# 🌊 Microplastic River-to-Ocean Tracking System

**A concept dashboard visualizing microplastic pollution flowing from rivers to oceans using satellite-derived spectral data.**

> **⚠️ This is a concept demonstration.** The satellite monitoring pipeline, flux estimates, and dashboard data are simulated. No operational satellite-based plastic flux monitoring system exists today. The problem is real — the monitoring vision represents where the science *could* go, not where it is.

[![Live Demo](https://img.shields.io/badge/Live_Demo-microplastic--tracker.onrender.com-00b4d8?style=for-the-badge)](https://microplastic-tracker.onrender.com)

![Vite + React 19](https://img.shields.io/badge/Vite_8-React_19-646CFF?style=flat-square&logo=vite) ![No External Dependencies](https://img.shields.io/badge/Charts-Pure_SVG-ff6b6b?style=flat-square) ![Dark Theme](https://img.shields.io/badge/Theme-Dark_(%230a0a0f)-0a0a0f?style=flat-square)

---

## Overview

A visually rich, data-dense single-page application that explores the concept of satellite spectral monitoring for river plastic pollution. Built with React 19 and Vite — zero external dependencies beyond the base template. All charts are hand-built with SVG. All data is simulated but grounded in real-world estimates from the scientific literature.

The page is designed to feel like a NASA Worldview / Bloomberg Terminal hybrid — cinematic dark theme with dense, interactive data visualizations. But it also includes a thorough **Scientific Reality Check** section that critically examines every claim made on the page.

---

## Sections

### 1. Hero / Landing
Animated particle field simulating plastic debris drifting from a river delta into the ocean. Key statistics on the scale of river-to-ocean plastic pollution.

### 2. The Problem
Three editorial sub-sections with scroll-triggered reveals:
- **Scale of Crisis** — 11M tons/year counter, source breakdown (stacked bar), top 10 most polluted rivers (animated bars with real tonnage estimates)
- **What Happens Underwater** — Depth/timeline visualization of plastic's journey from surface to seafloor, with residence times and affected species counts
- **Why Current Monitoring Fails** — Comparison table: Traditional vs. Satellite monitoring across 9 metrics including spatial resolution, minimum detection size, microplastic capability, and signal specificity

### 3. The Solution (Conceptual)
Interactive explainer for a theoretical satellite monitoring pipeline:
- **Spectral Signature Chart** — SVG line chart comparing plastic, water, and vegetation reflectance curves (400–2500nm) with expandable caveats on real-world limitations
- **Sensor Fusion Stack** — Cards for 6 satellite sensors (Sentinel-2, PACE/OCI, Sentinel-3, MODIS, JRC Surface Water, Dynamic World) with resolution, revisit time, and expandable limitation notes
- **Detection Pipeline** — 5-step flow (capture → FDI classification → temporal stacking → source attribution → ocean handoff) with inline caveats on each step

### 4. Scientific Reality Check
A dedicated section critically examining the science behind every claim on the page:
- **Reality vs. Aspiration table** — 8 claims mapped to scientific reality
- **10 expandable critical analysis items** — Each graded by severity (Critical / High / Moderate):
  1. The "NDPI" is actually NDMI (vegetation moisture index)
  2. Sentinel-2 cannot detect microplastics
  3. Spectral confusion with foam, algae, driftwood
  4. PACE/OCI was not designed for plastic detection
  5. No sensor fusion integration framework exists
  6. Spectral-to-mass-flux conversion is not possible at claimed precision
  7. Confidence intervals are cosmetic
  8. River detection is much harder than open ocean
  9. No independent field validation at scale
  10. Missing lidar approaches (CALIPSO)
- **"What IS Real"** — Affirms the genuine science and the real pollution crisis
- **References** — 8 peer-reviewed citations

### 5. River Dashboard (Simulated Data)
Interactive time-series dashboard for 10 major rivers:
- **River selector** — Tabs for Pasig, Ganges, Citarum, Mekong, Danube, Mississippi, Niger, Yangtze, Nile, Amazon
- **SVG time-series chart** — 36 months (2024–2026) with confidence bands, trend lines, event markers, and hover tooltips
- **Metrics panel** — Monthly load, YoY change, peak month, ocean delivery %, intervention score, monitoring coverage
- **Supporting cards** — Source breakdown pie chart, river profile, stylized monitoring map
- Prominent disclaimer: all data is simulated; real uncertainty is 10–100× wider than shown

### 6. Impact & Action
Aspirational intervention modeling (clearly labeled as theoretical):
- Before/after reduction scenarios with cost comparisons
- Three intervention types with effectiveness ratings
- Accountability chain visualization
- Interactive "Your River" scenario builder

---

## Scientific References

The page cites and critically evaluates findings from:

| Ref | Citation | Used For |
|-----|----------|----------|
| [1] | Biermann et al. (2020). "Finding Plastic Patches in Coastal Waters." *Sci. Reports* 10, 5364. | FDI — the actual peer-reviewed plastic detection index |
| [2] | Garaba & Dierssen (2018). "Airborne remote sensing of synthetic hydrocarbon detection using SWIR." *RSE* 209. | SWIR spectral signatures, wetting effects (~56% reflectance loss) |
| [3] | Topouzelis et al. (2019). "Detection of floating plastics from satellite and UAS." *Int. J. Appl. Earth Obs.* 79. | Minimum detection size (~5×5m), Plastic Litter Project |
| [4] | Themistocleous et al. (2020). "Detection of Floating Plastic Litter from Space." *Remote Sensing* 12(16). | Plastic Index (PI) alternative |
| [5] | Meijer et al. (2021). "More than 1000 rivers account for 80% of riverine plastic emissions." *Sci. Advances* 7(18). | River tonnage baselines |
| [6] | Gao (1996). "NDWI for vegetation liquid water from space." *RSE* 58(3). | Proof that (NIR−SWIR)/(NIR+SWIR) is NDMI, not a plastic index |
| [7] | Marye et al. (2025). "Remote Sensing for Monitoring Macroplastics in Rivers." *WIREs Water*. | River-specific detection challenges |
| [8] | Lebreton et al. (2017). "River plastic emissions to the world's oceans." *Nat. Comms.* 8, 15611. | River plastic flux model estimates |

---

## Tech Stack

| | |
|---|---|
| **Framework** | React 19.2 + Vite 8 |
| **Dependencies** | Zero beyond Vite's React template |
| **Charts** | Pure SVG — no charting library |
| **Styling** | CSS-in-JS (inline styles) + one CSS file for animations |
| **Data** | All hardcoded/simulated as `const` arrays at top of `App.jsx` |
| **Deployment** | Render (static site, auto-deploy from `master`) |

---

## Getting Started

```bash
# Clone
git clone https://github.com/decoher3nce/microplastic-tracker.git
cd microplastic-tracker

# Install
npm install

# Dev server
npm run dev        # → http://localhost:5173

# Production build
npm run build      # → dist/
npm run preview    # Preview the build
```

---

## Design System

| Token | Value | Usage |
|-------|-------|-------|
| `bg` | `#0a0a0f` | Primary background |
| `bgAlt` | `#0d1117` | Section alternates |
| `bgCard` | `#1a1a2e` | Glass-morphism cards |
| `blue` | `#0077b6` | Ocean, primary accent |
| `cyan` | `#00b4d8` | Interactive elements, links |
| `coral` | `#ff6b6b` | Warnings, worsening trends |
| `red` | `#e63946` | Critical severity |
| `green` | `#00d68f` | Positive trends, improvements |
| `amber` | `#f4a261` | Caveats, moderate severity |
| `white` | `#e0e0e0` | Primary text |
| `muted` | `#8892a0` | Secondary text |
| `dim` | `#4a4f5c` | Tertiary text, grid lines |

Typography uses the system font stack with `clamp()` responsive sizing. Cards use glass-morphism (`rgba` backgrounds, `backdrop-filter: blur`, thin `rgba(255,255,255,0.1)` borders).

---

## Project Structure

```
microplastic-tracker/
├── index.html            # Entry point, dark background, meta viewport
├── package.json          # React 19, Vite 8, zero extra deps
├── vite.config.js        # Minimal Vite + React plugin
└── src/
    ├── main.jsx          # React 19 createRoot entry
    ├── index.css         # Animations, scrollbar, glass-morphism, gradients
    └── App.jsx           # Entire application (~1,600 lines)
        ├── Constants     #   Color palette, river data, sensors, references
        ├── Data gen      #   generateTimeSeries() for simulated flux data
        ├── Hooks         #   useScrollReveal(), useAnimatedCounter()
        ├── Nav           #   Fixed navigation with smooth scroll
        ├── Hero          #   Particle animation, concept badge
        ├── Problem       #   ScaleOfCrisis, UnderwaterJourney, MonitoringComparison
        ├── Solution      #   SpectralChart, SensorCards, DetectionPipeline
        ├── RealityCheck  #   Critical analysis, expandable issues, references
        ├── Dashboard     #   TimeSeriesChart, SourcePie, RiverMap, metrics
        ├── Impact        #   InterventionModeling, AccountabilityChain
        └── Footer        #   Data sources, concept disclaimer
```

---

## Philosophy

This project explores a tension: **the plastic pollution crisis is undeniably real**, but the satellite monitoring technology to address it at scale **does not yet exist at the precision implied by typical "tech for good" dashboards**. Rather than hiding that gap, this page surfaces it — presenting both the vision and its scientific critique side by side.

The goal is to demonstrate that honesty about scientific limitations doesn't make a dashboard less compelling. If anything, the critical analysis makes the page *more* interesting than a naive presentation would be.

---

## License

MIT

---

<p align="center">
  <em>Part of the <strong>Spectral Solutions Atlas</strong></em><br/>
  <sub>Built with open satellite data references · Copernicus · NASA EarthData · Google Earth Engine · JRC</sub>
</p>
