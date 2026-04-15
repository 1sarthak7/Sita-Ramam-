<p align="center">
  <img src="frames/title.png" alt="Sita Ramam" width="600" style="border-radius: 12px;" />
</p>

<h1 align="center">✦ Sita Ramam ✦</h1>

<p align="center">
  <em>Sita Ramam | Story Telling Scroll</em>
</p>

<p align="center">
  <a href="https://1sarthak7.github.io/Sita-Ramam-/">
    <img src="https://img.shields.io/badge/🌐_Live_Demo-Visit_Site-7EB8D8?style=for-the-badge&labelColor=0B1118" alt="Live Demo" />
  </a>
  &nbsp;
  <img src="https://img.shields.io/badge/Vanilla-HTML%20·%20CSS%20·%20JS-D4889C?style=for-the-badge&labelColor=0B1118" alt="Tech Stack" />
  &nbsp;
  <img src="https://img.shields.io/badge/Frames-641_Extracted-A8D4E6?style=for-the-badge&labelColor=0B1118" alt="Frames" />
</p>

<br/>

<p align="center">
  <strong>"He didn't die for a country. He lived — and died — for Sita."</strong>
</p>

---

<br/>

##  About

**Sita Ramam** is an immersive, scroll-driven storytelling website that reimagines the love story from the 2022 Telugu film *Sita Ramam* — a tale of a soldier's letters, a woman's devotion, and a love that transcends time, borders, and death.

Built entirely with **vanilla HTML, CSS, and JavaScript** — no frameworks, no dependencies — this project uses Apple-style frame-by-frame canvas animation to create a cinematic experience controlled entirely by scroll.

> *Every scroll reveals a frame. Every frame tells a story.*

<br/>

##  Features

<table>
  <tr>
    <td width="50%">
      <h3> Scroll-Driven Frame Animation</h3>
      <p>575 frames from the main video + 66 title card frames rendered on HTML5 Canvas, synchronized to scroll position at 60fps. Inspired by Apple's product page animation technique.</p>
    </td>
    <td width="50%">
      <h3> Scroll Expansion Hero</h3>
      <p>Two expanding media sections that intercept scroll events — a centered image card smoothly expands to fill the viewport as you scroll, with title text splitting apart cinematically.</p>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3>Parallax Transitions</h3>
      <p>Three parallax divider sections between story chapters with depth-creating background movement, gradient fades, and poetic text that drifts into view.</p>
    </td>
    <td width="50%">
      <h3> Smooth Loving Font</h3>
      <p>Custom handwritten font giving titles and quotes an intimate, love-letter aesthetic — as if Ram himself wrote the words.</p>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3> Glassmorphic Story Cards</h3>
      <p>Frosted-glass overlay cards with backdrop blur appear at precise scroll moments to narrate each chapter of the story.</p>
    </td>
    <td width="50%">
      <h3> Theme Music</h3>
      <p>Sita Ramam's iconic soundtrack with a custom play/pause toggle, smooth volume fade-in/out, and no autoplay interruption.</p>
    </td>
  </tr>
</table>

<br/>

##  Design Philosophy

<p align="center">
  <img src="frames/title3.png" alt="Story Scene" width="500" style="border-radius: 12px;" />
</p>

The design draws from the film's emotional palette — cool blues of Kashmir snow, the warmth of handwritten letters, and the misty softness of love remembered.

| Token | Color | Usage |
|-------|-------|-------|
| `--accent-primary` | ![#7EB8D8](https://via.placeholder.com/12/7EB8D8/7EB8D8.png) `#7EB8D8` | Soft sky blue — links, accents, progress |
| `--rose` | ![#D4889C](https://via.placeholder.com/12/D4889C/D4889C.png) `#D4889C` | Gentle rose — love, ornaments, warmth |
| `--snow` | ![#F0F4F8](https://via.placeholder.com/12/F0F4F8/F0F4F8.png) `#F0F4F8` | Cool white — primary text |
| `--deep-night` | ![#0B1118](https://via.placeholder.com/12/0B1118/0B1118.png) `#0B1118` | Night sky — backgrounds |

<br/>

##  Architecture

```
Sita Ramam/
├── index.html              # 7-section story structure
├── styles.css              # 1000+ line design system
├── script.js               # 600+ line animation engine
├── frames/
│   ├── title/              # 66 title card frames (24fps)
│   ├── main/               # 575 story frames (8fps from 4K source)
│   ├── title.png           # Expansion hero image
│   ├── title2.png          # Story expansion background
│   └── title3.png          # Story expansion media
├── assets/
│   └── audio/theme.mp3     # Sita Ramam theme soundtrack
├── smooth_loving/          # Custom handwritten font files
│   ├── SmoothLoving.woff
│   ├── SmoothLoving.ttf
│   └── SmoothLoving.otf
└── .github/
    └── workflows/deploy.yml # Auto-deploy to GitHub Pages
```

<br/>

##  The Story Flow

```
   ╭──────────────────────────────────────╮
   │  ✦  SCROLL EXPANSION HERO           │
   │     "Sita" / "Ramam" split reveal    │
   ╰──────────────┬───────────────────────╯
                  │ scroll
   ╭──────────────▼───────────────────────╮
   │       TITLE CARD ANIMATION           │
   │     66-frame canvas scrub            │
   ╰──────────────┬───────────────────────╯
                  │ scroll
   ╭──────────────▼───────────────────────╮
   │  ✦   STORY EXPANSION                 │
   │     "A love letter / written in      │
   │      sacrifice" split reveal         │
   ╰──────────────┬───────────────────────╯
                  │ scroll
   ╭──────────────▼───────────────────────╮
   │      THE LETTERS & LOVE STORY        │
   │     Frames 1-192 · 3 story cards     │
   ╰──────────────┬───────────────────────╯
                  │
        ┌─────────▼─────────┐
        │ ≋ PARALLAX ≋      │
        │ "Her words became  │
        │  his compass"      │
        └─────────┬─────────┘
                  │
   ╭──────────────▼───────────────────────╮
   │       THE JOURNEY                    │
   │     Frames 192-384 · 3 story cards   │
   ╰──────────────┬───────────────────────╯
                  │
        ┌─────────▼─────────┐
        │ ≋ PARALLAX ≋      │
        │ "The truth was     │
        │  never far"        │
        └─────────┬─────────┘
                  │
   ╭──────────────▼───────────────────────╮
   │    THE CLIMAX                      │
   │     Frames 384-575 · Vignette        │
   │     "He lived — and died — for Sita" │
   ╰──────────────┬───────────────────────╯
                  │
        ┌─────────▼─────────┐
        │ ≋ PARALLAX ≋      │
        │ "Some stories      │
        │  never end"        │
        └─────────┬─────────┘
                  │
   ╭──────────────▼───────────────────────╮
   │       TRIBUTE                        │
   │     Credits · Final quote            │
   │     A Film by Hanu Raghavapudi       │
   ╰─────────────────────────────────────╯
```

<br/>

##  Technical Highlights

### Frame Animation Engine
- **Separate scroll & render loops** — scroll listener calculates target frame index, `requestAnimationFrame` only draws when the frame changes
- **Batch preloading** — frames load in batches of 20 with a cinematic loading bar
- **Canvas rendering** — direct `drawImage()` on `<canvas>` instead of swapping `<img>` elements for GPU-level performance
- **`position: sticky`** — scroll runway technique with `overflow-x: clip` to avoid sticky-breaking bugs

### Scroll Expansion System
- **Wheel event interception** — intercepts `deltaY` and maps it to a 0→1 progress value
- **Touch support** — separate touch handlers with adjusted sensitivity for mobile
- **Reversible** — scrolling back up at the section collapses the expansion
- **Two independent instances** — hero expansion and story expansion with priority-based activation

### Performance
- **60fps** target with no jank
- **No frameworks** — zero JavaScript dependencies
- **~105MB total** — 641 JPEG frames + audio + fonts
- **will-change: transform** on parallax images for GPU compositing

<br/>

##  Getting Started

### Prerequisites
- A modern browser (Chrome, Firefox, Safari, Edge)
- [Python 3](https://www.python.org/) for local dev server

### Run Locally

```bash
# Clone the repository
git clone https://github.com/1sarthak7/Sita-Ramam-.git
cd Sita-Ramam-

# Start the development server
python3 -m http.server 3000

# Or use the npm script
npm run dev
```

Then open **http://localhost:3000** in your browser.

### Frame Extraction (if re-generating)

```bash
# Title card — all 66 frames at 24fps
ffmpeg -i "Sita Ramam title card.mov" -vf "fps=24,scale=1920:-1" -q:v 3 frames/title/frame-%04d.jpg

# Main video — 575 frames at 8fps for smooth scroll
ffmpeg -i "Sita Ramam Video.mov" -vf "fps=8,scale=1920:-1" -q:v 3 frames/main/frame-%04d.jpg
```

<br/>

## 🎬 Credits

<p align="center">
  <strong>Sita Ramam</strong> (2022)<br/>
  A Film by <strong>Hanu Raghavapudi</strong><br/>
  <br/>
  <em>Dulquer Salmaan · Mrunal Thakur · Rashmika Mandanna</em><br/>
  Music by <strong>Vishal Chandrasekhar</strong>
</p>

<br/>

> This project is a **fan-made tribute** to the film *Sita Ramam* and is not affiliated with or endorsed by the film's production team. All movie content, music, and imagery belong to their respective copyright holders. Created purely as a cinematic web development exercise and a love letter to extraordinary cinema.

<br/>

---

<p align="center">
  <em>Made with ♥ as a tribute to cinema</em>
</p>

<p align="center">
  <sub>✦ A love that transcends time ✦</sub>
</p>
