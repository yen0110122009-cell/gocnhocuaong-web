import wave
import math
import random
import struct

sample_rate = 44100
duration = 45
frames = sample_rate * duration
random.seed(111)

with wave.open('/home/ubuntu/webdev-static-assets/ambient-rain-default.wav', 'w') as out:
    out.setnchannels(2)
    out.setsampwidth(2)
    out.setframerate(sample_rate)
    for i in range(frames):
        t = i / sample_rate
        # Layered filtered noise with gentle modulation for a soft rain texture.
        white = random.uniform(-1.0, 1.0)
        white2 = random.uniform(-1.0, 1.0)
        low = math.sin(2 * math.pi * 0.19 * t) * 0.04
        shimmer = math.sin(2 * math.pi * 3.7 * t) * 0.015
        sample = (white * 0.09 + white2 * 0.035 + low + shimmer)
        # Very occasional tiny droplets, kept quiet and non-abrupt.
        if random.random() < 0.00055:
            sample += random.uniform(0.03, 0.08)
        fade = min(1.0, t / 2.0, (duration - t) / 2.0)
        value = max(-0.22, min(0.22, sample * fade))
        left = int(value * 32767)
        right = int((value * 0.97 + math.sin(2 * math.pi * 0.11 * t) * 0.002) * 32767)
        out.writeframes(struct.pack('<hh', left, right))
print('generated ambient-rain-default.wav')
