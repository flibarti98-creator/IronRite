export function showHome() {
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  const name = userData.name || "Atleta";
  const goal = userData.goal || "strength";
  const experience = userData.experience || "beginner";
  const frequency = userData.frequency || 3;

  const goalLabel = { strength: "Siła", mass: "Masa", cut: "Redukcja" }[goal] || "Siła";
  const expLabel = { beginner: "Początkujący", intermediate: "Średni", advanced: "Zaawansowany" }[experience] || "";

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Dzień dobry" : hour < 18 ? "Cześć" : "Dobry wieczór";

  const app = document.getElementById("app");
  app.innerHTML = `
    <div class="home-screen" id="homeScreen">

      <!-- ═══ HEADER ═══ -->
      <header class="home-header">
        <div class="home-header-inner">
          <div class="home-greeting">
            <span class="home-greeting-text">${greeting},</span>
            <span class="home-username">${name}</span>
          </div>
          <button class="home-avatar" id="avatarBtn" aria-label="Profil">
            <span>${name.charAt(0).toUpperCase()}</span>
          </button>
        </div>
      </header>

      <!-- ═══ SCROLLABLE BODY ═══ -->
      <main class="home-body" id="homeBody">

        <!-- ── HERO CARD ── -->
        <div class="hero-card">
          <div class="hero-card-content">
            <div class="hero-card-text">
              <p class="hero-label">Cel tygodnia</p>
              <h2 class="hero-title">${goalLabel}</h2>
              <p class="hero-sub">${frequency}× w tygodniu · ${expLabel}</p>
            </div>
            <div class="hero-graphic" aria-hidden="true">
              ${HERO_SVG}
            </div>
          </div>
          <div class="hero-stats">
            <div class="hero-stat">
              <span class="hero-stat-val">0</span>
              <span class="hero-stat-label">treningi</span>
            </div>
            <div class="hero-stat-divider"></div>
            <div class="hero-stat">
              <span class="hero-stat-val">0</span>
              <span class="hero-stat-label">serie łącznie</span>
            </div>
            <div class="hero-stat-divider"></div>
            <div class="hero-stat">
              <span class="hero-stat-val">0 kg</span>
              <span class="hero-stat-label">obj. tygodnia</span>
            </div>
          </div>
        </div>

        <!-- ── QUICK ACTIONS ── -->
        <div class="section-label">Szybki start</div>
        <div class="quick-actions">
          <button class="quick-btn" data-action="workout">
            <div class="quick-btn-icon">${ICON_BARBELL}</div>
            <span>Nowy trening</span>
          </button>
          <button class="quick-btn" data-action="log">
            <div class="quick-btn-icon">${ICON_LOG}</div>
            <span>Dziennik</span>
          </button>
          <button class="quick-btn" data-action="sleep">
            <div class="quick-btn-icon">${ICON_SLEEP}</div>
            <span>Sen</span>
          </button>
          <button class="quick-btn" data-action="supps">
            <div class="quick-btn-icon">${ICON_PILL}</div>
            <span>Suplementy</span>
          </button>
        </div>

        <!-- ── RECORDS ── -->
        ${renderRecords(userData.lifts)}

        <!-- ── LAST WORKOUTS PLACEHOLDER ── -->
        <div class="section-label">Ostatnie treningi</div>
        <div class="empty-state">
          <div class="empty-icon">${ICON_EMPTY}</div>
          <p class="empty-title">Brak treningów</p>
          <p class="empty-sub">Dodaj pierwszy trening żeby zobaczyć historię.</p>
          <button class="btn btn-primary empty-cta">Zacznij teraz</button>
        </div>

        <div style="height: 100px"></div>

      </main>

      <!-- ═══ BOTTOM NAV ═══ -->
      <nav class="bottom-nav" role="navigation" aria-label="Główna nawigacja">
        <button class="nav-item active" data-tab="home" aria-label="Home">
          <div class="nav-icon">${NAV_HOME}</div>
          <span class="nav-label">Home</span>
        </button>
        <button class="nav-item" data-tab="workout" aria-label="Trening">
          <div class="nav-icon">${NAV_BARBELL}</div>
          <span class="nav-label">Trening</span>
        </button>
        <button class="nav-item nav-item--add" data-tab="add" aria-label="Dodaj">
          <div class="nav-icon">${NAV_PLUS}</div>
        </button>
        <button class="nav-item" data-tab="stats" aria-label="Postępy">
          <div class="nav-icon">${NAV_CHART}</div>
          <span class="nav-label">Postępy</span>
        </button>
        <button class="nav-item" data-tab="profile" aria-label="Profil">
          <div class="nav-icon">${NAV_PERSON}</div>
          <span class="nav-label">Profil</span>
        </button>
      </nav>

    </div>
  `;

  // ── Nav tab switching ──
  app.querySelectorAll(".nav-item").forEach(btn => {
    btn.addEventListener("click", () => {
      app.querySelectorAll(".nav-item").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      // TODO: routing do ekranów
    });
  });

  // ── Avatar → clear storage ──
  document.getElementById("avatarBtn").addEventListener("click", () => {
    if (confirm("Wyczyścić dane i wrócić do quizu?")) {
      localStorage.clear();
      location.reload();
    }
  });
}

// ─────────────────────────────────────────────
//  HELPERS
// ─────────────────────────────────────────────

function renderRecords(lifts) {
  if (!lifts) return "";
  const { bench = 0, squat = 0, deadlift = 0 } = lifts;
  if (!bench && !squat && !deadlift) return "";

  return `
    <div class="section-label">Rekordy osobiste</div>
    <div class="records-grid">
      ${recordCard("Wyciskanie", bench, "BP")}
      ${recordCard("Przysiad", squat, "SQ")}
      ${recordCard("Martwy ciąg", deadlift, "DL")}
    </div>
  `;
}

function recordCard(label, val, abbr) {
  return `
    <div class="record-card">
      <span class="record-abbr">${abbr}</span>
      <span class="record-val">${val || "—"}<span class="record-unit">${val ? " kg" : ""}</span></span>
      <span class="record-label">${label}</span>
    </div>
  `;
}

// ─────────────────────────────────────────────
//  SVG ASSETS
// ─────────────────────────────────────────────

const HERO_SVG = `
<svg viewBox="0 0 140 120" fill="none" xmlns="http://www.w3.org/2000/svg" class="hero-svg">
  <!-- glow -->
  <ellipse cx="70" cy="90" rx="52" ry="14" fill="rgba(91,127,191,0.12)"/>
  <!-- barbell shaft -->
  <rect x="18" y="57" width="104" height="6" rx="3" fill="rgba(255,255,255,0.12)"/>
  <!-- left collar -->
  <rect x="22" y="52" width="8" height="16" rx="3" fill="rgba(255,255,255,0.2)"/>
  <!-- right collar -->
  <rect x="110" y="52" width="8" height="16" rx="3" fill="rgba(255,255,255,0.2)"/>
  <!-- left plates outer -->
  <rect x="8" y="44" width="14" height="32" rx="4" fill="rgba(91,127,191,0.5)"/>
  <!-- left plates inner -->
  <rect x="14" y="48" width="8" height="24" rx="3" fill="rgba(91,127,191,0.7)"/>
  <!-- right plates inner -->
  <rect x="118" y="48" width="8" height="24" rx="3" fill="rgba(91,127,191,0.7)"/>
  <!-- right plates outer -->
  <rect x="118" y="44" width="14" height="32" rx="4" fill="rgba(91,127,191,0.5)"/>
  <!-- center knurl marks -->
  <line x1="62" y1="55" x2="62" y2="65" stroke="rgba(255,255,255,0.08)" stroke-width="1.5"/>
  <line x1="66" y1="55" x2="66" y2="65" stroke="rgba(255,255,255,0.08)" stroke-width="1.5"/>
  <line x1="70" y1="55" x2="70" y2="65" stroke="rgba(255,255,255,0.08)" stroke-width="1.5"/>
  <line x1="74" y1="55" x2="74" y2="65" stroke="rgba(255,255,255,0.08)" stroke-width="1.5"/>
  <line x1="78" y1="55" x2="78" y2="65" stroke="rgba(255,255,255,0.08)" stroke-width="1.5"/>
  <!-- weight labels on plates -->
  <text x="11" y="62" font-size="6" fill="rgba(255,255,255,0.4)" font-family="Barlow,sans-serif" font-weight="600">20</text>
  <text x="119" y="62" font-size="6" fill="rgba(255,255,255,0.4)" font-family="Barlow,sans-serif" font-weight="600">20</text>
  <!-- shine on left plate -->
  <rect x="9" y="46" width="3" height="10" rx="1.5" fill="rgba(255,255,255,0.15)"/>
  <!-- shine on right plate -->
  <rect x="128" y="46" width="3" height="10" rx="1.5" fill="rgba(255,255,255,0.15)"/>
</svg>
`;

const ICON_BARBELL = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="1" y="10.5" width="4" height="3" rx="1"/><rect x="5" y="8" width="3" height="8" rx="1"/><line x1="8" y1="12" x2="16" y2="12"/><rect x="16" y="8" width="3" height="8" rx="1"/><rect x="19" y="10.5" width="4" height="3" rx="1"/></svg>`;
const ICON_LOG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="4" y="3" width="16" height="18" rx="2"/><line x1="8" y1="8" x2="16" y2="8"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="8" y1="16" x2="12" y2="16"/></svg>`;
const ICON_SLEEP = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>`;
const ICON_PILL = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="3" y="9" width="18" height="6" rx="3"/><line x1="12" y1="9" x2="12" y2="15" stroke-width="1.5" opacity="0.5"/></svg>`;
const ICON_EMPTY = `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="8" y="14" width="32" height="26" rx="4" stroke="rgba(255,255,255,0.12)" stroke-width="2"/><line x1="8" y1="22" x2="40" y2="22" stroke="rgba(255,255,255,0.08)" stroke-width="2"/><line x1="16" y1="8" x2="16" y2="18" stroke="rgba(255,255,255,0.15)" stroke-width="2.5" stroke-linecap="round"/><line x1="32" y1="8" x2="32" y2="18" stroke="rgba(255,255,255,0.15)" stroke-width="2.5" stroke-linecap="round"/></svg>`;

const NAV_HOME = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/><path d="M9 21V12h6v9"/></svg>`;
const NAV_BARBELL = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="1" y="10.5" width="4" height="3" rx="1"/><rect x="5" y="8" width="3" height="8" rx="1"/><line x1="8" y1="12" x2="16" y2="12"/><rect x="16" y="8" width="3" height="8" rx="1"/><rect x="19" y="10.5" width="4" height="3" rx="1"/></svg>`;
const NAV_PLUS = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`;
const NAV_CHART = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`;
const NAV_PERSON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="7" r="4"/><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7"/></svg>`;