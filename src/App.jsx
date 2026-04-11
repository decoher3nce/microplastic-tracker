import { useState, useEffect, useRef, useCallback } from 'react'

// ─── COLOR PALETTE ───
const C = {
  bg: '#0a0a0f',
  bgAlt: '#0d1117',
  bgCard: '#1a1a2e',
  blue: '#0077b6',
  cyan: '#00b4d8',
  coral: '#ff6b6b',
  red: '#e63946',
  green: '#00d68f',
  amber: '#f4a261',
  white: '#e0e0e0',
  muted: '#8892a0',
  dim: '#4a4f5c',
}

// ─── RIVER DATA ───
const RIVERS = [
  {
    name: 'Pasig', country: 'Philippines', length: 27, population: '13M',
    oceanBasin: 'Pacific Ocean', trend: 'worsening', trendPct: 8.2,
    annualTons: 63700, peakMonth: 'August', peakLoad: 8200,
    oceanDelivery: 92, interventionScore: 9,
    sources: { urban: 55, industrial: 20, agricultural: 5, dumping: 20 },
    coverage: 78, seasonType: 'monsoon',
    events: [
      { month: 7, year: 2024, label: 'Monsoon flooding' },
      { month: 2, year: 2025, label: 'Cleanup campaign' },
      { month: 9, year: 2025, label: 'Industrial spill' },
    ]
  },
  {
    name: 'Ganges', country: 'India/Bangladesh', length: 2525, population: '655M',
    oceanBasin: 'Indian Ocean', trend: 'worsening', trendPct: 5.1,
    annualTons: 115000, peakMonth: 'July', peakLoad: 18500,
    oceanDelivery: 88, interventionScore: 10,
    sources: { urban: 45, industrial: 25, agricultural: 15, dumping: 15 },
    coverage: 62, seasonType: 'monsoon',
    events: [
      { month: 6, year: 2024, label: 'Monsoon onset' },
      { month: 1, year: 2025, label: 'Namami Gange cleanup phase' },
      { month: 7, year: 2025, label: 'Record rainfall' },
    ]
  },
  {
    name: 'Citarum', country: 'Indonesia', length: 297, population: '28M',
    oceanBasin: 'Indian Ocean', trend: 'worsening', trendPct: 3.4,
    annualTons: 38500, peakMonth: 'January', peakLoad: 5100,
    oceanDelivery: 85, interventionScore: 8,
    sources: { urban: 40, industrial: 30, agricultural: 10, dumping: 20 },
    coverage: 71, seasonType: 'monsoon',
    events: [
      { month: 12, year: 2024, label: 'Wet season peak' },
      { month: 5, year: 2025, label: 'Army cleanup deployed' },
      { month: 1, year: 2026, label: 'Flooding event' },
    ]
  },
  {
    name: 'Mekong', country: 'China/Myanmar/Laos/Thailand/Cambodia/Vietnam', length: 4350, population: '60M',
    oceanBasin: 'Pacific Ocean', trend: 'stable', trendPct: 0.8,
    annualTons: 33000, peakMonth: 'September', peakLoad: 5400,
    oceanDelivery: 76, interventionScore: 7,
    sources: { urban: 35, industrial: 15, agricultural: 30, dumping: 20 },
    coverage: 55, seasonType: 'monsoon',
    events: [
      { month: 8, year: 2024, label: 'Mekong flood pulse' },
      { month: 3, year: 2025, label: 'Upstream dam release' },
      { month: 9, year: 2025, label: 'Monsoon peak' },
    ]
  },
  {
    name: 'Danube', country: '10 countries (Europe)', length: 2850, population: '83M',
    oceanBasin: 'Black Sea', trend: 'improving', trendPct: -4.2,
    annualTons: 1533, peakMonth: 'April', peakLoad: 210,
    oceanDelivery: 68, interventionScore: 5,
    sources: { urban: 50, industrial: 20, agricultural: 20, dumping: 10 },
    coverage: 91, seasonType: 'temperate',
    events: [
      { month: 3, year: 2024, label: 'Spring melt' },
      { month: 10, year: 2024, label: 'EU waste directive enforced' },
      { month: 4, year: 2025, label: 'International cleanup day' },
    ]
  },
  {
    name: 'Mississippi', country: 'United States', length: 3766, population: '18M',
    oceanBasin: 'Gulf of Mexico', trend: 'improving', trendPct: -2.8,
    annualTons: 8900, peakMonth: 'April', peakLoad: 1200,
    oceanDelivery: 72, interventionScore: 6,
    sources: { urban: 40, industrial: 15, agricultural: 35, dumping: 10 },
    coverage: 88, seasonType: 'temperate',
    events: [
      { month: 4, year: 2024, label: 'Spring flood season' },
      { month: 8, year: 2024, label: 'EPA monitoring expansion' },
      { month: 3, year: 2025, label: 'Record snowmelt' },
    ]
  },
  {
    name: 'Niger', country: 'Guinea/Mali/Niger/Nigeria', length: 4180, population: '130M',
    oceanBasin: 'Atlantic Ocean', trend: 'worsening', trendPct: 6.1,
    annualTons: 25000, peakMonth: 'September', peakLoad: 4200,
    oceanDelivery: 79, interventionScore: 8,
    sources: { urban: 35, industrial: 10, agricultural: 20, dumping: 35 },
    coverage: 42, seasonType: 'monsoon',
    events: [
      { month: 8, year: 2024, label: 'Rainy season peak' },
      { month: 1, year: 2025, label: 'Dry season low' },
      { month: 9, year: 2025, label: 'Niger Delta flooding' },
    ]
  },
  {
    name: 'Yangtze', country: 'China', length: 6300, population: '400M',
    oceanBasin: 'East China Sea', trend: 'stable', trendPct: -0.5,
    annualTons: 55000, peakMonth: 'July', peakLoad: 8800,
    oceanDelivery: 82, interventionScore: 7,
    sources: { urban: 40, industrial: 30, agricultural: 15, dumping: 15 },
    coverage: 76, seasonType: 'monsoon',
    events: [
      { month: 6, year: 2024, label: 'Three Gorges release' },
      { month: 11, year: 2024, label: 'Fishing ban enforcement' },
      { month: 7, year: 2025, label: 'Major flood event' },
    ]
  },
  {
    name: 'Nile', country: 'Uganda/Sudan/Egypt', length: 6650, population: '257M',
    oceanBasin: 'Mediterranean Sea', trend: 'worsening', trendPct: 4.5,
    annualTons: 18000, peakMonth: 'September', peakLoad: 2900,
    oceanDelivery: 45, interventionScore: 6,
    sources: { urban: 50, industrial: 15, agricultural: 25, dumping: 10 },
    coverage: 48, seasonType: 'monsoon',
    events: [
      { month: 8, year: 2024, label: 'Nile flood season' },
      { month: 3, year: 2025, label: 'Cairo cleanup initiative' },
      { month: 9, year: 2025, label: 'Blue Nile surge' },
    ]
  },
  {
    name: 'Amazon', country: 'Brazil/Peru/Colombia', length: 6992, population: '30M',
    oceanBasin: 'Atlantic Ocean', trend: 'worsening', trendPct: 3.9,
    annualTons: 38000, peakMonth: 'May', peakLoad: 5500,
    oceanDelivery: 71, interventionScore: 7,
    sources: { urban: 30, industrial: 10, agricultural: 15, dumping: 45 },
    coverage: 35, seasonType: 'tropical',
    events: [
      { month: 4, year: 2024, label: 'Wet season peak' },
      { month: 10, year: 2024, label: 'Deforestation monitoring' },
      { month: 5, year: 2025, label: 'Record water levels' },
    ]
  },
]

// Generate 36 months of time series data for each river
function generateTimeSeries(river) {
  const data = []
  const baseMonthly = river.annualTons / 12
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  const peakIdx = months.indexOf(river.peakMonth.slice(0,3))

  for (let y = 0; y < 3; y++) {
    const year = 2024 + y
    for (let m = 0; m < 12; m++) {
      // Seasonal pattern
      const dist = Math.min(Math.abs(m - peakIdx), 12 - Math.abs(m - peakIdx))
      const seasonal = 1 + (1.8 - dist * 0.25) * (dist < 4 ? 1 : 0.2)
      // Trend
      const trendFactor = 1 + (river.trendPct / 100) * (y + m / 12) / 3
      // Random noise
      const noise = 0.85 + Math.random() * 0.3
      const value = Math.max(50, baseMonthly * seasonal * trendFactor * noise)

      // Confidence interval
      const ci = value * (0.12 + Math.random() * 0.08)

      data.push({
        month: m,
        year,
        label: `${months[m]} ${year}`,
        value: Math.round(value),
        ciLow: Math.round(value - ci),
        ciHigh: Math.round(value + ci),
      })
    }
  }
  return data
}

// Pre-generate all river data
const RIVER_DATA = {}
RIVERS.forEach(r => {
  RIVER_DATA[r.name] = generateTimeSeries(r)
})

const TOP_RIVERS_POLLUTION = [
  { name: 'Pasig', tons: 63700 },
  { name: 'Ganges', tons: 115000 },
  { name: 'Meycauayan', tons: 30000 },
  { name: 'Tullahan', tons: 28000 },
  { name: 'Citarum', tons: 38500 },
  { name: 'Irrawaddy', tons: 35000 },
  { name: 'Brantas', tons: 22000 },
  { name: 'Solo', tons: 19000 },
  { name: 'Serayu', tons: 16000 },
  { name: 'Mekong', tons: 33000 },
]

const PLASTIC_SOURCES = [
  { label: 'Packaging', pct: 40, color: C.coral },
  { label: 'Textiles', pct: 15, color: C.cyan },
  { label: 'Microbeads', pct: 12, color: C.amber },
  { label: 'Tire Wear', pct: 10, color: C.green },
  { label: 'Other', pct: 23, color: C.dim },
]

const DEPTH_STAGES = [
  { label: 'Surface Macroplastic', depth: '0-1m', time: '1-4 weeks', species: 45, color: C.cyan },
  { label: 'UV Degradation Zone', depth: '0-5m', time: '2-6 months', species: 30, color: C.blue },
  { label: 'Microplastic Fragmentation', depth: '0-200m', time: '1-5 years', species: 120, color: C.amber },
  { label: 'Ingestion by Marine Life', depth: '0-1000m', time: '5-50 years', species: 220, color: C.coral },
  { label: 'Seafloor Accumulation', depth: '1000m+', time: '100-1000+ years', species: 65, color: C.red },
]

const SENSORS = [
  { name: 'Sentinel-2A/B', detect: 'Floating debris detection (FDI)', res: '10-20m', revisit: '5 days', color: '#4fc3f7',
    caveat: 'SWIR bands at 20m, not 10m. Can detect large macroplastic aggregations only — not individual items or microplastics. Minimum detectable target ~5×5m.' },
  { name: 'PACE/OCI', detect: 'Ocean color (phytoplankton/aerosol)', res: '1km', revisit: '2 days', color: '#81c784',
    caveat: 'Designed for phytoplankton and aerosols, not plastic. 1km resolution is far too coarse for debris detection. No validated microplastic proxy method exists.' },
  { name: 'Sentinel-3 OLCI', detect: 'Sea surface spectral anomaly', res: '300m', revisit: '1 day', color: '#ffb74d',
    caveat: '300m pixels average over large areas. Could identify large-scale anomalies but cannot distinguish plastic from algae, foam, or sediment.' },
  { name: 'MODIS', detect: 'Large-scale pattern context', res: '250m-1km', revisit: '1-2 days', color: '#e57373',
    caveat: 'Useful for broad environmental context (SST, chlorophyll) but lacks spatial and spectral resolution for plastic detection.' },
  { name: 'JRC Surface Water', detect: 'River flow path modeling', res: '30m', revisit: 'Monthly', color: '#9575cd',
    caveat: 'Valuable for water mask generation and river delineation. Not a detection sensor — provides supporting spatial context.' },
  { name: 'Dynamic World', detect: 'Land use source correlation', res: '10m', revisit: '2-3 days', color: '#4db6ac',
    caveat: 'Land cover classification product. Useful for upstream source attribution but does not detect plastic directly.' },
]

const REFERENCES = [
  { id: 'biermann2020', short: 'Biermann et al. 2020', full: 'Biermann, L., et al. "Finding Plastic Patches in Coastal Waters using Optical Satellite Data." Scientific Reports 10, 5364 (2020).' },
  { id: 'garaba2018', short: 'Garaba & Dierssen 2018', full: 'Garaba, S.P. & Dierssen, H.M. "An airborne remote sensing case study of synthetic hydrocarbon detection using short wave infrared absorption features." Remote Sensing of Environment 209, 48–58 (2018).' },
  { id: 'topouzelis2019', short: 'Topouzelis et al. 2019', full: 'Topouzelis, K., et al. "Detection of floating plastics from satellite and unmanned aerial systems (Plastic Litter Project 2018)." Int. J. Applied Earth Observation 79, 175–183 (2019).' },
  { id: 'themistocleous2020', short: 'Themistocleous et al. 2020', full: 'Themistocleous, K., et al. "Investigating Detection of Floating Plastic Litter from Space Using Sentinel-2 Imagery." Remote Sensing 12(16), 2648 (2020).' },
  { id: 'meijer2021', short: 'Meijer et al. 2021', full: 'Meijer, L.J.J., et al. "More than 1000 rivers account for 80% of global riverine plastic emissions into the ocean." Science Advances 7(18), eaaz5803 (2021).' },
  { id: 'gao1996', short: 'Gao 1996', full: 'Gao, B. "NDWI — A normalized difference water index for remote sensing of vegetation liquid water from space." Remote Sensing of Environment 58(3), 257–266 (1996).' },
  { id: 'marye2025', short: 'Marye et al. 2025', full: 'Marye, A., et al. "Remote Sensing for Monitoring Macroplastics in Rivers: A Review." WIREs Water (2025).' },
  { id: 'lebreton2017', short: 'Lebreton et al. 2017', full: 'Lebreton, L.C.M., et al. "River plastic emissions to the world\'s oceans." Nature Communications 8, 15611 (2017).' },
]

// ─── HOOKS ───

function useScrollReveal() {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.1 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return [ref, visible]
}

function useAnimatedCounter(target, duration = 2000, active = true) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!active) return
    let start = null
    const step = (ts) => {
      if (!start) start = ts
      const progress = Math.min((ts - start) / duration, 1)
      setValue(Math.floor(progress * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration, active])
  return value
}

// ─── COMPONENTS ───

function Nav() {
  const links = [
    { label: 'Problem', href: '#problem' },
    { label: 'Solution', href: '#solution' },
    { label: 'Reality Check', href: '#reality-check' },
    { label: 'Dashboard', href: '#dashboard' },
    { label: 'Impact', href: '#impact' },
  ]
  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: 'rgba(10,10,15,0.85)', backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      padding: '12px 32px', display: 'flex', alignItems: 'center', gap: 32,
    }}>
      <span style={{ fontWeight: 700, color: C.cyan, fontSize: 14, letterSpacing: 2, textTransform: 'uppercase' }}>
        MPROTS
      </span>
      <div style={{ display: 'flex', gap: 24, marginLeft: 'auto' }}>
        {links.map(l => (
          <a key={l.href} href={l.href} style={{
            color: C.muted, textDecoration: 'none', fontSize: 13, fontWeight: 500,
            letterSpacing: 0.5, transition: 'color 0.2s',
          }}
          onMouseEnter={e => e.target.style.color = C.cyan}
          onMouseLeave={e => e.target.style.color = C.muted}
          >{l.label}</a>
        ))}
      </div>
    </nav>
  )
}

// Particle animation in hero
function ParticleField() {
  const particles = useRef([])
  if (particles.current.length === 0) {
    for (let i = 0; i < 60; i++) {
      particles.current.push({
        id: i,
        x: Math.random() * 100,
        y: 30 + Math.random() * 40,
        size: 2 + Math.random() * 4,
        duration: 8 + Math.random() * 12,
        delay: Math.random() * 10,
        opacity: 0.3 + Math.random() * 0.5,
        color: Math.random() > 0.5 ? C.coral : (Math.random() > 0.5 ? C.amber : C.cyan),
      })
    }
  }

  return (
    <div style={{
      position: 'absolute', inset: 0, overflow: 'hidden', opacity: 0.4, zIndex: 1,
    }}>
      {particles.current.map(p => (
        <div key={p.id} style={{
          position: 'absolute',
          left: `${p.x}%`,
          top: `${p.y}%`,
          width: p.size,
          height: p.size,
          borderRadius: p.size > 4 ? '2px' : '50%',
          background: p.color,
          opacity: p.opacity,
          animation: `flowRight ${p.duration}s linear ${p.delay}s infinite`,
        }} />
      ))}
      {/* Wave lines */}
      <svg style={{ position: 'absolute', bottom: '20%', left: 0, width: '200%', height: 80, opacity: 0.15 }}>
        <path d="M0,40 Q75,20 150,40 Q225,60 300,40 Q375,20 450,40 Q525,60 600,40 Q675,20 750,40 Q825,60 900,40 Q975,20 1050,40 Q1125,60 1200,40 Q1275,20 1350,40 Q1425,60 1500,40" fill="none" stroke={C.cyan} strokeWidth="1.5" style={{ animation: 'waveMotion 8s linear infinite' }} />
        <path d="M0,50 Q75,30 150,50 Q225,70 300,50 Q375,30 450,50 Q525,70 600,50 Q675,30 750,50 Q825,70 900,50 Q975,30 1050,50 Q1125,70 1200,50 Q1275,30 1350,50 Q1425,70 1500,50" fill="none" stroke={C.blue} strokeWidth="1" style={{ animation: 'waveMotion 12s linear infinite' }} />
      </svg>
      {/* River delta shape */}
      <svg style={{ position: 'absolute', left: '-5%', top: '25%', width: '35%', height: '50%', opacity: 0.12 }}>
        <path d="M0,50% L40%,30% L100%,45%" fill="none" stroke={C.amber} strokeWidth="2" />
        <path d="M0,50% L40%,50% L100%,50%" fill="none" stroke={C.amber} strokeWidth="3" />
        <path d="M0,50% L40%,70% L100%,55%" fill="none" stroke={C.amber} strokeWidth="2" />
      </svg>
    </div>
  )
}

function HeroSection() {
  const [ref, visible] = useScrollReveal()
  const stats = [
    { value: '80%', desc: 'of ocean plastic enters via rivers' },
    { value: '1,000', desc: 'rivers responsible for 80% of input' },
    { value: '1%', desc: 'of river systems actively monitored' },
  ]

  return (
    <section ref={ref} style={{
      position: 'relative', minHeight: '100vh', display: 'flex',
      flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
      padding: '120px 32px 80px', textAlign: 'center', overflow: 'hidden',
    }}>
      <ParticleField />
      {/* Concept badge — top right corner */}
      <div style={{
        position: 'absolute', top: 56, right: 24, zIndex: 10,
        padding: '6px 14px', borderRadius: 20,
        background: 'rgba(0,180,216,0.08)', border: '1px solid rgba(0,180,216,0.2)',
        fontSize: 11, fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase',
        color: C.cyan, opacity: 0.8,
      }}>
        Concept · Satellite Spectral Intelligence
      </div>
      <div style={{
        position: 'relative', zIndex: 2,
        opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(40px)',
        transition: 'all 1.2s ease',
      }}>
        <h1 style={{
          fontSize: 'clamp(32px, 5vw, 64px)', fontWeight: 800, lineHeight: 1.1,
          letterSpacing: '-0.02em', marginBottom: 20, maxWidth: 900,
          background: `linear-gradient(135deg, #ffffff 0%, #ffffff 50%, ${C.cyan} 100%)`,
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          Microplastic River-to-Ocean Tracking System
        </h1>
        <p style={{
          fontSize: 'clamp(16px, 2vw, 20px)', color: C.muted, maxWidth: 700,
          lineHeight: 1.6, marginBottom: 48,
        }}>
          A concept for tracing 11 million tons of plastic from source to sea using satellite spectral intelligence
        </p>

        <div style={{
          display: 'flex', gap: 32, justifyContent: 'center', flexWrap: 'wrap',
        }}>
          {stats.map((s, i) => (
            <div key={i} style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(20px)',
              transition: `all 0.8s ease ${0.3 + i * 0.2}s`,
            }}>
              <div className="glass-card" style={{ padding: '20px 28px', minWidth: 200 }}>
                <div style={{ fontSize: 32, fontWeight: 800, color: C.cyan, marginBottom: 4 }}>{s.value}</div>
                <div style={{ fontSize: 13, color: C.muted }}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
        animation: 'scrollBounce 2s ease infinite', opacity: 0.5,
      }}>
        <span style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: C.muted }}>Scroll</span>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M10 4L10 16M10 16L4 10M10 16L16 10" stroke={C.muted} strokeWidth="1.5" />
        </svg>
      </div>
    </section>
  )
}

// ─── PROBLEM SECTION ───

function AnimatedBar({ value, max, color, label, tons, delay = 0, active }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
        <span style={{ color: C.white }}>{label}</span>
        <span style={{ color: C.muted }}>{tons ? `${(tons/1000).toFixed(1)}K tons/yr` : `${value}%`}</span>
      </div>
      <div style={{ height: 8, background: 'rgba(255,255,255,0.05)', borderRadius: 4, overflow: 'hidden' }}>
        <div style={{
          height: '100%', borderRadius: 4, background: `linear-gradient(90deg, ${color}, ${color}88)`,
          width: active ? `${(value / max) * 100}%` : '0%',
          transition: `width 1.2s ease ${delay}s`,
        }} />
      </div>
    </div>
  )
}

function StackedBar({ items, active }) {
  let offset = 0
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ height: 32, borderRadius: 8, overflow: 'hidden', display: 'flex', position: 'relative' }}>
        {items.map((item, i) => {
          const left = offset
          offset += item.pct
          return (
            <div key={i} style={{
              width: active ? `${item.pct}%` : '0%',
              height: '100%',
              background: item.color,
              transition: `width 1s ease ${i * 0.15}s`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 700, color: '#000',
              overflow: 'hidden', whiteSpace: 'nowrap',
            }}>
              {item.pct >= 10 && `${item.pct}%`}
            </div>
          )
        })}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: 12 }}>
        {items.map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: item.color }} />
            <span style={{ color: C.muted }}>{item.label} ({item.pct}%)</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function ScaleOfCrisis() {
  const [ref, visible] = useScrollReveal()
  const counter = useAnimatedCounter(11, 1500, visible)
  const maxTons = Math.max(...TOP_RIVERS_POLLUTION.map(r => r.tons))

  return (
    <div ref={ref} className={`section-reveal ${visible ? 'visible' : ''}`}>
      <h3 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8, color: C.white }}>
        Scale of Crisis
      </h3>
      <p style={{ color: C.muted, marginBottom: 32, fontSize: 15 }}>
        Understanding the magnitude of plastic entering our oceans
      </p>

      {/* Big counter */}
      <div className="glass-card" style={{ textAlign: 'center', marginBottom: 32, padding: 32 }}>
        <div style={{ fontSize: 72, fontWeight: 900, color: C.coral, lineHeight: 1 }}>
          {counter}M
        </div>
        <div style={{ fontSize: 16, color: C.muted, marginTop: 8 }}>tons of plastic entering oceans per year</div>
      </div>

      {/* Source breakdown */}
      <h4 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, color: C.white }}>Where Plastic Comes From</h4>
      <StackedBar items={PLASTIC_SOURCES} active={visible} />

      {/* Top 10 rivers */}
      <h4 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, marginTop: 32, color: C.white }}>
        Top 10 Most Polluted Rivers
      </h4>
      <p style={{ fontSize: 14, color: C.muted, marginBottom: 20 }}>
        &ldquo;Rivers are the arteries of pollution&rdquo;
      </p>
      {TOP_RIVERS_POLLUTION.sort((a,b) => b.tons - a.tons).map((r, i) => (
        <AnimatedBar
          key={r.name}
          label={r.name}
          value={r.tons}
          max={maxTons}
          tons={r.tons}
          color={C.coral}
          delay={i * 0.1}
          active={visible}
        />
      ))}
    </div>
  )
}

function UnderwaterJourney() {
  const [ref, visible] = useScrollReveal()

  return (
    <div ref={ref} className={`section-reveal ${visible ? 'visible' : ''}`} style={{ marginTop: 64 }}>
      <h3 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8, color: C.white }}>
        What Happens Underwater
      </h3>
      <p style={{ color: C.muted, marginBottom: 32, fontSize: 15 }}>
        A plastic bottle&rsquo;s journey from river to seafloor
      </p>

      {/* Impact chain */}
      <div className="glass-card" style={{
        marginBottom: 32, textAlign: 'center',
        background: 'linear-gradient(135deg, rgba(230,57,70,0.08), rgba(0,180,216,0.08))',
      }}>
        <div style={{ fontSize: 14, lineHeight: 2, color: C.muted }}>
          <span style={{ color: C.coral, fontWeight: 700 }}>1 plastic bottle</span>
          {' → '}
          <span style={{ color: C.amber, fontWeight: 700 }}>10,000 microplastic fragments</span>
          {' → '}
          <span style={{ color: C.cyan, fontWeight: 700 }}>ingested by 12+ species</span>
          {' → '}
          <span style={{ color: C.red, fontWeight: 700 }}>enters human food chain</span>
        </div>
      </div>

      {/* Depth timeline */}
      <div style={{ position: 'relative', paddingLeft: 40 }}>
        {/* Vertical line */}
        <div style={{
          position: 'absolute', left: 14, top: 0, bottom: 0, width: 2,
          background: `linear-gradient(to bottom, ${C.cyan}, ${C.red})`,
        }} />

        {DEPTH_STAGES.map((stage, i) => (
          <div key={i} style={{
            position: 'relative', marginBottom: 24, paddingLeft: 24,
            opacity: visible ? 1 : 0, transform: visible ? 'translateX(0)' : 'translateX(-20px)',
            transition: `all 0.6s ease ${i * 0.15}s`,
          }}>
            {/* Dot */}
            <div style={{
              position: 'absolute', left: -32, top: 8,
              width: 12, height: 12, borderRadius: '50%',
              background: stage.color, border: `2px solid ${C.bg}`,
            }} />
            <div className="glass-card" style={{ padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: 8 }}>
                <div>
                  <div style={{ fontWeight: 700, color: stage.color, fontSize: 15 }}>{stage.label}</div>
                  <div style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>Depth: {stage.depth}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 13, color: C.muted }}>Residence: {stage.time}</div>
                  <div style={{ fontSize: 13, color: C.amber }}>{stage.species} species affected</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function MonitoringComparison() {
  const [ref, visible] = useScrollReveal()

  const rows = [
    { metric: 'Cost', trad: '$50K+ per survey', sat: 'Free data access', satWin: true },
    { metric: 'Frequency', trad: 'Quarterly', sat: 'Daily revisit', satWin: true },
    { metric: 'Coverage', trad: 'Point samples', sat: 'Continental scale', satWin: true },
    { metric: 'Labor', trad: '10+ field staff', sat: 'Automated processing', satWin: true },
    { metric: 'Latency', trad: 'Months to report', sat: 'Near real-time', satWin: true },
    { metric: 'Spatial Resolution', trad: 'Sub-millimeter (microscopy)', sat: '20m pixels (SWIR) to 1km (PACE)', satWin: false },
    { metric: 'Min. Detection Size', trad: '1 μm (lab analysis)', sat: '~5×5m aggregation (Topouzelis 2019)', satWin: false },
    { metric: 'Microplastic Detection', trad: 'Yes (FTIR/Raman spectroscopy)', sat: 'No — physically undetectable at <5mm', satWin: false },
    { metric: 'Signal Specificity', trad: 'Chemical ID per particle', sat: 'Ambiguous — foam, algae, wood overlap', satWin: false },
  ]

  return (
    <div ref={ref} className={`section-reveal ${visible ? 'visible' : ''}`} style={{ marginTop: 64 }}>
      <h3 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8, color: C.white }}>
        Why Current Monitoring Fails
      </h3>
      <p style={{ color: C.muted, marginBottom: 32, fontSize: 15 }}>
        Traditional approaches cannot keep pace with the scale of the crisis
      </p>

      {/* Comparison table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '12px 16px', borderBottom: `1px solid ${C.dim}`, color: C.muted, fontWeight: 600 }}>Metric</th>
              <th style={{ textAlign: 'left', padding: '12px 16px', borderBottom: `1px solid ${C.dim}`, color: C.coral, fontWeight: 600 }}>Traditional</th>
              <th style={{ textAlign: 'left', padding: '12px 16px', borderBottom: `1px solid ${C.dim}`, color: C.green, fontWeight: 600 }}>Satellite Spectral</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} style={{
                opacity: visible ? 1 : 0,
                transition: `opacity 0.5s ease ${i * 0.1}s`,
              }}>
                <td style={{ padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.04)', color: C.white, fontWeight: 500 }}>{row.metric}</td>
                <td style={{ padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.04)', color: C.muted }}>{row.trad}</td>
                <td style={{ padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.04)', color: row.satWin ? C.green : C.amber }}>
                  {row.sat} {row.satWin && '✓'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Coverage visual */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 32 }}>
        <div className="glass-card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 13, color: C.coral, fontWeight: 600, marginBottom: 12 }}>Traditional Coverage</div>
          <svg width="100%" viewBox="0 0 200 120">
            {/* Sparse dots */}
            {Array.from({length: 8}).map((_, i) => (
              <circle key={i} cx={30 + Math.random() * 140} cy={20 + Math.random() * 80} r="3" fill={C.coral} opacity="0.6" />
            ))}
            <text x="100" y="115" textAnchor="middle" fill={C.muted} fontSize="10">8 sample points</text>
          </svg>
        </div>
        <div className="glass-card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 13, color: C.green, fontWeight: 600, marginBottom: 12 }}>Satellite Coverage</div>
          <svg width="100%" viewBox="0 0 200 120">
            {/* Dense heat map grid */}
            {Array.from({length: 15}).map((_, row) =>
              Array.from({length: 20}).map((_, col) => (
                <rect key={`${row}-${col}`} x={10 + col * 9} y={5 + row * 7} width="8" height="6" rx="1"
                  fill={C.green} opacity={0.1 + Math.random() * 0.4} />
              ))
            )}
            <text x="100" y="115" textAnchor="middle" fill={C.muted} fontSize="10">Continuous coverage</text>
          </svg>
        </div>
      </div>
    </div>
  )
}

function ProblemSection() {
  return (
    <section id="problem" style={{
      padding: '80px 32px', maxWidth: 960, margin: '0 auto',
      backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.02) 1px, transparent 1px)',
      backgroundSize: '30px 30px',
    }}>
      <div style={{
        display: 'inline-block', padding: '6px 16px', borderRadius: 20,
        background: 'rgba(230,57,70,0.1)', border: '1px solid rgba(230,57,70,0.2)',
        fontSize: 12, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase',
        color: C.coral, marginBottom: 16,
      }}>
        The Problem
      </div>
      <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, marginBottom: 48, color: C.white }}>
        A Crisis Flowing Through Our Rivers
      </h2>

      <ScaleOfCrisis />
      <UnderwaterJourney />
      <MonitoringComparison />
    </section>
  )
}

// ─── SOLUTION SECTION ───

function SpectralChart() {
  // Simulated reflectance curves for plastic, water, vegetation
  const wavelengths = [400,500,600,700,800,900,1000,1100,1200,1400,1600,1800,2000,2200,2500]
  const plastic = [0.06,0.08,0.10,0.12,0.11,0.10,0.09,0.08,0.07,0.15,0.22,0.18,0.08,0.20,0.06]
  const water = [0.08,0.06,0.04,0.03,0.02,0.01,0.01,0.01,0.01,0.005,0.003,0.002,0.001,0.001,0.001]
  const vegetation = [0.03,0.05,0.04,0.03,0.35,0.38,0.36,0.34,0.32,0.15,0.10,0.08,0.06,0.05,0.04]

  const w = 400, h = 200, pad = { top: 20, right: 20, bottom: 40, left: 50 }
  const xMin = 400, xMax = 2500, yMin = 0, yMax = 0.42
  const sx = (v) => pad.left + ((v - xMin) / (xMax - xMin)) * (w - pad.left - pad.right)
  const sy = (v) => h - pad.bottom - ((v - yMin) / (yMax - yMin)) * (h - pad.top - pad.bottom)

  const toPath = (data) => wavelengths.map((wl, i) =>
    `${i === 0 ? 'M' : 'L'}${sx(wl).toFixed(1)},${sy(data[i]).toFixed(1)}`
  ).join(' ')

  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', maxWidth: 500 }}>
      {/* Grid lines */}
      {[0, 0.1, 0.2, 0.3, 0.4].map(v => (
        <g key={v}>
          <line x1={pad.left} y1={sy(v)} x2={w - pad.right} y2={sy(v)} stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
          <text x={pad.left - 5} y={sy(v) + 3} textAnchor="end" fill={C.dim} fontSize="9">{v.toFixed(1)}</text>
        </g>
      ))}
      {[400,800,1200,1600,2000,2500].map(wl => (
        <g key={wl}>
          <line x1={sx(wl)} y1={pad.top} x2={sx(wl)} y2={h - pad.bottom} stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
          <text x={sx(wl)} y={h - pad.bottom + 15} textAnchor="middle" fill={C.dim} fontSize="9">{wl}nm</text>
        </g>
      ))}

      {/* Curves */}
      <path d={toPath(vegetation)} fill="none" stroke="#4caf50" strokeWidth="2" opacity="0.8" />
      <path d={toPath(water)} fill="none" stroke={C.blue} strokeWidth="2" opacity="0.8" />
      <path d={toPath(plastic)} fill="none" stroke={C.coral} strokeWidth="2.5" />

      {/* SWIR highlight zone */}
      <rect x={sx(1500)} y={pad.top} width={sx(2300) - sx(1500)} height={h - pad.top - pad.bottom} fill={C.coral} opacity="0.05" />
      <text x={sx(1900)} y={pad.top + 14} textAnchor="middle" fill={C.coral} fontSize="8" opacity="0.6">SWIR Detection Zone</text>

      {/* Legend */}
      <g transform={`translate(${pad.left + 10}, ${pad.top + 5})`}>
        <line x1="0" y1="0" x2="20" y2="0" stroke={C.coral} strokeWidth="2" />
        <text x="25" y="3" fill={C.coral} fontSize="9">Plastic</text>
        <line x1="0" y1="14" x2="20" y2="14" stroke={C.blue} strokeWidth="2" />
        <text x="25" y="17" fill={C.blue} fontSize="9">Water</text>
        <line x1="0" y1="28" x2="20" y2="28" stroke="#4caf50" strokeWidth="2" />
        <text x="25" y="31" fill="#4caf50" fontSize="9">Vegetation</text>
      </g>

      {/* Axis labels */}
      <text x={w / 2} y={h - 5} textAnchor="middle" fill={C.muted} fontSize="10">Wavelength (nm)</text>
      <text x={12} y={h / 2} textAnchor="middle" fill={C.muted} fontSize="10" transform={`rotate(-90, 12, ${h/2})`}>Reflectance</text>
    </svg>
  )
}

function SensorCard({ sensor, index, visible, }) {
  const [showCaveat, setShowCaveat] = useState(false)
  // Mini sparkline
  const sparkData = Array.from({length: 20}, () => Math.random())
  const sparkW = 120, sparkH = 30
  const sparkPath = sparkData.map((v, i) =>
    `${i === 0 ? 'M' : 'L'}${(i / 19) * sparkW},${sparkH - v * sparkH * 0.8}`
  ).join(' ')

  return (
    <div className="glass-card" style={{
      display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px',
      borderLeft: `3px solid ${sensor.color}`,
      opacity: visible ? 1 : 0, transform: visible ? 'translateX(0)' : 'translateX(-20px)',
      transition: `all 0.5s ease ${index * 0.1}s`,
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, color: sensor.color, fontSize: 15 }}>{sensor.name}</div>
        <div style={{ fontSize: 13, color: C.muted, marginTop: 2 }}>{sensor.detect}</div>
        <div style={{ display: 'flex', gap: 16, marginTop: 8, fontSize: 12 }}>
          <span style={{ color: C.dim }}>Res: <span style={{ color: C.white }}>{sensor.res}</span></span>
          <span style={{ color: C.dim }}>Revisit: <span style={{ color: C.white }}>{sensor.revisit}</span></span>
        </div>
        {sensor.caveat && (
          <div style={{ marginTop: 6 }}>
            <span onClick={(e) => { e.stopPropagation(); setShowCaveat(!showCaveat) }}
              style={{ fontSize: 11, color: C.amber, cursor: 'pointer', opacity: 0.7, userSelect: 'none' }}>
              {showCaveat ? '▾' : '▸'} limitations
            </span>
            {showCaveat && (
              <div style={{ fontSize: 11, color: C.amber, marginTop: 4, lineHeight: 1.5, opacity: 0.8 }}>
                {sensor.caveat}
              </div>
            )}
          </div>
        )}
      </div>
      <svg width={sparkW} height={sparkH} style={{ flexShrink: 0 }}>
        <path d={sparkPath} fill="none" stroke={sensor.color} strokeWidth="1.5" opacity="0.7" />
      </svg>
    </div>
  )
}

function PipelineCaveat({ text }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ marginTop: 4 }}>
      <span onClick={(e) => { e.stopPropagation(); setOpen(!open) }}
        style={{ fontSize: 11, color: C.amber, cursor: 'pointer', opacity: 0.7, userSelect: 'none' }}>
        {open ? '▾' : '▸'} caveats
      </span>
      {open && (
        <div style={{ fontSize: 11, color: C.amber, marginTop: 4, lineHeight: 1.5, opacity: 0.8 }}>
          {text}
        </div>
      )}
    </div>
  )
}

function DetectionPipeline() {
  const [ref, visible] = useScrollReveal()
  const steps = [
    { num: 1, title: 'Capture Multispectral Image', desc: 'Acquire Sentinel-2 image — visible bands at 10m, SWIR at 20m resolution', visual: 'grid',
      caveat: 'SWIR bands critical for plastic discrimination are 20m, not 10m. Many rivers are narrower than 20m, causing mixed-pixel contamination with riverbanks.' },
    { num: 2, title: 'Apply Floating Debris Index (FDI)', desc: 'FDI (Biermann et al. 2020) measures NIR deviation from Red Edge–SWIR baseline, combined with NDVI to separate vegetation',
      visual: 'formula',
      caveat: 'The formula originally shown as "NDPI" — (NIR−SWIR)/(NIR+SWIR) — is actually the NDMI/NDWI (Gao 1996), used for vegetation moisture content. The actual peer-reviewed index for floating plastic is the FDI.' },
    { num: 3, title: 'Temporal Stacking', desc: 'Overlay multiple dates to track accumulation patterns (where cloud-free imagery is available)', visual: 'stack',
      caveat: 'Sentinel-2 revisit is 5 days. Cloud cover (especially during monsoon — peak plastic transport) means most events go unobserved. >95% of transport may be missed.' },
    { num: 4, title: 'Source Attribution', desc: 'Correlate detections with upstream land use (theoretical — requires validated detection first)', visual: 'attr',
      caveat: 'This step assumes reliable detection in Step 2, which is not yet operational for rivers. Narrow channels, turbidity, shadows, and vegetation create major challenges.' },
    { num: 5, title: 'Ocean Handoff', desc: 'Track plastic dispersal into coastal waters via ocean current models (theoretical)', visual: 'ocean',
      caveat: 'Requires coupling satellite detection with hydrodynamic models. No validated end-to-end river-to-ocean tracking system exists.' },
  ]

  return (
    <div ref={ref} className={`section-reveal ${visible ? 'visible' : ''}`} style={{ marginTop: 48 }}>
      <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24, color: C.white }}>Detection Pipeline</h3>
      <div style={{ display: 'grid', gap: 16 }}>
        {steps.map((step, i) => (
          <div key={i} className="glass-card" style={{
            display: 'flex', gap: 16, alignItems: 'center', padding: '16px 20px',
            opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(15px)',
            transition: `all 0.5s ease ${i * 0.12}s`,
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: `linear-gradient(135deg, ${C.blue}, ${C.cyan})`, fontWeight: 800, fontSize: 16, color: '#fff', flexShrink: 0,
            }}>
              {step.num}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, color: C.white, fontSize: 15 }}>{step.title}</div>
              <div style={{ fontSize: 13, color: C.muted, marginTop: 2 }}>{step.desc}</div>
              {step.caveat && <PipelineCaveat text={step.caveat} />}
            </div>
            {/* Mini visual for each step */}
            <svg width="60" height="40" style={{ flexShrink: 0, opacity: 0.5 }}>
              {step.visual === 'grid' && Array.from({length: 16}).map((_, j) => (
                <rect key={j} x={(j % 4) * 15} y={Math.floor(j / 4) * 10} width="13" height="8" rx="1"
                  fill={Math.random() > 0.7 ? C.coral : C.blue} opacity={0.3 + Math.random() * 0.5} />
              ))}
              {step.visual === 'formula' && (
                <text x="30" y="25" textAnchor="middle" fill={C.cyan} fontSize="8" fontFamily="monospace">FDI+NDVI</text>
              )}
              {step.visual === 'stack' && [0,1,2].map(j => (
                <rect key={j} x={5 + j * 4} y={5 + j * 5} width="45" height="20" rx="3" fill="none" stroke={C.cyan} opacity={0.3 + j * 0.2} />
              ))}
              {step.visual === 'attr' && (
                <>
                  <circle cx="15" cy="20" r="8" fill={C.coral} opacity="0.4" />
                  <line x1="23" y1="20" x2="40" y2="20" stroke={C.amber} strokeWidth="1" />
                  <circle cx="48" cy="20" r="8" fill={C.amber} opacity="0.4" />
                </>
              )}
              {step.visual === 'ocean' && (
                <path d="M5,25 Q15,15 25,25 Q35,35 45,25 Q55,15 60,20" fill="none" stroke={C.cyan} strokeWidth="1.5" />
              )}
            </svg>
          </div>
        ))}
      </div>
    </div>
  )
}

function SolutionCaveat({ text }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ position: 'relative', flexShrink: 0 }}>
      <button onClick={() => setOpen(!open)} style={{
        background: 'rgba(244,162,97,0.08)', border: '1px solid rgba(244,162,97,0.2)',
        borderRadius: 6, padding: '4px 10px', cursor: 'pointer',
        fontSize: 11, color: C.amber, fontWeight: 600, whiteSpace: 'nowrap',
        display: 'flex', alignItems: 'center', gap: 4,
      }}>
        ⚠ Caveats <span style={{ fontSize: 9, transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : '' }}>▾</span>
      </button>
      {open && (
        <div style={{
          position: 'absolute', right: 0, top: '100%', marginTop: 6, zIndex: 20,
          width: 320, padding: '12px 14px', borderRadius: 8,
          background: 'rgba(26,26,46,0.97)', border: '1px solid rgba(244,162,97,0.2)',
          backdropFilter: 'blur(12px)', fontSize: 12, color: C.amber, lineHeight: 1.6,
          boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
        }}>
          {text}
        </div>
      )}
    </div>
  )
}

function SolutionSection() {
  const [ref, visible] = useScrollReveal()

  return (
    <section id="solution" ref={ref} style={{
      padding: '80px 32px', maxWidth: 960, margin: '0 auto',
    }}>
      <div style={{
        display: 'inline-block', padding: '6px 16px', borderRadius: 20,
        background: 'rgba(0,180,216,0.1)', border: '1px solid rgba(0,180,216,0.2)',
        fontSize: 12, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase',
        color: C.cyan, marginBottom: 16,
      }}>
        The Solution
      </div>
      <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, marginBottom: 16, color: C.white }}>
        Satellite Spectral Monitoring
      </h2>
      <p style={{ color: C.muted, fontSize: 16, marginBottom: 48, maxWidth: 700 }}>
        A theoretical framework for using multispectral satellite imagery to detect floating plastic debris.
        <span style={{ color: C.dim, fontSize: 13 }}> This pipeline is conceptual — no operational system exists today. See <a href="#reality-check" style={{ color: C.cyan, textDecoration: 'none' }}>Reality Check</a> for details.</span>
      </p>

      {/* Spectral signature chart */}
      <div className="glass-card" style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
          <div style={{ flex: 1 }}>
            <h4 style={{ fontSize: 16, fontWeight: 600, color: C.white, marginBottom: 8 }}>Spectral Signature Comparison</h4>
            <p style={{ fontSize: 13, color: C.muted }}>
              Laboratory measurements show plastic has SWIR absorption features from C-H bond overtones (Garaba &amp; Dierssen 2018).
            </p>
          </div>
          <SolutionCaveat text="Lab conditions only — wetting reduces SWIR reflectance by ~56% (up to 90% at longer wavelengths). Sargassum, seafoam, driftwood, pumice, and turbid sediment have overlapping SWIR features. At 20m pixel scales, plastic signals are diluted below detection thresholds." />
        </div>
        <SpectralChart />
      </div>

      {/* Sensor cards */}
      <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 20, color: C.white }}>Sensor Fusion Stack</h3>
      <div style={{ display: 'grid', gap: 12, marginBottom: 32 }}>
        {SENSORS.map((s, i) => (
          <SensorCard key={s.name} sensor={s} index={i} visible={visible} />
        ))}
      </div>

      <DetectionPipeline />
    </section>
  )
}

// ─── DASHBOARD SECTION ───

function TimeSeriesChart({ data, river, width = 800, height = 320 }) {
  const [hoveredIdx, setHoveredIdx] = useState(null)
  const pad = { top: 30, right: 30, bottom: 50, left: 65 }

  const values = data.map(d => d.value)
  const allValues = data.flatMap(d => [d.ciLow, d.ciHigh])
  const yMin = Math.min(...allValues) * 0.85
  const yMax = Math.max(...allValues) * 1.1
  const xCount = data.length

  const sx = (i) => pad.left + (i / (xCount - 1)) * (width - pad.left - pad.right)
  const sy = (v) => pad.top + ((yMax - v) / (yMax - yMin)) * (height - pad.top - pad.bottom)

  // Main line path
  const linePath = data.map((d, i) => `${i === 0 ? 'M' : 'L'}${sx(i).toFixed(1)},${sy(d.value).toFixed(1)}`).join(' ')

  // Confidence band
  const ciBandUpper = data.map((d, i) => `${i === 0 ? 'M' : 'L'}${sx(i).toFixed(1)},${sy(d.ciHigh).toFixed(1)}`).join(' ')
  const ciBandLower = data.map((d, i) => `L${sx(xCount - 1 - i).toFixed(1)},${sy(data[xCount - 1 - i].ciLow).toFixed(1)}`).join(' ')
  const ciBand = ciBandUpper + ' ' + ciBandLower + ' Z'

  // Trend line (linear regression)
  const n = values.length
  const sumX = n * (n - 1) / 2
  const sumY = values.reduce((a, b) => a + b, 0)
  const sumXY = values.reduce((a, v, i) => a + i * v, 0)
  const sumX2 = n * (n - 1) * (2 * n - 1) / 6
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX)
  const intercept = (sumY - slope * sumX) / n
  const trendStart = intercept
  const trendEnd = intercept + slope * (n - 1)

  // Color based on trend
  const trendColor = river.trend === 'improving' ? C.green : river.trend === 'worsening' ? C.coral : C.amber

  // Y-axis ticks
  const yTicks = []
  const yStep = Math.ceil((yMax - yMin) / 5 / 100) * 100
  for (let v = Math.ceil(yMin / yStep) * yStep; v <= yMax; v += yStep) {
    yTicks.push(v)
  }

  // X-axis labels (every 6 months)
  const xLabels = data.filter((_, i) => i % 6 === 0)

  // Event markers
  const eventIndices = river.events.map(ev => {
    return data.findIndex(d => d.month === ev.month - 1 && d.year === ev.year)
  }).filter(i => i >= 0)

  return (
    <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%' }}
      onMouseLeave={() => setHoveredIdx(null)}>
      {/* Grid */}
      {yTicks.map(v => (
        <g key={v}>
          <line x1={pad.left} y1={sy(v)} x2={width - pad.right} y2={sy(v)} stroke="rgba(255,255,255,0.05)" />
          <text x={pad.left - 8} y={sy(v) + 4} textAnchor="end" fill={C.dim} fontSize="11">
            {v >= 1000 ? `${(v/1000).toFixed(1)}K` : v}
          </text>
        </g>
      ))}

      {/* X labels */}
      {xLabels.map((d, i) => (
        <text key={i} x={sx(data.indexOf(d))} y={height - pad.bottom + 20} textAnchor="middle" fill={C.dim} fontSize="10">
          {d.label}
        </text>
      ))}

      {/* Year separators */}
      {[12, 24].map(i => (
        <line key={i} x1={sx(i)} y1={pad.top} x2={sx(i)} y2={height - pad.bottom} stroke="rgba(255,255,255,0.08)" strokeDasharray="4" />
      ))}

      {/* Confidence band */}
      <path d={ciBand} fill={trendColor} opacity="0.08" />

      {/* Main line */}
      <path d={linePath} fill="none" stroke={trendColor} strokeWidth="2.5" strokeLinejoin="round" />

      {/* Trend line */}
      <line x1={sx(0)} y1={sy(trendStart)} x2={sx(n-1)} y2={sy(trendEnd)}
        stroke={trendColor} strokeWidth="1.5" strokeDasharray="6 4" opacity="0.5" />

      {/* Event markers */}
      {eventIndices.map((idx, i) => (
        <g key={i}>
          <polygon
            points={`${sx(idx)},${sy(data[idx].value) - 14} ${sx(idx) - 6},${sy(data[idx].value) - 24} ${sx(idx) + 6},${sy(data[idx].value) - 24}`}
            fill={C.amber} opacity="0.8"
          />
        </g>
      ))}

      {/* Hover interaction areas */}
      {data.map((d, i) => (
        <g key={i}>
          <rect x={sx(i) - (width / xCount / 2)} y={pad.top} width={width / xCount} height={height - pad.top - pad.bottom}
            fill="transparent" onMouseEnter={() => setHoveredIdx(i)} />
        </g>
      ))}

      {/* Hover tooltip */}
      {hoveredIdx !== null && (
        <g>
          <line x1={sx(hoveredIdx)} y1={pad.top} x2={sx(hoveredIdx)} y2={height - pad.bottom} stroke="rgba(255,255,255,0.2)" />
          <circle cx={sx(hoveredIdx)} cy={sy(data[hoveredIdx].value)} r="5" fill={trendColor} stroke={C.bg} strokeWidth="2" />
          <rect x={sx(hoveredIdx) + 10} y={sy(data[hoveredIdx].value) - 36} width="140" height="48" rx="6" fill="rgba(10,10,15,0.95)" stroke="rgba(255,255,255,0.1)" />
          <text x={sx(hoveredIdx) + 18} y={sy(data[hoveredIdx].value) - 18} fill={C.white} fontSize="12" fontWeight="700">
            {data[hoveredIdx].label}
          </text>
          <text x={sx(hoveredIdx) + 18} y={sy(data[hoveredIdx].value)} fill={trendColor} fontSize="12">
            {data[hoveredIdx].value.toLocaleString()} tons
          </text>
          {/* Check if this is an event month */}
          {river.events.find(ev => data[hoveredIdx].month === ev.month - 1 && data[hoveredIdx].year === ev.year) && (
            <text x={sx(hoveredIdx) + 18} y={sy(data[hoveredIdx].value) - 48} fill={C.amber} fontSize="10">
              {river.events.find(ev => data[hoveredIdx].month === ev.month - 1 && data[hoveredIdx].year === ev.year).label}
            </text>
          )}
        </g>
      )}

      {/* Axis labels */}
      <text x={width / 2} y={height - 5} textAnchor="middle" fill={C.muted} fontSize="11">Month</text>
      <text x={15} y={height / 2} textAnchor="middle" fill={C.muted} fontSize="11" transform={`rotate(-90, 15, ${height/2})`}>
        Plastic Flux (tons/month)
      </text>
    </svg>
  )
}

function SourcePie({ sources }) {
  const entries = Object.entries(sources)
  const colors = { urban: C.coral, industrial: C.amber, agricultural: C.green, dumping: C.cyan }
  let cumAngle = -90

  return (
    <svg viewBox="0 0 120 120" style={{ width: 120, height: 120 }}>
      {entries.map(([key, pct], i) => {
        const startAngle = cumAngle
        const angle = (pct / 100) * 360
        cumAngle += angle
        const r = 50
        const cx = 60, cy = 60
        const x1 = cx + r * Math.cos((startAngle * Math.PI) / 180)
        const y1 = cy + r * Math.sin((startAngle * Math.PI) / 180)
        const x2 = cx + r * Math.cos(((startAngle + angle) * Math.PI) / 180)
        const y2 = cy + r * Math.sin(((startAngle + angle) * Math.PI) / 180)
        const largeArc = angle > 180 ? 1 : 0
        return (
          <path key={key}
            d={`M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${largeArc} 1 ${x2},${y2} Z`}
            fill={colors[key]} opacity="0.8"
          />
        )
      })}
      <circle cx="60" cy="60" r="25" fill={C.bg} />
    </svg>
  )
}

function RiverMap({ river }) {
  // Stylized river path
  const points = Array.from({length: 8}, (_, i) => ({
    x: 10 + (i / 7) * 180,
    y: 40 + Math.sin(i * 0.9 + river.name.length) * 25,
  }))
  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')
  const monitorDots = points.filter((_, i) => i % 2 === 1)

  return (
    <svg viewBox="0 0 200 80" style={{ width: '100%', maxWidth: 300 }}>
      <path d={pathD} fill="none" stroke={C.blue} strokeWidth="3" opacity="0.6" strokeLinecap="round" strokeLinejoin="round" />
      {monitorDots.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="5" fill={C.cyan} opacity="0.8" />
          <circle cx={p.x} cy={p.y} r="8" fill="none" stroke={C.cyan} strokeWidth="0.5" opacity="0.4" />
        </g>
      ))}
      {/* Ocean indicator */}
      <rect x="185" y="10" width="15" height="60" rx="4" fill={C.blue} opacity="0.15" />
      <text x="192" y="44" textAnchor="middle" fill={C.blue} fontSize="8" opacity="0.5">Sea</text>
    </svg>
  )
}

function DashboardSection() {
  const [selectedRiver, setSelectedRiver] = useState('Pasig')
  const [ref, visible] = useScrollReveal()

  const river = RIVERS.find(r => r.name === selectedRiver)
  const data = RIVER_DATA[selectedRiver]
  const trendColor = river.trend === 'improving' ? C.green : river.trend === 'worsening' ? C.coral : C.amber
  const trendArrow = river.trend === 'improving' ? '↓' : river.trend === 'worsening' ? '↑' : '→'

  return (
    <section id="dashboard" ref={ref} style={{
      padding: '80px 32px', maxWidth: 1100, margin: '0 auto',
    }}>
      <div style={{
        display: 'inline-block', padding: '6px 16px', borderRadius: 20,
        background: 'rgba(0,119,182,0.1)', border: '1px solid rgba(0,119,182,0.2)',
        fontSize: 12, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase',
        color: C.blue, marginBottom: 16,
      }}>
        River Dashboard
      </div>
      <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, marginBottom: 16, color: C.white }}>
        River Time-Series Analysis
      </h2>
      <div style={{
        padding: '14px 18px', borderRadius: 8, marginBottom: 32,
        background: 'rgba(244,162,97,0.08)', border: '1px solid rgba(244,162,97,0.2)',
        fontSize: 13, color: C.amber, lineHeight: 1.7, maxWidth: 900,
      }}>
        <strong>⚠ SIMULATED DATA</strong> — All time-series data, flux values, and trends shown below are simulated to illustrate
        what a future monitoring dashboard <em>could</em> look like. The annual tonnage baselines are drawn from waste-generation
        models (Meijer et al. 2021; Lebreton et al. 2017), <em>not</em> satellite measurements.
        <br/><br/>
        <strong>On the confidence intervals:</strong> The shaded bands shown are cosmetic (±12-20% of signal). Real uncertainty
        in any satellite-derived plastic flux estimate would span <strong>1-2 orders of magnitude</strong> (10-100×) due to
        compounding unknowns in sub-pixel detection, mass conversion, temporal sampling, and the fact that most plastic is subsurface and invisible to optical sensors.
        <br/><br/>
        <strong>On the tonnage values:</strong> No validated method exists to convert satellite spectral detections to "tons/month."
        The conversion requires a chain of poorly constrained assumptions — each multiplying uncertainty.
      </div>

      {/* River selector tabs */}
      <div style={{
        display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 12, marginBottom: 32,
        scrollbarWidth: 'thin',
      }}>
        {RIVERS.map(r => {
          const isActive = r.name === selectedRiver
          const tc = r.trend === 'improving' ? C.green : r.trend === 'worsening' ? C.coral : C.amber
          return (
            <button key={r.name} onClick={() => setSelectedRiver(r.name)} style={{
              padding: '8px 18px', borderRadius: 8, border: 'none', cursor: 'pointer',
              background: isActive ? 'rgba(0,119,182,0.2)' : 'rgba(255,255,255,0.03)',
              color: isActive ? C.cyan : C.muted,
              fontSize: 13, fontWeight: isActive ? 700 : 500, whiteSpace: 'nowrap',
              transition: 'all 0.2s',
              outline: isActive ? `1px solid rgba(0,180,216,0.3)` : '1px solid rgba(255,255,255,0.06)',
            }}>
              {r.name}
              <span style={{ marginLeft: 6, color: tc, fontSize: 11 }}>
                {r.trend === 'improving' ? '↓' : r.trend === 'worsening' ? '↑' : '→'}
              </span>
            </button>
          )
        })}
      </div>

      {/* Main chart */}
      <div className="glass-card" style={{ marginBottom: 24, padding: '24px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
          <div>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: C.white }}>{river.name} River — Plastic Flux</h3>
            <p style={{ fontSize: 13, color: C.muted }}>{river.country} · {river.oceanBasin}</p>
          </div>
          <div style={{
            padding: '6px 14px', borderRadius: 20,
            background: `${trendColor}15`, border: `1px solid ${trendColor}30`,
            fontSize: 13, fontWeight: 600, color: trendColor,
          }}>
            {trendArrow} {Math.abs(river.trendPct)}% YoY · {river.trend}
          </div>
        </div>
        <TimeSeriesChart data={data} river={river} />
        <div style={{ display: 'flex', gap: 16, marginTop: 12, fontSize: 11, color: C.dim, flexWrap: 'wrap' }}>
          <span>— Simulated plastic load</span>
          <span style={{ color: C.dim }}>--- Trend line</span>
          <span><span style={{ color: C.amber }}>▲</span> Event marker (hover for details)</span>
          <span>Shaded area = illustrative CI (actual uncertainty is 10-100× wider)</span>
        </div>
      </div>

      {/* Metrics panel */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'Monthly Load', value: `${(river.annualTons / 12 / 1000).toFixed(1)}K tons`, trend: trendArrow, trendColor },
          { label: 'YoY Change', value: `${river.trendPct > 0 ? '+' : ''}${river.trendPct}%`, trendColor },
          { label: 'Peak Month', value: river.peakMonth, sub: `${(river.peakLoad / 1000).toFixed(1)}K tons` },
          { label: 'Ocean Delivery', value: `${river.oceanDelivery}%`, sub: 'reaches coast' },
          { label: 'Intervention Score', value: `${river.interventionScore}/10`, trendColor: river.interventionScore >= 8 ? C.coral : C.amber },
          { label: 'Monitoring Coverage', value: `${river.coverage}%`, sub: 'satellite coverage' },
        ].map((m, i) => (
          <div key={i} className="glass-card" style={{ padding: '14px 16px', textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: C.dim, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>{m.label}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: m.trendColor || C.white }}>
              {m.value} {m.trend && <span style={{ fontSize: 14 }}>{m.trend}</span>}
            </div>
            {m.sub && <div style={{ fontSize: 11, color: C.dim, marginTop: 2 }}>{m.sub}</div>}
          </div>
        ))}
      </div>

      {/* Bottom row: source pie + river profile + map */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
        {/* Source breakdown */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ fontSize: 13, color: C.muted, fontWeight: 600, marginBottom: 12 }}>Source Breakdown</div>
          <SourcePie sources={river.sources} />
          <div style={{ marginTop: 12, fontSize: 12 }}>
            {Object.entries(river.sources).map(([key, pct]) => (
              <div key={key} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '2px 0' }}>
                <span style={{ color: C.muted, textTransform: 'capitalize' }}>{key}</span>
                <span style={{ color: C.white, fontWeight: 600 }}>{pct}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* River profile */}
        <div className="glass-card">
          <div style={{ fontSize: 13, color: C.muted, fontWeight: 600, marginBottom: 12 }}>River Profile</div>
          {[
            { label: 'Length', value: `${river.length.toLocaleString()} km` },
            { label: 'Countries', value: river.country },
            { label: 'Watershed Pop.', value: river.population },
            { label: 'Ocean Basin', value: river.oceanBasin },
            { label: 'Annual Load', value: `${(river.annualTons / 1000).toFixed(1)}K tons` },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: 12 }}>
              <span style={{ color: C.dim }}>{item.label}</span>
              <span style={{ color: C.white, fontWeight: 500, textAlign: 'right', maxWidth: '60%' }}>{item.value}</span>
            </div>
          ))}
        </div>

        {/* River map */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontSize: 13, color: C.muted, fontWeight: 600, marginBottom: 12 }}>Monitoring Points</div>
          <RiverMap river={river} />
          <div style={{ fontSize: 11, color: C.dim, marginTop: 8 }}>
            {river.coverage}% of river length monitored
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── IMPACT SECTION ───

function InterventionModeling() {
  const [ref, visible] = useScrollReveal()
  const currentVal = useAnimatedCounter(11000, 1500, visible)
  const projectedVal = useAnimatedCounter(6600, 1500, visible)

  const interventions = [
    { name: 'Trash Traps at River Mouths', effectiveness: '60-80%', cost: '$500K per installation', capture: 75, color: C.cyan },
    { name: 'Upstream Waste Infrastructure', effectiveness: '90% prevention', cost: '$50M per city', capture: 90, color: C.green },
    { name: 'Satellite Monitoring + Policy', effectiveness: 'Real-time detection', cost: '$2M per river system', capture: 60, color: C.amber },
  ]

  return (
    <div ref={ref} className={`section-reveal ${visible ? 'visible' : ''}`}>
      <h3 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8, color: C.white }}>Intervention Modeling</h3>
      <p style={{ color: C.muted, marginBottom: 32, fontSize: 15 }}>
        If the top 10 rivers reduce plastic input by 50%, ocean plastic drops by 40%
      </p>

      {/* Before/after bars */}
      <div className="glass-card" style={{ marginBottom: 32 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
          <div>
            <div style={{ fontSize: 13, color: C.coral, fontWeight: 600, marginBottom: 8 }}>Current</div>
            <div style={{ fontSize: 36, fontWeight: 900, color: C.coral }}>{(currentVal / 1000).toFixed(0)}M</div>
            <div style={{ fontSize: 12, color: C.muted }}>tons/year entering oceans</div>
            <div style={{
              height: 12, borderRadius: 6, marginTop: 12,
              background: `linear-gradient(90deg, ${C.coral}, ${C.red})`,
              width: visible ? '100%' : '0%', transition: 'width 1.5s ease',
            }} />
          </div>
          <div>
            <div style={{ fontSize: 13, color: C.green, fontWeight: 600, marginBottom: 8 }}>Projected (with intervention)</div>
            <div style={{ fontSize: 36, fontWeight: 900, color: C.green }}>{(projectedVal / 1000).toFixed(0)}M</div>
            <div style={{ fontSize: 12, color: C.muted }}>tons/year — 40% reduction</div>
            <div style={{
              height: 12, borderRadius: 6, marginTop: 12,
              background: `linear-gradient(90deg, ${C.green}, ${C.cyan})`,
              width: visible ? '60%' : '0%', transition: 'width 1.5s ease 0.3s',
            }} />
          </div>
        </div>

        <div style={{ marginTop: 24, padding: '12px 16px', background: 'rgba(0,214,143,0.06)', borderRadius: 8, border: '1px solid rgba(0,214,143,0.1)' }}>
          <div style={{ fontSize: 14, color: C.green, fontWeight: 600 }}>Cost Comparison</div>
          <div style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>
            Ocean cleanup: <span style={{ color: C.coral, fontWeight: 600 }}>$20B+ estimated</span> vs.
            River intervention: <span style={{ color: C.green, fontWeight: 600 }}>$2B for 80% reduction</span>
          </div>
        </div>
      </div>

      {/* Intervention types */}
      <div style={{ display: 'grid', gap: 12 }}>
        {interventions.map((intv, i) => (
          <div key={i} className="glass-card" style={{
            display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px',
            borderLeft: `3px solid ${intv.color}`,
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, color: intv.color, fontSize: 15 }}>{intv.name}</div>
              <div style={{ fontSize: 13, color: C.muted, marginTop: 2 }}>
                Effectiveness: {intv.effectiveness} · Cost: {intv.cost}
              </div>
            </div>
            <div style={{ width: 80 }}>
              <div style={{ height: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{
                  height: '100%', borderRadius: 3, background: intv.color,
                  width: visible ? `${intv.capture}%` : '0%',
                  transition: `width 1s ease ${i * 0.2}s`,
                }} />
              </div>
              <div style={{ fontSize: 11, color: C.muted, textAlign: 'center', marginTop: 4 }}>{intv.capture}%</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function AccountabilityChain() {
  const [ref, visible] = useScrollReveal()
  const steps = [
    'Satellite Detection',
    'Source Identification',
    'Government Notification',
    'Compliance Tracking',
    'Public Reporting',
  ]

  return (
    <div ref={ref} className={`section-reveal ${visible ? 'visible' : ''}`} style={{ marginTop: 64 }}>
      <h3 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8, color: C.white }}>Accountability Chain</h3>
      <p style={{ color: C.muted, marginBottom: 32, fontSize: 15 }}>
        Every river system gets a pollution passport — traceable, accountable, public
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: 0, flexWrap: 'wrap', justifyContent: 'center' }}>
        {steps.map((step, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{
              padding: '12px 20px', borderRadius: 8,
              background: `linear-gradient(135deg, rgba(0,119,182,${0.1 + i * 0.04}), rgba(0,180,216,${0.05 + i * 0.03}))`,
              border: '1px solid rgba(0,180,216,0.15)',
              fontSize: 13, fontWeight: 600, color: C.cyan, whiteSpace: 'nowrap',
              opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(10px)',
              transition: `all 0.5s ease ${i * 0.15}s`,
            }}>
              {step}
            </div>
            {i < steps.length - 1 && (
              <svg width="30" height="20" style={{ flexShrink: 0 }}>
                <path d="M5,10 L20,10 M16,5 L22,10 L16,15" fill="none" stroke={C.cyan} strokeWidth="1.5" opacity="0.4" />
              </svg>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function YourRiverImpact() {
  const [ref, visible] = useScrollReveal()
  const [selectedRiver, setSelectedRiver] = useState('Pasig')
  const river = RIVERS.find(r => r.name === selectedRiver)

  const reductionPct = river.trend === 'improving' ? 15 : river.interventionScore >= 8 ? 45 : 30

  return (
    <div ref={ref} className={`section-reveal ${visible ? 'visible' : ''}`} style={{ marginTop: 64 }}>
      <h3 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8, color: C.white }}>Your River, Your Impact</h3>
      <p style={{ color: C.muted, marginBottom: 24, fontSize: 15 }}>
        See what satellite monitoring can achieve for any river
      </p>

      <div style={{ marginBottom: 16 }}>
        <select
          value={selectedRiver}
          onChange={e => setSelectedRiver(e.target.value)}
          style={{
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 8, padding: '10px 16px', color: C.white, fontSize: 14,
            cursor: 'pointer', outline: 'none',
          }}
        >
          {RIVERS.map(r => <option key={r.name} value={r.name}>{r.name}</option>)}
        </select>
      </div>

      <div className="glass-card" style={{
        background: 'linear-gradient(135deg, rgba(0,119,182,0.08), rgba(0,214,143,0.06))',
        textAlign: 'center', padding: 32,
      }}>
        <div style={{ fontSize: 15, color: C.muted, lineHeight: 1.8 }}>
          <strong style={{ color: C.amber }}>Theoretical scenario:</strong> If satellite monitoring of the <span style={{ color: C.cyan, fontWeight: 700 }}>{river.name}</span> could
          achieve operational detection capability, pollution sources <em>might</em> be identifiable within <span style={{ color: C.amber, fontWeight: 700 }}>months</span>,
          potentially enabling a <span style={{ color: C.green, fontWeight: 700 }}>{reductionPct}%</span> reduction
          over <span style={{ color: C.green, fontWeight: 700 }}>several years</span> — if coupled with on-the-ground intervention.
        </div>
        <div style={{ marginTop: 16, fontSize: 13, color: C.dim }}>
          That would represent ~{((river.annualTons * reductionPct / 100) / 1000).toFixed(1)}K fewer tons reaching the {river.oceanBasin} annually (based on Meijer et al. 2021 model estimates)
        </div>
        <div style={{ marginTop: 12, fontSize: 12, color: C.amber, fontStyle: 'italic' }}>
          Note: These projections assume detection capabilities that do not yet exist at the required precision.
        </div>
      </div>
    </div>
  )
}

function ImpactSection() {
  return (
    <section id="impact" style={{
      padding: '80px 32px', maxWidth: 960, margin: '0 auto',
      backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.02) 1px, transparent 1px)',
      backgroundSize: '30px 30px',
    }}>
      <div style={{
        display: 'inline-block', padding: '6px 16px', borderRadius: 20,
        background: 'rgba(0,214,143,0.1)', border: '1px solid rgba(0,214,143,0.2)',
        fontSize: 12, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase',
        color: C.green, marginBottom: 16,
      }}>
        Impact & Action
      </div>
      <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, marginBottom: 16, color: C.white }}>
        What We Could Achieve
      </h2>
      <div style={{
        padding: '12px 16px', borderRadius: 8, marginBottom: 48, maxWidth: 800,
        background: 'rgba(244,162,97,0.06)', border: '1px solid rgba(244,162,97,0.15)',
        fontSize: 13, color: C.amber, lineHeight: 1.6,
      }}>
        ⚠ The intervention estimates below are drawn from policy and engineering literature, not satellite-verified outcomes.
        The connection between satellite monitoring and intervention effectiveness shown here is aspirational, not demonstrated.
      </div>

      <InterventionModeling />
      <AccountabilityChain />
      <YourRiverImpact />
    </section>
  )
}

// ─── SCIENTIFIC REALITY CHECK ───

function RealityCheckSection() {
  const [ref, visible] = useScrollReveal()
  const [expandedItem, setExpandedItem] = useState(null)

  const issues = [
    {
      title: '1. The "NDPI" Is Actually a Vegetation Moisture Index',
      severity: 'critical',
      summary: 'The formula (NIR−SWIR)/(NIR+SWIR) is the NDMI/NDWI (Gao 1996) for vegetation water content — not a plastic index.',
      detail: `The formula originally presented on this page as "NDPI" is the well-established Normalized Difference Moisture Index (NDMI), published by Gao in 1996 to measure vegetation water content. It has been used for decades in drought monitoring and crop health assessment.

The actual peer-reviewed indices for floating plastic detection are:
• FDI (Floating Debris Index) — Biermann et al. 2020: Uses Red Edge, NIR, and SWIR bands to measure NIR deviation from an interpolated baseline
• PI (Plastic Index) — Themistocleous et al. 2020: Uses Red and NIR bands
• NDVI is used in combination with FDI to separate plastics from vegetation (plastics have low NDVI)

Applying NDMI to water surfaces and calling it "NDPI" conflates unrelated science.`,
    },
    {
      title: '2. Sentinel-2 Cannot Detect Microplastics',
      severity: 'critical',
      summary: 'SWIR bands are 20m resolution (not 10m). Microplastics (<5mm) are physically undetectable. Only large macroplastic aggregations (≥5×5m) can be identified.',
      detail: `Sentinel-2's SWIR bands (B11 at 1610nm, B12 at 2190nm) are at 20m resolution, not 10m. Only visible and broad NIR bands are 10m.

The Plastic Litter Project (Topouzelis et al. 2019) deployed artificial 10×10m and 5×5m targets — a 5×5m target occupies ~6% of a 20m SWIR pixel, near the detection threshold. Individual microplastic particles (<5mm) are 4,000× smaller than a pixel.

What Sentinel-2 can detect: dense, large aggregations of floating macroplastic that cover a meaningful fraction of a pixel — under clear skies, calm water, and optimal sun angle.`,
    },
    {
      title: '3. Spectral Confusion: Many Materials Look Like Plastic',
      severity: 'high',
      summary: 'Sargassum, seafoam, driftwood, pumice, turbid sediment, and algal blooms all have overlapping SWIR signatures. Wetting reduces plastic reflectance by ~56%.',
      detail: `Laboratory spectroscopy shows plastics have SWIR absorption features from C-H bonds at ~1210nm and ~1430nm (Garaba & Dierssen 2018). However:

• Wetting reduces reflectance by 56% on average, up to 90% in SWIR bands
• Sargassum, macroalgae, seafoam, whitecaps, pumice, driftwood, and turbid sediment all reflect in NIR/SWIR
• Different plastic types (PE, PP, PET, PS) have different signatures — there is no single "plastic" curve
• At satellite pixel scales, plastic signals are diluted by surrounding water below noise thresholds
• The clean lab-measured curves shown in the spectral chart do not represent real satellite-observable conditions`,
    },
    {
      title: '4. PACE/OCI Was Not Designed for Plastic Detection',
      severity: 'high',
      summary: '"Ocean color microplastic proxy" is not an established scientific concept. PACE has 1km resolution — designed for phytoplankton and aerosols.',
      detail: `PACE's Ocean Color Instrument provides hyperspectral coverage at ~1km resolution. It was designed to study phytoplankton community composition, aerosols, and cloud properties.

No validated method exists to infer microplastic concentrations from ocean color data. Some researchers have explored statistical correlations, but these likely reflect co-occurring processes (convergence zones concentrate both plankton and debris) rather than direct optical detection of plastics.

The term "ocean color microplastic proxy" does not appear in peer-reviewed literature as a validated detection method.`,
    },
    {
      title: '5. The Sensor Fusion Stack Has No Integration Framework',
      severity: 'high',
      summary: '6 sensors spanning 10m to 1km resolution with different revisit times and spectral bands. No mathematical framework defines how they combine into a single measurement.',
      detail: `Fusing data from sensors with 100× resolution differences (10m to 1km) requires explicit mathematical frameworks:

• Resolution mismatch: Upsampling 1km PACE data to 10m creates phantom detail; downsampling destroys the information you need
• Temporal mismatch: Different revisit times (1-16 days) mean observations are rarely simultaneous. Floating debris moves kilometers in hours
• Spectral incompatibility: Different spectral bands, response functions, and calibrations require cross-calibration
• No algorithm defined: The page shows a pipeline without defining how any measurement from one sensor constrains another

Missing entirely: How do you mask river banks? For narrow rivers (<30m wide), most pixels are mixed land-water. The land spectral signal dominates any plastic signal. You need water masks, bank/shadow masking, and sub-pixel unmixing — none of which are described.`,
    },
    {
      title: '6. Converting Spectral Signal to "Tons/Month" Is Not Possible at Claimed Precision',
      severity: 'critical',
      summary: 'The conversion requires a chain of poorly constrained assumptions. Cumulative uncertainty: 1-2 orders of magnitude (10-100×).',
      detail: `Converting a satellite detection to mass flux requires:

1. Spectral signal → sub-pixel plastic fraction (uncertainty: 5-50×)
2. Fraction → areal density kg/m² (10-100× — thin film vs. thick raft)
3. Detected area → total area (extrapolation from cloudy/undetected regions)
4. Snapshot → flux rate (requires flow velocity, residence time)
5. Single overpass → monthly total (5-day revisit = >95% of events unobserved)

Each step multiplies uncertainty. A satellite estimate of "5,000 tons/month" could plausibly be 500 to 50,000 tons.

The actual river flux literature (Meijer et al. 2021; Lebreton et al. 2017) derives estimates from waste generation statistics and hydrological models — not satellite observations.`,
    },
    {
      title: '7. Confidence Intervals Are Cosmetic',
      severity: 'high',
      summary: 'The shaded CI bands (±12-20%) are visual decoration. Real uncertainty would span the entire chart height — 10-100× the signal.',
      detail: `The dashboard shows narrow, symmetrical confidence intervals as a percentage of the signal. This implies a precision that does not exist.

Real uncertainty in satellite-derived plastic estimates would include:
• Radiometric calibration: ~3-5% (the smallest contributor)
• Atmospheric correction: 5-15% (variable)
• Sub-pixel detection probability: unknown — could be 0% for sparse plastics
• Mass conversion: 1-2 orders of magnitude
• Temporal sampling: sparse revisit means most transport is unobserved
• Subsurface plastic: ~99% of ocean plastic is below the surface and invisible to optical sensors

No methodology is given for how the intervals are calculated because no validated methodology exists.`,
    },
    {
      title: '8. River Detection Is Much Harder Than Open Ocean',
      severity: 'high',
      summary: 'Many listed rivers are narrower than satellite pixels. Turbidity, vegetation, shadows, bridges, and monsoon clouds create severe detection challenges.',
      detail: `River environments present substantially greater challenges than open ocean (Marye et al. 2025):

• The Pasig River (27km long) is roughly 70m wide in places — just 3-4 SWIR pixels across, with bank contamination on both edges
• Tropical rivers have high turbidity that masks plastic signals
• Dense riparian vegetation creates shadows and obscures the water surface
• Urban rivers have bridges, boats, and infrastructure creating spectral confusion
• Monsoon season (when plastic transport peaks) has the highest cloud cover — meaning fewest satellite observations during the most important period
• The clean seasonal curves shown in the dashboard would actually have large gaps and high noise`,
    },
    {
      title: '9. No Independent Field Validation',
      severity: 'high',
      summary: 'Field validation relies on controlled experiments with artificial targets (Topouzelis et al. 2019), not real-world plastic pollution. No large-scale validation campaign exists.',
      detail: `Field validation for satellite-based plastic detection is extremely limited:

• The Plastic Litter Projects (2018-2021) deployed artificial targets of known size synchronized with satellite overpasses. These demonstrated detection of dense, large aggregations — far from natural conditions.
• Reported detection accuracies (86-94%) are for large, obvious targets, not dispersed river pollution
• No standardized monitoring protocols exist for matching satellite observations with in-situ sampling
• Most validation uses drone imagery as intermediate ground truth rather than direct physical sampling
• There is no large-scale, systematic validation comparing satellite estimates with comprehensive field surveys

Without ground truth, the dashboard values cannot be verified.`,
    },
    {
      title: '10. Missing: CALIPSO and Lidar Approaches',
      severity: 'moderate',
      summary: 'CALIPSO (ended 2023) used lidar that could theoretically distinguish plastic via depolarization. This promising approach is absent from the sensor stack.',
      detail: `CALIPSO's CALIOP instrument measured backscatter at 532nm and 1064nm. Lidar has advantages over passive sensors: it works day/night, at low solar angles, and provides depth-resolved information.

While CALIPSO was never operationally used for plastic detection, lidar depolarization ratios could theoretically distinguish plastic particles from marine biota. This approach — or its successors (ATLID on EarthCARE, ICESat-2) — represents a potentially more promising path than passive SWIR spectral detection for sub-surface and dispersed plastics.

Its absence from the sensor stack is a notable gap.`,
    },
  ]

  const severityColors = { critical: C.red, high: C.coral, moderate: C.amber }

  return (
    <section id="reality-check" style={{
      padding: '80px 32px', maxWidth: 960, margin: '0 auto',
    }}>
      <div style={{
        display: 'inline-block', padding: '6px 16px', borderRadius: 20,
        background: 'rgba(244,162,97,0.1)', border: '1px solid rgba(244,162,97,0.2)',
        fontSize: 12, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase',
        color: C.amber, marginBottom: 16,
      }}>
        Scientific Reality Check
      </div>
      <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, marginBottom: 16, color: C.white }}>
        What the Science Actually Says
      </h2>
      <p style={{ color: C.muted, fontSize: 16, marginBottom: 16, maxWidth: 800, lineHeight: 1.7 }}>
        The microplastic pollution crisis is real and urgent. However, satellite-based plastic monitoring is still
        in an <strong style={{ color: C.white }}>early research phase</strong>. The dashboard and detection pipeline shown above represent
        a <strong style={{ color: C.amber }}>theoretical future capability</strong>, not current operational reality.
        Below is a critical analysis of the key scientific gaps.
      </p>

      {/* Summary table */}
      <div ref={ref} className={`section-reveal ${visible ? 'visible' : ''}`}>
        <div className="glass-card" style={{ marginBottom: 32, padding: '20px 24px' }}>
          <h4 style={{ fontSize: 16, fontWeight: 700, color: C.white, marginBottom: 16 }}>Reality vs. Aspiration</h4>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', padding: '10px 12px', borderBottom: `1px solid ${C.dim}`, color: C.muted, fontWeight: 600 }}>Claim on This Page</th>
                  <th style={{ textAlign: 'left', padding: '10px 12px', borderBottom: `1px solid ${C.dim}`, color: C.muted, fontWeight: 600 }}>Scientific Reality</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Satellite spectral detection of river plastic', 'Large floating macroplastic aggregations can be detected from Sentinel-2 under ideal conditions — not microplastics, not quantitatively'],
                  ['NDPI formula for plastic detection', 'This formula is NDMI for vegetation moisture (Gao 1996). Actual plastic index is FDI (Biermann et al. 2020)'],
                  ['Sentinel-2 at 10m detects plastic', 'SWIR bands critical for plastic are 20m. Microplastics are undetectable.'],
                  ['PACE detects microplastic proxies', 'No validated method exists. PACE (1km res) was designed for phytoplankton/aerosols.'],
                  ['6-sensor fusion stack', 'No integration methodology defined. Sensors have incompatible resolutions and revisit times.'],
                  ['Plastic flux in tons/month', 'No validated conversion exists. Uncertainty is 1-2 orders of magnitude (10-100×).'],
                  ['Narrow confidence intervals', 'Real uncertainty would span the entire chart. The bands shown are cosmetic.'],
                  ['River tonnage estimates', 'Real numbers from waste models (Meijer et al. 2021) — not satellite measurements.'],
                ].map(([claim, reality], i) => (
                  <tr key={i}>
                    <td style={{ padding: '10px 12px', borderBottom: '1px solid rgba(255,255,255,0.04)', color: C.coral }}>{claim}</td>
                    <td style={{ padding: '10px 12px', borderBottom: '1px solid rgba(255,255,255,0.04)', color: C.muted }}>{reality}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Expandable issue cards */}
        <h4 style={{ fontSize: 18, fontWeight: 700, color: C.white, marginBottom: 8 }}>Detailed Critical Analysis</h4>
        <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.7, marginBottom: 20, maxWidth: 800 }}>
          The items below critique specific claims made on this page — the detection indices, sensor capabilities,
          data conversion pipeline, and uncertainty quantification. Each issue is graded by severity: how much it
          undermines the scientific credibility of the monitoring system as presented. Click any item to expand the
          full analysis with references.
        </p>
        <div style={{ display: 'grid', gap: 10 }}>
          {issues.map((issue, i) => (
            <div key={i} className="glass-card" style={{
              padding: 0, cursor: 'pointer', overflow: 'hidden',
              borderLeft: `3px solid ${severityColors[issue.severity]}`,
            }}
              onClick={() => setExpandedItem(expandedItem === i ? null : i)}
            >
              <div style={{ padding: '14px 18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, color: C.white, fontSize: 15, marginBottom: 4 }}>{issue.title}</div>
                    <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.5 }}>{issue.summary}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                    <span style={{
                      fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1,
                      padding: '3px 8px', borderRadius: 4,
                      background: `${severityColors[issue.severity]}15`,
                      color: severityColors[issue.severity],
                    }}>
                      {issue.severity}
                    </span>
                    <span style={{ color: C.dim, fontSize: 18, transition: 'transform 0.2s', transform: expandedItem === i ? 'rotate(180deg)' : 'rotate(0)' }}>
                      ▾
                    </span>
                  </div>
                </div>
              </div>
              {expandedItem === i && (
                <div style={{
                  padding: '0 18px 16px', borderTop: '1px solid rgba(255,255,255,0.05)',
                  fontSize: 13, color: C.muted, lineHeight: 1.8, whiteSpace: 'pre-line',
                }}>
                  <div style={{ paddingTop: 14 }}>{issue.detail}</div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* What IS real */}
        <div className="glass-card" style={{
          marginTop: 32, padding: '24px',
          background: 'linear-gradient(135deg, rgba(0,214,143,0.06), rgba(0,119,182,0.06))',
          borderLeft: `3px solid ${C.green}`,
        }}>
          <h4 style={{ fontSize: 16, fontWeight: 700, color: C.green, marginBottom: 12 }}>What IS Real</h4>
          <div style={{ fontSize: 14, color: C.muted, lineHeight: 1.8 }}>
            <div style={{ marginBottom: 8 }}>✓ <strong style={{ color: C.white }}>The plastic pollution crisis is real</strong> — 8-11 million tons enter oceans annually (estimates from Jambeck et al. 2015; Lebreton et al. 2017)</div>
            <div style={{ marginBottom: 8 }}>✓ <strong style={{ color: C.white }}>Rivers are the primary pathway</strong> — ~80% of ocean plastic enters via rivers (Meijer et al. 2021)</div>
            <div style={{ marginBottom: 8 }}>✓ <strong style={{ color: C.white }}>Satellite detection of large floating debris is demonstrated</strong> — under controlled conditions and at aggregation scales ≥5×5m (Topouzelis et al. 2019; Biermann et al. 2020)</div>
            <div style={{ marginBottom: 8 }}>✓ <strong style={{ color: C.white }}>River interventions are effective</strong> — trash traps, waste infrastructure, and policy enforcement work independently of satellite monitoring</div>
            <div>✓ <strong style={{ color: C.white }}>The vision is worth pursuing</strong> — improved satellite sensors (hyperspectral, lidar), AI classification, and ground-truth networks could make this concept closer to reality</div>
          </div>
        </div>

        {/* References */}
        <div style={{ marginTop: 32 }}>
          <h4 style={{ fontSize: 16, fontWeight: 700, color: C.white, marginBottom: 16 }}>References</h4>
          <div style={{ fontSize: 12, color: C.dim, lineHeight: 2 }}>
            {REFERENCES.map((ref, i) => (
              <div key={i} style={{ paddingLeft: 16, textIndent: -16 }}>
                [{i + 1}] {ref.full}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── FOOTER ───

function Footer() {
  return (
    <footer style={{
      padding: '48px 32px', textAlign: 'center',
      borderTop: '1px solid rgba(255,255,255,0.05)',
      background: 'linear-gradient(180deg, transparent, rgba(0,10,20,0.5))',
    }}>
      <div style={{ fontSize: 14, fontWeight: 600, color: C.cyan, marginBottom: 16 }}>
        Microplastic River-to-Ocean Tracking System
      </div>
      <div style={{
        fontSize: 13, color: C.amber, maxWidth: 600, margin: '0 auto 16px', lineHeight: 1.6,
        padding: '10px 16px', borderRadius: 8,
        background: 'rgba(244,162,97,0.06)', border: '1px solid rgba(244,162,97,0.15)',
      }}>
        This is a concept demonstration. All dashboard data is simulated. The satellite monitoring pipeline
        represents aspirational future capability, not current operational reality.
      </div>
      <div style={{ fontSize: 12, color: C.dim, maxWidth: 600, margin: '0 auto', lineHeight: 1.8 }}>
        Sensor references: Copernicus Open Access Hub · NASA EarthData · Google Earth Engine · JRC Global Surface Water
      </div>
      <div style={{ fontSize: 12, color: C.dim, marginTop: 8 }}>
        Sensor data referenced is freely available. Tonnage estimates from Meijer et al. 2021 and Lebreton et al. 2017.
      </div>
      <div style={{ fontSize: 12, color: C.muted, marginTop: 16 }}>
        Part of the <span style={{ color: C.cyan }}>Spectral Solutions Atlas</span>
      </div>
    </footer>
  )
}

// ─── APP ───

export default function App() {
  return (
    <div style={{ background: C.bg, minHeight: '100vh' }}>
      <Nav />
      <HeroSection />
      <div className="gradient-divider" />
      <ProblemSection />
      <div className="gradient-divider" />
      <SolutionSection />
      <div className="gradient-divider" />
      <RealityCheckSection />
      <div className="gradient-divider" />
      <DashboardSection />
      <div className="gradient-divider" />
      <ImpactSection />
      <div className="gradient-divider" />
      <Footer />
    </div>
  )
}
