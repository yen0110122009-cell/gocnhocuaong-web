const encoder = new TextEncoder();

export const MAX_TTS_CHUNK_BYTES = 4_500;

export function textByteLength(value: string) {
  return encoder.encode(value).byteLength;
}

function splitWordsByBytes(value: string, maxBytes: number) {
  const words = value.trim().split(/\s+/).filter(Boolean);
  const result: string[] = [];
  let current = "";
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (textByteLength(candidate) <= maxBytes) {
      current = candidate;
      continue;
    }
    if (current) result.push(current);
    if (textByteLength(word) <= maxBytes) {
      current = word;
      continue;
    }
    let fragment = "";
    for (const character of Array.from(word)) {
      const next = fragment + character;
      if (textByteLength(next) > maxBytes) {
        if (fragment) result.push(fragment);
        fragment = character;
      } else {
        fragment = next;
      }
    }
    current = fragment;
  }
  if (current) result.push(current);
  return result;
}

export function splitLongVietnameseText(text: string, maxBytes = MAX_TTS_CHUNK_BYTES) {
  const normalized = text.replace(/\r\n?/g, "\n").trim();
  const paragraphs = normalized.split(/\n{2,}/).map((paragraph) => paragraph.trim()).filter(Boolean);
  const chunks: string[] = [];
  for (const paragraph of paragraphs) {
    const sentences = paragraph.split(/(?<=[.!?…。！？])\s+/u).map((sentence) => sentence.trim()).filter(Boolean);
    const units = sentences.length ? sentences : [paragraph];
    let current = "";
    for (const unit of units) {
      if (textByteLength(unit) > maxBytes) {
        if (current) {
          chunks.push(current);
          current = "";
        }
        chunks.push(...splitWordsByBytes(unit, maxBytes));
        continue;
      }
      const candidate = current ? `${current} ${unit}` : unit;
      if (textByteLength(candidate) <= maxBytes) {
        current = candidate;
      } else {
        if (current) chunks.push(current);
        current = unit;
      }
    }
    if (current) chunks.push(current);
  }
  return chunks;
}
