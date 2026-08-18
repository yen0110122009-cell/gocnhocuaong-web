from pathlib import Path
from PIL import Image

source = Path('/home/ubuntu/webdev-static-assets/gocnhocuaong-characters/character-reference.png')
out_dir = source.parent
image = Image.open(source).convert('RGB')

# Coordinates target the large identity portraits in the left identity panel.
crops = {
    'lumi-portrait-clean.png': (145, 112, 300, 355),
    'ong-portrait-cleaner.png': (145, 405, 300, 575),
}
for filename, box in crops.items():
    image.crop(box).save(out_dir / filename, optimize=True)
