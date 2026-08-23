import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { splitLongVietnameseText } from "./splitText.ts";

type TtsRequest = {
  text?: unknown;
  voiceName?: unknown;
  speakingRate?: unknown;
  pitch?: unknown;
};

type WavPart = {
  sampleRate: number;
  channels: number;
  bitsPerSample: number;
  pcm: Uint8Array;
};

const GOOGLE_TTS_ENDPOINT = "https://texttospeech.googleapis.com/v1/text:synthesize";
const DEFAULT_VOICE = "vi-VN-Wavenet-A";
const MAX_TOTAL_BYTES = 1_000_000;
const MAX_CHUNKS = 240;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 8;
const requestLog = new Map<string, number[]>();

function allowedOrigins() {
  return (Deno.env.get("LUMI_TTS_ALLOWED_ORIGINS") ?? "https://yen0110122009-cell.github.io")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

function corsHeaders(request: Request) {
  const origin = request.headers.get("origin") ?? "";
  const allowed = allowedOrigins();
  const headers: Record<string, string> = {
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin",
  };
  if (allowed.includes(origin)) headers["Access-Control-Allow-Origin"] = origin;
  return headers;
}

function jsonResponse(request: Request, body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders(request), "Content-Type": "application/json; charset=utf-8" },
  });
}

function base64ToBytes(value: string) {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
  return bytes;
}

function readAscii(bytes: Uint8Array, offset: number, length: number) {
  return String.fromCharCode(...bytes.slice(offset, offset + length));
}

function readUint16(bytes: Uint8Array, offset: number) {
  return bytes[offset] | (bytes[offset + 1] << 8);
}

function readUint32(bytes: Uint8Array, offset: number) {
  return (bytes[offset] | (bytes[offset + 1] << 8) | (bytes[offset + 2] << 16) | (bytes[offset + 3] << 24)) >>> 0;
}

function parseWav(bytes: Uint8Array): WavPart {
  if (readAscii(bytes, 0, 4) !== "RIFF" || readAscii(bytes, 8, 4) !== "WAVE") throw new Error("Google TTS không trả về WAV hợp lệ.");
  let offset = 12;
  let sampleRate = 0;
  let channels = 0;
  let bitsPerSample = 0;
  let pcm: Uint8Array | null = null;
  while (offset + 8 <= bytes.length) {
    const chunkId = readAscii(bytes, offset, 4);
    const chunkSize = readUint32(bytes, offset + 4);
    const dataStart = offset + 8;
    if (chunkId === "fmt ") {
      channels = readUint16(bytes, dataStart + 2);
      sampleRate = readUint32(bytes, dataStart + 4);
      bitsPerSample = readUint16(bytes, dataStart + 14);
    } else if (chunkId === "data") {
      pcm = bytes.slice(dataStart, Math.min(dataStart + chunkSize, bytes.length));
      break;
    }
    offset = dataStart + chunkSize + (chunkSize % 2);
  }
  if (!pcm || !sampleRate || !channels || bitsPerSample !== 16) throw new Error("Định dạng WAV Google TTS không được hỗ trợ để ghép.");
  return { sampleRate, channels, bitsPerSample, pcm };
}

function writeUint16(view: DataView, offset: number, value: number) {
  view.setUint16(offset, value, true);
}

function writeUint32(view: DataView, offset: number, value: number) {
  view.setUint32(offset, value, true);
}

function encodeWav(parts: WavPart[]) {
  if (!parts.length) throw new Error("Không có audio để ghép.");
  const first = parts[0];
  if (parts.some((part) => part.sampleRate !== first.sampleRate || part.channels !== first.channels || part.bitsPerSample !== first.bitsPerSample)) {
    throw new Error("Các đoạn audio Google TTS có thông số khác nhau, không thể ghép an toàn.");
  }
  const dataLength = parts.reduce((total, part) => total + part.pcm.byteLength, 0);
  const buffer = new ArrayBuffer(44 + dataLength);
  const bytes = new Uint8Array(buffer);
  const view = new DataView(buffer);
  bytes.set(new TextEncoder().encode("RIFF"), 0);
  writeUint32(view, 4, 36 + dataLength);
  bytes.set(new TextEncoder().encode("WAVEfmt "), 8);
  writeUint32(view, 16, 16);
  writeUint16(view, 20, 1);
  writeUint16(view, 22, first.channels);
  writeUint32(view, 24, first.sampleRate);
  const blockAlign = first.channels * first.bitsPerSample / 8;
  writeUint32(view, 28, first.sampleRate * blockAlign);
  writeUint16(view, 32, blockAlign);
  writeUint16(view, 34, first.bitsPerSample);
  bytes.set(new TextEncoder().encode("data"), 36);
  writeUint32(view, 40, dataLength);
  let offset = 44;
  for (const part of parts) {
    bytes.set(part.pcm, offset);
    offset += part.pcm.byteLength;
  }
  return bytes;
}

function checkRateLimit(request: Request) {
  const key = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "anonymous";
  const now = Date.now();
  const recent = (requestLog.get(key) ?? []).filter((timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS);
  if (recent.length >= RATE_LIMIT_MAX_REQUESTS) return false;
  recent.push(now);
  requestLog.set(key, recent);
  return true;
}

function numericOption(value: unknown, fallback: number, minimum: number, maximum: number) {
  const number = typeof value === "number" && Number.isFinite(value) ? value : fallback;
  return Math.min(maximum, Math.max(minimum, number));
}

async function synthesizeChunk(apiKey: string, text: string, voiceName: string, speakingRate: number, pitch: number) {
  const response = await fetch(`${GOOGLE_TTS_ENDPOINT}?key=${encodeURIComponent(apiKey)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      input: { text },
      voice: { languageCode: "vi-VN", name: voiceName },
      audioConfig: { audioEncoding: "LINEAR16", speakingRate, pitch },
    }),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || typeof payload.audioContent !== "string") {
    const message = typeof payload.error?.message === "string" ? payload.error.message : `Google TTS trả về HTTP ${response.status}`;
    throw new Error(message);
  }
  return base64ToBytes(payload.audioContent);
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    const origin = request.headers.get("origin") ?? "";
    return allowedOrigins().includes(origin)
      ? new Response(null, { status: 204, headers: corsHeaders(request) })
      : new Response("Origin không được phép.", { status: 403 });
  }
  if (request.method !== "POST") return jsonResponse(request, { error: "Chỉ hỗ trợ POST." }, 405);
  const origin = request.headers.get("origin") ?? "";
  if (!allowedOrigins().includes(origin)) return jsonResponse(request, { error: "Origin không được phép." }, 403);
  if (!checkRateLimit(request)) return jsonResponse(request, { error: "Bạn đang gửi quá nhiều yêu cầu TTS. Hãy thử lại sau một phút." }, 429);

  const apiKey = Deno.env.get("GOOGLE_TTS_API_KEY")?.trim();
  if (!apiKey) return jsonResponse(request, { error: "Edge Function chưa được cấu hình GOOGLE_TTS_API_KEY." }, 503);

  let input: TtsRequest;
  try {
    input = await request.json() as TtsRequest;
  } catch {
    return jsonResponse(request, { error: "Body phải là JSON hợp lệ." }, 400);
  }
  const text = typeof input.text === "string" ? input.text.trim() : "";
  if (!text) return jsonResponse(request, { error: "Vui lòng gửi trường text không rỗng." }, 400);
  if (textByteLength(text) > MAX_TOTAL_BYTES) return jsonResponse(request, { error: "Văn bản vượt quá dung lượng xử lý an toàn của Edge Function." }, 413);

  const requestedVoice = typeof input.voiceName === "string" && input.voiceName.trim() ? input.voiceName.trim() : DEFAULT_VOICE;
  if (!/^vi-VN-[A-Za-z0-9-]+$/.test(requestedVoice)) return jsonResponse(request, { error: "voiceName phải là voice vi-VN của Google Cloud TTS." }, 400);
  const speakingRate = numericOption(input.speakingRate, 0.96, 0.25, 4);
  const pitch = numericOption(input.pitch, 1.08, -20, 20);
  const chunks = splitLongVietnameseText(text);
  if (!chunks.length || chunks.length > MAX_CHUNKS) return jsonResponse(request, { error: "Không thể chia văn bản thành số đoạn an toàn." }, 413);

  try {
    const parts: WavPart[] = [];
    for (const chunk of chunks) {
      parts.push(parseWav(await synthesizeChunk(apiKey, chunk, requestedVoice, speakingRate, pitch)));
    }
    const merged = encodeWav(parts);
    return new Response(merged, {
      status: 200,
      headers: {
        ...corsHeaders(request),
        "Content-Type": "audio/wav",
        "Content-Disposition": "inline; filename=\"lumi-tts.wav\"",
        "Cache-Control": "no-store",
        "X-TTS-Chunks": String(chunks.length),
      },
    });
  } catch (error) {
    console.error("lumi-tts synthesis failed", error);
    return jsonResponse(request, { error: error instanceof Error ? error.message : "Không thể tạo audio TTS." }, 502);
  }
});
