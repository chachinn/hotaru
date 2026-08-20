(() => {
  'use strict';

  const APP_VERSION = '0.1.0';
  const STORAGE_KEY = 'hotaru.app.v1';
  const LEGACY_STORAGE_KEY = 'genseki.app.v1';
  const $app = document.getElementById('app');
  const $toast = document.getElementById('toast');

  const DEFAULT_STATE = {
    schemaVersion: 1,
    roster: [],
    weapons: [],
    builds: [],
    settings: { haptics: true },
    ui: { tab: 'home' }
  };

  const tabs = [
    ['home', '⌂', 'Home'],
    ['characters', '✦', 'Characters'],
    ['build', '◇', 'Build'],
    ['roster', '♙', 'Roster'],
    ['more', '•••', 'More']
  ];

  let state = loadState();
  const initialTab = new URLSearchParams(location.search).get('tab');
  if (tabs.some(([id]) => id === initialTab)) state.ui.tab = initialTab;
  let toastTimer = null;

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
      if (!raw) return structuredClone(DEFAULT_STATE);
      const parsed = JSON.parse(raw);
      const migrated = {
        ...structuredClone(DEFAULT_STATE),
        ...parsed,
        settings: { ...DEFAULT_STATE.settings, ...(parsed.settings || {}) },
        ui: { ...DEFAULT_STATE.ui, ...(parsed.ui || {}) },
        roster: Array.isArray(parsed.roster) ? parsed.roster : [],
        weapons: Array.isArray(parsed.weapons) ? parsed.weapons : [],
        builds: Array.isArray(parsed.builds) ? parsed.builds : []
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
        localStorage.removeItem(LEGACY_STORAGE_KEY);
      } catch (_) {}
      return migrated;
    } catch (_) {
      return structuredClone(DEFAULT_STATE);
    }
  }

  function saveState() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (_) {}
  }

  function escapeHTML(value = '') {
    return String(value).replace(/[&<>'"]/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;' }[c]));
  }

  function haptic() {
    if (state.settings.haptics && navigator.vibrate) navigator.vibrate(8);
  }

  function toast(message) {
    clearTimeout(toastTimer);
    $toast.textContent = message;
    $toast.classList.add('show');
    toastTimer = setTimeout(() => $toast.classList.remove('show'), 1800);
  }

  function setTab(tab) {
    if (!tabs.some(([id]) => id === tab)) tab = 'home';
    state.ui.tab = tab;
    saveState();
    haptic();
    render();
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  function topbar() {
    return `
      <header class="topbar">
        <div class="brand">
          <img class="brand-icon" src="icons/icon-192.png" alt="" />
          <div class="brand-copy">
            <h2 class="brand-title">Hotaru</h2>
            <p class="brand-subtitle">Character build companion</p>
          </div>
        </div>
      </header>`;
  }

  function nav() {
    return `
      <nav class="bottom-nav" aria-label="Primary navigation">
        ${tabs.map(([id, icon, label]) => `
          <button class="nav-btn ${state.ui.tab === id ? 'active' : ''}" data-tab="${id}" aria-label="${label}">
            <span class="nav-icon" aria-hidden="true">${icon}</span>
            <span class="nav-label">${label}</span>
          </button>`).join('')}
      </nav>`;
  }

  function homeView() {
    return `
      <main>
        <section class="hero">
          <img class="hero-logo" src="icons/icon-192.png" alt="" />
          <div class="eyebrow" style="color:rgba(255,255,255,.78)">Your Teyvat build companion</div>
          <h1>Build smarter.</h1>
          <p>Weapons, artifacts and stat targets—organized around the characters you actually use.</p>
        </section>

        <section class="section">
          <div class="section-head">
            <div><div class="eyebrow">Start here</div><h2>What do you want to check?</h2></div>
          </div>
          <div class="grid two">
            <button class="card card-button" data-go="characters">
              <div class="card-icon">✦</div><strong>Find a character</strong><span>Open a character build guide.</span>
            </button>
            <button class="card card-button" data-go="build">
              <div class="card-icon">◇</div><strong>Check my build</strong><span>Review weapon, artifacts and stats.</span>
            </button>
            <button class="card card-button" data-go="roster">
              <div class="card-icon">♙</div><strong>My roster</strong><span>Keep track of characters you own.</span>
            </button>
            <button class="card card-button" data-action="coming-soon">
              <div class="card-icon">⌁</div><strong>Team-aware builds</strong><span>Recommendations that adapt to your team.</span>
            </button>
          </div>
        </section>

        <section class="section">
          <div class="section-head"><h2>Your progress</h2><span class="pill">Local-first</span></div>
          <div class="card status-list">
            <div class="status-row"><div><strong>Characters saved</strong><br><span>Owned roster</span></div><strong>${state.roster.length}</strong></div>
            <div class="status-row"><div><strong>Weapons saved</strong><br><span>Your available options</span></div><strong>${state.weapons.length}</strong></div>
            <div class="status-row"><div><strong>Builds saved</strong><br><span>Character loadouts</span></div><strong>${state.builds.length}</strong></div>
          </div>
        </section>
      </main>`;
  }

  function charactersView() {
    return `
      <main>
        <div class="page-head"><div class="eyebrow">Database</div><h1>Characters</h1><p class="muted">Search by character, element, weapon or role once the live game-data layer is connected.</p></div>
        <label class="search"><span aria-hidden="true">⌕</span><input id="character-search" type="search" placeholder="Search characters" autocomplete="off" /></label>
        <section class="section card empty">
          <div class="empty-symbol">✦</div><h3>Character data comes next</h3><p>The app shell is ready. The next update will connect the source data and build-guide layer without using fake sample characters.</p>
        </section>
      </main>`;
  }

  function buildView() {
    return `
      <main>
        <div class="page-head"><div class="eyebrow">Core feature</div><h1>Build Check</h1><p class="muted">Hotaru will evaluate the whole build together instead of scoring isolated stats.</p></div>
        <div class="feature-row">
          <div class="card"><div class="card-icon">⚔</div><div><strong>Weapon ranking</strong><span>Best overall, 4★, F2P and best option you own.</span></div></div>
          <div class="card"><div class="card-icon">❀</div><div><strong>Artifact setup</strong><span>Sets, main stats and substat priorities by playstyle.</span></div></div>
          <div class="card"><div class="card-icon">▥</div><div><strong>Stat targets</strong><span>Minimum, good and strong targets with build-aware warnings.</span></div></div>
        </div>
        <section class="section card empty">
          <div class="empty-symbol">◇</div><h3>No build selected</h3><p>Once character data is connected, choose a character here and Hotaru can begin guiding the build.</p>
        </section>
      </main>`;
  }

  function rosterView() {
    return `
      <main>
        <div class="page-head"><div class="eyebrow">Your account</div><h1>My Roster</h1><p class="muted">Your owned characters and weapons will live here, saved locally first.</p></div>
        <section class="card empty">
          <div class="empty-symbol">♙</div><h3>Your roster is empty</h3><p>We’ll enable character selection after the database connection so your first entries are real Genshin data, not placeholders.</p>
        </section>
      </main>`;
  }

  function moreView() {
    return `
      <main>
        <div class="page-head"><div class="eyebrow">Hotaru</div><h1>More</h1><p class="muted">App preferences, data tools and information.</p></div>
        <section class="card">
          <div class="status-row"><div><strong>Version</strong><br><span>Foundation build</span></div><span>${escapeHTML(APP_VERSION)}</span></div>
          <div class="status-row"><div><strong>Storage</strong><br><span>Roster and preferences</span></div><span>On device</span></div>
          <div class="status-row"><div><strong>Haptics</strong><br><span>Navigation feedback</span></div><button class="secondary" data-action="toggle-haptics">${state.settings.haptics ? 'On' : 'Off'}</button></div>
        </section>
        <section class="section card">
          <strong>Unofficial fan companion</strong>
          <p class="muted small">Hotaru is an independent fan-made tool and is not affiliated with or endorsed by HoYoverse.</p>
        </section>
      </main>`;
  }

  function view() {
    switch (state.ui.tab) {
      case 'characters': return charactersView();
      case 'build': return buildView();
      case 'roster': return rosterView();
      case 'more': return moreView();
      default: return homeView();
    }
  }

  function render() {
    $app.innerHTML = `${topbar()}${view()}${nav()}`;
  }

  document.addEventListener('click', event => {
    const tab = event.target.closest('[data-tab]');
    if (tab) return setTab(tab.dataset.tab);
    const go = event.target.closest('[data-go]');
    if (go) return setTab(go.dataset.go);
    const action = event.target.closest('[data-action]')?.dataset.action;
    if (action === 'coming-soon') toast('This feature is planned for a later update.');
    if (action === 'toggle-haptics') {
      state.settings.haptics = !state.settings.haptics;
      saveState();
      render();
      toast(`Haptics ${state.settings.haptics ? 'on' : 'off'}.`);
    }
  });

  window.addEventListener('dblclick', event => event.preventDefault(), { passive: false });
  document.addEventListener('gesturestart', event => event.preventDefault(), { passive: false });
  document.addEventListener('gesturechange', event => event.preventDefault(), { passive: false });
  document.addEventListener('gestureend', event => event.preventDefault(), { passive: false });

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => navigator.serviceWorker.register('./service-worker.js').catch(() => {}));
  }

  render();
})();
