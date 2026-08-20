import math
import random
import wave
from pathlib import Path

sample_rate = 44100
duration = 45
random.seed(42)
frames = [0.0] * (sample_rate * duration)

def add_burst(start_s: float, length_s: float, amplitude: float):
    start = int(start_s * sample_rate)
    length = int(length_s * sample_rate)
    for i in range(length):
        idx = start + i
        if idx >= len(frames):
            break
        t = i / sample_rate
        env = math.sin(math.pi * min(1.0, i / max(1, length - 1))) ** 0.65
        noise = random.uniform(-1.0, 1.0)
        paper = 0.55 * noise + 0.25 * math.sin(2 * math.pi * (1800 + 500 * math.sin(t * 11)) * t)
        frames[idx] += amplitude * env * paper

# Soft room tone and sparse page turns, with different lengths and locations.
for i in range(len(frames)):
    t = i / sample_rate
    frames[i] += 0.004 * random.uniform(-1, 1) + 0.002 * math.sin(2 * math.pi * 48 * t)

for start, length, amp in [
    (2.2, 0.70, 0.20), (6.8, 0.48, 0.15), (11.4, 0.95, 0.18),
    (16.1, 0.55, 0.16), (21.7, 0.82, 0.19), (27.0, 0.44, 0.14),
    (31.8, 0.74, 0.18), (37.2, 0.52, 0.15), (42.0, 0.86, 0.17),
]:
    add_burst(start, length, amp)

# Five-second fade in/out for seamless playback start and stop.
fade = 5 * sample_rate
for i in range(fade):
    frames[i] *= i / fade
    frames[-1 - i] *= i / fade

peak = max(1e-9, max(abs(x) for x in frames))
scale = 0.72 / peak
out = bytearray()
for sample in frames:
    value = max(-1.0, min(1.0, sample * scale))
    out += int(value * 32767).to_bytes(2, "little", signed=True)

path = Path("/home/ubuntu/webdev-static-assets/ambient-book-pages-default.wav")
with wave.open(str(path), "wb") as wav:
    wav.setnchannels(1)
    wav.setsampwidth(2)
    wav.setframerate(sample_rate)
    wav.writeframes(bytes(out))
print(path)
print(f"duration={duration}s sample_rate={sample_rate}")
