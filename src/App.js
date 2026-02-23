import { useState, useEffect, useRef } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { MapContainer, TileLayer, CircleMarker, Tooltip as MapTooltip, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

/* ─────────────────────────────────────────
   GLOBAL STYLES (injected once)
───────────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0a0a0f;
    --surface: #12121a;
    --card: #1a1a28;
    --border: #2a2a40;
    --accent: #7c3aed;
    --accent2: #06b6d4;
    --accent3: #f59e0b;
    --text: #f0f0ff;
    --muted: #8888aa;
    --danger: #ef4444;
    --success: #10b981;
    --font-head: 'Syne', sans-serif;
    --font-body: 'DM Sans', sans-serif;
    --radius: 16px;
    --glow: 0 0 40px rgba(124,58,237,0.25);
  }

  [data-theme="light"] {
    --bg: #f4f7fb;
    --surface: #ffffff;
    --card: #ffffff;
    --border: #c7d2e2;
    --accent: #2563eb;
    --accent2: #0ea5a4;
    --accent3: #d97706;
    --text: #0b1220;
    --muted: #334155;
    --danger: #dc2626;
    --success: #059669;
    --glow: 0 0 28px rgba(37,99,235,0.18);
  }

  html, body, #root { height: 100%; background: var(--bg); color: var(--text); font-family: var(--font-body); }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: var(--surface); }
  ::-webkit-scrollbar-thumb { background: var(--accent); border-radius: 4px; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; } to { opacity: 1; }
  }
  @keyframes pulse {
    0%,100% { box-shadow: 0 0 0 0 rgba(124,58,237,0.4); }
    50% { box-shadow: 0 0 0 12px rgba(124,58,237,0); }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  @keyframes scanline {
    from { transform: translateY(-100%); }
    to { transform: translateY(100vh); }
  }
  @keyframes float {
    0%,100% { transform: translateY(0px); }
    50% { transform: translateY(-8px); }
  }
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  @keyframes gradient-shift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  .fade-up { animation: fadeUp 0.5s ease forwards; }
  .fade-in { animation: fadeIn 0.4s ease forwards; }

  .btn {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 10px 22px; border: none; border-radius: 10px;
    font-family: var(--font-head); font-weight: 600; font-size: 14px;
    cursor: pointer; transition: all 0.2s; white-space: nowrap;
  }
  .btn-primary {
    background: linear-gradient(135deg, var(--accent), #9333ea);
    color: white;
  }
  .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(124,58,237,0.5); }
  .btn-secondary {
    background: var(--card); color: var(--text); border: 1px solid var(--border);
  }
  .btn-secondary:hover { background: var(--border); }
  .btn-cyan {
    background: linear-gradient(135deg, var(--accent2), #0891b2);
    color: white;
  }
  .btn-cyan:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(6,182,212,0.4); }
  .btn-amber {
    background: linear-gradient(135deg, var(--accent3), #d97706);
    color: white;
  }
  .btn-amber:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(245,158,11,0.4); }

  .glass {
    background: rgba(26,26,40,0.7);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255,255,255,0.06);
  }

  [data-theme="light"] .glass {
    background: rgba(255,255,255,0.95);
    border: 1px solid #c7d2e2;
    box-shadow: 0 10px 30px rgba(15,23,42,0.08);
  }

  [data-theme="light"] .btn-secondary {
    background: #ffffff;
    border-color: #c7d2e2;
    color: #0b1220;
  }

  [data-theme="light"] .tag {
    border: 1px solid #d7dfeb;
    background: #f8fbff;
  }

  [data-theme="light"] input,
  [data-theme="light"] select {
    background: #ffffff !important;
    color: #0b1220 !important;
    border-color: #c7d2e2 !important;
  }

  .tag {
    display: inline-block; padding: 3px 10px; border-radius: 20px;
    font-size: 11px; font-weight: 600; font-family: var(--font-head); letter-spacing: 0.5px;
  }

  .theme-toggle {
    position: fixed;
    bottom: 18px;
    right: 14px;
    z-index: 9999;
    border: 1px solid var(--border);
    background: var(--card);
    color: var(--text);
    border-radius: 999px;
    padding: 8px 12px;
    cursor: pointer;
    font-family: var(--font-head);
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.4px;
    box-shadow: 0 10px 24px rgba(0,0,0,0.2);
    transition: transform 0.2s, background 0.2s;
  }
  .theme-toggle:hover { transform: translateY(-1px); }
`;

function injectStyles() {
  if (!document.getElementById("app-styles")) {
    const s = document.createElement("style");
    s.id = "app-styles";
    s.textContent = STYLES;
    document.head.appendChild(s);
  }
}

/* ─────────────────────────────────────────
   HELPERS
───────────────────────────────────────── */
const DEPT_COLORS = {
  Engineering: "#7c3aed", Marketing: "#06b6d4", Finance: "#f59e0b",
  HR: "#10b981", Sales: "#ef4444", Operations: "#ec4899",
  Design: "#8b5cf6", IT: "#3b82f6", Legal: "#a78bfa", Management: "#f97316",
};
const getDeptColor = (dept) => DEPT_COLORS[dept] || "#7c3aed";

const GENDER_ICONS = { Male: "♂", Female: "♀", Other: "⚧" };

/* ─────────────────────────────────────────
   LOADER
───────────────────────────────────────── */
function Loader() {
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100vh", flexDirection:"column", gap:16 }}>
      <div style={{ width:48, height:48, border:"3px solid var(--border)", borderTop:"3px solid var(--accent)", borderRadius:"50%", animation:"spin 0.8s linear infinite" }} />
      <p style={{ color:"var(--muted)", fontFamily:"var(--font-head)", fontSize:14, letterSpacing:2 }}>LOADING DATA</p>
    </div>
  );
}

/* ─────────────────────────────────────────
   NOISE / BG DECORATION
───────────────────────────────────────── */
function BgDecor() {
  return (
    <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0, overflow:"hidden" }}>
      <div style={{
        position:"absolute", width:600, height:600, borderRadius:"50%",
        background:"radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)",
        top:-200, right:-200
      }} />
      <div style={{
        position:"absolute", width:500, height:500, borderRadius:"50%",
        background:"radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)",
        bottom:-200, left:-100
      }} />
    </div>
  );
}

/* ─────────────────────────────────────────
   LOGIN PAGE
───────────────────────────────────────── */
function LoginPage({ onLogin }) {
  const [un, setUn] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const handle = () => {
    setLoading(true);
    setTimeout(() => {
      if (un === "testuser" && pw === "Test123") {
        onLogin();
      } else {
        setErr("Invalid credentials. Try testuser / Test123");
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", position:"relative", overflow:"hidden" }}>
      <BgDecor />
      {/* Animated grid lines */}
      <div style={{ position:"fixed", inset:0, backgroundImage:"linear-gradient(rgba(124,58,237,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.04) 1px, transparent 1px)", backgroundSize:"60px 60px", pointerEvents:"none" }} />

      <div style={{ position:"relative", zIndex:1, width:"100%", maxWidth:420, padding:"0 20px" }}>
        {/* Logo / brand */}
        <div style={{ textAlign:"center", marginBottom:40, animation:"fadeUp 0.5s ease forwards" }}>
          <div style={{
            width:72, height:72, margin:"0 auto 16px",
            background:"linear-gradient(135deg, var(--accent), var(--accent2))",
            borderRadius:20, display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:32, animation:"float 3s ease-in-out infinite",
            boxShadow:"0 20px 60px rgba(124,58,237,0.4)"
          }}>👤</div>
          <h1 style={{ fontFamily:"var(--font-head)", fontSize:32, fontWeight:800, letterSpacing:-1 }}>
            Employee <span style={{ background:"linear-gradient(90deg, var(--accent), var(--accent2))", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Hub</span>
          </h1>
          <p style={{ color:"var(--muted)", marginTop:6, fontSize:14 }}>Intelligent workforce management platform</p>
        </div>

        {/* Card */}
        <div className="glass" style={{ borderRadius:24, padding:36, animation:"fadeUp 0.5s 0.1s ease both" }}>
          <h2 style={{ fontFamily:"var(--font-head)", fontSize:20, fontWeight:700, marginBottom:24 }}>Sign in to continue</h2>

          <div style={{ marginBottom:16 }}>
            <label style={{ display:"block", color:"var(--muted)", fontSize:12, fontWeight:600, letterSpacing:1, marginBottom:8, textTransform:"uppercase" }}>Username</label>
            <input
              value={un} onChange={e => { setUn(e.target.value); setErr(""); }}
              onKeyDown={e => e.key === "Enter" && handle()}
              placeholder="Enter username"
              style={{
                width:"100%", background:"var(--bg)", border:"1px solid var(--border)",
                borderRadius:10, padding:"12px 16px", color:"var(--text)",
                fontFamily:"var(--font-body)", fontSize:15, outline:"none",
                transition:"border-color 0.2s"
              }}
              onFocus={e => e.target.style.borderColor = "var(--accent)"}
              onBlur={e => e.target.style.borderColor = "var(--border)"}
            />
          </div>

          <div style={{ marginBottom:24 }}>
            <label style={{ display:"block", color:"var(--muted)", fontSize:12, fontWeight:600, letterSpacing:1, marginBottom:8, textTransform:"uppercase" }}>Password</label>
            <div style={{ position:"relative" }}>
              <input
                type={showPw ? "text" : "password"}
                value={pw} onChange={e => { setPw(e.target.value); setErr(""); }}
                onKeyDown={e => e.key === "Enter" && handle()}
                placeholder="Enter password"
                style={{
                  width:"100%", background:"var(--bg)", border:"1px solid var(--border)",
                  borderRadius:10, padding:"12px 44px 12px 16px", color:"var(--text)",
                  fontFamily:"var(--font-body)", fontSize:15, outline:"none",
                  transition:"border-color 0.2s"
                }}
                onFocus={e => e.target.style.borderColor = "var(--accent)"}
                onBlur={e => e.target.style.borderColor = "var(--border)"}
              />
              <button onClick={() => setShowPw(!showPw)} style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", color:"var(--muted)", cursor:"pointer", fontSize:18 }}>
                {showPw ? "🙈" : "👁"}
              </button>
            </div>
          </div>

          {err && (
            <div style={{ background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.3)", borderRadius:8, padding:"10px 14px", color:"#fca5a5", fontSize:13, marginBottom:16, display:"flex", alignItems:"center", gap:8 }}>
              ⚠️ {err}
            </div>
          )}

          <button className="btn btn-primary" onClick={handle} disabled={loading}
            style={{ width:"100%", justifyContent:"center", padding:"14px", fontSize:15, borderRadius:12, animation:"pulse 2s infinite" }}>
            {loading ? <>
              <span style={{ width:16, height:16, border:"2px solid rgba(255,255,255,0.3)", borderTop:"2px solid white", borderRadius:"50%", animation:"spin 0.8s linear infinite" }} />
              Authenticating…
            </> : "→ Sign In"}
          </button>

          <div style={{ marginTop:16, textAlign:"center" }}>
            <span style={{ fontSize:12, color:"var(--muted)" }}>Demo: </span>
            <code style={{ fontSize:12, color:"var(--accent2)", background:"var(--bg)", padding:"2px 8px", borderRadius:4 }}>testuser / Test123</code>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   BAR CHART SCREEN
───────────────────────────────────────── */
function BarChartScreen({ employees, onBack }) {
  const top10 = employees.slice(0, 10);
  const colors = ["#7c3aed","#8b5cf6","#06b6d4","#0891b2","#f59e0b","#d97706","#10b981","#059669","#ef4444","#ec4899"];

  return (
    <div style={{ minHeight:"100vh", padding:"20px", position:"relative" }}>
      <BgDecor />
      <div style={{ maxWidth:900, margin:"0 auto", position:"relative", zIndex:1 }}>
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:32, animation:"fadeUp 0.4s ease forwards" }}>
          <button className="btn btn-secondary" onClick={onBack} style={{ padding:"8px 16px" }}>← Back</button>
          <div>
            <h1 style={{ fontFamily:"var(--font-head)", fontWeight:800, fontSize:26 }}>💰 Salary Analytics</h1>
            <p style={{ color:"var(--muted)", fontSize:13 }}>Top 10 employees by compensation</p>
          </div>
        </div>

        <div className="glass" style={{ borderRadius:20, padding:32, animation:"fadeUp 0.4s 0.1s ease both" }}>
          <ResponsiveContainer width="100%" height={380}>
            <BarChart data={top10} margin={{ top:10, right:20, left:20, bottom:60 }}>
              <defs>
                {top10.map((_, i) => (
                  <linearGradient key={i} id={`grad${i}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={colors[i]} stopOpacity={1}/>
                    <stop offset="100%" stopColor={colors[i]} stopOpacity={0.4}/>
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis
                dataKey="first_name"
                tick={{ fill:"#8888aa", fontSize:11, fontFamily:"var(--font-head)" }}
                angle={-35} textAnchor="end" interval={0}
              />
              <YAxis
                tick={{ fill:"#8888aa", fontSize:11 }}
                tickFormatter={v => `$${(v/1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:10, fontFamily:"var(--font-body)" }}
                formatter={v => [`$${Number(v).toLocaleString()}`, "Salary"]}
                cursor={{ fill:"rgba(124,58,237,0.1)" }}
              />
              <Bar dataKey="salary" radius={[6,6,0,0]}>
                {top10.map((_, i) => <Cell key={i} fill={`url(#grad${i})`} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Stat cards */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16, marginTop:20, animation:"fadeUp 0.4s 0.2s ease both" }}>
          {[
            { label:"Highest Salary", value:`$${Math.max(...top10.map(e=>+e.salary||0)).toLocaleString()}`, icon:"🏆" },
            { label:"Average Salary", value:`$${(top10.reduce((a,e)=>a+(+e.salary||0),0)/top10.length).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g,",")}`, icon:"📊" },
            { label:"Total Payroll", value:`$${top10.reduce((a,e)=>a+(+e.salary||0),0).toLocaleString()}`, icon:"💼" },
          ].map((s,i) => (
            <div key={i} className="glass" style={{ borderRadius:14, padding:"16px 20px", textAlign:"center" }}>
              <div style={{ fontSize:28, marginBottom:8 }}>{s.icon}</div>
              <div style={{ fontFamily:"var(--font-head)", fontWeight:700, fontSize:20, color:"var(--accent2)" }}>{s.value}</div>
              <div style={{ color:"var(--muted)", fontSize:12, marginTop:4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   MAP SCREEN (SVG world-inspired dots map)
───────────────────────────────────────── */
const CITY_GEO = {
  "New York": { lat: 40.7128, lng: -74.0060 },
  "Los Angeles": { lat: 34.0522, lng: -118.2437 },
  "Chicago": { lat: 41.8781, lng: -87.6298 },
  "Houston": { lat: 29.7604, lng: -95.3698 },
  "Phoenix": { lat: 33.4484, lng: -112.0740 },
  "Philadelphia": { lat: 39.9526, lng: -75.1652 },
  "San Antonio": { lat: 29.4241, lng: -98.4936 },
  "San Diego": { lat: 32.7157, lng: -117.1611 },
  "Dallas": { lat: 32.7767, lng: -96.7970 },
  "San Jose": { lat: 37.3382, lng: -121.8863 },
  "Austin": { lat: 30.2672, lng: -97.7431 },
  "Jacksonville": { lat: 30.3322, lng: -81.6557 },
  "London": { lat: 51.5072, lng: -0.1276 },
  "Edinburgh": { lat: 55.9533, lng: -3.1883 },
  "Paris": { lat: 48.8566, lng: 2.3522 },
  "Berlin": { lat: 52.5200, lng: 13.4050 },
  "Tokyo": { lat: 35.6762, lng: 139.6503 },
  "San Francisco": { lat: 37.7749, lng: -122.4194 },
  "Sydney": { lat: -33.8688, lng: 151.2093 },
  "Mumbai": { lat: 19.0760, lng: 72.8777 },
  "Toronto": { lat: 43.6532, lng: -79.3832 },
  "Singapore": { lat: 1.3521, lng: 103.8198 },
};

function FitBounds({ points }) {
  const map = useMap();
  useEffect(() => {
    if (!points.length) return;
    map.fitBounds(points.map(p => [p.lat, p.lng]), { padding: [30, 30], maxZoom: 4 });
  }, [map, points]);
  return null;
}

function MapScreen({ employees, onBack, theme }) {
  const [hovered, setHovered] = useState(null);

  const cityMap = {};
  employees.forEach(e => {
    const c = e.city;
    if (!cityMap[c]) cityMap[c] = { city:c, employees:[], dept:e.department };
    cityMap[c].employees.push(e);
  });
  const cities = Object.values(cityMap).map(c => ({
    ...c,
    geo: CITY_GEO[c.city]
  })).sort((a, b) => b.employees.length - a.employees.length);
  const mapped = cities.filter(c => c.geo);
  const unmapped = cities.filter(c => !c.geo);

  return (
    <div style={{ minHeight:"100vh", padding:"20px", position:"relative" }}>
      <BgDecor />
      <div style={{ maxWidth:1000, margin:"0 auto", position:"relative", zIndex:1 }}>
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:28, animation:"fadeUp 0.4s ease forwards" }}>
          <button className="btn btn-secondary" onClick={onBack} style={{ padding:"8px 16px" }}>← Back</button>
          <div>
            <h1 style={{ fontFamily:"var(--font-head)", fontWeight:800, fontSize:26 }}>🌍 City Distribution</h1>
            <p style={{ color:"var(--muted)", fontSize:13 }}>{cities.length} cities across the globe</p>
          </div>
        </div>

        <div className="glass" style={{ borderRadius:20, padding:24, position:"relative", overflow:"hidden", animation:"fadeUp 0.4s 0.1s ease both" }}>
          <div style={{ width:"100%", height:520, borderRadius:14, overflow:"hidden", border:"1px solid var(--border)" }}>
            <MapContainer
              center={[20, 0]}
              zoom={2}
              minZoom={2}
              maxZoom={6}
              maxBounds={[[-85, -180], [85, 180]]}
              worldCopyJump
              style={{ width:"100%", height:"100%", background:"var(--bg)" }}
            >
              <TileLayer
                url={theme === "light"
                  ? "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                  : "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"}
                attribution='&copy; OpenStreetMap contributors &copy; CARTO'
              />
              <FitBounds points={mapped.map(c => c.geo)} />
              {mapped.map((c, i) => {
                const radius = Math.min(7 + c.employees.length * 1.7, 15);
                const color = getDeptColor(c.dept);
                return (
                  <CircleMarker
                    key={i}
                    center={[c.geo.lat, c.geo.lng]}
                    radius={radius}
                    pathOptions={{
                      color: "rgba(255,255,255,0.9)",
                      weight: 2,
                      fillColor: color,
                      fillOpacity: hovered?.city === c.city ? 0.95 : 0.82
                    }}
                    eventHandlers={{
                      mouseover: () => setHovered(c),
                      mouseout: () => setHovered(null)
                    }}
                  >
                    <MapTooltip direction="top" offset={[0, -8]} opacity={1}>
                      <div style={{ minWidth:150 }}>
                        <div style={{ fontWeight:700 }}>{c.city}</div>
                        <div style={{ fontSize:12 }}>{c.employees.length} employee{c.employees.length > 1 ? "s" : ""}</div>
                      </div>
                    </MapTooltip>
                  </CircleMarker>
                );
              })}
            </MapContainer>
          </div>

          {hovered && (
            <div style={{
              position:"absolute", top:20, right:20,
              background:"var(--card)", border:"1px solid var(--border)",
              borderRadius:12, padding:"14px 18px", minWidth:180,
              animation:"fadeIn 0.2s ease"
            }}>
              <div style={{ fontFamily:"var(--font-head)", fontWeight:700, fontSize:16, marginBottom:4 }}>📍 {hovered.city}</div>
              <div style={{ color:"var(--muted)", fontSize:12 }}>{hovered.employees.length} employee{hovered.employees.length>1?"s":""}</div>
              <div style={{ marginTop:8, display:"flex", flexWrap:"wrap", gap:4 }}>
                {[...new Set(hovered.employees.map(e=>e.department))].map(d => (
                  <span key={d} className="tag" style={{ background:`${getDeptColor(d)}22`, color:getDeptColor(d) }}>{d}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(3, minmax(0,1fr))", gap:10, marginTop:14, animation:"fadeUp 0.4s 0.15s ease both" }}>
          <div className="glass" style={{ borderRadius:10, padding:"10px 12px" }}>
            <div style={{ color:"var(--muted)", fontSize:11, textTransform:"uppercase", letterSpacing:1 }}>Mapped Cities</div>
            <div style={{ fontFamily:"var(--font-head)", fontWeight:700, fontSize:20 }}>{mapped.length}</div>
          </div>
          <div className="glass" style={{ borderRadius:10, padding:"10px 12px" }}>
            <div style={{ color:"var(--muted)", fontSize:11, textTransform:"uppercase", letterSpacing:1 }}>Unmapped Cities</div>
            <div style={{ fontFamily:"var(--font-head)", fontWeight:700, fontSize:20 }}>{unmapped.length}</div>
          </div>
          <div className="glass" style={{ borderRadius:10, padding:"10px 12px" }}>
            <div style={{ color:"var(--muted)", fontSize:11, textTransform:"uppercase", letterSpacing:1 }}>Top City</div>
            <div style={{ fontFamily:"var(--font-head)", fontWeight:700, fontSize:20 }}>{cities[0]?.city || "-"}</div>
          </div>
        </div>

        {/* City list */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(160px,1fr))", gap:10, marginTop:16, animation:"fadeUp 0.4s 0.2s ease both" }}>
          {cities.map((c, i) => (
            <div key={i} className="glass" style={{ borderRadius:10, padding:"10px 14px", cursor:"pointer", transition:"all 0.2s", border: hovered?.city===c.city?"1px solid var(--accent)":"1px solid transparent" }}
              onMouseEnter={() => setHovered(c)} onMouseLeave={() => setHovered(null)}>
              <div style={{ fontFamily:"var(--font-head)", fontWeight:600, fontSize:13 }}>📍 {c.city}</div>
              <div style={{ color:"var(--muted)", fontSize:11, marginTop:2 }}>{c.employees.length} emp.</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   LIST PAGE
───────────────────────────────────────── */
function ListPage({ employees, onSelect, onLogout, onBarChart, onMap }) {
  const [search, setSearch] = useState("");
  const [dept, setDept] = useState("All");
  const [sortBy, setSortBy] = useState("name");
  const [page, setPage] = useState(0);
  const PER_PAGE = 8;

  const depts = ["All", ...new Set(employees.map(e => e.department).filter(Boolean))];
  const filtered = employees
    .filter(e => {
      const q = search.toLowerCase();
      return (dept === "All" || e.department === dept) &&
        (!q || `${e.first_name} ${e.last_name} ${e.email} ${e.city}`.toLowerCase().includes(q));
    })
    .sort((a, b) => {
      if (sortBy === "name") return `${a.first_name}${a.last_name}`.localeCompare(`${b.first_name}${b.last_name}`);
      if (sortBy === "salary") return (+b.salary||0) - (+a.salary||0);
      if (sortBy === "dept") return (a.department||"").localeCompare(b.department||"");
      return 0;
    });

  const pages = Math.ceil(filtered.length / PER_PAGE);
  const visible = filtered.slice(page * PER_PAGE, (page+1) * PER_PAGE);

  return (
    <div style={{ minHeight:"100vh", padding:"20px 16px", position:"relative" }}>
      <BgDecor />
      <div style={{ maxWidth:1100, margin:"0 auto", position:"relative", zIndex:1 }}>

        {/* Header */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:28, flexWrap:"wrap", gap:12, animation:"fadeUp 0.4s ease forwards" }}>
          <div>
            <h1 style={{ fontFamily:"var(--font-head)", fontWeight:800, fontSize:30 }}>
              Employee <span style={{ background:"linear-gradient(90deg, var(--accent), var(--accent2))", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Directory</span>
            </h1>
            <p style={{ color:"var(--muted)", fontSize:13 }}>{filtered.length} of {employees.length} records</p>
          </div>
          <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
            <button className="btn btn-amber" onClick={onBarChart}>📊 Salary Chart</button>
            <button className="btn btn-cyan" onClick={onMap}>🌍 City Map</button>
            <button className="btn btn-secondary" onClick={onLogout}>🚪 Logout</button>
          </div>
        </div>

        {/* Controls */}
        <div className="glass" style={{ borderRadius:16, padding:16, marginBottom:20, display:"flex", flexWrap:"wrap", gap:12, alignItems:"center", animation:"fadeUp 0.4s 0.05s ease both" }}>
          <input
            value={search} onChange={e => { setSearch(e.target.value); setPage(0); }}
            placeholder="🔍  Search employees…"
            style={{ flex:"1 1 200px", background:"var(--bg)", border:"1px solid var(--border)", borderRadius:10, padding:"10px 16px", color:"var(--text)", fontFamily:"var(--font-body)", fontSize:14, outline:"none" }}
            onFocus={e=>e.target.style.borderColor="var(--accent)"}
            onBlur={e=>e.target.style.borderColor="var(--border)"}
          />
          <select value={dept} onChange={e => { setDept(e.target.value); setPage(0); }}
            style={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:10, padding:"10px 14px", color:"var(--text)", fontFamily:"var(--font-body)", fontSize:14, outline:"none", cursor:"pointer" }}>
            {depts.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}
            style={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:10, padding:"10px 14px", color:"var(--text)", fontFamily:"var(--font-body)", fontSize:14, outline:"none", cursor:"pointer" }}>
            <option value="name">Sort: Name</option>
            <option value="salary">Sort: Salary</option>
            <option value="dept">Sort: Dept</option>
          </select>
        </div>

        {/* Employee Cards Grid */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(300px,1fr))", gap:14 }}>
          {visible.map((emp, i) => (
            <div key={emp.id || i}
              onClick={() => onSelect(emp)}
              className="glass"
              style={{
                borderRadius:16, padding:20, cursor:"pointer",
                transition:"all 0.25s", animation:`fadeUp 0.4s ${i*0.04}s ease both`,
                borderLeft:`3px solid ${getDeptColor(emp.department)}`,
                position:"relative", overflow:"hidden"
              }}
              onMouseEnter={e => { e.currentTarget.style.transform="translateY(-4px)"; e.currentTarget.style.boxShadow=`0 16px 40px rgba(0,0,0,0.4), 0 0 0 1px ${getDeptColor(emp.department)}44`; }}
              onMouseLeave={e => { e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow=""; }}
            >
              <div style={{ display:"flex", alignItems:"flex-start", gap:14 }}>
                {/* Avatar */}
                <div style={{
                  width:48, height:48, borderRadius:14, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center",
                  background:`linear-gradient(135deg, ${getDeptColor(emp.department)}33, ${getDeptColor(emp.department)}11)`,
                  border:`1px solid ${getDeptColor(emp.department)}44`,
                  fontFamily:"var(--font-head)", fontWeight:800, fontSize:18, color:getDeptColor(emp.department)
                }}>
                  {(emp.first_name||"?")[0]}{(emp.last_name||"?")[0]}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontFamily:"var(--font-head)", fontWeight:700, fontSize:16, marginBottom:2 }}>
                    {emp.first_name} {emp.last_name}
                  </div>
                  <div style={{ color:"var(--muted)", fontSize:12, marginBottom:8, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                    {emp.email}
                  </div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                    <span className="tag" style={{ background:`${getDeptColor(emp.department)}22`, color:getDeptColor(emp.department) }}>{emp.department}</span>
                    {emp.city && <span className="tag" style={{ background:"rgba(255,255,255,0.05)", color:"var(--muted)" }}>📍 {emp.city}</span>}
                  </div>
                </div>
                <div style={{ textAlign:"right", flexShrink:0 }}>
                  {emp.salary && <div style={{ fontFamily:"var(--font-head)", fontWeight:700, color:"var(--accent3)", fontSize:15 }}>${Number(emp.salary).toLocaleString()}</div>}
                  {emp.gender && <div style={{ color:"var(--muted)", fontSize:12, marginTop:2 }}>{GENDER_ICONS[emp.gender]||""} {emp.gender}</div>}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {pages > 1 && (
          <div style={{ display:"flex", justifyContent:"center", gap:8, marginTop:28, animation:"fadeIn 0.4s ease" }}>
            <button className="btn btn-secondary" onClick={() => setPage(p => Math.max(0,p-1))} disabled={page===0} style={{ padding:"8px 16px" }}>←</button>
            {Array.from({length:pages}, (_,i) => (
              <button key={i} className="btn" onClick={() => setPage(i)}
                style={{ padding:"8px 14px", background: page===i ? "var(--accent)" : "var(--card)", color:"var(--text)", border:"1px solid var(--border)", fontFamily:"var(--font-head)" }}>
                {i+1}
              </button>
            ))}
            <button className="btn btn-secondary" onClick={() => setPage(p => Math.min(pages-1,p+1))} disabled={page===pages-1} style={{ padding:"8px 16px" }}>→</button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   DETAILS PAGE
───────────────────────────────────────── */
function DetailsPage({ employee: emp, allEmployees, onBack, onPhotoTaken }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const [camActive, setCamActive] = useState(false);
  const [camError, setCamError] = useState(null);
  const [countdown, setCountdown] = useState(null);

  const teammates = allEmployees.filter(e => e.department === emp.department && e.id !== emp.id).slice(0, 4);

  const startCam = async () => {
    setCamError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width:640, height:480, facingMode:"user" } });
      streamRef.current = stream;
      setCamActive(true);
    } catch {
      setCamError("Camera access denied or unavailable. Please allow camera permissions.");
    }
  };

  const stopCam = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
    setCamActive(false);
  };

  useEffect(() => {
    if (!camActive || !videoRef.current || !streamRef.current) return;
    videoRef.current.srcObject = streamRef.current;
    videoRef.current.play().catch(() => {
      setCamError("Camera is connected, but preview could not start. Please try again.");
    });
  }, [camActive]);

  useEffect(() => () => stopCam(), []);

  const captureWithCountdown = () => {
    let count = 3;
    setCountdown(count);
    const iv = setInterval(() => {
      count--;
      if (count > 0) setCountdown(count);
      else {
        clearInterval(iv);
        setCountdown(null);
        capture();
      }
    }, 1000);
  };

  const capture = () => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0, 640, 480);
    const dataUrl = canvasRef.current.toDataURL("image/png");
    stopCam();
    onPhotoTaken(dataUrl, emp);
  };

  const dc = getDeptColor(emp.department);
  const fields = [
    { icon:"📧", label:"Email", value:emp.email },
    { icon:"📱", label:"Phone", value:emp.phone_number },
    { icon:"📍", label:"City", value:emp.city },
    { icon:"🎂", label:"Date of Birth", value:emp.date_of_birth },
    { icon:"👔", label:"Job Title", value:emp.job_title },
    { icon:"💰", label:"Salary", value:emp.salary ? `$${Number(emp.salary).toLocaleString()}` : null },
    { icon:"⚡", label:"Status", value:emp.employment_status },
    { icon:"🏦", label:"Department", value:emp.department },
  ].filter(f => f.value);

  return (
    <div style={{ minHeight:"100vh", padding:"20px 16px", position:"relative" }}>
      <BgDecor />
      <div style={{ maxWidth:860, margin:"0 auto", position:"relative", zIndex:1 }}>

        {/* Back */}
        <button className="btn btn-secondary" onClick={() => { stopCam(); onBack(); }} style={{ marginBottom:24, animation:"fadeUp 0.3s ease forwards" }}>
          ← Back to Directory
        </button>

        {/* Hero card */}
        <div className="glass" style={{ borderRadius:24, padding:32, marginBottom:20, position:"relative", overflow:"hidden", animation:"fadeUp 0.4s ease forwards" }}>
          <div style={{ position:"absolute", top:0, left:0, right:0, height:120, background:`linear-gradient(135deg, ${dc}22, ${dc}08)` }} />
          <div style={{ position:"absolute", top:0, right:0, width:200, height:200, borderRadius:"50%", background:`radial-gradient(circle, ${dc}15, transparent 70%)` }} />

          <div style={{ position:"relative", display:"flex", flexWrap:"wrap", gap:24, alignItems:"flex-end" }}>
            <div style={{
              width:90, height:90, borderRadius:22, display:"flex", alignItems:"center", justifyContent:"center",
              background:`linear-gradient(135deg, ${dc}33, ${dc}11)`, border:`2px solid ${dc}66`,
              fontFamily:"var(--font-head)", fontWeight:800, fontSize:32, color:dc, flexShrink:0
            }}>
              {(emp.first_name||"?")[0]}{(emp.last_name||"?")[0]}
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontFamily:"var(--font-head)", fontWeight:800, fontSize:32 }}>{emp.first_name} {emp.last_name}</div>
              <div style={{ color:"var(--muted)", fontSize:15, marginTop:4 }}>{emp.job_title || "Employee"}</div>
              <div style={{ display:"flex", gap:10, marginTop:12, flexWrap:"wrap" }}>
                <span className="tag" style={{ background:`${dc}22`, color:dc, fontSize:12 }}>{emp.department}</span>
                {emp.employment_status && (
                  <span className="tag" style={{ background:emp.employment_status==="Active"?"rgba(16,185,129,0.15)":"rgba(239,68,68,0.15)", color:emp.employment_status==="Active"?"var(--success)":"var(--danger)" }}>
                    {emp.employment_status==="Active"?"●":"○"} {emp.employment_status}
                  </span>
                )}
                {emp.gender && <span className="tag" style={{ background:"rgba(255,255,255,0.05)", color:"var(--muted)" }}>{GENDER_ICONS[emp.gender]||""} {emp.gender}</span>}
              </div>
            </div>
            {emp.salary && (
              <div style={{ textAlign:"right" }}>
                <div style={{ color:"var(--muted)", fontSize:12, textTransform:"uppercase", letterSpacing:1 }}>Annual Salary</div>
                <div style={{ fontFamily:"var(--font-head)", fontWeight:800, fontSize:28, color:"var(--accent3)" }}>${Number(emp.salary).toLocaleString()}</div>
              </div>
            )}
          </div>
        </div>

        {/* Details grid */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(240px,1fr))", gap:12, marginBottom:20, animation:"fadeUp 0.4s 0.1s ease both" }}>
          {fields.map((f, i) => (
            <div key={i} className="glass" style={{ borderRadius:12, padding:"14px 18px" }}>
              <div style={{ color:"var(--muted)", fontSize:11, textTransform:"uppercase", letterSpacing:1, marginBottom:6 }}>{f.icon} {f.label}</div>
              <div style={{ fontFamily:"var(--font-head)", fontWeight:600, fontSize:14 }}>{f.value}</div>
            </div>
          ))}
        </div>

        {/* Teammates */}
        {teammates.length > 0 && (
          <div className="glass" style={{ borderRadius:16, padding:20, marginBottom:20, animation:"fadeUp 0.4s 0.15s ease both" }}>
            <h3 style={{ fontFamily:"var(--font-head)", fontWeight:700, fontSize:16, marginBottom:14 }}>🤝 Same Department</h3>
            <div style={{ display:"flex", flexWrap:"wrap", gap:10 }}>
              {teammates.map((t, i) => (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:8, background:"var(--bg)", borderRadius:10, padding:"8px 14px" }}>
                  <div style={{ width:28, height:28, borderRadius:8, background:`${getDeptColor(t.department)}33`, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"var(--font-head)", fontWeight:700, fontSize:12, color:getDeptColor(t.department) }}>
                    {(t.first_name||"?")[0]}{(t.last_name||"?")[0]}
                  </div>
                  <span style={{ fontSize:13 }}>{t.first_name} {t.last_name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Camera Section */}
        <div className="glass" style={{ borderRadius:20, padding:28, animation:"fadeUp 0.4s 0.2s ease both" }}>
          <h3 style={{ fontFamily:"var(--font-head)", fontWeight:700, fontSize:18, marginBottom:6 }}>📸 Capture Photo</h3>
          <p style={{ color:"var(--muted)", fontSize:13, marginBottom:20 }}>Take a verification or profile photo</p>

          {camError && (
            <div style={{ background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.3)", borderRadius:10, padding:"12px 16px", color:"#fca5a5", marginBottom:16, fontSize:13 }}>
              ⚠️ {camError}
            </div>
          )}

          {!camActive ? (
            <button className="btn btn-cyan" onClick={startCam} style={{ padding:"14px 28px", fontSize:15 }}>
              📷 Launch Camera
            </button>
          ) : (
            <div>
              <div style={{ position:"relative", borderRadius:16, overflow:"hidden", marginBottom:16, border:`2px solid ${dc}44` }}>
                <video ref={videoRef} style={{ width:"100%", display:"block", maxHeight:320, objectFit:"cover", transform:"scaleX(-1)" }} playsInline muted />
                {countdown !== null && (
                  <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", background:"rgba(0,0,0,0.4)" }}>
                    <span style={{ fontFamily:"var(--font-head)", fontWeight:800, fontSize:100, color:"white", textShadow:"0 0 40px rgba(124,58,237,0.8)", animation:"pulse 1s infinite" }}>{countdown}</span>
                  </div>
                )}
                {/* Scanline effect */}
                <div style={{ position:"absolute", inset:0, pointerEvents:"none", backgroundImage:"repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)" }} />
              </div>
              <canvas ref={canvasRef} width={640} height={480} style={{ display:"none" }} />
              <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
                <button className="btn btn-primary" onClick={captureWithCountdown} disabled={countdown!==null} style={{ padding:"12px 24px" }}>
                  {countdown!==null ? `📸 ${countdown}…` : "📸 Capture (3s countdown)"}
                </button>
                <button className="btn btn-secondary" onClick={capture} disabled={countdown!==null} style={{ padding:"12px 24px" }}>
                  ⚡ Instant Capture
                </button>
                <button className="btn btn-secondary" onClick={stopCam} style={{ padding:"12px 20px" }}>
                  ✕ Stop Camera
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   PHOTO RESULT PAGE
───────────────────────────────────────── */
function PhotoResultPage({ photo, employee: emp, onBack, onRetake }) {
  const [filter, setFilter] = useState("none");
  const filters = [
    { name:"None", value:"none", style:{} },
    { name:"Grayscale", value:"grayscale", style:{ filter:"grayscale(100%)" } },
    { name:"Sepia", value:"sepia", style:{ filter:"sepia(80%)" } },
    { name:"Vivid", value:"vivid", style:{ filter:"saturate(180%) contrast(110%)" } },
    { name:"Noir", value:"noir", style:{ filter:"contrast(150%) brightness(70%) grayscale(50%)" } },
  ];
  const activeFilter = filters.find(f => f.value === filter)?.style || {};

  const download = () => {
    const a = document.createElement("a");
    a.href = photo;
    a.download = `${emp.first_name}_${emp.last_name}_photo.png`;
    a.click();
  };

  const dc = getDeptColor(emp.department);

  return (
    <div style={{ minHeight:"100vh", padding:"20px 16px", position:"relative" }}>
      <BgDecor />
      <div style={{ maxWidth:720, margin:"0 auto", position:"relative", zIndex:1 }}>

        <button className="btn btn-secondary" onClick={onBack} style={{ marginBottom:24, animation:"fadeUp 0.3s ease forwards" }}>
          ← Back to Profile
        </button>

        {/* Success banner */}
        <div style={{
          background:"linear-gradient(135deg, rgba(16,185,129,0.15), rgba(16,185,129,0.05))",
          border:"1px solid rgba(16,185,129,0.3)", borderRadius:16, padding:"16px 24px",
          display:"flex", alignItems:"center", gap:16, marginBottom:24,
          animation:"fadeUp 0.4s ease forwards"
        }}>
          <span style={{ fontSize:36 }}>✅</span>
          <div>
            <div style={{ fontFamily:"var(--font-head)", fontWeight:700, fontSize:18 }}>Photo Captured Successfully!</div>
            <div style={{ color:"var(--muted)", fontSize:13 }}>For {emp.first_name} {emp.last_name} · {emp.department}</div>
          </div>
        </div>

        {/* Photo card */}
        <div className="glass" style={{ borderRadius:24, overflow:"hidden", animation:"fadeUp 0.4s 0.1s ease both", boxShadow:`0 30px 80px rgba(0,0,0,0.5), 0 0 0 1px ${dc}33` }}>
          <div style={{ position:"relative" }}>
            <img src={photo} alt="Captured" style={{ width:"100%", display:"block", transform:"scaleX(-1)", ...activeFilter, transition:"filter 0.3s" }} />
            {/* Corner badge */}
            <div style={{ position:"absolute", top:16, left:16, background:"rgba(0,0,0,0.7)", backdropFilter:"blur(10px)", borderRadius:10, padding:"6px 12px", fontSize:12, fontFamily:"var(--font-head)", fontWeight:600 }}>
              📸 {new Date().toLocaleString()}
            </div>
            <div style={{ position:"absolute", top:16, right:16 }}>
              <span className="tag" style={{ background:`${dc}cc`, color:"white" }}>{emp.department}</span>
            </div>
          </div>

          <div style={{ padding:24 }}>
            {/* Filter strip */}
            <div style={{ marginBottom:20 }}>
              <div style={{ color:"var(--muted)", fontSize:12, textTransform:"uppercase", letterSpacing:1, marginBottom:10 }}>🎨 Photo Filter</div>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                {filters.map(f => (
                  <button key={f.value} onClick={() => setFilter(f.value)}
                    style={{
                      padding:"6px 14px", borderRadius:8, cursor:"pointer",
                      background: filter===f.value ? "var(--accent)" : "var(--bg)",
                      color: filter===f.value ? "white" : "var(--muted)",
                      fontFamily:"var(--font-head)", fontWeight:600, fontSize:13,
                      border: `1px solid ${filter===f.value ? "transparent" : "var(--border)"}`,
                      transition:"all 0.2s"
                    }}>
                    {f.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Employee info strip */}
            <div style={{ background:"var(--bg)", borderRadius:14, padding:"16px 20px", display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:12, marginBottom:20 }}>
              <div>
                <div style={{ fontFamily:"var(--font-head)", fontWeight:700, fontSize:18 }}>{emp.first_name} {emp.last_name}</div>
                <div style={{ color:"var(--muted)", fontSize:13 }}>{emp.job_title || "Employee"} · {emp.city}</div>
              </div>
              {emp.salary && <div style={{ fontFamily:"var(--font-head)", fontWeight:800, color:"var(--accent3)", fontSize:22 }}>${Number(emp.salary).toLocaleString()}</div>}
            </div>

            <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
              <button className="btn btn-primary" onClick={download} style={{ flex:1, justifyContent:"center" }}>⬇️ Download Photo</button>
              <button className="btn btn-cyan" onClick={onRetake} style={{ flex:1, justifyContent:"center" }}>🔄 Retake Photo</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   APP ROOT
───────────────────────────────────────── */
export default function App() {
  injectStyles();

  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme === "light" || savedTheme === "dark" ? savedTheme : "light";
  });
  const [screen, setScreen] = useState("login"); // login | list | details | photo | chart | map
  const [employees, setEmployees] = useState([]);
  const [selected, setSelected] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [photoEmp, setPhotoEmp] = useState(null);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const parseSalary = (value) => {
    if (typeof value === "number") return value;
    if (typeof value !== "string") return 0;
    return Number(value.replace(/[^0-9.-]/g, "")) || 0;
  };

  const parseTableRows = (rows) =>
    rows.map((row, index) => {
      const fullName = row?.[0] || "";
      const [first_name = "Employee", ...lastParts] = fullName.split(" ").filter(Boolean);
      const last_name = lastParts.join(" ") || String(index + 1);
      const city = row?.[2] || "Unknown";
      const employeeId = row?.[3] || String(index + 1);

      return {
        id: employeeId,
        first_name,
        last_name,
        email: `${first_name.toLowerCase()}.${last_name.toLowerCase().replace(/\s+/g, "")}@company.com`,
        phone_number: `+1-555-${String(employeeId).slice(-4).padStart(4, "0")}`,
        department: row?.[1]?.includes("Accountant") ? "Finance"
          : row?.[1]?.includes("Engineer") ? "Engineering"
          : row?.[1]?.includes("Developer") ? "IT"
          : row?.[1]?.includes("Director") ? "Management"
          : row?.[1]?.includes("Support") ? "Operations"
          : row?.[1]?.includes("Sales") ? "Sales"
          : "Operations",
        job_title: row?.[1] || "Employee",
        salary: parseSalary(row?.[5]),
        city,
        gender: index % 2 ? "Female" : "Male",
        employment_status: "Active",
        date_of_birth: row?.[4] || "1990/01/01",
      };
    });

  const fetchData = async () => {
    try {
      const res = await fetch("https://backend.jotish.in/backend_dev/gettabledata.php", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({ username:"test", password:"123456" })
      });
      const json = await res.json();

      const tableRows = json?.TABLE_DATA?.data;
      if (Array.isArray(tableRows) && tableRows.length) {
        setEmployees(parseTableRows(tableRows));
      } else {
        const data = json.data || json.employees || json || [];
        setEmployees(Array.isArray(data) ? data : Object.values(data));
      }
    } catch {
      // Demo fallback data
      setEmployees(Array.from({length:20}, (_,i) => ({
        id: i+1,
        first_name: ["Alice","Bob","Carol","David","Eva","Frank","Grace","Hank","Iris","Jack","Kate","Leo","Mia","Nate","Olivia","Paul","Quinn","Rachel","Sam","Tara"][i],
        last_name: ["Smith","Johnson","Williams","Brown","Jones","Garcia","Miller","Davis","Wilson","Moore","Taylor","Anderson","Thomas","Jackson","White","Harris","Martin","Thompson","Wood","Clark"][i],
        email: `user${i+1}@company.com`,
        phone_number: `+1-555-${String(1000+i*37).slice(-4)}`,
        department: ["Engineering","Marketing","Finance","HR","Sales","Operations","Design","IT","Legal","Management"][i%10],
        job_title: ["Engineer","Analyst","Manager","Director","Coordinator","Specialist","Lead","Head","Executive","Officer"][i%10],
        salary: 50000 + i*4500 + Math.floor(Math.random()*5000),
        city: ["New York","Los Angeles","Chicago","Houston","Phoenix","Philadelphia","San Antonio","San Diego","Dallas","San Jose","Austin","London","Paris","Berlin","Tokyo","Sydney","Mumbai","Toronto","Singapore","Jacksonville"][i],
        gender: ["Male","Female","Female","Male","Female","Male","Female","Male","Female","Male","Female","Male","Female","Male","Female","Male","Other","Female","Male","Female"][i],
        employment_status: i%5===4 ? "Inactive" : "Active",
        date_of_birth: `19${70+i%30}-${String((i%12)+1).padStart(2,"0")}-${String((i%28)+1).padStart(2,"0")}`,
      })));
    }
  };

  const handleLogin = () => {
    setScreen("loading");
    fetchData().then(() => setScreen("list"));
  };

  let currentScreen = null;
  if (screen === "loading") currentScreen = <Loader />;
  if (screen === "login") currentScreen = <LoginPage onLogin={handleLogin} />;
  if (screen === "list") currentScreen = (
    <ListPage
      employees={employees}
      onSelect={emp => { setSelected(emp); setScreen("details"); }}
      onLogout={() => setScreen("login")}
      onBarChart={() => setScreen("chart")}
      onMap={() => setScreen("map")}
    />
  );
  if (screen === "chart") currentScreen = <BarChartScreen employees={employees} onBack={() => setScreen("list")} />;
  if (screen === "map") currentScreen = <MapScreen employees={employees} onBack={() => setScreen("list")} theme={theme} />;
  if (screen === "details") currentScreen = (
    <DetailsPage
      employee={selected}
      allEmployees={employees}
      onBack={() => setScreen("list")}
      onPhotoTaken={(dataUrl, emp) => { setPhoto(dataUrl); setPhotoEmp(emp); setScreen("photo"); }}
    />
  );
  if (screen === "photo") currentScreen = (
    <PhotoResultPage
      photo={photo}
      employee={photoEmp}
      onBack={() => setScreen("details")}
      onRetake={() => setScreen("details")}
    />
  );

  return (
    <>
      {currentScreen}
      <button className="theme-toggle" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
        {theme === "dark" ? "LIGHT MODE" : "DARK MODE"}
      </button>
    </>
  );
}
