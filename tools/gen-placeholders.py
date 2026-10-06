#!/usr/bin/env python3
"""Generate the R2 placeholder art for MC 10088 (DE-PERSONALIZE-01).

Abstract vertical color-wash gradients (paper/ink/clay tones) with subtle
grain and 2-3 soft geometric forms. No text, no recognizable objects, no
faces. Deterministic: fixed SEED, stable per-file draw order — re-runnable,
byte-identical output. Each existing target is opened with PIL first so the
replacement matches its current pixel size and format exactly (R2.5: no
layout metric moves).
"""
import random
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageFilter

SEED = 20261006
ROOT = Path(__file__).resolve().parent.parent
P = "projects/anny/prototypes"

# palette: (top, mid, bottom, form, form, form) — neutral warm paper/ink/clay
PAPER, SAND, ROSE, CLAY = (243, 237, 228), (226, 211, 193), (216, 183, 166), (201, 158, 124)
TERRA, INK, CHAR, SLATE, MOSS = (186, 134, 105), (60, 54, 48), (88, 82, 74), (146, 138, 126), (158, 152, 130)
PALETTES = {
    "paper-clay": (PAPER, SAND, CLAY, ROSE, TERRA, SLATE),
    "paper-terra": (PAPER, CLAY, TERRA, SAND, SLATE, ROSE),
    "sand-ink": (SAND, ROSE, INK, PAPER, TERRA, CHAR),
    "paper-ink": (PAPER, SLATE, INK, SAND, CHAR, CLAY),
    "paper-rose": (PAPER, SAND, ROSE, CLAY, SLATE, TERRA),
    "ink-slate": (INK, CHAR, SLATE, CLAY, SAND, TERRA),
    "sand-clay": (SAND, CLAY, TERRA, PAPER, SLATE, INK),
}

# (path, fallback size if file absent, PIL format, palette key)
TARGETS = (
    [(f"{P}/_assets/gal-0{n}.jpeg", (1536, 2048), "JPEG", key)
     for n, key in enumerate(["paper-clay", "paper-terra", "sand-ink", "paper-ink"], 1)]
    + [(f"{P}/_assets/anny-portrait.jpg", (1656, 2208), "JPEG", "paper-rose")]
    + [(f"{P}/00-poc-live-site/images/gal-0{n}.jpeg", (1536, 2048), "JPEG", key)
       for n, key in enumerate(["paper-clay", "paper-terra", "sand-ink", "paper-ink"], 1)]
    + [(f"{P}/23-lab-anny-real/assets/gallery/gal-0{n}.jpeg", (1536, 2048), "JPEG", key)
       for n, key in enumerate(["paper-clay", "paper-terra", "sand-ink", "paper-ink"], 1)]
    + [(f"{P}/23-lab-anny-real/assets/plates/om-portrait.png", (780, 618), "PNG", "ink-slate"),
       (f"{P}/23-lab-anny-real/assets/plates/mirror-reflection.png", (2048, 896), "PNG", "ink-slate"),
       (f"{P}/24-lab-anny-flag/assets/plates/portrait.png", (1200, 1560), "PNG", "paper-rose"),
       (f"{P}/26-lab-anny-low/assets/plates/om-plate.png", (888, 756), "PNG", "sand-clay")]
)


def gradient(size, stops, rng):
    """Vertical 3-stop wash at reduced scale, wobbled so bands feel painted."""
    w, h = size
    wobble = [rng.uniform(-0.06, 0.06) for _ in range(h)]
    px = []
    for y in range(h):
        t = y / max(h - 1, 1)
        a, b, f = (stops[0], stops[1], (t / 0.55)) if t < 0.55 else (stops[1], stops[2], (t - 0.55) / 0.45)
        f = min(max(f + wobble[y], 0.0), 1.0)
        row = tuple(int(a[c] + (b[c] - a[c]) * f) for c in range(3))
        px.extend([row] * w)
    img = Image.new("RGB", size)
    img.putdata(px)
    return img


def forms(img, colors, rng, blur):
    """2-3 soft geometric forms drawn then blurred into the wash."""
    w, h = img.size
    d = ImageDraw.Draw(img)
    for c in colors[: rng.randint(2, 3)]:
        rx, ry = w * rng.uniform(0.18, 0.34), h * rng.uniform(0.10, 0.24)
        cx, cy = rng.uniform(rx * 0.4, w - rx * 0.4), rng.uniform(ry, h - ry)
        d.ellipse([cx - rx, cy - ry, cx + rx, cy + ry], fill=c)
    return img.filter(ImageFilter.GaussianBlur(blur))


def grain(size, rng, amp=6):
    """Subtle per-pixel luminance grain, deterministic from rng."""
    return Image.frombytes("L", size, bytes(min(max(128 + rng.randint(-amp, amp), 0), 255)
                                            for _ in range(size[0] * size[1])))


def make(size, pal_key, rng):
    scale = 8
    sw, sh = max(size[0] // scale, 8), max(size[1] // scale, 8)
    pal = PALETTES[pal_key]
    img = forms(gradient((sw, sh), pal[:3], rng), pal[3:], rng, blur=max(min(sw, sh) // 6, 4))
    img = img.resize(size, Image.BICUBIC)
    return ImageChops.add(img, grain(size, rng).convert("RGB"), scale=1, offset=-128)


def main():
    for i, (rel, fallback, fmt, pal_key) in enumerate(TARGETS):
        path = ROOT / rel
        rng = random.Random(SEED * 1000 + i)  # stable per file
        size = Image.open(path).size if path.exists() else fallback
        img = make(size, pal_key, rng)
        kw = {"quality": 88, "optimize": True} if fmt == "JPEG" else {}
        img.save(path, fmt, **kw)
        print(f"wrote {rel} {size} {fmt}")


if __name__ == "__main__":
    main()
