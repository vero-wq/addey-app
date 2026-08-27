const checkSvg = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;

// ------------------------------------------------------------------
// Sheets — the built-in tabs, plus any sheets added from the Settings
// gallery. state.sheets holds the order + visibility for all of them;
// state.customSheets holds the data for the gallery-added ones.
// ------------------------------------------------------------------
const BUILTIN_SHEET_META = {
  todo: { label: "Lists", icon: `<path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01"></path>` },
  budget: { label: "Budget", icon: `<line x1="12" y1="2" x2="12" y2="22"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>` },
  investments: { label: "Investments", icon: `<polyline points="3 17 9 11 13 15 21 6"></polyline><polyline points="15 6 21 6 21 12"></polyline>` },
  bible: {
    label: "Bible Reading",
    icon: `<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path><path d="M13 7v9M10.2 9.6h5.6"></path>`,
  },
  wellness: { label: "Wellness", icon: `<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"></path>` },
  sleep: { label: "Sleep", icon: `<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"></path>` },
};
const BUILTIN_SHEET_ORDER = ["todo", "budget", "investments", "bible", "sleep", "wellness"];

const SHEET_GALLERY = [
  {
    key: "workout",
    label: "Workout Log",
    icon: `<rect x="1.5" y="9" width="3" height="6" rx="1"></rect><rect x="19.5" y="9" width="3" height="6" rx="1"></rect><rect x="5.5" y="7" width="2.5" height="10" rx="1"></rect><rect x="16" y="7" width="2.5" height="10" rx="1"></rect><line x1="8" y1="12" x2="16" y2="12"></line>`,
    desc: "Track sets, weight, and how your training sessions are going.",
    starterItems: ["Upper body — Monday", "Lower body — Wednesday", "Full body — Friday"],
  },
  {
    key: "wardrobe",
    label: "Capsule Wardrobe",
    icon: `<path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23Z"></path>`,
    desc: "Checklist for what's in rotation this season, by category.",
    starterItems: ["Tops", "Bottoms", "Outerwear", "Shoes", "Accessories"],
  },
  {
    key: "meals",
    label: "Meal Planner",
    icon: `<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"></path><path d="M7 2v20"></path><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"></path>`,
    desc: "Plan the week's meals and roll them into your groceries budget.",
    starterItems: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
  },
  {
    key: "quran",
    label: "Quran Reading Plan",
    icon: `<path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path><path d="M9 7h8M9 11h8M9 15h5"></path>`,
    desc: "31 reading segments with the same pace tracker as your Bible plan.",
    starterItems: [],
  },
  {
    key: "books",
    label: "Book List",
    icon: `<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path><path d="M9 7h7"></path>`,
    desc: "Your reading list, organized by category — to read and already read.",
    starterItems: [],
  },
];

// ------------------------------------------------------------------
// Capsule Wardrobe — richer than a plain checklist: each item carries
// category/type/color/season/priority/purchase-type/price data, seeded
// from her real spreadsheet. Season pills up top (Staples pinned first,
// then the four seasons ordered starting with whatever season it is
// right now on this device, so the most relevant one is never buried),
// and within a season the items collapse into category groups — same
// pattern as the Bible book list.
const WARDROBE_SEED_ITEMS = [{"category": "Tops", "name": "White Button-Down Shirt", "itemType": "Everyday", "color": "White", "season": "All", "priority": "High", "purchaseType": "Support", "min": 40, "max": 80, "purchased": true, "paid": 55, "notes": "A versatile staple that works for most occasions."}, {"category": "Bottoms", "name": "Dark Wash Jeans", "itemType": "Everyday", "color": "Indigo", "season": "All", "priority": "High", "purchaseType": "Support", "min": 60, "max": 120, "purchased": true, "paid": 89, "notes": "Goes with almost everything."}, {"category": "Outerwear", "name": "Wool Coat", "itemType": "Cold Weather", "color": "Camel", "season": "Fall/Winter", "priority": "Medium", "purchaseType": "Bonus", "min": 150, "max": 300, "purchased": false, "paid": null, "notes": "Add your own wishlist items like this one."}, {"category": "Shoes", "name": "White Sneakers", "itemType": "Everyday", "color": "White", "season": "All", "priority": "High", "purchaseType": "Support", "min": 60, "max": 120, "purchased": true, "paid": 75, "notes": ""}, {"category": "Accessories", "name": "Leather Belt", "itemType": "Everyday", "color": "Black", "season": "All", "priority": "Low", "purchaseType": "Support", "min": 20, "max": 50, "purchased": true, "paid": 30, "notes": ""}];

const WARDROBE_SEASON_DEFS = [
  { key: "spring", label: "Spring" },
  { key: "summer", label: "Summer" },
  { key: "fall", label: "Fall" },
  { key: "winter", label: "Winter" },
];

// "All" / "All-season" -> Staples. Combined seasons ("Spring/Summer")
// tag the item under both, so it shows up in either pill.
function parseSeasonTags(seasonStr) {
  const s = (seasonStr || "").trim().toLowerCase();
  if (!s || s === "all" || s === "all-season" || s === "all seasons") return ["staples"];
  return s
    .split("/")
    .map((p) => p.trim())
    .filter((p) => WARDROBE_SEASON_DEFS.some((d) => d.key === p));
}

// Northern-hemisphere calendar seasons from the device's local date —
// good enough to put the relevant pill first without asking anyone
// where they live.
function getCurrentSeasonKey() {
  const m = new Date().getMonth(); // 0=Jan
  if (m <= 1 || m === 11) return "winter"; // Dec, Jan, Feb
  if (m <= 4) return "spring"; // Mar, Apr, May
  if (m <= 7) return "summer"; // Jun, Jul, Aug
  return "fall"; // Sep, Oct, Nov
}

// Staples always leads; the four seasons follow starting with whichever
// one it is right now, so a summer visit doesn't bury Summer behind
// Spring every time.
function wardrobeSeasonPillOrder() {
  const current = getCurrentSeasonKey();
  const idx = WARDROBE_SEASON_DEFS.findIndex((d) => d.key === current);
  const rotated = WARDROBE_SEASON_DEFS.slice(idx).concat(WARDROBE_SEASON_DEFS.slice(0, idx));
  return [{ key: "staples", label: "Staples" }, ...rotated];
}

// A small color-name -> swatch lookup. Falls back to a neutral dot for
// anything unrecognized rather than guessing wrong.
const WARDROBE_COLOR_SWATCHES = [
  ["black", "#221E1A"],
  ["white", "#F7F5F0"],
  ["off-white", "#F0ECE0"],
  ["ivory", "#F0E9DB"],
  ["cream", "#ECE3D2"],
  ["camel", "#B98A55"],
  ["chocolate", "#4A3323"],
  ["brown", "#5C4128"],
  ["tan", "#C9AB7C"],
  ["gold", "#C9A86A"],
  ["grey", "#9A958D"],
  ["gray", "#9A958D"],
  ["navy", "#2C3A4A"],
  ["denim", "#5B7A9A"],
  ["merlot", "#5C1F2E"],
  ["red", "#B3392B"],
  ["green", "#6B7F5A"],
  ["olive", "#6B6B45"],
  ["floral", "#C08887"],
  ["neutral", "#ADA79A"],
  ["diamond", "#D9D3C4"],
];
function wardrobeColorSwatch(colorStr) {
  const s = (colorStr || "").toLowerCase();
  for (const [name, hex] of WARDROBE_COLOR_SWATCHES) {
    if (s.includes(name)) return hex;
  }
  return "#ADA79A";
}

function seedWardrobeItems() {
  return WARDROBE_SEED_ITEMS.map((it) => ({
    id: nextId(),
    ...it,
    seasonTags: parseSeasonTags(it.season),
  }));
}

function seedQuranItems() {
  return QURAN_SEED_ITEMS.map((it) => ({ id: nextId(), ...it }));
}

function seedBookItems() {
  return BOOK_SEED_ITEMS.map((it) => ({ id: nextId(), ...it }));
}

const BOOK_SEED_ITEMS = [{"title": "Atomic Habits", "author": "James Clear", "category": "Personal Growth", "link": "", "read": true, "format": "read", "onlineRating": 5, "myRating": 4, "notes": "A good example of how notes show up here."}, {"title": "Add your own book", "author": "", "category": "To Read", "link": "", "read": false, "format": "read", "onlineRating": null, "myRating": null, "notes": ""}];

const QURAN_SEED_ITEMS = [{"reading": "Surah Al-Fatiha (1:1–7) to Surah Al-Baqarah (2:1–141)", "done": false}, {"reading": "Surah Al-Baqarah (2:142–252)", "done": false}, {"reading": "Surah Al-Baqarah (2:253–286) to Surah Aal-E-Imran (3:1–92)", "done": false}, {"reading": "Surah Aal-E-Imran (3:93–200) to Surah An-Nisa (4:1–23)", "done": false}, {"reading": "Surah An-Nisa (4:24–147)", "done": false}, {"reading": "Surah An-Nisa (4:148–176) to Surah Al-Ma’idah (5:1–81)", "done": false}, {"reading": "Surah Al-Ma’idah (5:82–120) to Surah Al-An’am (6:1–110)", "done": false}, {"reading": "Surah Al-An’am (6:111–165) to Surah Al-A’raf (7:1–87)", "done": false}, {"reading": "Surah Al-A’raf (7:88–206) to Surah Al-Anfal (8:1–40)", "done": false}, {"reading": "Surah Al-Anfal (8:41–75) to Surah At-Tawbah (9:1–129)", "done": false}, {"reading": "Surah Yunus (10:1–109) to Surah Hud (11:1–5)", "done": false}, {"reading": "Surah Hud (11:6–123) to Surah Yusuf (12:1–52)", "done": false}, {"reading": "Surah Yusuf (12:53–111) to Surah Ar-Ra’d (13:1–43)", "done": false}, {"reading": "Surah Ibrahim (14:1–52) to Surah Al-Hijr (15:1–99)", "done": false}, {"reading": "Surah An-Nahl (16:1–128)", "done": false}, {"reading": "Surah Al-Isra (17:1–111) to Surah Al-Kahf (18:1–74)", "done": false}, {"reading": "Surah Al-Kahf (18:75–110) to Surah Maryam (19:1–98)", "done": false}, {"reading": "Surah Taha (20:1–135) to Surah Al-Anbiya (21:1–50)", "done": false}, {"reading": "Surah Al-Anbiya (21:51–112) to Surah Al-Hajj (22:1–78)", "done": false}, {"reading": "Surah Al-Mu’minun (23:1–118) to Surah An-Nur (24:1–64)", "done": false}, {"reading": "Surah Al-Furqan (25:1–77) to Surah Ash-Shu’ara (26:1–227)", "done": false}, {"reading": "Surah An-Naml (27:1–93) to Surah Al-Qasas (28:1–44)", "done": false}, {"reading": "Surah Al-Qasas (28:45–88) to Surah Al-Ankabut (29:1–69)", "done": false}, {"reading": "Surah Ar-Rum (30:1–60) to Surah Luqman (31:1–34)", "done": false}, {"reading": "Surah As-Sajda (32:1–30) to Surah Ya-Sin (36:1–83)", "done": false}, {"reading": "Surah As-Saffat (37:1–182) to Surah Sad (38:1–88)", "done": false}, {"reading": "Surah Az-Zumar (39:1–75) to Surah Ghafir (40:1–85)", "done": false}, {"reading": "Surah Fussilat (41:1–54) to Surah Ash-Shura (42:1–53)", "done": false}, {"reading": "Surah Az-Zukhruf (43:1–89) to Surah Ad-Dukhan (44:1–59)", "done": false}, {"reading": "Surah Al-Jathiya (45:1–37) to Surah Al-Qamar (54:1–55)", "done": false}, {"reading": "Surah Ar-Rahman (55:1–78) to Surah An-Nas (114:1–6)", "done": false}];

let state = null;
let saveTimer = null;
let currentUserId = null;
let currentUserEmail = null;

// ------------------------------------------------------------------
// Supabase — the real backend. The app's data now lives in the
// `app_state` table (one JSON row per user, RLS-walled so nobody can
// read or write anyone else's row) instead of this browser's
// localStorage, so it's the same on every device the moment you sign in.
// The publishable key is safe to ship in client code by design — it can
// only do what the database's row-level security policies allow it to.
// ------------------------------------------------------------------
const SUPABASE_URL = "https://kzdtxlwzlihorrlqmpzb.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_S1j4SqujL3N0g-ebTpKFBA_MLTrvJEU";
const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

// Resolves once someone is signed in — shows the sign-in/create-account
// screen and waits on it if nobody is yet, otherwise resolves immediately
// with the existing session.
async function requireAuth() {
  const {
    data: { session },
  } = await sb.auth.getSession();
  if (session) return session;
  return new Promise((resolve) => showAuthGate(resolve));
}

function showAuthGate(onSignedIn) {
  const gate = document.getElementById("auth-gate");
  const bootLoading = document.getElementById("boot-loading");
  if (bootLoading) bootLoading.remove();
  gate.style.display = "flex";

  const form = document.getElementById("auth-gate-form");
  const emailInput = document.getElementById("auth-gate-email");
  const passwordInput = document.getElementById("auth-gate-password");
  const submitBtn = document.getElementById("auth-gate-submit");
  const status = document.getElementById("auth-gate-status");
  const tabs = gate.querySelectorAll(".auth-gate-tab");
  let mode = "signin";

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      mode = tab.dataset.mode;
      tabs.forEach((t) => t.classList.toggle("active", t === tab));
      submitBtn.textContent = mode === "signin" ? "Sign in" : "Create account";
      passwordInput.autocomplete = mode === "signin" ? "current-password" : "new-password";
      status.textContent = "";
      status.classList.remove("err");
    });
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    submitBtn.disabled = true;
    status.classList.remove("err");
    status.textContent = mode === "signin" ? "Signing in…" : "Creating your account…";
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const { data, error } =
      mode === "signin"
        ? await sb.auth.signInWithPassword({ email, password })
        : await sb.auth.signUp({ email, password });
    if (error) {
      status.textContent = error.message;
      status.classList.add("err");
      submitBtn.disabled = false;
      return;
    }
    if (mode === "signup" && !data.session) {
      // Email confirmation is on for this project — no session yet.
      status.textContent = "Check your email to confirm your account, then sign in.";
      submitBtn.disabled = false;
      return;
    }
    gate.style.display = "none";
    onSignedIn(data.session);
  });

  const googleBtn = document.getElementById("auth-gate-google");
  if (googleBtn) {
    googleBtn.addEventListener("click", async () => {
      googleBtn.disabled = true;
      status.classList.remove("err");
      status.textContent = "Redirecting to Google…";
      const { error } = await sb.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: window.location.origin + window.location.pathname },
      });
      if (error) {
        status.textContent = error.message;
        status.classList.add("err");
        googleBtn.disabled = false;
      }
      // On success the browser navigates away to Google, then back here —
      // boot()'s requireAuth() picks up the new session on reload.
    });
  }
}

async function loadStateFromSupabase(userId) {
  const { data, error } = await sb.from("app_state").select("data").eq("user_id", userId).single();
  if (error) {
    console.error("Could not load saved data:", error);
    return null;
  }
  return data?.data ?? null;
}

async function saveStateToSupabase(userId, stateToSave) {
  const { error } = await sb.from("app_state").upsert({ user_id: userId, data: stateToSave });
  if (error) throw error;
}

function el(html) {
  const t = document.createElement("template");
  t.innerHTML = html.trim();
  return t.content.firstChild;
}

function escapeHtml(str) {
  return String(str ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function nextId() {
  return state.nextId++;
}

// A phone camera photo can easily be several MB straight out of the file
// picker — stored as-is (base64) in localStorage, a couple of those are
// enough to blow past the browser's per-site storage quota, which makes
// EVERY save silently fail afterward (not just the photo — any checkbox,
// anywhere), because the whole state object is written as one JSON blob.
// Downscaling through a canvas before it ever reaches state keeps each
// photo to a few tens of KB, and it's the only thing that goes through
// FileReader now — nothing stores a raw file's dataURL directly.
function resizeImageToDataUrl(file, maxDim = 900, quality = 0.8) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error || new Error("Could not read file"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Could not decode image"));
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          if (width >= height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d").drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

// ------------------------------------------------------------------
// Saving — plain localStorage on this device. No network round-trip,
// no page reload, and nothing for a future code update to collide with.
// ------------------------------------------------------------------
function setSaveIndicator(text, isErr) {
  const ind = document.getElementById("save-indicator");
  if (!ind) return;
  ind.textContent = text;
  ind.classList.toggle("err", Boolean(isErr));
}

// .topbar is position:fixed (see index.html for why), so it's out of
// normal document flow — .shell-body needs a top margin matching its
// real rendered height or content starts underneath it. Height differs
// a little between the desktop and mobile padding, so it's measured
// rather than hardcoded, and re-measured on resize/orientation change.
function syncTopbarHeight() {
  const bar = document.querySelector(".topbar");
  if (!bar) return;
  document.documentElement.style.setProperty("--topbar-h", `${bar.offsetHeight}px`);
}

function scheduleSave() {
  setSaveIndicator("Saving…");
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(doSave, 300);
}

async function doSave() {
  try {
    await saveStateToSupabase(currentUserId, state);
    // Saves happen constantly and silently — flashing "Saving…" briefly is
    // enough to show something's happening; there's no need for a lingering
    // "Saved" that just sits there taking up space once it's done. A
    // failure is the one state worth calling out, so that stays.
    setSaveIndicator("");
  } catch (err) {
    console.error("Save failed:", err);
    setSaveIndicator("Couldn't save", true);
  }
}

// ------------------------------------------------------------------
// Tabs
// ------------------------------------------------------------------
function activateTab(tab) {
  document.querySelectorAll(".tab-btn").forEach((b) => b.classList.toggle("active", b.dataset.tab === tab));
  document.querySelectorAll(".panel").forEach((p) => p.classList.toggle("active", p.id === `panel-${tab}`));
  const homeRow = document.getElementById("home-tab-row");
  if (homeRow) homeRow.classList.toggle("active", tab === "home");
  const homeCircle = document.getElementById("home-tab-circle");
  if (homeCircle) homeCircle.classList.toggle("active", tab === "home");
  if (tab === "home") renderHome();
  state.activeTab = tab;
  scheduleSave();
  // Auto-growing textareas measure scrollHeight, which is 0 while their
  // panel is display:none — recompute now that this panel is visible.
  document.querySelectorAll(`#panel-${tab} textarea.auto-grow`).forEach((t) => {
    t.style.height = "auto";
    t.style.height = t.scrollHeight + "px";
  });
}

function iconSvg(inner) {
  return `<svg class="tab-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;
}

// Same open-eye / eye-slash pair used for sheet visibility in Settings.
function eyeToggleSvg(hidden) {
  return hidden
    ? `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a21.6 21.6 0 0 1 5.06-6.06M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 8 11 8a21.6 21.6 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`
    : `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
}

function sheetIcon(sheet) {
  if (sheet.kind === "builtin") return BUILTIN_SHEET_META[sheet.id]?.icon || `<circle cx="12" cy="12" r="9"></circle>`;
  const tpl = SHEET_GALLERY.find((g) => g.key === state.customSheets[sheet.id]?.templateKey);
  return tpl ? tpl.icon : `<circle cx="12" cy="12" r="9"></circle>`;
}

function sheetLabel(sheet) {
  if (sheet.kind === "builtin") return BUILTIN_SHEET_META[sheet.id]?.label || sheet.id;
  return state.customSheets[sheet.id]?.label || "Space";
}

// Home sits fixed, dead center, on the mobile bar. Only the first
// MOBILE_PINNED_COUNT visible sheets render as bottom-bar icons on
// mobile (via CSS hiding anything past that count) — split evenly
// across the two strips flanking Home so it actually looks centered,
// not crowded to one side. No scrolling either way, nothing to swipe
// past. Whatever doesn't fit shows up instead in the top menu, alongside
// Settings and Appearance. On desktop every visible sheet just flows
// straight into the one sidebar list, in original order, since there's
// room for all of them — the left/right split only matters on mobile.
const MOBILE_PINNED_COUNT = 4;

function renderNav() {
  const leftNav = document.getElementById("tabs-nav-left");
  const rightNav = document.getElementById("tabs-nav-right");
  if (!leftNav || !rightNav) return;
  leftNav.innerHTML = "";
  rightNav.innerHTML = "";
  const visible = state.sheets.filter((s) => s.visible);
  const pinnedCount = Math.min(visible.length, MOBILE_PINNED_COUNT);
  const splitAt = Math.ceil(pinnedCount / 2);
  const tabBtn = (s, overflow) =>
    el(`<button class="tab-btn${overflow ? " tab-btn-overflow" : ""}" data-tab="${s.id}">${iconSvg(sheetIcon(s))}<span>${escapeHtml(sheetLabel(s))}</span></button>`);
  visible.forEach((s, i) => {
    const btn = tabBtn(s, i >= MOBILE_PINNED_COUNT);
    (i < splitAt ? leftNav : rightNav).appendChild(btn);
  });
  renderMenuOverflow(visible.slice(MOBILE_PINNED_COUNT));
}

// The sheets that didn't make the cut for the mobile bottom bar — listed
// in the same top menu that already holds Settings/Appearance, right
// above them, with a small "More sheets" label. CSS hides this whole
// section on desktop, where the sidebar already shows everything.
function renderMenuOverflow(overflowSheets) {
  const section = document.getElementById("menu-sheets-section");
  const list = document.getElementById("menu-sheets-list");
  if (!section || !list) return;
  list.innerHTML = "";
  overflowSheets.forEach((s) => {
    const item = el(`
      <button type="button" class="menu-item menu-sheet-item" data-tab="${s.id}">
        ${iconSvg(sheetIcon(s))}
        <div>${escapeHtml(sheetLabel(s))}</div>
      </button>
    `);
    item.addEventListener("click", () => {
      activateTab(s.id);
      document.getElementById("main-menu-dropdown")?.classList.remove("open");
    });
    list.appendChild(item);
  });
  section.classList.toggle("has-items", overflowSheets.length > 0);
}

function rebuildNav() {
  renderNav();
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => activateTab(btn.dataset.tab));
  });
}

function ensureCustomPanels() {
  const main = document.querySelector("main.content");
  const settingsPanel = document.getElementById("panel-settings");
  if (!main) return;
  Object.keys(state.customSheets).forEach((id) => {
    if (!document.getElementById(`panel-${id}`)) {
      const section = document.createElement("section");
      section.id = `panel-${id}`;
      section.className = "panel";
      main.insertBefore(section, settingsPanel);
    }
  });
}

function initTabs() {
  rebuildNav();
  renderAccountAvatar();
  const avatarBtn = document.getElementById("account-avatar-btn");
  if (avatarBtn) avatarBtn.addEventListener("click", () => openAccountSheet());
  const brandBtn = document.getElementById("brand-home-btn");
  if (brandBtn) brandBtn.addEventListener("click", () => activateTab("home"));
  const homeRow = document.getElementById("home-tab-row");
  const homeCircle = document.getElementById("home-tab-circle");
  if (homeRow) homeRow.addEventListener("click", () => activateTab("home"));
  if (homeCircle) homeCircle.addEventListener("click", () => activateTab("home"));
  const validTabs = state.sheets
    .filter((s) => s.visible)
    .map((s) => s.id)
    .concat(["settings", "appearance", "home"]);
  let target = state.activeTab || "home";
  if (!validTabs.includes(target)) target = "home";
  activateTab(target);
}

function renderAll() {
  ensureCustomPanels();
  renderHome();
  renderLists();
  renderBudget();
  renderInvestments();
  renderBible();
  renderSleep();
  renderWellness();
  Object.keys(state.customSheets).forEach((id) => renderCustomSheet(id));
  renderAppearance();
  renderSettings();
}

// ------------------------------------------------------------------
// Settings — reorder / hide / remove sheets, add new ones from the gallery
// ------------------------------------------------------------------
function confirmModal(title, message, confirmLabel, onConfirm) {
  const overlay = el(`
    <div class="modal-overlay">
      <div class="modal-box">
        <h3>${escapeHtml(title)}</h3>
        <p>${escapeHtml(message)}</p>
        <div class="modal-actions">
          <button type="button" class="btn-ghost modal-cancel">Cancel</button>
          <button type="button" class="btn-danger modal-confirm">${escapeHtml(confirmLabel)}</button>
        </div>
      </div>
    </div>
  `);
  overlay.querySelector(".modal-cancel").addEventListener("click", () => overlay.remove());
  overlay.querySelector(".modal-confirm").addEventListener("click", () => {
    overlay.remove();
    onConfirm();
  });
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) overlay.remove();
  });
  document.body.appendChild(overlay);
}

// ------------------------------------------------------------------
// Account — profile sheet behind the top-right avatar. Sign out lives
// only here, deliberately, so it's never one accidental tap away from
// the everyday nav (Settings/Appearance in the hamburger menu are about
// the app's spaces, not the account itself).
// ------------------------------------------------------------------
function accountInitial() {
  const source = currentUserEmail || "";
  return source ? source[0].toUpperCase() : "?";
}

function renderAccountAvatar() {
  const btn = document.getElementById("account-avatar-btn");
  if (btn) btn.textContent = accountInitial();
}

// "You" — the single destination behind the avatar, replacing both the old
// hamburger and the old Account sheet. One icon, one flat list: spaces/app
// content up top (the stuff you'll open most from here), identity/billing
// below, Sign out last. Matches the reference apps Veronika pointed to
// (Etsy's "You" tab, Slack's account sheet) rather than splitting settings
// and account across two separate top-right icons.
function openAccountSheet() {
  const acct = state.account || { plan: "free", planLabel: "Free", isFounder: false, unlimitedSpaces: false };
  const statusPill = acct.isFounder
    ? "Founder account &middot; full access to everything"
    : `${escapeHtml(acct.planLabel || "Free")} plan`;
  const overlay = el(`
    <div class="modal-overlay">
      <div class="modal-box info-modal-box account-modal-box you-page">
        <div class="info-modal-header">
          <h3>You</h3>
          <button type="button" class="icon-btn info-modal-close" aria-label="Close">${closeSvg}</button>
        </div>
        <div class="account-modal-header-row">
          <div class="account-avatar-lg">${accountInitial()}</div>
          <div>
            <div class="account-email">${escapeHtml(currentUserEmail || "")}</div>
            <div class="account-plan-badge${acct.isFounder ? " founder" : ""}">${escapeHtml(acct.planLabel || "Free")}</div>
          </div>
        </div>
        <div class="you-status-pill">${statusPill}</div>

        <button type="button" class="you-list-row" id="you-myspaces-row">
          ${iconSvg('<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18"/>')}
          <span>My Spaces</span>
        </button>
        <button type="button" class="you-list-row" id="you-gallery-row">
          ${iconSvg('<path d="M12 2l3 7h7l-5.5 4.5L18.5 21 12 16.5 5.5 21l2-7.5L2 9h7z"/>')}
          <span>Gallery</span>
        </button>
        <button type="button" class="you-list-row" id="you-pillars-row">
          ${iconSvg('<circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>')}
          <span>Pillar Mapping</span>
        </button>
        <button type="button" class="you-list-row" id="you-appearance-row">
          ${iconSvg('<circle cx="12" cy="12" r="5"></circle><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/>')}
          <span>Appearance</span>
        </button>

        <div class="you-list-divider"></div>

        <button type="button" class="you-list-row" id="account-password-btn">
          ${iconSvg('<path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16z"/>')}
          <span>Email &amp; password</span>
        </button>
        <button type="button" class="you-list-row" id="account-billing-btn">
          ${iconSvg('<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>')}
          <span>Plan &amp; Billing</span>
        </button>

        <div class="you-list-divider"></div>

        <button type="button" class="you-list-row danger" id="account-signout-btn">
          ${iconSvg('<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line>')}
          <span>Sign out</span>
        </button>
      </div>
    </div>
  `);
  const close = () => overlay.remove();
  overlay.querySelector(".info-modal-close").addEventListener("click", close);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });
  overlay.querySelector("#you-myspaces-row").addEventListener("click", () => {
    close();
    settingsSubTab = "mine";
    activateTab("settings");
  });
  overlay.querySelector("#you-gallery-row").addEventListener("click", () => {
    close();
    settingsSubTab = "gallery";
    activateTab("settings");
  });
  overlay.querySelector("#you-pillars-row").addEventListener("click", () => {
    close();
    openPillarMappingModal();
  });
  overlay.querySelector("#you-appearance-row").addEventListener("click", () => {
    close();
    activateTab("appearance");
  });
  overlay.querySelector("#account-password-btn").addEventListener("click", () => {
    close();
    openChangePasswordModal();
  });
  overlay.querySelector("#account-billing-btn").addEventListener("click", () => {
    close();
    openBillingModal();
  });
  const signOutBtn = overlay.querySelector("#account-signout-btn");
  signOutBtn.addEventListener("click", async () => {
    signOutBtn.disabled = true;
    signOutBtn.querySelector("span").textContent = "Signing out…";
    try {
      await sb.auth.signOut();
    } catch (err) {
      console.error("Sign out failed:", err);
    }
    location.reload();
  });
  document.body.appendChild(overlay);
}

// Reached only from Account → "Email & password". Email changes go through
// Supabase's confirmation-email flow, which isn't wired up yet, so for now
// this only handles the password half — real and functional, not a stub.
function openChangePasswordModal() {
  const overlay = el(`
    <div class="modal-overlay">
      <div class="modal-box info-modal-box account-modal-box">
        <div class="info-modal-header">
          <h3>Email &amp; password</h3>
          <button type="button" class="icon-btn info-modal-close" aria-label="Close">${closeSvg}</button>
        </div>
        <div class="account-section" style="border-top:none;padding-top:4px;">
          <div class="account-section-label">Email</div>
          <div class="account-note">${escapeHtml(currentUserEmail || "")}</div>
        </div>
        <div class="account-section">
          <div class="account-section-label">New password</div>
          <input type="password" class="text-input" id="account-new-password" placeholder="At least 8 characters" style="width:100%;margin-bottom:8px;" />
          <input type="password" class="text-input" id="account-confirm-password" placeholder="Confirm new password" style="width:100%;" />
        </div>
        <div class="account-password-status" id="account-password-status" style="font-size:12.5px;min-height:16px;margin:2px 2px 4px;"></div>
        <div class="account-section" style="border-top:none;padding-top:0;">
          <button type="button" class="account-btn" id="account-password-save" style="justify-content:center;background:var(--accent-dark);color:#fff;border-color:var(--accent-dark);">
            <span>Save new password</span>
          </button>
        </div>
      </div>
    </div>
  `);
  const close = () => overlay.remove();
  overlay.querySelector(".info-modal-close").addEventListener("click", close);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });
  const status = overlay.querySelector("#account-password-status");
  const saveBtn = overlay.querySelector("#account-password-save");
  saveBtn.addEventListener("click", async () => {
    const pw = overlay.querySelector("#account-new-password").value;
    const confirm = overlay.querySelector("#account-confirm-password").value;
    status.style.color = "var(--muted)";
    if (pw.length < 8) {
      status.style.color = "#8C3F2B";
      status.textContent = "Password needs to be at least 8 characters.";
      return;
    }
    if (pw !== confirm) {
      status.style.color = "#8C3F2B";
      status.textContent = "Passwords don't match.";
      return;
    }
    saveBtn.disabled = true;
    status.textContent = "Saving…";
    try {
      const { error } = await sb.auth.updateUser({ password: pw });
      if (error) throw error;
      status.style.color = "var(--good)";
      status.textContent = "Password updated.";
      setTimeout(close, 900);
    } catch (err) {
      console.error("Password update failed:", err);
      status.style.color = "#8C3F2B";
      status.textContent = "Couldn't update password — try again.";
      saveBtn.disabled = false;
    }
  });
  document.body.appendChild(overlay);
}

// Reached only from Account → "Plan & Billing". This is the one place
// price, payment method, and plan changes live — a founder account has
// nothing to manage here since access was granted directly, but the shape
// below is what a real subscriber will see once billing is connected.
function openBillingModal() {
  const acct = state.account || { plan: "free", planLabel: "Free", isFounder: false };
  const overlay = el(`
    <div class="modal-overlay">
      <div class="modal-box info-modal-box account-modal-box">
        <div class="info-modal-header">
          <h3>Plan &amp; Billing</h3>
          <button type="button" class="icon-btn info-modal-close" aria-label="Close">${closeSvg}</button>
        </div>
        ${
          acct.isFounder
            ? `<div class="account-section" style="border-top:none;padding-top:4px;">
                <div class="account-section-label">Current plan</div>
                <div class="account-note" style="border-color:var(--accent);background:var(--bg);">
                  <strong style="color:var(--text);">Founder — Full Access</strong><br/>
                  Granted personally — every space, no subscription, nothing to manage here.
                </div>
              </div>`
            : `<div class="account-section" style="border-top:none;padding-top:4px;">
                <div class="account-section-label">Current plan</div>
                <div class="account-note"><strong style="color:var(--text);">${escapeHtml(acct.planLabel || "Free")}</strong></div>
              </div>
              <div class="account-section">
                <button type="button" class="account-btn" disabled>
                  <span>Change plan</span>
                  <span>&rsaquo;</span>
                </button>
              </div>
              <div class="account-section">
                <button type="button" class="account-btn danger" disabled>
                  <span>Cancel subscription</span>
                </button>
              </div>
              <div class="account-note" style="margin-top:2px;">Billing isn't connected yet — these will work once real subscriptions launch.</div>`
        }
      </div>
    </div>
  `);
  const close = () => overlay.remove();
  overlay.querySelector(".info-modal-close").addEventListener("click", close);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });
  document.body.appendChild(overlay);
}

function openPhotoLightbox(src) {
  const overlay = el(`
    <div class="modal-overlay photo-lightbox-overlay">
      <button type="button" class="icon-btn photo-lightbox-close" aria-label="Close">${closeSvg}</button>
      <img class="photo-lightbox-img" src="${src}" alt="" />
    </div>
  `);
  overlay.querySelector(".photo-lightbox-close").addEventListener("click", () => overlay.remove());
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) overlay.remove();
  });
  document.body.appendChild(overlay);
}

// Drag-and-drop reorder in Settings.
let draggedSheetId = null;

function reorderSheet(draggedId, targetId, before) {
  const fromIdx = state.sheets.findIndex((s) => s.id === draggedId);
  if (fromIdx < 0) return;
  const [item] = state.sheets.splice(fromIdx, 1);
  let targetIdx = state.sheets.findIndex((s) => s.id === targetId);
  if (targetIdx < 0) targetIdx = state.sheets.length;
  const insertAt = before ? targetIdx : targetIdx + 1;
  state.sheets.splice(insertAt, 0, item);
  scheduleSave();
  rebuildNav();
  renderSettings();
}

// Drag-and-drop reorder for budget line items — kept within the same
// section, since sections are their own visual groups.
let draggedBudgetItemId = null;

function reorderBudgetItem(draggedId, targetId, before) {
  const draggedIdx = state.budget.findIndex((b) => b.id === draggedId);
  const targetIdx = state.budget.findIndex((b) => b.id === targetId);
  if (draggedIdx < 0 || targetIdx < 0) return;
  if (state.budget[draggedIdx].section !== state.budget[targetIdx].section) return;
  const [item] = state.budget.splice(draggedIdx, 1);
  let newTargetIdx = state.budget.findIndex((b) => b.id === targetId);
  const insertAt = before ? newTargetIdx : newTargetIdx + 1;
  state.budget.splice(insertAt, 0, item);
  scheduleSave();
  renderBudget();
}

// Drag-and-drop reorder for financial goals.
let draggedGoalId = null;

function reorderGoal(draggedId, targetId, before) {
  const ordered = state.goals.slice().sort((a, b) => a.sortOrder - b.sortOrder);
  const fromIdx = ordered.findIndex((g) => g.id === draggedId);
  if (fromIdx < 0) return;
  const [item] = ordered.splice(fromIdx, 1);
  let targetIdx = ordered.findIndex((g) => g.id === targetId);
  if (targetIdx < 0) targetIdx = ordered.length;
  const insertAt = before ? targetIdx : targetIdx + 1;
  ordered.splice(insertAt, 0, item);
  ordered.forEach((g, i) => (g.sortOrder = i));
  scheduleSave();
  renderBudget();
}

function toggleSheetVisible(id) {
  const s = state.sheets.find((x) => x.id === id);
  if (!s) return;
  s.visible = !s.visible;
  scheduleSave();
  rebuildNav();
  renderSettings();
  if (!s.visible && state.activeTab === id) {
    const fallback = state.sheets.find((x) => x.visible);
    activateTab(fallback ? fallback.id : "home");
  }
}

function addSheetFromTemplate(tpl) {
  const id = `sheet_${nextId()}`;
  const isWardrobe = tpl.key === "wardrobe";
  const isQuran = tpl.key === "quran";
  const isBooks = tpl.key === "books";
  const isWorkout = tpl.key === "workout";
  state.customSheets[id] = {
    label: tpl.label,
    templateKey: tpl.key,
    items: isWardrobe
      ? seedWardrobeItems()
      : isQuran
      ? seedQuranItems()
      : isBooks
      ? seedBookItems()
      : isWorkout
      ? []
      : tpl.starterItems.map((text) => ({ id: nextId(), text, done: false })),
    ...(isWardrobe ? { wardrobeSchemaV: 2, openCategories: {}, activeSeason: null } : {}),
    ...(isQuran ? { quranSchemaV: 1, quranSettings: { startDate: todayISO() } } : {}),
    ...(isBooks ? { booksSchemaV: 1, openCategories: {}, activeStatus: "toread" } : {}),
    ...(isWorkout ? seedWorkoutSheetData() : {}),
  };
  state.sheets.push({ id, kind: "custom", visible: true });
  scheduleSave();
  ensureCustomPanels();
  renderCustomSheet(id);
  rebuildNav();
  renderSettings();
}

// Dispatches to the right renderer for a custom sheet — most gallery
// templates are a plain checklist, but Capsule Wardrobe, the Quran
// Reading Plan, and the Book List each have their own richer shape.
function renderCustomSheet(id) {
  const sheet = state.customSheets[id];
  if (sheet && sheet.templateKey === "wardrobe" && sheet.wardrobeSchemaV === 2) {
    renderWardrobeSheet(id);
  } else if (sheet && sheet.templateKey === "quran" && sheet.quranSchemaV === 1) {
    renderQuranSheet(id);
  } else if (sheet && sheet.templateKey === "books" && sheet.booksSchemaV === 1) {
    renderBookSheet(id);
  } else if (sheet && sheet.templateKey === "workout" && sheet.workoutSchemaV === 1) {
    renderWorkoutSheet(id);
  } else {
    renderChecklistSheet(id);
  }
}

// Mirrors the pinned-slot math in rebuildNav()/renderSettings(): the first
// MOBILE_PINNED_COUNT *visible* sheets, in order, are what the mobile bottom
// bar renders — removing one of those would leave a gap in it. A hidden
// sheet never occupies a pinned slot, however early it sits in the list.
function isPinnedSheet(id) {
  let visibleIdx = 0;
  for (const s of state.sheets) {
    if (s.id === id) return s.visible && visibleIdx < MOBILE_PINNED_COUNT;
    if (s.visible) visibleIdx++;
  }
  return false;
}

function removeCustomSheet(id) {
  if (isPinnedSheet(id)) return;
  state.sheets = state.sheets.filter((s) => s.id !== id);
  delete state.customSheets[id];
  const panelEl = document.getElementById(`panel-${id}`);
  if (panelEl) panelEl.remove();
  scheduleSave();
  rebuildNav();
  renderSettings();
  if (state.activeTab === id) {
    const fallback = state.sheets.find((x) => x.visible);
    activateTab(fallback ? fallback.id : "home");
  }
}

// Unlike a gallery sheet (Wardrobe/Books/Quran/...), a built-in sheet isn't
// backed by a template — there's nowhere in the Gallery to add it back from.
// Removing one wipes its underlying data for good, not just its tab.
function removeBuiltinSheet(id) {
  if (isPinnedSheet(id)) return;
  if (id === "todo") {
    state.lists = [];
    state.activeListId = null;
  }
  if (id === "budget") {
    state.budget = [];
    state.goals = [];
  }
  if (id === "investments") state.investmentAccounts = [];
  if (id === "bible") state.bible = [];
  if (id === "wellness") state.wellness = [];
  if (id === "sleep") state.sleepLogs = [];
  // Mark it as deliberately deleted, not just "missing" — otherwise boot()'s
  // own backfill (which re-adds any built-in sheet id it doesn't find, to
  // heal an old/incomplete save) would silently bring it right back on
  // the next reload.
  state.deletedBuiltinSheets ||= [];
  if (!state.deletedBuiltinSheets.includes(id)) state.deletedBuiltinSheets.push(id);
  state.sheets = state.sheets.filter((s) => s.id !== id);
  const panelEl = document.getElementById(`panel-${id}`);
  if (panelEl) panelEl.remove();
  scheduleSave();
  rebuildNav();
  renderSettings();
  if (state.activeTab === id) {
    const fallback = state.sheets.find((x) => x.visible);
    activateTab(fallback ? fallback.id : "home");
  }
}

// ------------------------------------------------------------------
// Appearance — color themes. Type stays the same everywhere; only the
// CSS variables (bg/surface/accent/etc.) swap, defined in index.html.
// ------------------------------------------------------------------
const THEMES = [
  { key: "cream", name: "Warm Cream", swatch: ["#F7F3EC", "#FFFFFF", "#A9804F"] },
  { key: "slate", name: "Slate", swatch: ["#EDEFF2", "#FFFFFF", "#4A6178"] },
  { key: "sage", name: "Sage", swatch: ["#F1F4EE", "#FFFFFF", "#7C9469"] },
  { key: "rose", name: "Dusty Rose", swatch: ["#FAF1EF", "#FFFFFF", "#C08887"] },
  { key: "ocean", name: "Ocean", swatch: ["#EEF3F5", "#FFFFFF", "#2E6E7E"] },
  { key: "dark", name: "Dark Mode", swatch: ["#1B1B1D", "#242426", "#C9A36A"] },
];

function applyTheme() {
  if (state.theme && state.theme !== "cream") {
    document.documentElement.setAttribute("data-app-theme", state.theme);
  } else {
    document.documentElement.removeAttribute("data-app-theme");
  }
}

function renderAppearance() {
  const panel = document.getElementById("panel-appearance");
  if (!panel) return;
  panel.innerHTML = "";
  panel.appendChild(el(`<h2 class="section-title serif">Appearance</h2>`));
  panel.appendChild(el(`<div class="settings-group-desc">Pick a color theme. It changes the whole app instantly — nothing else changes.</div>`));

  const grid = el(`<div class="theme-swatch-grid"></div>`);
  THEMES.forEach((theme) => {
    const isSelected = (state.theme || "cream") === theme.key;
    const card = el(`
      <button type="button" class="theme-swatch-card ${isSelected ? "selected" : ""}" data-theme-key="${theme.key}">
        <div class="theme-swatch-preview">${theme.swatch.map((c) => `<span style="background:${c};"></span>`).join("")}</div>
        <div class="theme-swatch-card-body">
          <div>
            <div class="theme-swatch-name">${escapeHtml(theme.name)}</div>
            ${isSelected ? `<div class="theme-swatch-current-tag">Current</div>` : ""}
          </div>
          <div class="theme-swatch-check">${isSelected ? "✓" : ""}</div>
        </div>
      </button>
    `);
    card.addEventListener("click", () => {
      state.theme = theme.key;
      scheduleSave();
      applyTheme();
      renderAppearance();
    });
    grid.appendChild(card);
  });
  panel.appendChild(grid);
}

let settingsSubTab = "mine"; // "mine" | "gallery" — resets each session, not persisted

function renderSettings() {
  const panel = document.getElementById("panel-settings");
  if (!panel) return;
  panel.innerHTML = "";
  panel.appendChild(el(`<h2 class="section-title serif">Settings</h2>`));

  // "My Sheets" (reorder/hide what you have) and "Gallery" (add something
  // new) are different tasks — a segmented control keeps them on one page
  // reachable from one menu item, without mixing them into one long scroll.
  const segment = el(`
    <div class="settings-segment">
      <button type="button" class="${settingsSubTab === "mine" ? "active" : ""}" data-target="mine">My Spaces</button>
      <button type="button" class="${settingsSubTab === "gallery" ? "active" : ""}" data-target="gallery">Gallery</button>
    </div>
  `);
  segment.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", () => {
      settingsSubTab = btn.dataset.target;
      renderSettings();
    });
  });
  panel.appendChild(segment);

  const minePanel = el(`<div class="settings-subpanel" style="${settingsSubTab === "mine" ? "" : "display:none;"}"></div>`);
  const galleryPanel = el(`<div class="settings-subpanel" style="${settingsSubTab === "gallery" ? "" : "display:none;"}"></div>`);

  minePanel.appendChild(el(`<div class="settings-group-title">Your spaces</div>`));
  minePanel.appendChild(
    el(
      `<div class="settings-group-desc">Drag a space to reorder it, tap the eye to hide it without losing data, or the trash can to remove it for good. Your first ${MOBILE_PINNED_COUNT} visible spaces pin to the bottom bar on mobile, so those don't get a trash can — move a space down past that point to remove it. Spaces you added from the Gallery can be added back anytime; built-in ones can't.</div>`
    )
  );

  const card = el(`<div class="card"></div>`);
  let visibleIdx = 0;
  state.sheets.forEach((s) => {
    const isCustom = s.kind === "custom";
    const label = sheetLabel(s);
    const pinnedSlot = s.visible && visibleIdx < MOBILE_PINNED_COUNT;
    if (s.visible) visibleIdx++;
    const row = el(`
      <div class="sheet-row" draggable="true" data-sheet-id="${s.id}">
        <span class="sheet-drag-handle">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="8" cy="6" r="1.6"></circle><circle cx="8" cy="12" r="1.6"></circle><circle cx="8" cy="18" r="1.6"></circle><circle cx="16" cy="6" r="1.6"></circle><circle cx="16" cy="12" r="1.6"></circle><circle cx="16" cy="18" r="1.6"></circle></svg>
        </span>
        <span class="sheet-row-icon">${iconSvg(sheetIcon(s)).replace('width="20" height="20"', 'width="17" height="17"')}</span>
        <span class="sheet-row-name" style="${s.visible ? "" : "opacity:0.5;"}">${escapeHtml(label)}${
      s.visible ? "" : `<span class="muted-sub">Hidden from sidebar</span>`
    }</span>
        <div class="sheet-row-actions">
          <button type="button" class="icon-btn sheet-toggle ${s.visible ? "" : "active-toggle"}" title="${s.visible ? "Hide from sidebar" : "Show in sidebar"}">
            ${
              s.visible
                ? `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"></path><circle cx="12" cy="12" r="3"></circle></svg>`
                : `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a21.6 21.6 0 0 1 5.06-6.06M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 8 11 8a21.6 21.6 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`
            }
          </button>
          ${
            pinnedSlot
              ? `<span class="icon-btn sheet-remove-lock" title="Pinned to the bottom bar — move it down past position ${MOBILE_PINNED_COUNT} to remove it" style="cursor:default;color:var(--border);">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="10" rx="2"></rect><path d="M8 11V7a4 4 0 0 1 8 0v4"></path></svg>
          </span>`
              : `<button type="button" class="icon-btn danger sheet-remove" title="Remove">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          </button>`
          }
        </div>
      </div>
    `);
    row.querySelector(".sheet-toggle").addEventListener("click", () => toggleSheetVisible(s.id));
    row.querySelector(".sheet-remove")?.addEventListener("click", () => {
      if (isCustom) {
        confirmModal(
          `Remove ${label}?`,
          "It'll disappear from your sidebar. You can add it again anytime from Settings, but its items will be gone for good.",
          "Remove",
          () => removeCustomSheet(s.id)
        );
      } else {
        confirmModal(
          `Remove ${label}?`,
          "This is a built-in space — unlike the gallery ones, there's no template to add it back from. Removing it deletes everything in it for good. If you just want it off your sidebar without losing anything, use the eye icon instead.",
          "Delete for good",
          () => removeBuiltinSheet(s.id)
        );
      }
    });
    row.addEventListener("dragstart", (e) => {
      draggedSheetId = s.id;
      row.classList.add("dragging");
      e.dataTransfer.effectAllowed = "move";
      try {
        e.dataTransfer.setData("text/plain", s.id);
      } catch (err) {
        // Some browsers require this call to not throw even if unused.
      }
    });
    row.addEventListener("dragend", () => {
      draggedSheetId = null;
      card.querySelectorAll(".sheet-row").forEach((r) => r.classList.remove("dragging", "drag-over-top", "drag-over-bottom"));
    });
    row.addEventListener("dragover", (e) => {
      if (!draggedSheetId || draggedSheetId === s.id) return;
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      const rect = row.getBoundingClientRect();
      const before = e.clientY - rect.top < rect.height / 2;
      row.classList.toggle("drag-over-top", before);
      row.classList.toggle("drag-over-bottom", !before);
    });
    row.addEventListener("dragleave", () => {
      row.classList.remove("drag-over-top", "drag-over-bottom");
    });
    row.addEventListener("drop", (e) => {
      e.preventDefault();
      if (!draggedSheetId || draggedSheetId === s.id) return;
      const rect = row.getBoundingClientRect();
      const before = e.clientY - rect.top < rect.height / 2;
      reorderSheet(draggedSheetId, s.id, before);
    });
    card.appendChild(row);
  });
  minePanel.appendChild(card);

  panel.appendChild(minePanel);

  galleryPanel.appendChild(el(`<div class="settings-group-title">Space gallery</div>`));
  galleryPanel.appendChild(el(`<div class="settings-group-desc">A few more spaces, ready to drop in whenever you want them.</div>`));
  const gallery = el(`<div class="sheet-gallery"></div>`);
  SHEET_GALLERY.forEach((tpl) => {
    const alreadyAdded = Object.values(state.customSheets).some((cs) => cs.templateKey === tpl.key);
    const cardEl = el(`
      <div class="sheet-card">
        <span class="sheet-card-icon">${iconSvg(tpl.icon).replace('width="20" height="20"', 'width="18" height="18"')}</span>
        <div class="sheet-card-name">${escapeHtml(tpl.label)}</div>
        <div class="sheet-card-desc">${escapeHtml(tpl.desc)}</div>
        ${
          alreadyAdded
            ? `<span class="sheet-card-added">${checkSvg} Added</span>`
            : `<button type="button" class="btn-ghost small" style="align-self:flex-start;">+ Add</button>`
        }
      </div>
    `);
    if (!alreadyAdded) {
      cardEl.querySelector("button").addEventListener("click", () => addSheetFromTemplate(tpl));
    }
    gallery.appendChild(cardEl);
  });
  galleryPanel.appendChild(gallery);
  panel.appendChild(galleryPanel);

  // Appearance lives on its own panel/tab technically, but belongs to
  // Settings conceptually (it's app-content, not identity) — this row keeps
  // it reachable from here instead of needing its own top-level nav slot.
  const appearanceSection = el(`
    <div class="account-section">
      <div class="account-section-label">Appearance</div>
      <button type="button" class="account-btn" id="settings-appearance-btn">
        <span>Theme<span class="account-btn-sub">${escapeHtml(THEMES.find((t) => t.key === (state.theme || "cream"))?.name || "Cream")}</span></span>
        <span>&rsaquo;</span>
      </button>
    </div>
  `);
  appearanceSection.querySelector("#settings-appearance-btn").addEventListener("click", () => activateTab("appearance"));
  panel.appendChild(appearanceSection);
}

function renderChecklistSheet(id) {
  const panel = document.getElementById(`panel-${id}`);
  const sheet = state.customSheets[id];
  if (!panel || !sheet) return;
  panel.innerHTML = "";
  panel.appendChild(el(`<h2 class="section-title serif">${escapeHtml(sheet.label)}</h2>`));

  const card = el(`<div class="card"></div>`);
  if (!sheet.items.length) card.appendChild(el(`<div class="muted">Nothing here yet.</div>`));
  sheet.items.forEach((item) => {
    const row = el(`
      <div class="checklist-item-row">
        <div class="checkbox ${item.done ? "checked" : ""}">${checkSvg}</div>
        <div class="checklist-item-text"><span class="${item.done ? "strike" : ""}">${escapeHtml(item.text)}</span></div>
        <button class="remove-btn" title="Delete">&times;</button>
      </div>
    `);
    row.querySelector(".checkbox").addEventListener("click", () => {
      item.done = !item.done;
      if (item.done) item.completedDate = todayISO();
      scheduleSave();
      renderChecklistSheet(id);
    });
    row.querySelector(".remove-btn").addEventListener("click", () => {
      sheet.items = sheet.items.filter((x) => x.id !== item.id);
      scheduleSave();
      renderChecklistSheet(id);
    });
    card.appendChild(row);
  });
  panel.appendChild(card);

  const form = el(`
    <form class="add-form">
      <input name="text" placeholder="Add an item" required />
      <button class="btn-primary" type="submit">Add</button>
    </form>
  `);
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    sheet.items.push({ id: nextId(), text: fd.get("text"), done: false });
    scheduleSave();
    renderChecklistSheet(id);
  });
  panel.appendChild(form);
}

// ------------------------------------------------------------------
// Capsule Wardrobe — season pills up top (Staples pinned first, then
// the four seasons ordered starting with whichever one it is right now
// on this device), collapsible category groups underneath, same
// collapse-persistence pattern as the Bible book list.
// ------------------------------------------------------------------
const editSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"></path></svg>`;
const chevronSvg = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>`;
const chevronRightSvg = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 6 15 12 9 18"></polyline></svg>`;
const backArrowSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 6 9 12 15 18"></polyline></svg>`;
const trashSvg = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>`;

// A curated palette for the dot — separate from the free-text Color
// description, so "Gold + Diamonds" or "Same as Blazer" can still get an
// exact, deliberately-chosen dot instead of a guessed fallback. Existing
// items with no swatchKey set yet fall back to a text guess (below).
const WARDROBE_SWATCH_OPTIONS = [
  { key: "black", label: "Black", hex: "#221E1A" },
  { key: "white", label: "White / Off-White", hex: "#F7F5F0" },
  { key: "cream", label: "Cream / Ivory", hex: "#ECE3D2" },
  { key: "camel", label: "Camel / Tan", hex: "#B98A55" },
  { key: "brown", label: "Brown / Chocolate", hex: "#5C4128" },
  { key: "gold", label: "Gold", hex: "#C9A86A" },
  { key: "grey", label: "Grey", hex: "#9A958D" },
  { key: "navy", label: "Navy / Denim", hex: "#2C3A4A" },
  { key: "red", label: "Red / Merlot", hex: "#B3392B" },
  { key: "green", label: "Green / Olive", hex: "#6B7F5A" },
  { key: "pink", label: "Pink / Floral", hex: "#C08887" },
  { key: "neutral", label: "Other / Neutral", hex: "#ADA79A" },
];
function wardrobeSwatchHex(key) {
  return (WARDROBE_SWATCH_OPTIONS.find((o) => o.key === key) || WARDROBE_SWATCH_OPTIONS.find((o) => o.key === "neutral")).hex;
}
// Best-guess starting point for the dropdown/dot when an item has no
// explicit swatchKey saved yet (every seeded item starts this way).
function guessSwatchKey(colorStr) {
  const s = (colorStr || "").toLowerCase();
  if (s.includes("black")) return "black";
  if (s.includes("white") || s.includes("ivory")) return "white";
  if (s.includes("cream")) return "cream";
  if (s.includes("camel") || s.includes("tan")) return "camel";
  if (s.includes("chocolate") || s.includes("brown")) return "brown";
  if (s.includes("gold")) return "gold";
  if (s.includes("grey") || s.includes("gray")) return "grey";
  if (s.includes("navy") || s.includes("denim")) return "navy";
  if (s.includes("red") || s.includes("merlot")) return "red";
  if (s.includes("green") || s.includes("olive")) return "green";
  if (s.includes("floral") || s.includes("pink")) return "pink";
  return "neutral";
}
function getItemSwatchHex(item) {
  return wardrobeSwatchHex(item.swatchKey || guessSwatchKey(item.color));
}
const linkSvg = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.07 0l2.83-2.83a5 5 0 0 0-7.07-7.07l-1.5 1.5"></path><path d="M14 11a5 5 0 0 0-7.07 0L4.1 13.83a5 5 0 0 0 7.07 7.07l1.5-1.5"></path></svg>`;
const photoPlaceholderSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><path d="M21 15l-5-5L5 21"></path></svg>`;
const WARDROBE_SEASON_OPTIONS = ["All", "Spring", "Summer", "Fall", "Winter", "Spring/Summer", "Fall/Winter", "Spring/Fall"];
const WARDROBE_PRIORITY_OPTIONS = ["High", "Medium", "Low", "Fixed"];
const WARDROBE_PURCHASE_TYPE_OPTIONS = ["Core", "Support", "Bonus", "Owned", "Fixed"];

function renderWardrobeSheet(id) {
  const panel = document.getElementById(`panel-${id}`);
  const sheet = state.customSheets[id];
  if (!panel || !sheet) return;
  panel.innerHTML = "";
  panel.appendChild(el(`<h2 class="section-title serif">${escapeHtml(sheet.label)}</h2>`));

  const pillOrder = wardrobeSeasonPillOrder();
  // Default to the current season, not Staples — that's the whole point
  // of reordering the pills by what's relevant right now.
  if (!sheet.activeSeason) sheet.activeSeason = getCurrentSeasonKey();

  const pillsRow = el(`<div class="view-toggle-row"><div class="view-toggle"></div></div>`);
  const pillsWrap = pillsRow.querySelector(".view-toggle");
  pillOrder.forEach((p) => {
    const btn = el(`<button type="button" class="${sheet.activeSeason === p.key ? "active" : ""}">${escapeHtml(p.label)}</button>`);
    btn.addEventListener("click", () => {
      sheet.activeSeason = p.key;
      scheduleSave();
      renderWardrobeSheet(id);
    });
    pillsWrap.appendChild(btn);
  });
  panel.appendChild(pillsRow);

  const items = sheet.items.filter((it) => (it.seasonTags || []).includes(sheet.activeSeason));
  const categories = [];
  const byCategory = new Map();
  items.forEach((it) => {
    if (!byCategory.has(it.category)) {
      byCategory.set(it.category, []);
      categories.push(it.category);
    }
    byCategory.get(it.category).push(it);
  });

  if (!items.length) {
    panel.appendChild(el(`<div class="muted" style="padding:10px 0;">Nothing tagged for this yet — add an item below.</div>`));
  }

  categories.forEach((cat) => {
    const catItems = byCategory.get(cat);
    const doneCount = catItems.filter((i) => i.purchased).length;
    const remembered = sheet.openCategories[cat];
    const shouldOpen = remembered !== undefined ? remembered : true;
    const details = el(`
      <details class="wardrobe-group" ${shouldOpen ? "open" : ""}>
        <summary class="wardrobe-summary">
          <span class="wardrobe-cat-title">${escapeHtml(cat)}</span>
          <span class="muted">${doneCount}/${catItems.length}</span>
        </summary>
        <div class="wardrobe-items"></div>
      </details>
    `);
    details.addEventListener("toggle", () => {
      sheet.openCategories[cat] = details.open;
      scheduleSave();
    });
    const itemsWrap = details.querySelector(".wardrobe-items");
    catItems.forEach((item) => {
      const priceText =
        item.purchased && item.paid != null
          ? `$${Number(item.paid).toFixed(2)}`
          : item.min || item.max
          ? `$${item.min}&ndash;${item.max}`
          : "";
      const thumb = item.photo
        ? `<img class="wi-thumb" src="${item.photo}" alt="" />`
        : `<span class="wi-swatch" style="background:${getItemSwatchHex(item)};" title="${escapeHtml(item.color)}"></span>`;
      const linkIcon = item.link
        ? `<a class="wi-link-icon" href="${escapeHtml(item.link)}" target="_blank" rel="noopener noreferrer" title="Open link">${linkSvg}</a>`
        : "";
      const rangeText = item.min || item.max ? `$${item.min}–${item.max} CAD` : "";
      const paidText = item.purchased && item.paid != null ? `$${Number(item.paid).toFixed(2)} CAD paid` : "";
      const seasonLabel = escapeHtml(item.season || "All");
      const zoomSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>`;
      const detailPhoto = item.photo
        ? `<button type="button" class="wi-detail-photo-btn"><img class="wi-detail-photo" src="${item.photo}" alt="" /><span class="wi-detail-photo-zoom">${zoomSvg}</span></button>`
        : `<div class="wi-detail-photo wi-detail-photo-empty" style="background:${getItemSwatchHex(item)}22;">${photoPlaceholderSvg}</div>`;
      const detailFacts = [
        ["Category", item.category],
        ["Type", item.itemType],
        ["Color", item.color],
        ["Season", seasonLabel],
        ["Priority", item.priority],
        ["Purchase type", item.purchaseType],
        ["Budget", rangeText],
      ].filter(([label, val]) => label && val);
      const factsHtml = detailFacts
        .map(([label, val]) => `<div class="wi-detail-fact"><span class="wi-detail-fact-label">${escapeHtml(label)}</span><span class="wi-detail-fact-val">${escapeHtml(String(val))}</span></div>`)
        .join("");
      const item2 = el(`
        <details class="wardrobe-item">
          <summary class="wardrobe-row">
            <div class="checkbox ${item.purchased ? "checked" : ""}">${checkSvg}</div>
            ${thumb}
            <div class="wi-body">
              <div class="wi-name ${item.purchased ? "owned" : ""}">${escapeHtml(item.name)}${linkIcon}</div>
              <div class="wi-sub">${escapeHtml([item.itemType, item.color].filter(Boolean).join(" · "))}</div>
            </div>
            <div class="wi-price">${priceText}</div>
            <span class="wardrobe-chevron">${chevronSvg}</span>
          </summary>
          <div class="wardrobe-item-detail">
            ${detailPhoto}
            <div class="wi-detail-facts">
              ${factsHtml}
              ${paidText ? `<div class="wi-detail-fact"><span class="wi-detail-fact-label">Paid</span><span class="wi-detail-fact-val">${escapeHtml(paidText)}</span></div>` : ""}
            </div>
            ${item.notes ? `<div class="wi-detail-notes">${escapeHtml(item.notes)}</div>` : ""}
            <div class="wi-detail-actions">
              ${item.link ? `<a class="btn-ghost wi-detail-link" href="${escapeHtml(item.link)}" target="_blank" rel="noopener noreferrer">${linkSvg} View product</a>` : ""}
              <button type="button" class="btn-ghost wi-detail-edit">${editSvg} Edit item</button>
            </div>
          </div>
        </details>
      `);
      // Anything inside <summary> that shouldn't toggle the accordion
      // (checkbox, the link icon which is its own <a>) needs to stop the
      // click from bubbling up to the native <summary> toggle.
      item2.querySelector(".checkbox").addEventListener("click", (e) => {
        e.stopPropagation();
        e.preventDefault();
        item.purchased = !item.purchased;
        scheduleSave();
        renderWardrobeSheet(id);
      });
      item2.querySelector(".wi-link-icon")?.addEventListener("click", (e) => e.stopPropagation());
      item2.querySelector(".wi-detail-edit").addEventListener("click", () => openWardrobeItemModal(id, item.id));
      item2.querySelector(".wi-detail-photo-btn")?.addEventListener("click", () => openPhotoLightbox(item.photo));
      itemsWrap.appendChild(item2);
    });
    panel.appendChild(details);
  });

  const addBtn = el(`<button type="button" class="btn-ghost" style="margin-top:16px;">+ Add item</button>`);
  addBtn.addEventListener("click", () => openWardrobeItemModal(id, null));
  panel.appendChild(addBtn);
}

function openWardrobeItemModal(sheetId, itemId) {
  const sheet = state.customSheets[sheetId];
  const isNew = !itemId;
  const item = isNew
    ? { category: "", name: "", itemType: "", color: "", season: "All", priority: "Medium", purchaseType: "Core", min: 0, max: 0, purchased: false, paid: null, notes: "", link: "", photo: null }
    : sheet.items.find((i) => i.id === itemId);
  if (!item) return;

  const overlay = el(`
    <div class="modal-overlay">
      <div class="modal-box wardrobe-modal-box">
        <div class="info-modal-header">
          <h3>${isNew ? "Add item" : "Edit item"}</h3>
          <button type="button" class="icon-btn info-modal-close" aria-label="Close">${closeSvg}</button>
        </div>
        <form class="wardrobe-item-form">
          <label class="muted" style="font-size:11px;">Name</label>
          <input name="name" required value="${escapeHtml(item.name)}" />
          <label class="muted" style="font-size:11px;">Category</label>
          <input name="category" required value="${escapeHtml(item.category)}" list="wardrobe-category-list-${sheetId}" />
          <div class="wardrobe-form-row">
            <div><label class="muted" style="font-size:11px;">Type</label><input name="itemType" value="${escapeHtml(item.itemType)}" /></div>
            <div><label class="muted" style="font-size:11px;">Color (description)</label><input name="color" value="${escapeHtml(item.color)}" /></div>
          </div>
          <label class="muted" style="font-size:11px;">Swatch color (sets the dot)</label>
          <div class="swatch-select-row">
            <span class="swatch-preview-dot" style="background:${wardrobeSwatchHex(item.swatchKey || guessSwatchKey(item.color))};"></span>
            <select name="swatchColor" class="swatch-select">${WARDROBE_SWATCH_OPTIONS.map(
              (o) => `<option value="${o.key}" ${(item.swatchKey || guessSwatchKey(item.color)) === o.key ? "selected" : ""}>${o.label}</option>`
            ).join("")}</select>
          </div>
          <div class="wardrobe-form-row">
            <div><label class="muted" style="font-size:11px;">Season</label><select name="season">${WARDROBE_SEASON_OPTIONS.map(
              (s) => `<option value="${s}" ${item.season === s ? "selected" : ""}>${s}</option>`
            ).join("")}</select></div>
            <div><label class="muted" style="font-size:11px;">Priority</label><select name="priority">${WARDROBE_PRIORITY_OPTIONS.map(
              (p) => `<option value="${p}" ${item.priority === p ? "selected" : ""}>${p}</option>`
            ).join("")}</select></div>
          </div>
          <div class="wardrobe-form-row">
            <div><label class="muted" style="font-size:11px;">Purchase type</label><select name="purchaseType">${WARDROBE_PURCHASE_TYPE_OPTIONS.map(
              (p) => `<option value="${p}" ${item.purchaseType === p ? "selected" : ""}>${p}</option>`
            ).join("")}</select></div>
            <div><label class="muted" style="font-size:11px;">Purchased?</label><select name="purchased"><option value="false" ${
              !item.purchased ? "selected" : ""
            }>Not yet</option><option value="true" ${item.purchased ? "selected" : ""}>Purchased</option></select></div>
          </div>
          <div class="wardrobe-form-row">
            <div><label class="muted" style="font-size:11px;">Min $CAD</label><input name="min" type="number" min="0" value="${item.min ?? 0}" /></div>
            <div><label class="muted" style="font-size:11px;">Max $CAD</label><input name="max" type="number" min="0" value="${item.max ?? 0}" /></div>
          </div>
          <label class="muted" style="font-size:11px;">Paid $CAD (if purchased)</label>
          <input name="paid" type="number" min="0" step="0.01" value="${item.paid ?? ""}" />
          <label class="muted" style="font-size:11px;">Notes</label>
          <textarea name="notes" rows="2">${escapeHtml(item.notes || "")}</textarea>
          <label class="muted" style="font-size:11px;">Link</label>
          <input name="link" type="url" placeholder="https://…" value="${escapeHtml(item.link || "")}" />
          <label class="muted" style="font-size:11px;">Photo</label>
          <div class="photo-upload-row">
            <div class="photo-upload-preview">${item.photo ? `<img src="${item.photo}" alt="" />` : photoPlaceholderSvg}</div>
            <input type="file" accept="image/*" class="wardrobe-photo-input" style="display:none;" />
            <button type="button" class="btn-ghost wardrobe-photo-btn">${item.photo ? "Change Photo" : "Choose Photo"}</button>
            ${item.photo ? `<button type="button" class="icon-btn danger wardrobe-photo-remove" title="Remove photo">${closeSvg}</button>` : ""}
          </div>
          <div class="modal-actions" style="margin-top:14px;justify-content:space-between;">
            <div style="display:flex;gap:8px;">
              ${isNew ? "" : `<button type="button" class="btn-ghost danger wardrobe-delete-btn">Delete</button>`}
              ${isNew ? "" : `<button type="button" class="btn-ghost wardrobe-duplicate-btn">Duplicate</button>`}
            </div>
            <button type="submit" class="btn-primary">${isNew ? "Add" : "Save"}</button>
          </div>
        </form>
      </div>
    </div>
  `);

  let pendingPhoto = item.photo || null;
  const photoInput = overlay.querySelector(".wardrobe-photo-input");
  const photoPreview = overlay.querySelector(".photo-upload-preview");
  overlay.querySelector(".wardrobe-photo-btn").addEventListener("click", () => photoInput.click());
  photoInput.addEventListener("change", () => {
    const file = photoInput.files[0];
    if (!file) return;
    photoPreview.innerHTML = `<span class="muted" style="font-size:11px;">Resizing…</span>`;
    resizeImageToDataUrl(file)
      .then((dataUrl) => {
        pendingPhoto = dataUrl;
        photoPreview.innerHTML = `<img src="${pendingPhoto}" alt="" />`;
      })
      .catch(() => {
        photoPreview.innerHTML = item.photo ? `<img src="${item.photo}" alt="" />` : photoPlaceholderSvg;
      });
  });
  overlay.querySelector(".wardrobe-photo-remove")?.addEventListener("click", () => {
    pendingPhoto = null;
    photoPreview.innerHTML = photoPlaceholderSvg;
    overlay.querySelector(".wardrobe-photo-remove")?.remove();
  });

  const swatchPreview = overlay.querySelector(".swatch-preview-dot");
  overlay.querySelector(".swatch-select").addEventListener("change", (e) => {
    swatchPreview.style.background = wardrobeSwatchHex(e.target.value);
  });

  const datalist = el(`<datalist id="wardrobe-category-list-${sheetId}"></datalist>`);
  [...new Set(sheet.items.map((i) => i.category))].forEach((c) => datalist.appendChild(el(`<option value="${escapeHtml(c)}"></option>`)));
  overlay.querySelector(".modal-box").appendChild(datalist);

  const close = () => overlay.remove();
  overlay.querySelector(".info-modal-close").addEventListener("click", close);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });

  overlay.querySelector("form").addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const updated = {
      name: fd.get("name").trim(),
      category: fd.get("category").trim(),
      itemType: fd.get("itemType").trim(),
      color: fd.get("color").trim(),
      swatchKey: fd.get("swatchColor"),
      season: fd.get("season"),
      priority: fd.get("priority"),
      purchaseType: fd.get("purchaseType"),
      purchased: fd.get("purchased") === "true",
      min: Number(fd.get("min")) || 0,
      max: Number(fd.get("max")) || 0,
      paid: fd.get("paid") ? Number(fd.get("paid")) : null,
      notes: fd.get("notes").trim(),
      link: fd.get("link").trim(),
      photo: pendingPhoto,
    };
    updated.seasonTags = parseSeasonTags(updated.season);
    if (isNew) {
      sheet.items.push({ id: nextId(), ...updated });
    } else {
      Object.assign(item, updated);
    }
    scheduleSave();
    close();
    renderWardrobeSheet(sheetId);
  });

  if (!isNew) {
    overlay.querySelector(".wardrobe-delete-btn").addEventListener("click", () => {
      close();
      confirmModal(`Remove ${item.name}?`, "It'll be gone from your capsule wardrobe list for good.", "Remove", () => {
        sheet.items = sheet.items.filter((i) => i.id !== itemId);
        scheduleSave();
        renderWardrobeSheet(sheetId);
      });
    });
    // Duplicate — for splitting a multi-color line ("Sandals, Black or
    // Tan") into two single-color items. Copies everything, then reopens
    // the editor on the new copy so she can change color/swatch right away.
    overlay.querySelector(".wardrobe-duplicate-btn").addEventListener("click", () => {
      const { id: _oldId, ...rest } = item;
      const copy = { id: nextId(), ...rest };
      sheet.items.push(copy);
      scheduleSave();
      close();
      renderWardrobeSheet(sheetId);
      openWardrobeItemModal(sheetId, copy.id);
    });
  }

  document.body.appendChild(overlay);
}

// ------------------------------------------------------------------
// Quran Reading Plan — mirrors the Bible sheet's pace-card + progress
// design exactly (per her request), but as a flat checklist since the
// 31 segments already span multiple surahs each and don't group into
// anything smaller the way Bible chapters group into books.
// ------------------------------------------------------------------
function renderQuranPace(panel, sheet, doneCount, total) {
  const settings = sheet.quranSettings;
  const today = new Date();
  const startDate = new Date(settings.startDate + "T00:00:00");
  const daysElapsed = Math.max(1, daysBetween(startDate, today) + 1);
  const pace = doneCount / daysElapsed;
  const remaining = total - doneCount;
  const fmt = (d) => d.toLocaleDateString("en-CA", { year: "numeric", month: "short", day: "numeric" });

  let projectedEnd = null;
  if (remaining > 0 && pace > 0) {
    const daysToFinish = Math.ceil(remaining / pace);
    projectedEnd = new Date(today.getTime() + daysToFinish * 86400000);
  }

  const pct = total ? Math.round((doneCount / total) * 100) : 0;

  const card = el(`
    <div class="card bible-pace-card">
      <div class="bible-pace-stats">
        <div class="bible-pace-stat">
          <label class="muted">Start date</label>
          <input type="date" class="quran-start-date" value="${settings.startDate}" />
        </div>
        <div class="bible-pace-stat">
          <label class="muted">Projected finish</label>
          <div class="bible-pace-stat-value">${remaining <= 0 ? "Finished!" : projectedEnd ? fmt(projectedEnd) : "—"}</div>
        </div>
      </div>
      <div class="bible-pace-track" title="${doneCount} of ${total} readings (${pct}%)">
        <div class="bible-pace-track-fill" style="width:${pct}%;"></div>
      </div>
    </div>
  `);
  card.querySelector(".quran-start-date").addEventListener("change", (e) => {
    if (e.target.value) {
      settings.startDate = e.target.value;
      scheduleSave();
      renderQuranSheet(sheet.__id);
    }
  });
  panel.appendChild(card);
}

function renderQuranSheet(id) {
  const panel = document.getElementById(`panel-${id}`);
  const sheet = state.customSheets[id];
  if (!panel || !sheet) return;
  sheet.__id = id; // so the pace card's date-change handler can re-render without threading id through
  const total = sheet.items.length;
  const doneCount = sheet.items.filter((r) => r.done).length;

  panel.innerHTML = "";
  panel.appendChild(el(`<h2 class="section-title serif">${escapeHtml(sheet.label)}</h2>`));
  panel.appendChild(el(`
    <div class="top-summary">
      <div>
        <div class="muted">Overall progress</div>
        <div class="value serif">${total ? Math.round((doneCount / total) * 100) : 0}%</div>
      </div>
      <div class="muted">${doneCount} of ${total} readings</div>
    </div>
  `));
  renderQuranPace(panel, sheet, doneCount, total);

  const list = el(`<div class="quran-list"></div>`);
  sheet.items.forEach((item) => {
    const row = el(`
      <div class="quran-row">
        <div class="checkbox ${item.done ? "checked" : ""}">${checkSvg}</div>
        <div class="quran-text ${item.done ? "done" : ""}">${escapeHtml(item.reading)}</div>
      </div>
    `);
    row.querySelector(".checkbox").addEventListener("click", () => {
      item.done = !item.done;
      if (item.done) item.completedDate = todayISO();
      scheduleSave();
      renderQuranSheet(id);
    });
    list.appendChild(row);
  });
  panel.appendChild(list);
}

// ------------------------------------------------------------------
// Book List — grouped by category (collapsible, like the wardrobe),
// with a To Read / Read / All filter, and each book expandable to show
// format, notes, and a link — with Online rating and My rating kept
// clearly distinct, since one exists for every book and the other only
// once she's actually read it.
// ------------------------------------------------------------------
function starsFor(n) {
  return n ? "⭐️".repeat(n) : "";
}

function renderBookSheet(id) {
  const panel = document.getElementById(`panel-${id}`);
  const sheet = state.customSheets[id];
  if (!panel || !sheet) return;
  panel.innerHTML = "";
  panel.appendChild(el(`<h2 class="section-title serif">${escapeHtml(sheet.label)}</h2>`));

  const total = sheet.items.length;
  const readCount = sheet.items.filter((b) => b.read).length;
  const summaryRow = el(`
    <div class="book-summary-strip">
      <div class="book-summary-chip"><div class="num">${total}</div><div class="lbl">Total books</div></div>
      <div class="book-summary-chip"><div class="num">${readCount}</div><div class="lbl">Read</div></div>
      <div class="book-summary-chip"><div class="num">${total - readCount}</div><div class="lbl">To read</div></div>
    </div>
  `);
  panel.appendChild(summaryRow);

  const filterRow = el(`<div class="view-toggle-row"><div class="view-toggle"></div></div>`);
  const filterWrap = filterRow.querySelector(".view-toggle");
  [
    ["toread", "To Read"],
    ["read", "Read"],
    ["all", "All"],
  ].forEach(([key, label]) => {
    const btn = el(`<button type="button" class="${sheet.activeStatus === key ? "active" : ""}">${label}</button>`);
    btn.addEventListener("click", () => {
      sheet.activeStatus = key;
      scheduleSave();
      renderBookSheet(id);
    });
    filterWrap.appendChild(btn);
  });
  panel.appendChild(filterRow);

  const items = sheet.items.filter((b) => {
    if (sheet.activeStatus === "read") return b.read;
    if (sheet.activeStatus === "toread") return !b.read;
    return true;
  });

  const categories = [];
  const byCategory = new Map();
  items.forEach((b) => {
    if (!byCategory.has(b.category)) {
      byCategory.set(b.category, []);
      categories.push(b.category);
    }
    byCategory.get(b.category).push(b);
  });

  if (!items.length) {
    panel.appendChild(el(`<div class="muted" style="padding:10px 0;">Nothing here yet — add a book below.</div>`));
  }

  categories.forEach((cat) => {
    const catItems = byCategory.get(cat);
    const doneCount = catItems.filter((b) => b.read).length;
    const remembered = sheet.openCategories[cat];
    const shouldOpen = remembered !== undefined ? remembered : true;
    const group = el(`
      <details class="wardrobe-group" ${shouldOpen ? "open" : ""}>
        <summary class="wardrobe-summary">
          <span class="wardrobe-cat-title">${escapeHtml(cat)}</span>
          <span class="muted">${doneCount}/${catItems.length}</span>
        </summary>
        <div class="wardrobe-items"></div>
      </details>
    `);
    group.addEventListener("toggle", () => {
      sheet.openCategories[cat] = group.open;
      scheduleSave();
    });
    const itemsWrap = group.querySelector(".wardrobe-items");
    catItems.forEach((book) => {
      const badge = book.read && book.myRating
        ? `<div class="wi-price bk-rating-badge">Mine<br><span class="stars">${starsFor(book.myRating)}</span></div>`
        : book.onlineRating
        ? `<div class="wi-price bk-rating-badge">Online<br><span class="stars">${starsFor(book.onlineRating)}</span></div>`
        : `<div class="wi-price"></div>`;
      const linkIcon = book.link
        ? `<a class="wi-link-icon" href="${escapeHtml(book.link)}" target="_blank" rel="noopener noreferrer" title="Open link">${linkSvg}</a>`
        : "";
      const facts = [
        ["Format", book.format],
        ["Online rating", starsFor(book.onlineRating)],
        ["My rating", book.read ? starsFor(book.myRating) : ""],
      ].filter(([, v]) => v);
      const factsHtml = facts
        .map(([label, val]) => `<div class="wi-detail-fact"><span class="wi-detail-fact-label">${escapeHtml(label)}</span><span class="wi-detail-fact-val">${escapeHtml(val)}</span></div>`)
        .join("");
      const item = el(`
        <details class="wardrobe-item">
          <summary class="wardrobe-row">
            <div class="checkbox ${book.read ? "checked" : ""}">${checkSvg}</div>
            <div class="wi-body">
              <div class="wi-name ${book.read ? "owned" : ""}">${escapeHtml(book.title)}${linkIcon}</div>
              <div class="wi-sub">${escapeHtml(book.author)}</div>
            </div>
            ${badge}
            <span class="wardrobe-chevron">${chevronSvg}</span>
          </summary>
          <div class="wardrobe-item-detail">
            <div class="wi-detail-facts">${factsHtml}</div>
            ${book.notes ? `<div class="wi-detail-notes">${escapeHtml(book.notes)}</div>` : ""}
            <div class="wi-detail-actions">
              ${book.link ? `<a class="btn-ghost wi-detail-link" href="${escapeHtml(book.link)}" target="_blank" rel="noopener noreferrer">${linkSvg} Open link</a>` : ""}
              <button type="button" class="btn-ghost wi-detail-edit">${editSvg} Edit</button>
            </div>
          </div>
        </details>
      `);
      item.querySelector(".checkbox").addEventListener("click", (e) => {
        e.stopPropagation();
        e.preventDefault();
        book.read = !book.read;
        scheduleSave();
        renderBookSheet(id);
      });
      item.querySelector(".wi-link-icon")?.addEventListener("click", (e) => e.stopPropagation());
      item.querySelector(".wi-detail-edit").addEventListener("click", () => openBookItemModal(id, book.id));
      itemsWrap.appendChild(item);
    });
    panel.appendChild(group);
  });

  const addBtn = el(`<button type="button" class="btn-ghost" style="margin-top:16px;">+ Add book</button>`);
  addBtn.addEventListener("click", () => openBookItemModal(id, null));
  panel.appendChild(addBtn);
}

const BOOK_FORMAT_OPTIONS = ["read", "listen", "listen & read", "listen or read"];
const BOOK_RATING_OPTIONS = [
  ["", "—"],
  ["1", "⭐️"],
  ["2", "⭐️⭐️"],
  ["3", "⭐️⭐️⭐️"],
  ["4", "⭐️⭐️⭐️⭐️"],
  ["5", "⭐️⭐️⭐️⭐️⭐️"],
];

function openBookItemModal(sheetId, itemId) {
  const sheet = state.customSheets[sheetId];
  const isNew = !itemId;
  const item = isNew
    ? { title: "", author: "", category: "", format: "listen or read", link: "", read: false, onlineRating: null, myRating: null, notes: "" }
    : sheet.items.find((b) => b.id === itemId);
  if (!item) return;

  const existingCategories = [...new Set(sheet.items.map((b) => b.category).filter(Boolean))].sort();

  const overlay = el(`
    <div class="modal-overlay">
      <div class="modal-box wardrobe-modal-box">
        <div class="info-modal-header">
          <h3>${isNew ? "Add book" : "Edit book"}</h3>
          <button type="button" class="icon-btn info-modal-close" aria-label="Close">${closeSvg}</button>
        </div>
        <div class="wardrobe-item-form">
          <label class="muted">Title</label>
          <input type="text" class="bk-f-title" value="${escapeHtml(item.title)}" />

          <label class="muted">Author</label>
          <input type="text" class="bk-f-author" value="${escapeHtml(item.author)}" />

          <label class="muted">Category</label>
          <input type="text" class="bk-f-category" value="${escapeHtml(item.category)}" list="bk-category-list" />
          <datalist id="bk-category-list">${existingCategories.map((c) => `<option value="${escapeHtml(c)}"></option>`).join("")}</datalist>

          <div class="wardrobe-form-row">
            <div>
              <label class="muted">Format</label>
              <select class="bk-f-format">${BOOK_FORMAT_OPTIONS.map((f) => `<option value="${f}" ${item.format === f ? "selected" : ""}>${f}</option>`).join("")}</select>
            </div>
            <div>
              <label class="muted">Status</label>
              <select class="bk-f-read">
                <option value="0" ${!item.read ? "selected" : ""}>To Read</option>
                <option value="1" ${item.read ? "selected" : ""}>Read</option>
              </select>
            </div>
          </div>

          <div class="wardrobe-form-row">
            <div>
              <label class="muted">Online rating</label>
              <select class="bk-f-online-rating">${BOOK_RATING_OPTIONS.map(([v, lbl]) => `<option value="${v}" ${String(item.onlineRating || "") === v ? "selected" : ""}>${lbl}</option>`).join("")}</select>
            </div>
            <div>
              <label class="muted">My rating</label>
              <select class="bk-f-my-rating">${BOOK_RATING_OPTIONS.map(([v, lbl]) => `<option value="${v}" ${String(item.myRating || "") === v ? "selected" : ""}>${lbl}</option>`).join("")}</select>
            </div>
          </div>

          <label class="muted">Notes</label>
          <textarea class="bk-f-notes" rows="3">${escapeHtml(item.notes)}</textarea>

          <label class="muted">Link</label>
          <input type="url" class="bk-f-link" value="${escapeHtml(item.link)}" placeholder="https://…" />
        </div>
        <div class="modal-actions" style="justify-content:space-between;">
          <div>${isNew ? "" : `<button type="button" class="btn-ghost danger bk-delete">Delete</button>`}</div>
          <button type="button" class="btn-primary bk-save">${isNew ? "Add" : "Save"}</button>
        </div>
      </div>
    </div>
  `);

  overlay.querySelector(".info-modal-close").addEventListener("click", () => overlay.remove());
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) overlay.remove();
  });

  overlay.querySelector(".bk-save").addEventListener("click", () => {
    const updated = {
      title: overlay.querySelector(".bk-f-title").value.trim(),
      author: overlay.querySelector(".bk-f-author").value.trim(),
      category: overlay.querySelector(".bk-f-category").value.trim(),
      format: overlay.querySelector(".bk-f-format").value,
      read: overlay.querySelector(".bk-f-read").value === "1",
      onlineRating: overlay.querySelector(".bk-f-online-rating").value ? Number(overlay.querySelector(".bk-f-online-rating").value) : null,
      myRating: overlay.querySelector(".bk-f-my-rating").value ? Number(overlay.querySelector(".bk-f-my-rating").value) : null,
      notes: overlay.querySelector(".bk-f-notes").value.trim(),
      link: overlay.querySelector(".bk-f-link").value.trim(),
    };
    if (!updated.title) return;
    if (isNew) {
      sheet.items.push({ id: nextId(), ...updated });
    } else {
      Object.assign(item, updated);
    }
    scheduleSave();
    overlay.remove();
    renderBookSheet(sheetId);
  });

  const deleteBtn = overlay.querySelector(".bk-delete");
  if (deleteBtn) {
    deleteBtn.addEventListener("click", () => {
      confirmModal("Delete book?", `Remove "${item.title}" from your book list?`, "Delete", () => {
        sheet.items = sheet.items.filter((b) => b.id !== item.id);
        scheduleSave();
        overlay.remove();
        renderBookSheet(sheetId);
      });
    });
  }

  document.body.appendChild(overlay);
}

// ------------------------------------------------------------------
// Workout Log — weekly, grouped by day, each exercise carrying its own
// rep range. "+ New week" spins off a fresh week seeded from the
// currently-open one: last week's Actual becomes this week's Previous,
// and (when the exercise allows it) a new Target gets suggested from
// how she did against her rep range — see suggestedWorkoutTarget().
// ------------------------------------------------------------------
const WORKOUT_SEED_DAYS = [
  {
    label: "Day 1",
    exercises: [
      {
        code: "A1",
        name: "Squat",
        muscles: "Quads / Glutes / Core",
        repMin: 8,
        repMax: 10,
        perSide: false,
        direction: "up",
        autoSuggest: true,
        notes: "Add your own notes here, like form cues or how it felt.",
        sets: [
          { setType: "Warm Up", prev: "", target: "", actual: "" },
          { setType: "Working Set", prev: "", target: "", actual: "" },
          { setType: "Working Set", prev: "", target: "", actual: "" },
        ],
      },
      {
        code: "A2",
        name: "Push-Up",
        muscles: "Chest / Shoulders / Triceps",
        repMin: 8,
        repMax: 12,
        perSide: false,
        direction: "up",
        autoSuggest: false,
        notes: "Bodyweight to start — add weight later if you want.",
        sets: [
          { setType: "Set 1", prev: "", target: "", actual: "" },
          { setType: "Set 2", prev: "", target: "", actual: "" },
        ],
      },
      {
        code: "B",
        name: "Plank",
        muscles: "Core",
        repMin: 30,
        repMax: 45,
        perSide: false,
        direction: "up",
        autoSuggest: false,
        notes: "Seconds held, not reps.",
        sets: [
          { setType: "Set 1", prev: "", target: "", actual: "" },
        ],
      },
    ],
  },
];

function weekLabelFromStart(startDate) {
  const start = new Date(startDate + "T00:00:00");
  const end = new Date(start.getTime() + 4 * 86400000);
  const fmtMonth = (d) => d.toLocaleDateString("en-CA", { month: "short" });
  return start.getMonth() === end.getMonth()
    ? `${fmtMonth(start)} ${start.getDate()}–${end.getDate()}`
    : `${fmtMonth(start)} ${start.getDate()}–${fmtMonth(end)} ${end.getDate()}`;
}

function seedWorkoutSheetData() {
  const startDate = "2026-08-17";
  const week = {
    id: nextId(),
    startDate,
    label: weekLabelFromStart(startDate),
    days: WORKOUT_SEED_DAYS.map((day) => ({
      id: nextId(),
      label: day.label,
      exercises: day.exercises.map((ex) => ({
        id: nextId(),
        code: ex.code,
        name: ex.name,
        muscles: ex.muscles,
        repMin: ex.repMin,
        repMax: ex.repMax,
        perSide: ex.perSide,
        direction: ex.direction,
        autoSuggest: ex.autoSuggest,
        link: ex.link || "",
        notes: ex.notes,
        sets: ex.sets.map((s) => ({ id: nextId(), ...s })),
      })),
    })),
  };
  return {
    workoutSchemaV: 1,
    weeks: [week],
    activeWeekId: week.id,
    progressionSettings: { autoSuggest: true, hitBumpPct: 2, exceedBumpPct: 8, roundTo: 5, missBehavior: "repeat" },
    openDays: {},
    openExercises: {},
  };
}

// Reads a logged "Actual" value back into a number, if it has one. Formats
// seen in practice: "125 x 12" (weight x reps), "15 x 12/side" (weight x
// reps, per side), "10/side" or "12" (bodyweight, reps only — no weight to
// progress), and "✖️" (skipped — nothing to read at all).
function parseWorkoutActual(str) {
  const s = String(str || "").trim();
  if (!s || s === "✖️") return null;
  const clean = s.replace(/\/side$/i, "").trim();
  const withWeight = clean.match(/^([\d.]+)\s*x\s*([\d.]+)$/i);
  if (withWeight) return { weight: parseFloat(withWeight[1]), reps: parseFloat(withWeight[2]), hasWeight: true };
  const repsOnly = clean.match(/^([\d.]+)$/);
  if (repsOnly) return { weight: null, reps: parseFloat(repsOnly[1]), hasWeight: false };
  return null;
}

// The heart of "+ New week": given an exercise and the set it's replacing,
// decide what to suggest as this set's new Target. Nothing here ever
// touches Actual (that always starts blank) or the exercise's own rep
// range — it only ever proposes a next number, and always leaves the
// field editable afterward.
function suggestedWorkoutTarget(exercise, lastSet, settings) {
  const parsed = parseWorkoutActual(lastSet.actual);
  if (!parsed || !parsed.hasWeight || !exercise.autoSuggest || !settings.autoSuggest) {
    // Nothing logged, a bodyweight/rep-only move, or auto-suggest turned
    // off for this exercise (or globally) — just repeat last week's target.
    return lastSet.target;
  }
  let pct;
  if (parsed.reps > exercise.repMax) pct = settings.exceedBumpPct;
  else if (parsed.reps === exercise.repMax) pct = settings.hitBumpPct;
  else if (parsed.reps < exercise.repMin) pct = settings.missBehavior === "drop5" ? -5 : null;
  else pct = null; // within range but not at the top yet — still building up to it
  if (pct === null) return lastSet.target;
  const dir = exercise.direction === "down" ? -1 : 1;
  const round = settings.roundTo || 5;
  let newWeight = parsed.weight * (1 + (dir * pct) / 100);
  newWeight = Math.max(0, Math.round(newWeight / round) * round);
  const suffix = exercise.perSide ? "/side" : "";
  const weightLabel = exercise.direction === "down" ? `${newWeight} assist` : `${newWeight} lb`;
  return `${weightLabel}${suffix}`;
}

function createNextWorkoutWeek(sheet, startDate) {
  const settings = sheet.progressionSettings;
  const fromWeek = sheet.weeks.find((w) => w.id === sheet.activeWeekId) || sheet.weeks[sheet.weeks.length - 1];
  return {
    id: nextId(),
    startDate,
    label: weekLabelFromStart(startDate),
    days: fromWeek.days.map((day) => ({
      id: nextId(),
      label: day.label,
      exercises: day.exercises.map((ex) => ({
        id: nextId(),
        code: ex.code,
        name: ex.name,
        muscles: ex.muscles,
        repMin: ex.repMin,
        repMax: ex.repMax,
        perSide: ex.perSide,
        direction: ex.direction,
        autoSuggest: ex.autoSuggest,
        link: ex.link || "",
        notes: ex.notes,
        sets: ex.sets.map((s) => ({
          id: nextId(),
          setType: s.setType,
          prev: s.actual && s.actual !== "✖️" ? s.actual : s.prev,
          target: suggestedWorkoutTarget(ex, s, settings),
          actual: "",
        })),
      })),
    })),
  };
}

// Home tab's "Workout Progress" card — same shape as Wellness Progress
// (a ring plus a 14-cell tone strip), fed from the sets she's actually
// logged instead of a separate tracked field. A day "worked out" once
// most of its exercises have something in Actual; the 80% bar matches
// the one Wellness Progress already uses, so the two cards read the same.
function exerciseTouched(ex) {
  return ex.sets.some((s) => (s.actual || "").trim() !== "");
}
function dayWorkoutTone(day) {
  if (!day.exercises.length) return "none";
  const touched = day.exercises.filter(exerciseTouched).length;
  if (touched === 0) return "none";
  return touched / day.exercises.length >= 0.8 ? "good" : "mixed";
}
function flattenWorkoutDays(sheet) {
  const weeks = [...sheet.weeks].sort((a, b) => (a.startDate < b.startDate ? -1 : a.startDate > b.startDate ? 1 : 0));
  const flat = [];
  weeks.forEach((week) => {
    week.days.forEach((day) => flat.push({ weekId: week.id, dayId: day.id, tone: dayWorkoutTone(day) }));
  });
  return flat;
}
function computeWorkoutProgressStats(sheet) {
  if (!sheet.weeks.length) return null;
  const activeWeek = sheet.weeks.find((w) => w.id === sheet.activeWeekId) || sheet.weeks[sheet.weeks.length - 1];
  const weekTotal = activeWeek.days.length;
  const weekDone = activeWeek.days.filter((d) => dayWorkoutTone(d) === "good").length;
  const weekPct = weekTotal ? Math.round((weekDone / weekTotal) * 100) : 0;
  const tones = flattenWorkoutDays(sheet).slice(-14).map((d) => d.tone);
  while (tones.length < 14) tones.unshift("none");
  return { weekDone, weekTotal, weekPct, weekLabel: activeWeek.label, tones };
}

function openNewWeekModal(sheetId) {
  const sheet = state.customSheets[sheetId];
  const fromWeek = sheet.weeks.find((w) => w.id === sheet.activeWeekId) || sheet.weeks[sheet.weeks.length - 1];
  const defaultStart = fromWeek?.startDate ? addDays(fromWeek.startDate, 7) : todayISO();
  const overlay = el(`
    <div class="modal-overlay">
      <div class="modal-box">
        <h3>Start a new week</h3>
        <p>Every day and exercise carries over from "${escapeHtml(fromWeek?.label || "")}" — last week's Actual becomes this week's Previous, and Target gets a fresh suggestion wherever auto-suggest is on.</p>
        <label class="muted" style="display:block;font-size:12px;margin-bottom:4px;">Week starting</label>
        <input type="date" class="new-week-start" value="${defaultStart}" style="width:100%;box-sizing:border-box;" />
        <div class="modal-actions">
          <button type="button" class="btn-ghost modal-cancel">Cancel</button>
          <button type="button" class="btn-primary modal-confirm">Create week</button>
        </div>
      </div>
    </div>
  `);
  overlay.querySelector(".modal-cancel").addEventListener("click", () => overlay.remove());
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) overlay.remove();
  });
  overlay.querySelector(".modal-confirm").addEventListener("click", () => {
    const startDate = overlay.querySelector(".new-week-start").value || todayISO();
    const newWeek = createNextWorkoutWeek(sheet, startDate);
    sheet.weeks.push(newWeek);
    sheet.activeWeekId = newWeek.id;
    scheduleSave();
    overlay.remove();
    renderWorkoutSheet(sheetId);
  });
  document.body.appendChild(overlay);
}

function renderProgressionSettingsCard(sheet, sheetId) {
  const s = sheet.progressionSettings;
  const card = el(`
    <div class="card">
      <div class="progression-row">
        <div class="progression-summary">
          Auto-suggest next week's target: <strong>${s.autoSuggest ? "On" : "Off"}</strong><br>
          Hit the top of your range → <strong>+${s.hitBumpPct}%</strong> &middot; Exceed it → <strong>+${s.exceedBumpPct}%</strong> &middot; round to nearest <strong>${s.roundTo} lb</strong>
        </div>
        <button type="button" class="btn-ghost small prog-edit-toggle">Edit</button>
      </div>
      <div class="progression-form">
        <div class="prog-field-row">
          <label>Auto-suggest next week's target</label>
          <div class="toggle-switch ${s.autoSuggest ? "on" : ""}" data-field="autoSuggest"></div>
        </div>
        <div class="prog-field-row">
          <label>If I hit the top of my rep range, bump by</label>
          <input type="number" min="0" max="30" data-field="hitBumpPct" value="${s.hitBumpPct}" /> <span class="muted">%</span>
        </div>
        <div class="prog-field-row">
          <label>If I exceed the top of my rep range, bump by</label>
          <input type="number" min="0" max="30" data-field="exceedBumpPct" value="${s.exceedBumpPct}" /> <span class="muted">%</span>
        </div>
        <div class="prog-field-row">
          <label>Round the suggested weight to the nearest</label>
          <select class="wide" data-field="roundTo">
            ${[2.5, 5, 10].map((v) => `<option value="${v}" ${s.roundTo === v ? "selected" : ""}>${v} lb</option>`).join("")}
          </select>
        </div>
        <div class="prog-field-row">
          <label>If I miss the bottom of my rep range</label>
          <select class="wide" data-field="missBehavior">
            <option value="repeat" ${s.missBehavior === "repeat" ? "selected" : ""}>Repeat the same target</option>
            <option value="drop5" ${s.missBehavior === "drop5" ? "selected" : ""}>Drop by 5%</option>
          </select>
        </div>
      </div>
    </div>
  `);
  const form = card.querySelector(".progression-form");
  card.querySelector(".prog-edit-toggle").addEventListener("click", () => form.classList.toggle("open"));
  card.querySelector('[data-field="autoSuggest"]').addEventListener("click", (e) => {
    s.autoSuggest = !s.autoSuggest;
    scheduleSave();
    renderWorkoutSheet(sheetId);
  });
  card.querySelectorAll("input[data-field]").forEach((input) => {
    input.addEventListener("change", () => {
      const v = parseFloat(input.value);
      if (Number.isFinite(v)) s[input.dataset.field] = v;
      scheduleSave();
      renderWorkoutSheet(sheetId);
    });
  });
  card.querySelectorAll("select[data-field]").forEach((select) => {
    select.addEventListener("change", () => {
      s[select.dataset.field] = select.dataset.field === "roundTo" ? parseFloat(select.value) : select.value;
      scheduleSave();
      renderWorkoutSheet(sheetId);
    });
  });
  return card;
}

function openWorkoutExerciseModal(sheetId, dayId, exerciseId) {
  const sheet = state.customSheets[sheetId];
  const week = sheet.weeks.find((w) => w.id === sheet.activeWeekId);
  const day = week.days.find((d) => d.id === dayId);
  const isNew = !exerciseId;
  const exercise = isNew ? null : day.exercises.find((e) => e.id === exerciseId);
  const overlay = el(`
    <div class="modal-overlay">
      <div class="modal-box wardrobe-modal-box">
        <h3>${isNew ? "Add exercise" : "Edit exercise"}</h3>
        <div class="wardrobe-item-form">
          <label class="muted" style="font-size:12px;">Code (e.g. A1, B)</label>
          <input type="text" name="code" value="${escapeHtml(exercise?.code || "")}" />
          <label class="muted" style="font-size:12px;">Exercise name</label>
          <input type="text" name="name" value="${escapeHtml(exercise?.name || "")}" required />
          <label class="muted" style="font-size:12px;">Primary muscles</label>
          <input type="text" name="muscles" value="${escapeHtml(exercise?.muscles || "")}" />
          <label class="muted" style="font-size:12px;">Target rep range</label>
          <div class="rep-range-row" style="margin-bottom:10px;">
            <input type="number" name="repMin" value="${exercise?.repMin ?? 8}" style="width:56px;" />
            <span class="muted">to</span>
            <input type="number" name="repMax" value="${exercise?.repMax ?? 10}" style="width:56px;" />
            <span class="muted">reps</span>
            <label style="display:flex;align-items:center;gap:5px;font-size:12.5px;color:var(--muted);margin-left:8px;">
              <input type="checkbox" name="perSide" style="width:auto;" ${exercise?.perSide ? "checked" : ""} /> per side
            </label>
          </div>
          <label class="muted" style="font-size:12px;">Progression direction</label>
          <select name="direction">
            <option value="up" ${(!exercise || exercise.direction === "up") ? "selected" : ""}>Heavier is harder (most exercises)</option>
            <option value="down" ${exercise?.direction === "down" ? "selected" : ""}>Lighter is harder (assisted machines)</option>
          </select>
          <label style="display:flex;align-items:center;gap:8px;font-size:13px;margin:10px 0;">
            <input type="checkbox" name="autoSuggest" style="width:auto;flex-shrink:0;" ${!exercise || exercise.autoSuggest ? "checked" : ""} /> Auto-suggest this exercise's target
          </label>
          <label class="muted" style="font-size:12px;">Video link</label>
          <input type="url" name="link" placeholder="https://youtu.be/… or an Instagram link" value="${escapeHtml(exercise?.link || "")}" />
          <label class="muted" style="font-size:12px;">Notes</label>
          <textarea name="notes" rows="2">${escapeHtml(exercise?.notes || "")}</textarea>
        </div>
        <div class="modal-actions">
          ${!isNew ? '<button type="button" class="btn-ghost danger wi-delete" style="margin-right:auto;">Delete</button>' : ""}
          <button type="button" class="btn-ghost modal-cancel">Cancel</button>
          <button type="button" class="btn-primary modal-confirm">${isNew ? "Add" : "Save"}</button>
        </div>
      </div>
    </div>
  `);
  overlay.querySelector(".modal-cancel").addEventListener("click", () => overlay.remove());
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) overlay.remove();
  });
  overlay.querySelector(".modal-confirm").addEventListener("click", () => {
    const form = overlay.querySelector(".wardrobe-item-form");
    const name = form.querySelector('[name="name"]').value.trim();
    if (!name) return;
    const updated = {
      code: form.querySelector('[name="code"]').value.trim(),
      name,
      muscles: form.querySelector('[name="muscles"]').value.trim(),
      repMin: parseFloat(form.querySelector('[name="repMin"]').value) || 0,
      repMax: parseFloat(form.querySelector('[name="repMax"]').value) || 0,
      perSide: form.querySelector('[name="perSide"]').checked,
      direction: form.querySelector('[name="direction"]').value,
      autoSuggest: form.querySelector('[name="autoSuggest"]').checked,
      link: form.querySelector('[name="link"]').value.trim(),
      notes: form.querySelector('[name="notes"]').value.trim(),
    };
    if (isNew) {
      day.exercises.push({
        id: nextId(),
        ...updated,
        sets: [{ id: nextId(), setType: "Top", prev: "", target: "", actual: "" }],
      });
    } else {
      Object.assign(exercise, updated);
    }
    scheduleSave();
    overlay.remove();
    renderWorkoutSheet(sheetId);
  });
  const deleteBtn = overlay.querySelector(".wi-delete");
  if (deleteBtn) {
    deleteBtn.addEventListener("click", () => {
      confirmModal("Remove this exercise?", `Remove "${exercise.name}" from this day?`, "Remove", () => {
        day.exercises = day.exercises.filter((e) => e.id !== exercise.id);
        scheduleSave();
        overlay.remove();
        renderWorkoutSheet(sheetId);
      });
    });
  }
  document.body.appendChild(overlay);
}

function renderWorkoutExercise(sheetId, dayId, exercise) {
  const sheet = state.customSheets[sheetId];
  const wasOpen = sheet.openExercises[exercise.id];
  const item = el(`
    <details class="workout-ex-item" ${wasOpen ? "open" : ""}>
      <summary class="workout-ex-row">
        <span class="workout-ex-code">${escapeHtml(exercise.code || "")}</span>
        <div class="workout-ex-row-body">
          <div class="workout-ex-name">${escapeHtml(exercise.name)}${
    exercise.link
      ? `<a class="wi-link-icon" href="${escapeHtml(exercise.link)}" target="_blank" rel="noopener noreferrer" title="Watch demo">${linkSvg}</a>`
      : ""
  }</div>
          <div class="workout-ex-hint">${escapeHtml(exercise.muscles || "")}${
    exercise.repMin != null && exercise.repMax != null
      ? ` · ${exercise.repMin}–${exercise.repMax} reps${exercise.perSide ? "/side" : ""}`
      : ""
  }</div>
        </div>
        <span class="wardrobe-chevron">${chevronSvg}</span>
      </summary>
      <div class="workout-ex-detail">
        <div class="workout-set-row workout-set-head">
          <div></div><span class="workout-set-col-label">Previous</span><span class="workout-set-col-label">Target</span><span class="workout-set-col-label">Actual</span>
        </div>
        <div class="workout-ex-sets"></div>
        <div class="wi-detail-notes workout-ex-notes-display" style="${exercise.notes ? "" : "display:none;"}">${escapeHtml(exercise.notes || "")}</div>
        <div class="workout-ex-actions">
          ${
            exercise.link
              ? `<a class="btn-ghost small" href="${escapeHtml(exercise.link)}" target="_blank" rel="noopener noreferrer">${linkSvg} Watch demo</a>`
              : ""
          }
          <button type="button" class="btn-ghost small wex-add-set">+ Add set</button>
          <button type="button" class="btn-ghost small wex-edit">Edit exercise</button>
        </div>
      </div>
    </details>
  `);
  item.querySelector(".wi-link-icon")?.addEventListener("click", (e) => e.stopPropagation());
  item.addEventListener("toggle", () => {
    sheet.openExercises[exercise.id] = item.open;
    scheduleSave();
  });
  const setsWrap = item.querySelector(".workout-ex-sets");
  exercise.sets.forEach((set) => {
    const missed = set.actual === "✖️";
    const row = el(`
      <div class="workout-set-row">
        <div class="workout-set-type">${escapeHtml(set.setType)}</div>
        <div class="workout-set-prev ${missed ? "workout-miss" : ""}">${escapeHtml(set.prev || "—")}</div>
        <input type="text" class="wset-target" value="${escapeHtml(set.target || "")}" placeholder="e.g. 65 lb" />
        <input type="text" class="wset-actual" value="${escapeHtml(set.actual || "")}" placeholder="—" />
        <button type="button" class="icon-btn wset-remove" title="Remove set">&times;</button>
      </div>
    `);
    row.querySelector(".wset-target").addEventListener("change", (e) => {
      set.target = e.target.value.trim();
      scheduleSave();
    });
    row.querySelector(".wset-actual").addEventListener("change", (e) => {
      set.actual = e.target.value.trim();
      scheduleSave();
    });
    row.querySelector(".wset-remove").addEventListener("click", () => {
      exercise.sets = exercise.sets.filter((s) => s.id !== set.id);
      scheduleSave();
      renderWorkoutSheet(sheetId);
    });
    setsWrap.appendChild(row);
  });
  item.querySelector(".wex-add-set").addEventListener("click", () => {
    const last = exercise.sets[exercise.sets.length - 1];
    exercise.sets.push({ id: nextId(), setType: "Extra", prev: last?.target || "", target: last?.target || "", actual: "" });
    scheduleSave();
    renderWorkoutSheet(sheetId);
  });
  item.querySelector(".wex-edit").addEventListener("click", () => openWorkoutExerciseModal(sheetId, dayId, exercise.id));
  return item;
}

function renderWorkoutSheet(sheetId) {
  const panel = document.getElementById(`panel-${sheetId}`);
  const sheet = state.customSheets[sheetId];
  if (!panel || !sheet) return;
  panel.innerHTML = "";
  panel.appendChild(el(`<h2 class="section-title serif">${escapeHtml(sheet.label)}</h2>`));

  const workoutStatsHere = computeWorkoutProgressStats(sheet);
  if (workoutStatsHere) {
    panel.appendChild(
      buildProgressCard(
        "Workout Progress",
        workoutStatsHere.weekPct,
        `<strong>${workoutStatsHere.weekDone} of ${workoutStatsHere.weekTotal}</strong> days worked out this week<br/>${workoutStatsHere.weekLabel}`,
        workoutStatsHere.tones,
        "Last 14 training days",
        null
      )
    );
  }

  if (!sheet.weeks.some((w) => w.id === sheet.activeWeekId)) {
    sheet.activeWeekId = sheet.weeks[sheet.weeks.length - 1]?.id;
  }
  const week = sheet.weeks.find((w) => w.id === sheet.activeWeekId);

  const weekRow = el(`<div class="workout-week-row"></div>`);
  const pills = el(`<div class="workout-week-pills"></div>`);
  sheet.weeks.forEach((w) => {
    const btn = el(`<button type="button" class="${w.id === sheet.activeWeekId ? "active" : ""}">${escapeHtml(w.label)}</button>`);
    btn.addEventListener("click", () => {
      sheet.activeWeekId = w.id;
      scheduleSave();
      renderWorkoutSheet(sheetId);
    });
    pills.appendChild(btn);
  });
  weekRow.appendChild(pills);
  const newWeekBtn = el(`<button type="button" class="btn-ghost small">+ New week</button>`);
  newWeekBtn.addEventListener("click", () => openNewWeekModal(sheetId));
  weekRow.appendChild(newWeekBtn);
  panel.appendChild(weekRow);

  if (!week) {
    panel.appendChild(el(`<div class="muted">No weeks yet — start one above.</div>`));
    return;
  }

  panel.appendChild(renderProgressionSettingsCard(sheet, sheetId));

  week.days.forEach((day) => {
    const details = el(`
      <details class="wardrobe-group" ${sheet.openDays[day.id] !== false ? "open" : ""}>
        <summary class="wardrobe-summary">
          <span class="wardrobe-cat-title workout-day-title-text">${escapeHtml(day.label)}</span>
          <span class="muted">${day.exercises.length} exercise${day.exercises.length === 1 ? "" : "s"}</span>
        </summary>
        <div class="wardrobe-items"></div>
      </details>
    `);
    details.addEventListener("toggle", () => {
      sheet.openDays[day.id] = details.open;
      scheduleSave();
    });
    details.querySelector(".workout-day-title-text").title = "Double-click to rename";
    details.querySelector(".workout-day-title-text").addEventListener("dblclick", (e) => {
      e.preventDefault();
      const titleEl = details.querySelector(".workout-day-title-text");
      const input = el(`<input type="text" value="${escapeHtml(day.label)}" style="font-weight:600;font-size:14px;" />`);
      titleEl.replaceWith(input);
      input.focus();
      input.select();
      const commit = () => {
        day.label = input.value.trim() || day.label;
        scheduleSave();
        renderWorkoutSheet(sheetId);
      };
      input.addEventListener("blur", commit);
      input.addEventListener("keydown", (e2) => {
        if (e2.key === "Enter") input.blur();
        if (e2.key === "Escape") renderWorkoutSheet(sheetId);
      });
    });
    const itemsWrap = details.querySelector(".wardrobe-items");
    day.exercises.forEach((ex) => itemsWrap.appendChild(renderWorkoutExercise(sheetId, day.id, ex)));
    const addExBtn = el(`<button type="button" class="btn-ghost small" style="margin-top:10px;">+ Add exercise</button>`);
    addExBtn.addEventListener("click", () => openWorkoutExerciseModal(sheetId, day.id, null));
    itemsWrap.appendChild(addExBtn);
    const removeDayBtn = el(`<button type="button" class="btn-ghost small danger" style="margin-top:10px;margin-left:8px;">Remove day</button>`);
    removeDayBtn.addEventListener("click", () => {
      confirmModal("Remove this day?", `Remove "${day.label}" and all its exercises from this week?`, "Remove", () => {
        week.days = week.days.filter((d) => d.id !== day.id);
        scheduleSave();
        renderWorkoutSheet(sheetId);
      });
    });
    itemsWrap.appendChild(removeDayBtn);
    panel.appendChild(details);
  });

  const addDayBtn = el(`<button type="button" class="btn-ghost small" style="margin-top:14px;">+ Add day</button>`);
  addDayBtn.addEventListener("click", () => {
    week.days.push({ id: nextId(), label: `Day ${week.days.length + 1}`, exercises: [] });
    scheduleSave();
    renderWorkoutSheet(sheetId);
  });
  panel.appendChild(addDayBtn);
}

// ------------------------------------------------------------------
// Lists — one home for every running list, not just tasks. Each list is
// either a plain checklist (Groceries, Packing — no priority, just a
// name and a checkbox) or a task list (priority dots, same as the old
// single To-Do). The overview shows every list with its own icon/color;
// tapping one drills into it, same tab, no separate nav entry needed.
// ------------------------------------------------------------------
const LIST_ICON_CHOICES = [
  { key: "checklist", svg: `<path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01"/>` },
  { key: "cart", svg: `<path d="M6 6h15l-1.5 9h-12z"/><circle cx="9" cy="20" r="1"/><circle cx="18" cy="20" r="1"/><path d="M3 3h2l1 3"/>` },
  { key: "gift", svg: `<path d="M20 12V8a2 2 0 00-2-2H6a2 2 0 00-2 2v4M4 12l1.5 8h13L20 12M4 12h16M9 6V4h6v2"/>` },
  { key: "plane", svg: `<path d="M3 11l18-7-7 18-3-8-8-3z"/>` },
  { key: "clock", svg: `<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/>` },
];
const LIST_COLOR_CHOICES = ["#8C3F2B", "#55694A", "#8B6BAE", "#4E7C93", "#C9A24A"];
const LIST_PRIORITY_CYCLE = ["1. High", "2. Medium", "3. Low"];

function listIconSvg(key) {
  return (LIST_ICON_CHOICES.find((i) => i.key === key) || LIST_ICON_CHOICES[0]).svg;
}
function listPriorityClass(priority) {
  return priority?.includes("High") ? "high" : priority?.includes("Low") ? "low" : "medium";
}
function activeList() {
  return state.lists.find((l) => l.id === state.activeListId) || null;
}

function renderLists() {
  const panel = document.getElementById("panel-todo");
  panel.innerHTML = "";
  const list = activeList();
  if (list) panel.appendChild(renderListDetail(list));
  else panel.appendChild(renderListsOverview());
}

function renderListsOverview() {
  const wrap = el(`<div></div>`);
  wrap.appendChild(el(`<h2 class="section-title serif">Lists</h2>`));

  state.lists.forEach((list) => {
    const openCount = list.items.filter((i) => !i.done).length;
    const sub = list.style === "checklist" ? `${list.items.length} item${list.items.length === 1 ? "" : "s"}` : `${openCount} open`;
    const card = el(`
      <button type="button" class="list-card">
        <span class="list-card-icon" style="background:${list.color};">${iconSvg(listIconSvg(list.icon))}</span>
        <span class="list-card-body">
          <span class="list-card-name">${escapeHtml(list.name)}</span>
          <span class="list-card-sub">${escapeHtml(sub)}</span>
        </span>
        <span class="list-card-chevron">${chevronRightSvg}</span>
      </button>
    `);
    card.addEventListener("click", () => {
      state.activeListId = list.id;
      scheduleSave();
      renderLists();
    });
    wrap.appendChild(card);
  });

  const newListBtn = el(`
    <button type="button" class="new-list-tile">
      <span class="new-list-tile-icon">${iconSvg('<path d="M12 5v14M5 12h14"/>')}</span>
      <span class="new-list-tile-label">New list</span>
    </button>
  `);
  newListBtn.addEventListener("click", () => openNewListModal());
  wrap.appendChild(newListBtn);

  return wrap;
}

function openNewListModal() {
  let icon = LIST_ICON_CHOICES[0].key;
  let color = LIST_COLOR_CHOICES[0];
  let style = "task";
  const overlay = el(`
    <div class="modal-overlay">
      <div class="modal-box account-modal-box">
        <h3>New List</h3>
        <div class="field-label">Name</div>
        <input type="text" class="list-name-input" placeholder="e.g. Packing — Bali" style="width:100%;box-sizing:border-box;" />
        <div class="field-label">Icon</div>
        <div class="icon-grid"></div>
        <div class="field-label">Color</div>
        <div class="color-grid"></div>
        <div class="field-label">Style</div>
        <div class="style-toggle">
          <button type="button" class="style-choice" data-value="checklist">Simple checklist</button>
          <button type="button" class="style-choice selected" data-value="task">Task list (priority)</button>
        </div>
        <div class="modal-actions">
          <button type="button" class="btn-ghost modal-cancel">Cancel</button>
          <button type="button" class="btn-primary modal-confirm">Create list</button>
        </div>
      </div>
    </div>
  `);

  const iconGrid = overlay.querySelector(".icon-grid");
  LIST_ICON_CHOICES.forEach((choice) => {
    const btn = el(`<button type="button" class="icon-choice${choice.key === icon ? " selected" : ""}">${iconSvg(choice.svg)}</button>`);
    btn.addEventListener("click", () => {
      icon = choice.key;
      iconGrid.querySelectorAll(".icon-choice").forEach((b) => b.classList.toggle("selected", b === btn));
    });
    iconGrid.appendChild(btn);
  });

  const colorGrid = overlay.querySelector(".color-grid");
  LIST_COLOR_CHOICES.forEach((c) => {
    const btn = el(`<button type="button" class="color-choice${c === color ? " selected" : ""}" style="background:${c};"></button>`);
    btn.addEventListener("click", () => {
      color = c;
      colorGrid.querySelectorAll(".color-choice").forEach((b) => b.classList.toggle("selected", b === btn));
    });
    colorGrid.appendChild(btn);
  });

  overlay.querySelectorAll(".style-choice").forEach((btn) => {
    btn.addEventListener("click", () => {
      style = btn.dataset.value;
      overlay.querySelectorAll(".style-choice").forEach((b) => b.classList.toggle("selected", b === btn));
    });
  });

  const nameInput = overlay.querySelector(".list-name-input");
  const submit = () => {
    const name = nameInput.value.trim();
    if (!name) {
      nameInput.focus();
      return;
    }
    const newList = { id: "list_" + nextId(), name, icon, color, style, items: [] };
    state.lists.push(newList);
    state.activeListId = newList.id;
    scheduleSave();
    overlay.remove();
    renderLists();
  };
  nameInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submit();
    }
  });
  overlay.querySelector(".modal-cancel").addEventListener("click", () => overlay.remove());
  overlay.querySelector(".modal-confirm").addEventListener("click", submit);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) overlay.remove();
  });
  document.body.appendChild(overlay);
  nameInput.focus();
}

let draggedListItemId = null;
function reorderListItem(list, draggedId, targetId, before) {
  const draggedIdx = list.items.findIndex((i) => i.id === draggedId);
  const targetIdx = list.items.findIndex((i) => i.id === targetId);
  if (draggedIdx < 0 || targetIdx < 0) return;
  const [item] = list.items.splice(draggedIdx, 1);
  const newTargetIdx = list.items.findIndex((i) => i.id === targetId);
  const insertAt = before ? newTargetIdx : newTargetIdx + 1;
  list.items.splice(insertAt, 0, item);
  list.items.forEach((i, idx) => (i.sortOrder = idx));
  scheduleSave();
  renderLists();
}

function renderListDetail(list) {
  const wrap = el(`<div></div>`);

  const topRow = el(`
    <div class="list-detail-topbar">
      <button type="button" class="list-back-btn">${backArrowSvg}</button>
      <h2 class="section-title serif list-detail-title" style="margin:0;" title="Double-click to rename">${escapeHtml(list.name)}</h2>
      <button type="button" class="list-delete-btn" title="Delete this list">${trashSvg}</button>
    </div>
  `);
  topRow.querySelector(".list-back-btn").addEventListener("click", () => {
    state.activeListId = null;
    scheduleSave();
    renderLists();
  });
  topRow.querySelector(".list-delete-btn").addEventListener("click", () => {
    confirmModal("Delete list?", `Delete "${list.name}" and everything in it? This can't be undone.`, "Delete", () => {
      state.lists = state.lists.filter((l) => l.id !== list.id);
      state.activeListId = null;
      scheduleSave();
      renderLists();
    });
  });
  const titleEl = topRow.querySelector(".list-detail-title");
  titleEl.addEventListener("dblclick", () => {
    const input = el(`<input type="text" class="list-edit-name" value="${escapeHtml(list.name)}" style="font-size:20px;width:100%;box-sizing:border-box;" />`);
    topRow.replaceChild(input, titleEl);
    input.focus();
    input.select();
    const commit = () => {
      list.name = input.value.trim() || list.name;
      scheduleSave();
      renderLists();
    };
    input.addEventListener("blur", commit);
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") input.blur();
      if (e.key === "Escape") renderLists();
    });
  });
  wrap.appendChild(topRow);

  const sorted = [...list.items].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  const card = el(`<div class="card"></div>`);
  if (!sorted.length) card.appendChild(el(`<div class="muted" style="padding:10px 0;">Nothing here yet.</div>`));
  sorted.forEach((item) => card.appendChild(listItemRow(list, item)));
  wrap.appendChild(card);

  const addBtn = el(`<button type="button" class="btn-primary todo-add-btn">+ Add item</button>`);
  addBtn.addEventListener("click", () => {
    addBtn.replaceWith(listAddComposer(list));
  });
  wrap.appendChild(addBtn);

  return wrap;
}

// Expands right in place where the new item will land — no popup. Shows
// priority dots only for a task-style list; a checklist skips straight
// to Save since it has nothing else to pick.
function listAddComposer(list) {
  const box = el(`
    <div class="inline-composer">
      <input type="text" class="inline-composer-input" placeholder="${list.style === "task" ? "New task…" : "New item…"}" />
      <div class="inline-composer-row">
        <div class="inline-pri-picks"></div>
        <div class="inline-composer-actions">
          <button type="button" class="inline-btn cancel">Cancel</button>
          <button type="button" class="inline-btn save">Add</button>
        </div>
      </div>
    </div>
  `);
  let priority = "2. Medium";
  if (list.style === "task") {
    const picks = box.querySelector(".inline-pri-picks");
    LIST_PRIORITY_CYCLE.forEach((p) => {
      const dot = el(`<button type="button" class="inline-pri-dot priority-${listPriorityClass(p)}${p === priority ? " sel" : ""}"></button>`);
      dot.addEventListener("click", () => {
        priority = p;
        picks.querySelectorAll(".inline-pri-dot").forEach((d) => d.classList.toggle("sel", d === dot));
      });
      picks.appendChild(dot);
    });
  }
  const input = box.querySelector(".inline-composer-input");
  const restoreAddBtn = () => {
    const addBtn = el(`<button type="button" class="btn-primary todo-add-btn">+ Add item</button>`);
    addBtn.addEventListener("click", () => box.replaceWith(listAddComposer(list)));
    box.replaceWith(addBtn);
  };
  const submit = () => {
    const task = input.value.trim();
    if (!task) {
      input.focus();
      return;
    }
    list.items.push({
      id: nextId(),
      task,
      priority: list.style === "task" ? priority : undefined,
      done: false,
      sortOrder: list.items.length,
    });
    scheduleSave();
    renderLists();
  };
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submit();
    }
    if (e.key === "Escape") restoreAddBtn();
  });
  box.querySelector(".cancel").addEventListener("click", restoreAddBtn);
  box.querySelector(".save").addEventListener("click", submit);
  setTimeout(() => input.focus(), 0);
  return box;
}

function listItemRow(list, item) {
  const row = el(`
    <div class="row todo-row" draggable="true" data-item-id="${item.id}">
      <span class="todo-drag-handle">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><circle cx="8" cy="6" r="1.6"></circle><circle cx="8" cy="12" r="1.6"></circle><circle cx="8" cy="18" r="1.6"></circle><circle cx="16" cy="6" r="1.6"></circle><circle cx="16" cy="12" r="1.6"></circle><circle cx="16" cy="18" r="1.6"></circle></svg>
      </span>
      <div class="checkbox todo-col-check ${item.done ? "checked" : ""}">${checkSvg}</div>
      <div class="todo-task-label" style="cursor:pointer;" title="Double-click to edit">
        <span class="${item.done ? "strike" : ""}">${escapeHtml(item.task)}</span>
      </div>
      ${
        list.style === "task"
          ? `<button type="button" class="todo-priority-dot priority-${listPriorityClass(item.priority)}" title="Tap to change priority"></button>`
          : `<span class="todo-priority-dot" style="background:none;visibility:hidden;"></span>`
      }
      <button class="remove-btn todo-col-actions" title="Delete">${trashSvg}</button>
    </div>
  `);

  row.addEventListener("dragstart", (e) => {
    draggedListItemId = item.id;
    row.classList.add("dragging");
    e.dataTransfer.effectAllowed = "move";
    try {
      e.dataTransfer.setData("text/plain", String(item.id));
    } catch (err) {
      // Some browsers require this call to not throw even if unused.
    }
  });
  row.addEventListener("dragend", () => {
    draggedListItemId = null;
    document.querySelectorAll(".todo-row").forEach((r) => r.classList.remove("dragging", "drag-over-top", "drag-over-bottom"));
  });
  row.addEventListener("dragover", (e) => {
    if (draggedListItemId == null || draggedListItemId === item.id) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    const rect = row.getBoundingClientRect();
    const before = e.clientY - rect.top < rect.height / 2;
    row.classList.toggle("drag-over-top", before);
    row.classList.toggle("drag-over-bottom", !before);
  });
  row.addEventListener("dragleave", () => {
    row.classList.remove("drag-over-top", "drag-over-bottom");
  });
  row.addEventListener("drop", (e) => {
    e.preventDefault();
    if (draggedListItemId == null || draggedListItemId === item.id) return;
    const rect = row.getBoundingClientRect();
    const before = e.clientY - rect.top < rect.height / 2;
    reorderListItem(list, draggedListItemId, item.id, before);
  });

  row.querySelector(".checkbox").addEventListener("click", () => {
    item.done = !item.done;
    scheduleSave();
    renderLists();
  });
  row.querySelector(".remove-btn").addEventListener("click", () => {
    confirmModal("Delete item?", `Delete "${item.task}"? This can't be undone.`, "Delete", () => {
      list.items = list.items.filter((x) => x.id !== item.id);
      scheduleSave();
      renderLists();
    });
  });

  const priorityDot = row.querySelector(".todo-priority-dot");
  if (priorityDot) {
    priorityDot.addEventListener("click", () => {
      const idx = LIST_PRIORITY_CYCLE.indexOf(item.priority || "2. Medium");
      item.priority = LIST_PRIORITY_CYCLE[(idx + 1) % LIST_PRIORITY_CYCLE.length];
      scheduleSave();
      renderLists();
    });
  }

  const taskLabel = row.querySelector(".todo-task-label");
  taskLabel.addEventListener("dblclick", () => {
    const input = el(`<input type="text" class="todo-edit-task" value="${escapeHtml(item.task)}" style="width:100%;box-sizing:border-box;" />`);
    row.replaceChild(input, taskLabel);
    input.focus();
    input.select();
    const commit = () => {
      item.task = input.value.trim() || item.task;
      scheduleSave();
      renderLists();
    };
    input.addEventListener("blur", commit);
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") input.blur();
      if (e.key === "Escape") {
        input.removeEventListener("blur", commit);
        renderLists();
      }
    });
  });

  return row;
}

// ------------------------------------------------------------------
// Budget — categories, sections, financial goals + paycheck view
// ------------------------------------------------------------------
let budgetView = "sections"; // "sections" | "paycheck" — synced from state.budgetView at boot
let budgetShowHidden = false; // synced from state.budgetShowHidden at boot

// Display order for budget sections — Subscriptions merges into Fixed Costs
// (see BUDGET_SECTION_MERGE_VERSION below), Giving sits right after it, and
// anything in a section not listed here sorts to the end.
const BUDGET_SECTION_ORDER = ["Categories", "Giving", "Savings & Investing", "Debt"];
// One-time merge of the old separate "Subscriptions" section into "Fixed
// Costs" — applied once in boot(), never re-run so later edits stick.
const BUDGET_SECTION_MERGE_VERSION = "2026-08-22c";


// Bucket definitions per pay frequency. Buckets are calendar-day-of-month
// ranges (matching how due dates already work in the By Category view),
// not actual tracked pay dates — so no extra "when do you get paid" field
// is needed in Paycheck Settings, just the frequency itself.
function getPaycheckBuckets(frequency) {
  if (frequency === "weekly") {
    return [
      { key: "w1", label: "Week 1", range: [1, 7] },
      { key: "w2", label: "Week 2", range: [8, 14] },
      { key: "w3", label: "Week 3", range: [15, 21] },
      { key: "w4", label: "Week 4", range: [22, 31] },
    ];
  }
  if (frequency === "monthly") {
    return [{ key: "m1", label: "This month", range: [1, 31] }];
  }
  // Semi-monthly and biweekly both approximate to two calendar-half pay periods.
  return [
    { key: "p1", label: "1st Paycheck", range: [1, 15] },
    { key: "p2", label: "2nd Paycheck", range: [16, 31] },
  ];
}

function paycheckBucketFor(item, buckets) {
  if (item.split) return "split";
  if (item.dueDay == null) return "unassigned";
  const match = buckets.find((b) => item.dueDay >= b.range[0] && item.dueDay <= b.range[1]);
  return match ? match.key : buckets[buckets.length - 1].key;
}

// Paycheck settings — one amount + frequency, used to flag when the budget
// asks for more than she actually brings home.
const PAYCHECK_FREQUENCIES = {
  weekly: { label: "Weekly", monthlyMultiplier: 52 / 12 },
  biweekly: { label: "Biweekly (every 2 weeks)", monthlyMultiplier: 26 / 12 },
  semimonthly: { label: "Semi-monthly (twice a month)", monthlyMultiplier: 2 },
  monthly: { label: "Monthly", monthlyMultiplier: 1 },
};

function monthlyIncomeFromPaycheck(settings) {
  const freq = PAYCHECK_FREQUENCIES[settings.frequency] || PAYCHECK_FREQUENCIES.semimonthly;
  return Number(settings.amount || 0) * freq.monthlyMultiplier;
}

function budgetFlagHtml(budgeted, income, label) {
  const diff = budgeted - income;
  if (diff > 0.5) {
    return `<div class="budget-flag over">Over your ${label} by $${diff.toLocaleString("en-CA", { maximumFractionDigits: 0 })}</div>`;
  }
  return `<div class="budget-flag ok">$${Math.abs(diff).toLocaleString("en-CA", { maximumFractionDigits: 0 })} under your ${label}</div>`;
}

function renderBudget() {
  const panel = document.getElementById("panel-budget");
  const items = state.budget;
  const total = items.filter((i) => !i.hidden).reduce((s, i) => s + Number(i.amount || 0), 0);

  const monthlyIncome = monthlyIncomeFromPaycheck(state.paycheckSettings);

  panel.innerHTML = "";
  panel.appendChild(el(`
    <div class="top-summary" style="align-items:center;margin-bottom:6px;">
      <h2 class="section-title serif" style="margin:0;">Budget</h2>
      <div style="text-align:right;">
        <div class="muted" style="font-size:12px;">Total / month</div>
        <div class="value serif">$${total.toLocaleString("en-CA", { maximumFractionDigits: 0 })}</div>
      </div>
    </div>
  `));
  panel.appendChild(el(`<div style="text-align:right;margin-bottom:14px;">${budgetFlagHtml(total, monthlyIncome, `$${monthlyIncome.toLocaleString("en-CA", { maximumFractionDigits: 0 })}/mo take-home`)}</div>`));

  const paycheckRow = el(`
    <div class="paycheck-settings-row">
      <div class="muted" style="font-size:13px;">
        Paycheck: <strong>$${Number(state.paycheckSettings.amount || 0).toLocaleString("en-CA")}</strong> · ${
    PAYCHECK_FREQUENCIES[state.paycheckSettings.frequency]?.label || "Semi-monthly (twice a month)"
  }
      </div>
      <button type="button" class="btn-ghost small paycheck-edit-toggle">Edit</button>
    </div>
  `);
  const paycheckForm = el(`
    <div class="paycheck-settings-form" style="display:none;">
      <label class="muted" style="display:block;font-size:12px;margin-bottom:4px;">Amount per paycheck</label>
      <input type="number" step="0.01" class="paycheck-amount-input" value="${state.paycheckSettings.amount}" style="width:100%;box-sizing:border-box;" />
      <label class="muted" style="display:block;font-size:12px;margin:10px 0 4px 0;">Frequency</label>
      <select class="paycheck-frequency-select" style="width:100%;box-sizing:border-box;">
        ${Object.entries(PAYCHECK_FREQUENCIES)
          .map(([key, f]) => `<option value="${key}" ${state.paycheckSettings.frequency === key ? "selected" : ""}>${f.label}</option>`)
          .join("")}
      </select>
      <button type="button" class="btn-primary small paycheck-save-btn" style="margin-top:10px;width:100%;">Save</button>
    </div>
  `);
  paycheckRow.querySelector(".paycheck-edit-toggle").addEventListener("click", () => {
    paycheckForm.style.display = paycheckForm.style.display === "none" ? "block" : "none";
  });
  paycheckForm.querySelector(".paycheck-save-btn").addEventListener("click", () => {
    const amt = parseFloat(paycheckForm.querySelector(".paycheck-amount-input").value);
    state.paycheckSettings.amount = Number.isFinite(amt) && amt >= 0 ? amt : state.paycheckSettings.amount;
    state.paycheckSettings.frequency = paycheckForm.querySelector(".paycheck-frequency-select").value;
    scheduleSave();
    renderBudget();
  });
  panel.appendChild(paycheckRow);
  panel.appendChild(paycheckForm);

  const hiddenCount = items.filter((i) => i.hidden).length;
  const toggleRow = el(`<div class="view-toggle-row"></div>`);
  const toggle = el(`
    <div class="view-toggle">
      <button data-view="sections" class="${budgetView === "sections" ? "active" : ""}">By Category</button>
      <button data-view="paycheck" class="${budgetView === "paycheck" ? "active" : ""}">By Paycheck</button>
    </div>
  `);
  toggle.querySelectorAll("button").forEach((b) => {
    b.addEventListener("click", () => {
      budgetView = b.dataset.view;
      state.budgetView = budgetView;
      scheduleSave();
      renderBudget();
    });
  });
  toggleRow.appendChild(toggle);
  if (hiddenCount > 0) {
    const hiddenToggle = el(`
      <button type="button" class="btn-ghost small hidden-toggle-btn ${budgetShowHidden ? "active" : ""}">
        ${budgetShowHidden ? "Hide" : "Show"} hidden (${hiddenCount})
      </button>
    `);
    hiddenToggle.addEventListener("click", () => {
      budgetShowHidden = !budgetShowHidden;
      state.budgetShowHidden = budgetShowHidden;
      scheduleSave();
      renderBudget();
    });
    toggleRow.appendChild(hiddenToggle);
  }
  panel.appendChild(toggleRow);

  const visibleItems = items.filter((i) => !i.hidden || budgetShowHidden);

  if (budgetView === "sections") {
    renderBudgetBySection(panel, visibleItems);
  } else {
    renderBudgetByPaycheck(panel, visibleItems);
  }

  renderFinancialGoals(panel);
}

function renderBudgetBySection(panel, items) {
  const bySection = {};
  items.forEach((i) => (bySection[i.section || "Other"] ||= []).push(i));
  const orderedSections = Object.keys(bySection).sort((a, b) => {
    const ai = BUDGET_SECTION_ORDER.indexOf(a);
    const bi = BUDGET_SECTION_ORDER.indexOf(b);
    return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
  });

  orderedSections.forEach((section) => {
    const rows = bySection[section];
    const sectionTotal = rows.filter((i) => !i.hidden).reduce((s, i) => s + Number(i.amount || 0), 0);
    const card = el(`
      <details class="card" open>
        <summary class="book-summary" style="margin-bottom:8px;">
          <strong>${escapeHtml(section)}</strong>
          <span class="muted">$${sectionTotal.toLocaleString("en-CA")}</span>
        </summary>
      </details>
    `);
    rows.forEach((r) => card.appendChild(budgetRow(r)));
    panel.appendChild(card);
  });

  const form = el(`
    <form class="add-form">
      <input name="category" placeholder="New category" required />
      <input name="amount" type="number" step="0.01" placeholder="$/month" required />
      <input name="section" placeholder="Section (e.g. Categories)" />
      <button class="btn-primary" type="submit">Add</button>
    </form>
  `);
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    state.budget.push({
      id: nextId(),
      category: fd.get("category"),
      amount: parseFloat(fd.get("amount")) || 0,
      section: fd.get("section") || "Other",
      dueDay: null,
      split: false,
      hidden: false,
      sortOrder: state.budget.length,
    });
    scheduleSave();
    renderBudget();
  });
  panel.appendChild(form);
}

function budgetRow(item, opts = {}) {
  const row = el(`<div class="row budget-row" draggable="true" data-item-id="${item.id}"></div>`);

  row.addEventListener("dragstart", (e) => {
    draggedBudgetItemId = item.id;
    row.classList.add("dragging");
    e.dataTransfer.effectAllowed = "move";
    try {
      e.dataTransfer.setData("text/plain", String(item.id));
    } catch (err) {
      // Some browsers require this call to not throw even if unused.
    }
  });
  row.addEventListener("dragend", () => {
    draggedBudgetItemId = null;
    document.querySelectorAll(".budget-row").forEach((r) => r.classList.remove("dragging", "drag-over-top", "drag-over-bottom"));
  });
  row.addEventListener("dragover", (e) => {
    if (draggedBudgetItemId == null || draggedBudgetItemId === item.id) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    const rect = row.getBoundingClientRect();
    const before = e.clientY - rect.top < rect.height / 2;
    row.classList.toggle("drag-over-top", before);
    row.classList.toggle("drag-over-bottom", !before);
  });
  row.addEventListener("dragleave", () => {
    row.classList.remove("drag-over-top", "drag-over-bottom");
  });
  row.addEventListener("drop", (e) => {
    e.preventDefault();
    if (draggedBudgetItemId == null || draggedBudgetItemId === item.id) return;
    const rect = row.getBoundingClientRect();
    const before = e.clientY - rect.top < rect.height / 2;
    reorderBudgetItem(draggedBudgetItemId, item.id, before);
  });

  function showDisplay() {
    row.classList.remove("editing");
    row.classList.toggle("hidden-item", !!item.hidden);
    row.innerHTML = "";
    row.appendChild(el(`
      <span class="budget-drag-handle">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><circle cx="8" cy="6" r="1.6"></circle><circle cx="8" cy="12" r="1.6"></circle><circle cx="8" cy="18" r="1.6"></circle><circle cx="16" cy="6" r="1.6"></circle><circle cx="16" cy="12" r="1.6"></circle><circle cx="16" cy="18" r="1.6"></circle></svg>
      </span>
    `));
    row.appendChild(el(`<div class="budget-row-main">${escapeHtml(item.category)}${opts.splitNote ? ` <span class="muted">(${opts.splitNote})</span>` : ""}${item.hidden ? `<span class="muted-sub">Hidden from totals</span>` : ""}</div>`));
    const shownAmount = opts.displayAmount != null ? opts.displayAmount : item.amount;
    row.appendChild(el(`<span class="budget-row-amount">$${Number(shownAmount || 0).toLocaleString("en-CA", { maximumFractionDigits: 0 })}</span>`));
    const right = el(`
      <div class="budget-row-actions">
        <button type="button" class="icon-btn budget-edit-btn" title="Edit due date, split, amount, or hide">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path></svg>
        </button>
        <button class="remove-btn" title="Delete">&times;</button>
      </div>
    `);
    right.querySelector(".budget-edit-btn").addEventListener("click", showEdit);
    right.querySelector(".remove-btn").addEventListener("click", () => {
      state.budget = state.budget.filter((x) => x.id !== item.id);
      scheduleSave();
      renderBudget();
    });
    row.appendChild(right);
  }

  function showEdit() {
    row.classList.add("editing");
    row.innerHTML = "";
    row.appendChild(el(`<div class="budget-row-main">${escapeHtml(item.category)}</div>`));
    const fields = el(`
      <div class="budget-fields">
        <label class="muted" style="font-size:11px;">Due</label>
        <input type="number" min="1" max="31" class="due-input" value="${item.dueDay ?? ""}" placeholder="day" />
        <button type="button" class="split-chip ${item.split ? "on" : ""}">Split 50/50</button>
        <span>$</span>
        <input type="number" step="0.01" class="amount-input" value="${item.amount}" />
        <button type="button" class="icon-btn hide-chip ${item.hidden ? "active-toggle" : ""}" title="${item.hidden ? "Hidden from totals — click to include again" : "Hide from totals"}">${eyeToggleSvg(item.hidden)}</button>
        <button type="button" class="icon-btn budget-done-btn" title="Done">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
        </button>
      </div>
    `);
    const dueInput = fields.querySelector(".due-input");
    const splitChip = fields.querySelector(".split-chip");
    const amountInput = fields.querySelector(".amount-input");
    const hideChip = fields.querySelector(".hide-chip");

    dueInput.addEventListener("change", () => {
      const v = parseInt(dueInput.value, 10);
      item.dueDay = Number.isFinite(v) && v >= 1 && v <= 31 ? v : null;
      if (item.dueDay != null) {
        item.split = false;
        splitChip.classList.remove("on");
      }
      scheduleSave();
    });
    splitChip.addEventListener("click", () => {
      item.split = !item.split;
      if (item.split) {
        item.dueDay = null;
        dueInput.value = "";
      }
      splitChip.classList.toggle("on", item.split);
      scheduleSave();
    });
    amountInput.addEventListener("change", () => {
      item.amount = parseFloat(amountInput.value) || 0;
      scheduleSave();
    });
    hideChip.addEventListener("click", () => {
      item.hidden = !item.hidden;
      hideChip.classList.toggle("active-toggle", item.hidden);
      hideChip.title = item.hidden ? "Hidden from totals — click to include again" : "Hide from totals";
      hideChip.innerHTML = eyeToggleSvg(item.hidden);
      scheduleSave();
    });
    fields.querySelector(".budget-done-btn").addEventListener("click", () => {
      scheduleSave();
      renderBudget();
    });
    row.appendChild(fields);
  }

  showDisplay();
  return row;
}

function renderBudgetByPaycheck(panel, items) {
  const frequency = state.paycheckSettings.frequency || "semimonthly";
  const paycheckBuckets = getPaycheckBuckets(frequency);
  const buckets = { unassigned: [] };
  paycheckBuckets.forEach((b) => (buckets[b.key] = []));

  items.forEach((item) => {
    const b = paycheckBucketFor(item, paycheckBuckets);
    if (b === "split") {
      const share = item.amount / paycheckBuckets.length;
      paycheckBuckets.forEach((pb) =>
        buckets[pb.key].push({ item, displayAmount: share, splitNote: `1/${paycheckBuckets.length}` })
      );
    } else {
      buckets[b].push({ item, displayAmount: item.amount, splitNote: null });
    }
  });

  const defs = [...paycheckBuckets, { key: "unassigned", label: "No due date set" }];
  const paycheckAmount = Number(state.paycheckSettings.amount || 0);

  defs.forEach(({ key, label }) => {
    const rows = buckets[key];
    const bucketTotal = rows.filter((r) => !r.item.hidden).reduce((s, r) => s + Number(r.displayAmount || 0), 0);
    const card = el(`
      <div class="card">
        <div class="paycheck-card-head">
          <strong>${label}</strong>
          <span class="amt serif">$${bucketTotal.toLocaleString("en-CA", { maximumFractionDigits: 0 })}</span>
        </div>
      </div>
    `);
    if (key !== "unassigned") {
      card.appendChild(el(budgetFlagHtml(bucketTotal, paycheckAmount, "paycheck")));
    } else if (rows.length > 0) {
      const visibleRows = rows.filter((r) => !r.item.hidden);
      card.appendChild(
        el(
          `<div class="unassigned-callout">${visibleRows.length} categor${
            visibleRows.length === 1 ? "y" : "ies"
          } with no due date — $${bucketTotal.toLocaleString("en-CA", {
            maximumFractionDigits: 0,
          })} isn't reflected in either paycheck above.</div>`
        )
      );
    }
    if (rows.length === 0) {
      card.appendChild(el(`<div class="muted">Nothing here.</div>`));
    }
    rows.forEach((r) => {
      card.appendChild(budgetRow(r.item, { displayAmount: r.displayAmount, splitNote: r.splitNote }));
    });
    panel.appendChild(card);
  });
  const rangeNote =
    frequency === "weekly"
      ? "This view splits the month into four due-date weeks (1–7, 8–14, 15–21, 22–31) and compares each to your weekly paycheck."
      : frequency === "monthly"
      ? "This view shows the whole month as one pay period."
      : "This view splits the month by due date (1st–15th and 16th–31st) and compares each half to one paycheck.";
  panel.appendChild(el(`<div class="muted" style="margin-top:-6px;margin-bottom:10px;">${rangeNote}</div>`));
  panel.appendChild(el(`<div class="muted" style="margin-top:-6px;margin-bottom:18px;">Set a due date or mark an item "Split 50/50" from the By Category view to place it here.</div>`));
}

function renderFinancialGoals(panel) {
  const section = el(`
    <details class="goals-section" ${state.goalsOpen === false ? "" : "open"}>
      <summary class="goals-section-summary">
        <h3 class="subsection-title serif" style="margin:0;">Financial Goals</h3>
        <span class="wardrobe-chevron">${chevronSvg}</span>
      </summary>
      <div class="goals-section-body"></div>
    </details>
  `);
  section.addEventListener("toggle", () => {
    state.goalsOpen = section.open;
    scheduleSave();
  });
  const card = el(`<div class="card"></div>`);
  state.goals
    .slice()
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .forEach((g) => {
      const row = el(`
        <div class="goal-row" draggable="true" data-item-id="${g.id}">
          <span class="goal-drag-handle">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><circle cx="8" cy="6" r="1.6"></circle><circle cx="8" cy="12" r="1.6"></circle><circle cx="8" cy="18" r="1.6"></circle><circle cx="16" cy="6" r="1.6"></circle><circle cx="16" cy="12" r="1.6"></circle><circle cx="16" cy="18" r="1.6"></circle></svg>
          </span>
          <div class="checkbox ${g.done ? "checked" : ""}">${checkSvg}</div>
          <div class="goal-label ${g.done ? "done" : ""}">${escapeHtml(g.label)}</div>
          <button class="remove-btn" title="Delete">&times;</button>
        </div>
      `);
      row.addEventListener("dragstart", (e) => {
        draggedGoalId = g.id;
        row.classList.add("dragging");
        e.dataTransfer.effectAllowed = "move";
        try {
          e.dataTransfer.setData("text/plain", String(g.id));
        } catch (err) {
          // Some browsers require this call to not throw even if unused.
        }
      });
      row.addEventListener("dragend", () => {
        draggedGoalId = null;
        document.querySelectorAll(".goal-row").forEach((r) => r.classList.remove("dragging", "drag-over-top", "drag-over-bottom"));
      });
      row.addEventListener("dragover", (e) => {
        if (draggedGoalId == null || draggedGoalId === g.id) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        const rect = row.getBoundingClientRect();
        const before = e.clientY - rect.top < rect.height / 2;
        row.classList.toggle("drag-over-top", before);
        row.classList.toggle("drag-over-bottom", !before);
      });
      row.addEventListener("dragleave", () => {
        row.classList.remove("drag-over-top", "drag-over-bottom");
      });
      row.addEventListener("drop", (e) => {
        e.preventDefault();
        if (draggedGoalId == null || draggedGoalId === g.id) return;
        const rect = row.getBoundingClientRect();
        const before = e.clientY - rect.top < rect.height / 2;
        reorderGoal(draggedGoalId, g.id, before);
      });
      row.querySelector(".checkbox").addEventListener("click", () => {
        g.done = !g.done;
        scheduleSave();
        renderBudget();
      });
      row.querySelector(".remove-btn").addEventListener("click", () => {
        state.goals = state.goals.filter((x) => x.id !== g.id);
        scheduleSave();
        renderBudget();
      });
      const labelEl = row.querySelector(".goal-label");
      labelEl.title = "Double-click to edit";
      labelEl.addEventListener("dblclick", () => {
        const input = el(`<input type="text" class="goal-label-input" value="${escapeHtml(g.label)}" />`);
        row.replaceChild(input, labelEl);
        input.focus();
        input.select();
        const commit = () => {
          g.label = input.value.trim() || g.label;
          scheduleSave();
          renderBudget();
        };
        input.addEventListener("blur", commit);
        input.addEventListener("keydown", (e) => {
          if (e.key === "Enter") input.blur();
          if (e.key === "Escape") {
            input.removeEventListener("blur", commit);
            renderBudget();
          }
        });
      });
      card.appendChild(row);
    });
  const body = section.querySelector(".goals-section-body");
  body.appendChild(card);

  const form = el(`
    <form class="add-form">
      <input name="label" placeholder="New goal" required />
      <button class="btn-primary" type="submit">Add</button>
    </form>
  `);
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    state.goals.push({ id: nextId(), label: fd.get("label"), done: false, sortOrder: state.goals.length });
    scheduleSave();
    renderBudget();
  });
  body.appendChild(form);
  panel.appendChild(section);
}

// ------------------------------------------------------------------
// Investments — accounts (RRSP/TFSA/FHSA), holdings, portfolio balancer
// ------------------------------------------------------------------
let portfolioChoice = "yours"; // synced from state.portfolioChoice at boot
let lastImportMessage = ""; // survives the renderInvestments() re-render triggered right after an import

const ACCOUNT_BUDGET_MATCH = {
  rrsp: /rrsp/i,
  tfsa: /tfsa/i,
  fhsa: /fhsa/i,
};

const ASSET_CLASS_MAP = {
  SPYM: "US Equity",
  SCHF: "Intl Equity",
  SHLD: "US Equity",
};
function assetClassFor(holdingName) {
  const key = Object.keys(ASSET_CLASS_MAP).find((k) => holdingName.toUpperCase().includes(k));
  if (key) return ASSET_CLASS_MAP[key];
  if (/gold|gltr|kilo|commod/i.test(holdingName)) return "Gold & Commodities";
  if (/bond|agg|tlt|govt/i.test(holdingName)) return "Bonds";
  return "Other";
}

const PORTFOLIO_PRESETS = {
  yours: {
    label: "Yours",
    note: "Whatever holdings you add above, in whatever ratio you want — no fixed number of tickers.",
    targets: null, // shown via the holdings table itself
  },
  dalio: {
    label: "Ray Dalio — All Weather",
    note: "Built to hold up across growth, recession, inflation, and deflation — heavy on bonds, light on stocks.",
    targets: { "US/Global Equity": 30, "Long-Term Bonds": 40, "Intermediate Bonds": 15, "Gold": 7.5, "Commodities": 7.5 },
  },
  bogleheads: {
    label: "Bogleheads Three-Fund",
    note: "The classic low-cost index approach: total US market, international, and bonds.",
    targets: { "US Equity": 60, "Intl Equity": 30, "Bonds": 10 },
  },
  classic: {
    label: "Classic 60/40",
    note: "The traditional balanced-investor split.",
    targets: { "US/Global Equity": 60, "Bonds": 40 },
  },
};

function currentMonthKey(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}
function monthLabel(key) {
  const [y, m] = key.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString("en-CA", { month: "long", year: "numeric" });
}
function getBudgetContribution(accountKey) {
  const re = ACCOUNT_BUDGET_MATCH[accountKey];
  return state.budget.filter((b) => re.test(b.category)).reduce((s, b) => s + Number(b.amount || 0), 0);
}

function currentInvestmentAccount() {
  return state.investmentAccounts.find((a) => a.key === state.selectedInvestmentAccount) || state.investmentAccounts[0];
}

function renderInvestments() {
  const panel = document.getElementById("panel-investments");
  if (!panel) return;
  panel.innerHTML = "";
  panel.appendChild(el(`<h2 class="section-title serif">Investments</h2>`));

  // Deleting the Investments sheet for good (Settings) clears every account
  // — and there's no "add account" flow to rebuild from, so this is a real
  // dead end, not just an empty list. Render that plainly instead of
  // crashing on an account that no longer exists.
  if (!state.investmentAccounts.length) {
    panel.appendChild(
      el(`<div class="card muted" style="text-align:center;padding:32px 16px;">No investment accounts here anymore.</div>`)
    );
    return;
  }

  const thisMonth = currentMonthKey();
  const totalBalance = state.investmentAccounts.reduce((s, a) => s + Number(a.balance || 0), 0);
  panel.appendChild(el(`
    <div class="top-summary">
      <div>
        <div class="muted">Accounts total</div>
        <div class="value serif">$${totalBalance.toLocaleString("en-CA", { maximumFractionDigits: 0 })}</div>
      </div>
    </div>
  `));

  // ---- Account switcher: one account in view at a time ----
  const tabsWrap = el(`<div class="view-toggle" style="flex-wrap:wrap;"></div>`);
  state.investmentAccounts.forEach((a) => {
    const btn = el(`<button data-key="${a.key}" class="${state.selectedInvestmentAccount === a.key ? "active" : ""}">${escapeHtml(a.name)}</button>`);
    btn.addEventListener("click", () => {
      state.selectedInvestmentAccount = a.key;
      scheduleSave();
      renderInvestments();
    });
    tabsWrap.appendChild(btn);
  });
  panel.appendChild(tabsWrap);

  const acct = currentInvestmentAccount();
  const contribution = getBudgetContribution(acct.key);
  const deployed = acct.deployedMonths.includes(thisMonth);

  // ---- One consolidated card: account overview, balancer preset, and
  // holdings all live together here instead of as separate blocks. ----
  const card = el(`<div class="card"></div>`);

  const header = el(`
    <div class="row" style="align-items:flex-start;">
      <div style="flex:1;min-width:180px;">
        <div style="font-weight:600;font-size:15px;">${escapeHtml(acct.name)}</div>
        <div class="muted" style="margin-top:2px;">This month's planned contribution: $${contribution.toLocaleString("en-CA", { maximumFractionDigits: 0 })} (from Budget)</div>
      </div>
      <div class="budget-fields">
        <label class="muted" style="font-size:11px;">Balance $</label>
        <input type="number" step="0.01" class="acct-balance" value="${acct.balance}" style="width:100px;" />
      </div>
      <button type="button" class="split-chip deploy-chip ${deployed ? "on" : ""}">${deployed ? "Deployed ✓" : `Deploy for ${monthLabel(thisMonth)}`}</button>
    </div>
  `);
  header.querySelector(".acct-balance").addEventListener("change", (e) => {
    acct.balance = parseFloat(e.target.value) || 0;
    scheduleSave();
    renderInvestments();
  });
  header.querySelector(".deploy-chip").addEventListener("click", () => {
    if (acct.deployedMonths.includes(thisMonth)) {
      acct.deployedMonths = acct.deployedMonths.filter((m) => m !== thisMonth);
    } else {
      acct.deployedMonths.push(thisMonth);
    }
    scheduleSave();
    renderInvestments();
  });
  card.appendChild(header);
  card.appendChild(el(`<div class="muted" style="margin:6px 0 16px 0;">"Deploy" just marks that this month's set-aside cash actually got invested, not left sitting in cash.</div>`));
  card.appendChild(el(`<div style="border-top:1px solid var(--border);margin:0 0 16px 0;"></div>`));

  // Preset tabs pick what "Target" is measured against, right where the
  // holdings themselves are shown — not a separate section further down.
  const presetTabs = el(`<div class="view-toggle" style="flex-wrap:wrap;margin-bottom:12px;"></div>`);
  Object.entries(PORTFOLIO_PRESETS).forEach(([key, preset]) => {
    const btn = el(`<button data-key="${key}" class="${portfolioChoice === key ? "active" : ""}">${escapeHtml(preset.label)}</button>`);
    btn.addEventListener("click", () => {
      portfolioChoice = key;
      state.portfolioChoice = key;
      scheduleSave();
      renderInvestments();
    });
    presetTabs.appendChild(btn);
  });
  card.appendChild(presetTabs);

  const preset = PORTFOLIO_PRESETS[portfolioChoice];
  card.appendChild(el(`<div class="muted" style="margin-bottom:14px;">${escapeHtml(preset.note)}</div>`));

  renderHoldingsTable(card, acct, preset);

  const form = el(`
    <form class="add-form">
      <input name="holding" placeholder="Ticker / holding" required />
      <input name="currentPct" type="number" step="0.1" placeholder="Current %" />
      <button class="btn-primary" type="submit">Add</button>
    </form>
  `);
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    acct.holdings.push({
      id: nextId(),
      holding: fd.get("holding"),
      currentPct: parseFloat(fd.get("currentPct")) || null,
      targetPct: null,
      action: null,
      sortOrder: acct.holdings.length,
    });
    scheduleSave();
    renderInvestments();
  });
  card.appendChild(form);

  panel.appendChild(card);

  renderPortfolioImport(panel, acct);
}

// ------------------------------------------------------------------
// Portfolio import — read a CSV exported from a brokerage and match its
// holdings/weights onto the RRSP Holdings table above.
// ------------------------------------------------------------------
function parseCsvLine(line) {
  const out = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (inQuotes) {
      if (c === '"' && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else if (c === '"') {
        inQuotes = false;
      } else {
        cur += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ",") {
      out.push(cur);
      cur = "";
    } else {
      cur += c;
    }
  }
  out.push(cur);
  return out;
}

function normalizeHeader(h) {
  return h.toLowerCase().replace(/[^a-z0-9]/g, "");
}

const SYMBOL_HEADERS = ["symbol", "ticker", "security", "securitysymbol", "equitysymbol", "assettype"];
const PERCENT_HEADERS = ["percent", "percentage", "weight", "allocation", "pctofportfolio", "portfoliopercent", "ofportfolio", "allocationpercent"];
const VALUE_HEADERS = ["value", "marketvalue", "amount", "currentvalue", "marketvaluecad", "marketvalueusd", "totalvalue"];

// Sheet names (normalized, no spaces/punctuation) worth trying first in a
// multi-sheet workbook — a Questrade export's "Positions" or per-ticker
// "SecuritiesOwnedSD" sheet holds real holdings; its "Balances" summary
// sheet (always first) and "Allocations..." sheet (asset-class rollups,
// e.g. "ETFs"/"Cash" instead of tickers) do not and should be skipped.
const PREFERRED_SHEET_NAMES = ["positions", "securitiesownedsd", "holdings", "securities"];
const SKIP_SHEET_NAME_PATTERN = /allocation/i;

function findColumn(headers, candidates) {
  const idx = headers.findIndex((h) => candidates.includes(normalizeHeader(h)));
  return idx;
}

// `rows` is a 2D array: rows[0] is the header row, rows[1..] are data rows.
// Cells may be strings (from CSV) or native numbers (from a parsed .xlsx sheet) —
// everything is coerced to a string before pattern-matching, which handles both.
function rowsToHoldings(rows) {
  if (rows.length < 2) throw new Error("That file doesn't look like it has any data rows.");
  const headers = rows[0].map((h) => String(h ?? "").trim());
  const symbolIdx = findColumn(headers, SYMBOL_HEADERS);
  const percentIdx = findColumn(headers, PERCENT_HEADERS);
  const valueIdx = findColumn(headers, VALUE_HEADERS);
  if (symbolIdx === -1) {
    throw new Error('Couldn\'t find a "Symbol" or "Ticker" column in that file.');
  }
  if (percentIdx === -1 && valueIdx === -1) {
    throw new Error('Couldn\'t find a "Value" or "Percent" column in that file.');
  }

  const parsedRows = rows
    .slice(1)
    .map((cols) => {
      const symbol = String(cols[symbolIdx] ?? "").trim();
      const percentRaw = percentIdx !== -1 ? cols[percentIdx] : null;
      const valueRaw = valueIdx !== -1 ? cols[valueIdx] : null;
      return { symbol, percentRaw, valueRaw };
    })
    .filter((r) => r.symbol);

  if (!parsedRows.length) throw new Error("No holdings with a symbol were found in that file.");

  let results;
  if (percentIdx !== -1) {
    results = parsedRows.map((r) => ({
      holding: r.symbol,
      currentPct: parseFloat(String(r.percentRaw ?? "").replace(/[^0-9.\-]/g, "")) || 0,
    }));
  } else {
    const values = parsedRows.map((r) => parseFloat(String(r.valueRaw ?? "").replace(/[^0-9.\-]/g, "")) || 0);
    const total = values.reduce((s, v) => s + v, 0);
    results = parsedRows.map((r, i) => ({
      holding: r.symbol,
      currentPct: total > 0 ? (values[i] / total) * 100 : 0,
    }));
  }
  return results;
}

function csvTextToRows(text) {
  return text.split(/\r?\n/).filter((l) => l.trim().length > 0).map(parseCsvLine);
}

function isExcelFile(file) {
  return /\.(xlsx|xls)$/i.test(file.name);
}

// A brokerage export often bundles several sheets: an account-summary
// sheet (no tickers), the actual per-holding sheet(s), and sometimes an
// asset-class rollup sheet that shares column names with the real one.
// Try the sheets most likely to hold real tickers first, skip known
// rollup sheets, and otherwise scan every sheet in order — returning the
// first one that actually parses into holdings, tagged with its name so
// the result message can say which sheet was used.
function pickHoldingsSheet(workbook) {
  const candidateNames = workbook.SheetNames.filter((n) => !SKIP_SHEET_NAME_PATTERN.test(n));
  const tryNames = [
    ...PREFERRED_SHEET_NAMES.map((pref) => candidateNames.find((n) => normalizeHeader(n) === pref)).filter(Boolean),
    ...candidateNames,
  ];
  const tried = new Set();
  for (const name of tryNames) {
    if (tried.has(name)) continue;
    tried.add(name);
    try {
      const rows = XLSX.utils.sheet_to_json(workbook.Sheets[name], { header: 1, raw: true, blankrows: false });
      const parsed = rowsToHoldings(rows);
      if (parsed.length) return { sheetName: name, parsed };
    } catch {
      // This sheet doesn't have the right columns — try the next one.
    }
  }
  return null;
}

function renderPortfolioImport(panel, acct) {
  const card = el(`
    <div class="card">
      <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;">
        <div style="flex:1;min-width:220px;">
          <strong>Import into ${escapeHtml(acct.name)}</strong>
          <div class="muted" style="margin-top:2px;">Upload a CSV or Excel file (like Questrade's positions export) with a Symbol column and either a Value or Percent column — it'll match tickers already in ${escapeHtml(acct.name)} and add any new ones. For a multi-sheet workbook, it looks past the account-summary sheet for the one with your actual holdings.</div>
        </div>
        <label class="btn-ghost small" style="cursor:pointer;">
          Choose file
          <input type="file" accept=".csv,.xlsx,.xls,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel" class="import-file-input" style="display:none;" />
        </label>
      </div>
      <div class="import-result muted" style="margin-top:10px;"></div>
    </div>
  `);
  const fileInput = card.querySelector(".import-file-input");
  const resultEl = card.querySelector(".import-result");
  if (lastImportMessage) {
    resultEl.textContent = lastImportMessage;
    lastImportMessage = "";
  }

  function applyParsedHoldings(parsed, sourceNote) {
    let updated = 0;
    let added = 0;
    parsed.forEach((p) => {
      const existing = acct.holdings.find((r) => r.holding.trim().toUpperCase() === p.holding.trim().toUpperCase());
      if (existing) {
        existing.currentPct = Math.round(p.currentPct * 10) / 10;
        updated++;
      } else {
        acct.holdings.push({
          id: nextId(),
          holding: p.holding,
          currentPct: Math.round(p.currentPct * 10) / 10,
          targetPct: null,
          action: null,
          sortOrder: acct.holdings.length,
        });
        added++;
      }
    });
    scheduleSave();
    lastImportMessage = `Updated ${updated} holding${updated === 1 ? "" : "s"} in ${acct.name}, added ${added} new${sourceNote ? ` (from the "${sourceNote}" sheet)` : ""}.`;
    renderInvestments();
  }

  fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (!file) return;
    const reader = new FileReader();

    if (isExcelFile(file)) {
      reader.onload = () => {
        try {
          if (!window.XLSX) throw new Error("Excel support didn't load — try a CSV export instead.");
          const workbook = XLSX.read(new Uint8Array(reader.result), { type: "array" });
          if (!workbook.SheetNames.length) throw new Error("That workbook doesn't have any sheets.");
          const best = pickHoldingsSheet(workbook);
          if (!best) {
            throw new Error(
              "Couldn't find a sheet with ticker symbols and a value or percentage in that workbook — checked " +
                workbook.SheetNames.join(", ") +
                "."
            );
          }
          applyParsedHoldings(best.parsed, best.sheetName);
        } catch (err) {
          resultEl.textContent = err.message || "Couldn't read that file.";
        }
      };
      reader.onerror = () => {
        resultEl.textContent = "Couldn't read that file.";
      };
      reader.readAsArrayBuffer(file);
    } else {
      reader.onload = () => {
        try {
          applyParsedHoldings(rowsToHoldings(csvTextToRows(String(reader.result))));
        } catch (err) {
          resultEl.textContent = err.message || "Couldn't read that file.";
        }
      };
      reader.onerror = () => {
        resultEl.textContent = "Couldn't read that file.";
      };
      reader.readAsText(file);
    }
  });

  panel.appendChild(card);
}

// Groups this account's holdings by broad asset class, and — for a model
// preset — works out which target each class is measured against
// (handling combined buckets like "US/Global Equity" or a split "Gold" +
// "Commodities" target that both draw on one combined holding).
function buildClassBreakdown(preset, currentByClass) {
  const rows = [];
  const rawToEntry = {};
  Object.entries(preset.targets).forEach(([label, target]) => {
    let current = currentByClass[label] || 0;
    let rawLabels = [label];
    if (label === "US/Global Equity") {
      current = (currentByClass["US Equity"] || 0) + (currentByClass["Intl Equity"] || 0);
      rawLabels = ["US Equity", "Intl Equity"];
    } else if ((label === "Gold" || label === "Commodities") && "Gold" in preset.targets && "Commodities" in preset.targets) {
      current = (currentByClass["Gold & Commodities"] || 0) / 2;
      rawLabels = ["Gold & Commodities"];
    }
    const entry = { label, target, current };
    rows.push(entry);
    rawLabels.forEach((raw) => {
      if (!(raw in rawToEntry)) rawToEntry[raw] = entry;
    });
  });
  return { rows, rawToEntry };
}

function gapLabelFor(current, target) {
  const gap = current - target;
  return Math.abs(gap) < 1 ? "On target" : gap < 0 ? `${Math.abs(gap).toFixed(0)}pt under — add` : `${gap.toFixed(0)}pt over — trim`;
}

// The one holdings table for an account: what you own, how much it's
// worth, and — right alongside it — how it measures up against whichever
// balancer preset is selected above. "Yours" gets an editable per-ticker
// target/action; a model preset gets a read-only class-level target and
// gap, plus a compact class breakdown underneath for the bigger picture.
function renderHoldingsTable(card, acct, preset) {
  if (!acct.holdings.length) {
    card.appendChild(el(`<div class="muted" style="margin-bottom:4px;">No holdings added yet — add one below or import a file.</div>`));
    return;
  }

  const isYours = !preset.targets;
  const currentByClass = {};
  acct.holdings.forEach((r) => {
    const cls = assetClassFor(r.holding);
    currentByClass[cls] = (currentByClass[cls] || 0) + (Number(r.currentPct) || 0);
  });
  const { rows: classRows, rawToEntry } = isYours ? { rows: [], rawToEntry: {} } : buildClassBreakdown(preset, currentByClass);

  const tableWrap = el(`<div class="table-scroll"></div>`);
  const table = el(`
    <table>
      <thead><tr><th>Holding</th><th>Amount</th><th>Current</th><th>${isYours ? "Target" : "Class target"}</th><th>${isYours ? "Action" : "Gap"}</th><th></th></tr></thead>
      <tbody></tbody>
    </table>
  `);
  tableWrap.appendChild(table);
  const tbody = table.querySelector("tbody");

  acct.holdings.forEach((r) => {
    const amount = Number(acct.balance || 0) * ((Number(r.currentPct) || 0) / 100);
    const amountLabel = `$${amount.toLocaleString("en-CA", { maximumFractionDigits: 0 })}`;

    let targetCellHtml, actionCellHtml;
    if (isYours) {
      targetCellHtml = `<input type="text" class="target-input" value="${escapeHtml(r.targetPct || "")}" placeholder="e.g. 50-55%" />`;
      actionCellHtml = `<input type="text" class="action-input" value="${escapeHtml(r.action || "")}" placeholder="e.g. add" />`;
    } else {
      const cls = assetClassFor(r.holding);
      const entry = rawToEntry[cls];
      targetCellHtml = entry ? `${entry.target}% <span class="muted">(${escapeHtml(entry.label)})</span>` : `<span class="muted">— (${escapeHtml(cls)})</span>`;
      actionCellHtml = entry ? `<span class="muted">${gapLabelFor(entry.current, entry.target)}</span>` : `<span class="muted">No target for this class</span>`;
    }

    const tr = el(`
      <tr>
        <td>${escapeHtml(r.holding)}</td>
        <td class="muted">${amountLabel}</td>
        <td><input type="number" step="0.1" class="current-input" value="${r.currentPct ?? ""}" style="width:64px;" />%</td>
        <td>${targetCellHtml}</td>
        <td>${actionCellHtml}</td>
        <td><button class="remove-btn">&times;</button></td>
      </tr>
    `);
    tr.querySelector(".current-input").addEventListener("change", (e) => {
      r.currentPct = parseFloat(e.target.value);
      if (Number.isNaN(r.currentPct)) r.currentPct = null;
      scheduleSave();
      renderInvestments();
    });
    if (isYours) {
      tr.querySelector(".target-input").addEventListener("change", (e) => {
        r.targetPct = e.target.value || null;
        scheduleSave();
      });
      tr.querySelector(".action-input").addEventListener("change", (e) => {
        r.action = e.target.value || null;
        scheduleSave();
      });
    }
    tr.querySelector(".remove-btn").addEventListener("click", () => {
      acct.holdings = acct.holdings.filter((x) => x.id !== r.id);
      scheduleSave();
      renderInvestments();
    });
    tbody.appendChild(tr);
  });
  card.appendChild(tableWrap);

  if (!isYours && classRows.length) {
    card.appendChild(el(`<div class="muted" style="margin:14px 0 6px 0;font-size:12px;">By asset class</div>`));
    const classTableWrap = el(`<div class="table-scroll"></div>`);
    const classTable = el(`
      <table>
        <thead><tr><th>Asset class</th><th>Target</th><th>You hold</th><th>Amount</th><th>Gap</th></tr></thead>
        <tbody></tbody>
      </table>
    `);
    classTableWrap.appendChild(classTable);
    const classBody = classTable.querySelector("tbody");
    classRows.forEach(({ label, target, current }) => {
      const amount = Number(acct.balance || 0) * (current / 100);
      classBody.appendChild(el(`
        <tr>
          <td>${escapeHtml(label)}</td>
          <td>${target}%</td>
          <td>${current.toFixed(0)}%</td>
          <td class="muted">$${amount.toLocaleString("en-CA", { maximumFractionDigits: 0 })}</td>
          <td class="muted">${gapLabelFor(current, target)}</td>
        </tr>
      `));
    });
    card.appendChild(classTableWrap);
  }
}

// ------------------------------------------------------------------
// Bible Reading — grouped by book, collapsible chapter grids
// ------------------------------------------------------------------
function parseBookAndChapter(reading) {
  const m = reading.match(/^(.*\D)\s+(\d+)$/);
  if (!m) return { book: reading, chapter: null };
  return { book: m[1].trim(), chapter: parseInt(m[2], 10) };
}

const OT_BOOKS = new Set([
  "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy", "Joshua", "Judges", "Ruth",
  "1 Samuel", "2 Samuel", "1 Kings", "2 Kings", "1 Chronicles", "2 Chronicles", "Ezra",
  "Nehemiah", "Esther", "Job", "Psalms", "Proverbs", "Ecclesiastes", "Song of Solomon",
  "Isaiah", "Jeremiah", "Lamentations", "Ezekiel", "Daniel", "Hosea", "Joel", "Amos",
  "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk", "Zephaniah", "Haggai", "Zechariah", "Malachi",
]);

// "all" | "ot" | "nt" — synced from state.bibleTestament at boot.
let bibleTestament = "all";

// Small bookmark glyph for the "jump to where you left off" control —
// an icon so it doesn't cost a whole row of space.
const bookmarkSvg = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z"></path></svg>`;

function daysBetween(a, b) {
  return Math.round((b - a) / (1000 * 60 * 60 * 24));
}

function renderBiblePace(panel, doneCount, total) {
  const settings = state.bibleSettings;
  const startDate = new Date(settings.startDate + "T00:00:00");
  const today = new Date();
  const daysElapsed = Math.max(1, daysBetween(startDate, today) + 1);
  const pace = doneCount / daysElapsed; // chapters/day so far
  const remaining = total - doneCount;
  const fmt = (d) => d.toLocaleDateString("en-CA", { year: "numeric", month: "short", day: "numeric" });

  let projectedEnd = null;
  if (remaining > 0 && pace > 0) {
    const daysToFinish = Math.ceil(remaining / pace);
    projectedEnd = new Date(today.getTime() + daysToFinish * 86400000);
  }

  const pct = total ? Math.round((doneCount / total) * 100) : 0;

  const card = el(`
    <div class="card bible-pace-card">
      <div class="bible-pace-stats">
        <div class="bible-pace-stat">
          <label class="muted">Start date</label>
          <input type="date" class="bible-start-date" value="${settings.startDate}" />
        </div>
        <div class="bible-pace-stat">
          <label class="muted">Projected finish</label>
          <div class="bible-pace-stat-value">${remaining <= 0 ? "Finished!" : projectedEnd ? fmt(projectedEnd) : "—"}</div>
        </div>
      </div>
      <div class="bible-pace-track" title="${doneCount} of ${total} chapters (${pct}%)">
        <div class="bible-pace-track-fill" style="width:${pct}%;"></div>
      </div>
    </div>
  `);
  card.querySelector(".bible-start-date").addEventListener("change", (e) => {
    if (e.target.value) {
      settings.startDate = e.target.value;
      scheduleSave();
      renderBible();
    }
  });
  panel.appendChild(card);
}

function renderBible() {
  const panel = document.getElementById("panel-bible");
  const rows = state.bible;
  const total = rows.length;
  const doneCount = rows.filter((r) => r.done).length;

  panel.innerHTML = "";
  panel.appendChild(el(`
    <div class="top-summary">
      <div>
        <div class="muted">Overall progress</div>
        <div class="value serif">${total ? Math.round((doneCount / total) * 100) : 0}%</div>
      </div>
      <div class="muted">${doneCount} of ${total} chapters</div>
    </div>
  `));
  renderBiblePace(panel, doneCount, total);

  const books = [];
  const byBook = new Map();
  rows.forEach((r) => {
    const { book, chapter } = parseBookAndChapter(r.reading);
    if (!byBook.has(book)) {
      byBook.set(book, []);
      books.push(book);
    }
    byBook.get(book).push({ ...r, chapter });
  });

  // A book counts as "in progress" once at least one chapter is done but
  // not all of them — the first one, in canonical order, is where a jump
  // link should land, since that's where reading naturally picks back up.
  const firstInProgressBook = books.find((book) => {
    const chapters = byBook.get(book);
    const bookDone = chapters.filter((c) => c.done).length;
    return bookDone > 0 && bookDone < chapters.length;
  });

  const toolbarRow = el(`<div class="view-toggle-row"></div>`);
  const testamentToggle = el(`
    <div class="view-toggle">
      <button data-testament="all" class="${bibleTestament === "all" ? "active" : ""}">All</button>
      <button data-testament="ot" class="${bibleTestament === "ot" ? "active" : ""}">Old Testament</button>
      <button data-testament="nt" class="${bibleTestament === "nt" ? "active" : ""}">New Testament</button>
    </div>
  `);
  testamentToggle.querySelectorAll("button").forEach((b) => {
    b.addEventListener("click", () => {
      bibleTestament = b.dataset.testament;
      state.bibleTestament = bibleTestament;
      scheduleSave();
      renderBible();
    });
  });
  toolbarRow.appendChild(testamentToggle);
  if (firstInProgressBook) {
    const jumpBtn = el(
      `<button type="button" class="icon-btn bible-jump-btn" title="Jump to where you left off — ${escapeHtml(firstInProgressBook)}" aria-label="Jump to where you left off — ${escapeHtml(firstInProgressBook)}">${bookmarkSvg}</button>`
    );
    jumpBtn.addEventListener("click", () => {
      const jumpToTarget = () => {
        const target = panel.querySelector(`.book-group[data-book="${CSS.escape(firstInProgressBook)}"]`);
        if (target) {
          target.open = true;
          state.bibleOpenBooks[firstInProgressBook] = true;
          scheduleSave();
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      };
      // If the current filter is hiding that book's testament, switch to
      // "All" first so there's actually something to scroll to.
      const bookIsOT = OT_BOOKS.has(firstInProgressBook);
      if ((bibleTestament === "ot" && !bookIsOT) || (bibleTestament === "nt" && bookIsOT)) {
        bibleTestament = "all";
        state.bibleTestament = bibleTestament;
        scheduleSave();
        renderBible();
        requestAnimationFrame(jumpToTarget);
      } else {
        jumpToTarget();
      }
    });
    toolbarRow.appendChild(jumpBtn);
  }
  panel.appendChild(toolbarRow);

  const visibleBooks = books.filter((book) => {
    if (bibleTestament === "all") return true;
    const isOT = OT_BOOKS.has(book);
    return bibleTestament === "ot" ? isOT : !isOT;
  });

  visibleBooks.forEach((book) => {
    const chapters = byBook.get(book);
    const bookDone = chapters.filter((c) => c.done).length;
    const inProgress = bookDone > 0 && bookDone < chapters.length;
    // Respect whatever she last set by hand — only fall back to
    // auto-opening in-progress books the first time a book is ever seen.
    const remembered = state.bibleOpenBooks[book];
    const shouldOpen = remembered !== undefined ? remembered : inProgress;
    const details = el(`
      <details class="book-group" data-book="${escapeHtml(book)}" ${shouldOpen ? "open" : ""}>
        <summary class="book-summary">
          <span class="book-title">${escapeHtml(book)}</span>
          <span class="muted">${bookDone}/${chapters.length}</span>
        </summary>
        <div class="chapter-grid"></div>
      </details>
    `);
    details.addEventListener("toggle", () => {
      state.bibleOpenBooks[book] = details.open;
      scheduleSave();
    });
    const grid = details.querySelector(".chapter-grid");
    chapters.forEach((c) => {
      const chip = el(`<div class="chapter-chip ${c.done ? "done" : ""}">${c.chapter ?? ""}</div>`);
      chip.addEventListener("click", () => {
        const original = state.bible.find((x) => x.id === c.id);
        original.done = !original.done;
        if (original.done) original.completedDate = todayISO();
        scheduleSave();
        renderBible();
      });
      grid.appendChild(chip);
    });
    panel.appendChild(details);
  });
}

// ------------------------------------------------------------------
// Wellness — today's quick entry + recent history
// ------------------------------------------------------------------
function todayISO() {
  // Local calendar date, not UTC — toISOString() rolls over at UTC
  // midnight, which reads as "tomorrow" for anyone west of Greenwich
  // in the evening (e.g. still 9pm Eastern but already past midnight UTC).
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// Yes/No fields, color-coded green/muted-red like a sheet's conditional formatting.
const WELLNESS_YESNO_FIELDS = [
  ["movement", "Movement"],
  ["spiritualAnchor", "Spiritual anchor"],
  ["sleepProtected", "Sleep protected"],
  ["socialConnection", "Social connection"],
];
// Small enumerated dropdowns, also color-coded.
const WELLNESS_ENUM_FIELDS = {
  cyclePhase: {
    label: "Cycle phase",
    options: [
      { value: "Menstrual", text: "1. Menstrual", title: "Menstrual — your period" },
      { value: "Follicular", text: "2. Follicular", title: "Follicular — after period, energy building" },
      { value: "Ovulatory", text: "3. Ovulatory", title: "Ovulatory — mid-cycle, egg release" },
      { value: "Luteal", text: "4. Luteal", title: "Luteal — after ovulation, before next period" },
    ],
  },
  foodQuality: {
    label: "Food quality",
    options: [
      { value: "Good", text: "Good" },
      { value: "Okay", text: "Okay" },
      { value: "Poor", text: "Poor" },
    ],
  },
};
const WELLNESS_NOTE_FIELDS = [
  ["whatWorked", "What worked?"],
  ["whatHarder", "What made things harder?"],
  ["adjustment", "One adjustment to make"],
];

// Which space(s) "fulfill" each pillar — editable from the "You" page's
// Pillar Mapping screen. Real, not just a label: if you log something
// today in a mapped space, that pillar marks itself done automatically.
// Tapping a pillar on Home still works manually too, for anything a
// mapped space can't see (a trip to church, meditating without logging
// it anywhere) — this is additive, not a replacement for the tap.
// state.pillarSourceMap holds {pillarKey: [sheetId, ...]}.
function pillarSourceLabel(key) {
  const ids = state.pillarSourceMap?.[key] || [];
  const labels = ids
    .map((id) => {
      if (id === "bible") {
        const sheet = state.sheets.find((s) => s.id === "bible" && s.visible);
        return sheet ? sheetLabel(sheet) : null;
      }
      const sheet = state.sheets.find((s) => s.id === id && s.visible);
      return sheet ? sheetLabel(sheet) : null;
    })
    .filter(Boolean);
  return labels.length ? labels.join(", ") : null;
}

// Which spaces actually make sense as a source for a given pillar — curated
// per pillar rather than one generic "any checklist" list, so Movement only
// ever offers Workout Log, Spiritual anchor only ever offers Bible/Quran,
// and Sleep protected / Social connection offer nothing until a space that
// fits them exists. This is deliberately conceptual, not the same as
// "can we detect activity here" (see sheetActiveToday below) — Workout Log
// belongs under Movement even though its week/day data can't yet be
// checked against today's date automatically.
function pillarCandidateSheets(key) {
  const results = [];
  if (key === "spiritualAnchor") {
    const bibleSheet = state.sheets.find((s) => s.id === "bible" && s.visible);
    if (bibleSheet) results.push({ id: "bible", label: sheetLabel(bibleSheet) });
    state.sheets.forEach((s) => {
      if (s.kind !== "custom" || !s.visible) return;
      const cs = state.customSheets[s.id];
      if (cs && cs.templateKey === "quran") results.push({ id: s.id, label: sheetLabel(s) });
    });
  } else if (key === "movement") {
    state.sheets.forEach((s) => {
      if (s.kind !== "custom" || !s.visible) return;
      const cs = state.customSheets[s.id];
      if (cs && cs.templateKey === "workout") results.push({ id: s.id, label: sheetLabel(s) });
    });
  } else if (key === "sleepProtected") {
    const sleepSheet = state.sheets.find((s) => s.id === "sleep" && s.visible);
    if (sleepSheet) results.push({ id: "sleep", label: sheetLabel(sleepSheet) });
  }
  // socialConnection: no space maps to this yet.
  return results;
}

// When a pillar has exactly one space that fits it and nothing's chosen
// yet, just pick it — no manual step needed for a "choice" that isn't
// really a choice. Leaves anything already set alone, and leaves pillars
// with zero or multiple candidates for the modal to handle.
function ensurePillarSourceDefaults() {
  let changed = false;
  WELLNESS_YESNO_FIELDS.forEach(([key]) => {
    if ((state.pillarSourceMap[key] || []).length) return;
    const candidates = pillarCandidateSheets(key);
    if (candidates.length === 1) {
      state.pillarSourceMap[key] = [candidates[0].id];
      changed = true;
    }
  });
  if (changed) scheduleSave();
}

// Did she log something today in this particular space? Used to
// auto-complete a pillar without needing a manual tap.
function sheetActiveToday(sheetId, today) {
  if (sheetId === "bible") {
    return state.bible.some((r) => r.done && r.completedDate === today);
  }
  if (sheetId === "sleep") {
    // Sleep protected is an outcome, not just a logged action — logging a
    // rough, short night shouldn't count the same as a real one. "Today"
    // reads on last night specifically, since that's what a morning log
    // is actually reporting on.
    const nightEntry = state.sleepLogs.find((e) => e.date === addDays(today, -1));
    return sleepNightProtected(nightEntry);
  }
  const cs = state.customSheets[sheetId];
  if (!cs || !Array.isArray(cs.items)) return false;
  return cs.items.some((i) => i.done && i.completedDate === today);
}

// Runs on every Home render: for each pillar with mapped spaces, if
// there's real activity today in any of them and the pillar isn't marked
// yet, mark it — additive to (never overriding) a manual tap or a manual
// correction made in the day editor.
function applyPillarAutoDetection(todaysEntry, today) {
  let changed = false;
  WELLNESS_YESNO_FIELDS.forEach(([key]) => {
    if (todaysEntry[key] === "Yes") return;
    const ids = state.pillarSourceMap?.[key] || [];
    if (ids.some((id) => sheetActiveToday(id, today))) {
      todaysEntry[key] = "Yes";
      changed = true;
    }
  });
  if (changed) scheduleSave();
}

// Reached from the "You" page. One checkbox list per pillar — pick zero or
// more spaces that count toward it. Checking a box doesn't retroactively
// mark today done; it just means from now on, logging something there
// today will. Tapping the pillar on Home always still works too.
function openPillarMappingModal() {
  const overlay = el(`
    <div class="modal-overlay">
      <div class="modal-box info-modal-box account-modal-box">
        <div class="info-modal-header">
          <h3>Pillar Mapping</h3>
          <button type="button" class="icon-btn info-modal-close" aria-label="Close">${closeSvg}</button>
        </div>
        <p class="muted" style="font-size:12.5px;line-height:1.5;margin:0 0 14px;">
          Each pillar only shows the spaces that actually fit it. Log something there today and it marks itself done. You can still tap a pillar on Home to log it yourself, for anything that isn't tracked in a space (a trip to church, meditating without logging it).
        </p>
        <div id="pillar-mapping-sections"></div>
      </div>
    </div>
  `);
  const sectionsWrap = overlay.querySelector("#pillar-mapping-sections");

  function renderSections() {
    ensurePillarSourceDefaults();
    sectionsWrap.innerHTML = "";
    WELLNESS_YESNO_FIELDS.forEach(([key, label]) => {
      const candidates = pillarCandidateSheets(key);
      const section = el(`<div class="account-section"></div>`);
      section.appendChild(el(`<div class="account-section-label">${escapeHtml(label)}</div>`));

      if (!candidates.length) {
        section.appendChild(el(`<div class="account-note">No spaces connected for this pillar yet — log it manually from Home.</div>`));
      } else if (candidates.length === 1) {
        const sp = candidates[0];
        const checked = (state.pillarSourceMap[key] || []).includes(sp.id);
        const row = el(`
          <label class="you-list-row" style="cursor:pointer;">
            <input type="checkbox" ${checked ? "checked" : ""} style="width:16px;height:16px;flex-shrink:0;margin:0;" />
            <span>${escapeHtml(sp.label)}</span>
          </label>
        `);
        row.querySelector("input").addEventListener("change", (e) => {
          state.pillarSourceMap[key] = e.target.checked ? [sp.id] : [];
          scheduleSave();
        });
        section.appendChild(row);
        section.appendChild(el(`<div class="account-note">Only one space fits here, so it's selected automatically.</div>`));
      } else {
        candidates.forEach((sp) => {
          const checked = (state.pillarSourceMap[key] || []).includes(sp.id);
          const row = el(`
            <label class="you-list-row" style="cursor:pointer;">
              <input type="checkbox" ${checked ? "checked" : ""} style="width:16px;height:16px;flex-shrink:0;margin:0;" />
              <span>${escapeHtml(sp.label)}</span>
            </label>
          `);
          row.querySelector("input").addEventListener("change", (e) => {
            const set = new Set(state.pillarSourceMap[key] || []);
            if (e.target.checked) set.add(sp.id);
            else set.delete(sp.id);
            state.pillarSourceMap[key] = Array.from(set);
            scheduleSave();
          });
          section.appendChild(row);
        });
      }
      sectionsWrap.appendChild(section);
    });
  }
  renderSections();

  const close = () => {
    overlay.remove();
    renderHome();
  };
  overlay.querySelector(".info-modal-close").addEventListener("click", close);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });
  document.body.appendChild(overlay);
}

function wellnessColorClass(field, value) {
  if (!value) return "";
  if (field === "foodQuality") return value === "Good" ? "good" : value === "Poor" ? "bad" : "mid";
  if (value === "Yes") return "good";
  if (value === "No") return "bad";
  return "mid"; // cycle phase and anything else: neutral highlight
}

function addDays(dateStr, days) {
  const d = new Date(dateStr + "T00:00:00");
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

// A day counts as "good" for Veronika's Bonus if at least 80% of that
// day's scoreable fields (the Yes/No fields plus food quality) came back
// positive — cycle phase never counts either way since it's information,
// not a good/bad outcome. A day with nothing scoreable logged isn't good
// or bad, it just didn't happen.
function isWellnessDayPositive(entry) {
  if (!entry) return false;
  const classes = [];
  WELLNESS_YESNO_FIELDS.forEach(([k]) => {
    if (entry[k]) classes.push(wellnessColorClass(k, entry[k]));
  });
  if (entry.foodQuality) classes.push(wellnessColorClass("foodQuality", entry.foodQuality));
  const good = classes.filter((c) => c === "good").length;
  const bad = classes.filter((c) => c === "bad").length;
  if (good + bad === 0) return false;
  return good / (good + bad) >= 0.8;
}

// Small "i" glyph for the field-info popups (cycle phase diagram, example
// chips for Food quality / Movement / Spiritual anchor). Kept tiny and
// unobtrusive so it doesn't compete with the field itself.
const infoSvg = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="11" x2="12" y2="16.5"></line><circle cx="12" cy="7.5" r="0.9" fill="currentColor" stroke="none"></circle></svg>`;
const closeSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="5" x2="19" y2="19"></line><line x1="19" y1="5" x2="5" y2="19"></line></svg>`;

// What each info popup shows. Cycle phase gets a simple diagram; the
// others get a short list of example answers she gave herself — not a
// strict rulebook, just examples of what tends to count.
const WELLNESS_FIELD_INFO = {
  cyclePhase: { type: "cycle" },
  foodQuality: {
    type: "examples",
    intro: "Not a strict rule — whatever “good” food looks like for you. A few examples:",
    examples: ["Meal prepped", "Protein bowls", "Home-cooked meals", "Balanced plate with veggies"],
  },
  movement: {
    type: "examples",
    intro: "Anything intentional counts. A few examples:",
    examples: ["Strength trained", "Went for a walk", "Yoga or stretching", "A workout class"],
  },
  spiritualAnchor: {
    type: "examples",
    intro: "Whatever grounds you. A few examples:",
    examples: ["Morning devotions", "Meditation", "Church", "Quiet prayer time"],
  },
  sleepProtected: {
    type: "examples",
    intro: "Whatever helps you actually get rest. A few examples:",
    examples: ["In bed by a set time", "No phone before bed", "7+ hours", "Wound down before sleep"],
  },
  socialConnection: {
    type: "examples",
    intro: "Any real connection counts. A few examples:",
    examples: ["Called a friend", "Time with family", "Coffee with someone", "A meaningful conversation"],
  },
};

function infoModal(title, bodyEl) {
  const overlay = el(`
    <div class="modal-overlay">
      <div class="modal-box info-modal-box">
        <div class="info-modal-header">
          <h3>${escapeHtml(title)}</h3>
          <button type="button" class="icon-btn info-modal-close" aria-label="Close">${closeSvg}</button>
        </div>
        <div class="info-modal-body"></div>
      </div>
    </div>
  `);
  overlay.querySelector(".info-modal-body").appendChild(bodyEl);
  const close = () => overlay.remove();
  overlay.querySelector(".info-modal-close").addEventListener("click", close);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });
  document.body.appendChild(overlay);
}

function buildExamplesInfoBody(info) {
  const body = el(`<div></div>`);
  body.appendChild(el(`<p class="muted" style="font-size:13px;margin:0 0 12px 0;line-height:1.5;">${escapeHtml(info.intro)}</p>`));
  const list = el(`<div class="example-chip-list"></div>`);
  info.examples.forEach((ex) => {
    list.appendChild(el(`<span class="example-chip">${escapeHtml(ex)}</span>`));
  });
  body.appendChild(list);
  return body;
}

// A simplified 28-day cycle timeline — four segments sized roughly to
// how many days each phase tends to span, with a short plain-language
// description under each. Illustrative, not medical guidance.
const CYCLE_PHASE_INFO = [
  { key: "menstrual", label: "1. Menstrual", days: "Days 1–5", flex: 5, desc: "Your period. Energy is often lowest here — a natural time to rest more." },
  { key: "follicular", label: "2. Follicular", days: "Days 6–13", flex: 8, desc: "After your period. Energy tends to build as estrogen rises." },
  { key: "ovulatory", label: "3. Ovulatory", days: "~Day 14", flex: 2, desc: "Mid-cycle. Often the highest-energy window, around when an egg is released." },
  { key: "luteal", label: "4. Luteal", days: "Days 15–28", flex: 13, desc: "After ovulation, before your next period. Energy gradually tapers; PMS symptoms can show up toward the end." },
];

function buildCyclePhaseInfoBody() {
  const body = el(`<div></div>`);
  body.appendChild(el(`<p class="muted" style="font-size:13px;margin:0 0 14px 0;line-height:1.5;">A general guide to a typical 28-day cycle — yours may run shorter, longer, or less predictably, and that's normal.</p>`));
  const track = el(`<div class="cycle-phase-track"></div>`);
  CYCLE_PHASE_INFO.forEach((p) => {
    track.appendChild(el(`<div class="cycle-phase-seg cycle-phase-${p.key}" style="flex:${p.flex};"></div>`));
  });
  body.appendChild(track);
  const cards = el(`<div class="cycle-phase-cards"></div>`);
  CYCLE_PHASE_INFO.forEach((p) => {
    cards.appendChild(el(`
      <div class="cycle-phase-card">
        <div class="cycle-phase-card-dot cycle-phase-${p.key}"></div>
        <div>
          <div class="cycle-phase-card-title">${escapeHtml(p.label)} <span class="muted" style="font-weight:400;">&middot; ${escapeHtml(p.days)}</span></div>
          <div class="cycle-phase-card-desc">${escapeHtml(p.desc)}</div>
        </div>
      </div>
    `));
  });
  body.appendChild(cards);
  body.appendChild(el(`<p class="muted" style="font-size:12px;margin:14px 0 0 0;line-height:1.5;">General education, not medical advice. If your cycle has been changing a lot, that's worth mentioning to your doctor.</p>`));
  return body;
}

function openFieldInfo(field, label) {
  const info = WELLNESS_FIELD_INFO[field];
  if (!info) return;
  if (info.type === "cycle") {
    infoModal(label, buildCyclePhaseInfoBody());
  } else if (info.type === "examples") {
    infoModal(label, buildExamplesInfoBody(info));
  }
}

function wellnessSelect(field, label, options, currentValue, onChange) {
  const wrap = el(`<div></div>`);
  const labelRow = el(`<div style="display:flex;align-items:center;gap:5px;margin-bottom:4px;"><label class="muted" style="font-size:11px;">${label}</label></div>`);
  if (WELLNESS_FIELD_INFO[field]) {
    const infoBtn = el(`<button type="button" class="field-info-btn" aria-label="What does ${escapeHtml(label)} mean?" title="What does ${escapeHtml(label)} mean?">${infoSvg}</button>`);
    infoBtn.addEventListener("click", () => openFieldInfo(field, label));
    labelRow.appendChild(infoBtn);
  }
  wrap.appendChild(labelRow);
  const select = document.createElement("select");
  select.className = `wellness-select ${wellnessColorClass(field, currentValue)}`;
  select.appendChild(el(`<option value="">—</option>`));
  options.forEach((opt) => {
    const value = typeof opt === "string" ? opt : opt.value;
    const text = typeof opt === "string" ? opt : opt.text;
    const title = typeof opt === "object" && opt.title ? opt.title : text;
    select.appendChild(
      el(`<option value="${escapeHtml(value)}" title="${escapeHtml(title)}" ${value === currentValue ? "selected" : ""}>${escapeHtml(text)}</option>`)
    );
  });
  const syncTitle = () => {
    const selectedOption = select.options[select.selectedIndex];
    select.title = selectedOption ? selectedOption.title : "";
  };
  select.addEventListener("change", () => {
    select.className = `wellness-select ${wellnessColorClass(field, select.value)}`;
    syncTitle();
    onChange(select.value || null);
  });
  syncTitle();
  wrap.appendChild(select);
  return wrap;
}

// Finds today's wellness log, creating a blank one if this is the first
// touch of the day. Shared by the Wellness page and Home's pillar tiles so
// both are always reading and writing the exact same row.
function ensureTodaysWellnessEntry(today) {
  let entry = state.wellness.find((l) => l.logDate === today);
  if (!entry) {
    entry = { id: nextId(), logDate: today };
    state.wellness.push(entry);
  }
  return entry;
}

// ------------------------------------------------------------------
// Sleep — a wind-down check-in the night before, a quick quality log the
// next morning, and (once there's enough real data) a trend report that
// looks for patterns across the two. The two halves merge into one
// "night" record keyed by the evening's date; a missed night just means
// that date has no record, it never resets the count toward unlocking
// the report. Once 10 nights are logged the report turns on and keeps
// recomputing over a rolling window, so it's a living read on current
// habits, not a one-time reward.
// ------------------------------------------------------------------
const SLEEP_MOOD_META = {
  calm: { emoji: "😌", label: "Calm" },
  woundup: { emoji: "😕", label: "Wound up" },
  anxious: { emoji: "😟", label: "Anxious" },
};
const SLEEP_QUALITY_META = {
  rough: { emoji: "😩", label: "Rough", score: 1 },
  okay: { emoji: "😌", label: "Okay", score: 2 },
  great: { emoji: "😴", label: "Great", score: 3 },
};
const SLEEP_HABITS = [
  ["noCaffeine", "No caffeine after 2pm"],
  ["phoneOff", "Phone off by target time"],
  ["noAlcohol", "No alcohol tonight"],
];
const SLEEP_NIGHTS_TO_UNLOCK = 10;
const SLEEP_TREND_WINDOW = 30;

// A night only counts as "protected" if it actually held up — enough hours
// against her own target, and not a night she rated Rough even if the
// hours were technically there (insomnia, restless sleep). The habit flags
// (caffeine, phone, alcohol) are never part of this check directly; they're
// the inputs the trend report correlates against this outcome, not the
// outcome itself.
function sleepNightProtected(entry) {
  if (!entry || !entry.am || entry.am.quality == null || entry.am.hours == null) return false;
  const target = state.sleepSettings?.targetHours || 7;
  return entry.am.quality !== "rough" && entry.am.hours >= target;
}

// Real record for a given night's date — creates it in state the first
// time something is actually saved against it. Never call this just to
// read a value; use sleepPeek for that, so opening the tab doesn't
// silently write empty draft entries into state.
function sleepEntryForDate(dateStr) {
  let entry = state.sleepLogs.find((e) => e.date === dateStr);
  if (!entry) {
    entry = { id: nextId(), date: dateStr, pm: null, am: null };
    state.sleepLogs.push(entry);
  }
  return entry;
}

// Read-only look at a night's date for rendering — returns a blank shape
// if nothing's been saved yet, without creating anything.
function sleepPeek(dateStr) {
  return state.sleepLogs.find((e) => e.date === dateStr) || { date: dateStr, pm: null, am: null };
}

// A "logged night" is one with a completed morning entry — that's the
// data point the progress counter and trend report both run on.
function sleepLoggedNights() {
  return state.sleepLogs
    .filter((e) => e.am && e.am.completedDate)
    .slice()
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

// Plain-language patterns over the most recent logged nights (capped at
// SLEEP_TREND_WINDOW so it stays a read on current habits, not a lifetime
// average). Returns null until there's enough data to say anything real;
// each individual insight only appears once there's enough of a sample
// on both sides of it to be worth mentioning.
function computeSleepTrend() {
  const nights = sleepLoggedNights();
  if (nights.length < SLEEP_NIGHTS_TO_UNLOCK) return null;
  const windowNights = nights.slice(0, SLEEP_TREND_WINDOW);
  const protectedCount = windowNights.filter((n) => sleepNightProtected(n)).length;
  const insights = [];

  const noCaffNights = windowNights.filter((n) => n.pm && n.pm.noCaffeine);
  if (noCaffNights.length >= 3) {
    const greatCount = noCaffNights.filter((n) => n.am.quality === "great").length;
    insights.push({
      icon: "☕",
      tone: "good",
      text: `Nights with <b>no late caffeine</b>, you slept "Great" <b>${greatCount} of ${noCaffNights.length}</b> times`,
      pct: Math.round((greatCount / noCaffNights.length) * 100),
    });
  }

  const withMovementFlag = windowNights.map((n) => ({
    n,
    moved: state.wellness.find((w) => w.logDate === n.date)?.movement === "Yes",
  }));
  const movedNights = withMovementFlag.filter((x) => x.moved);
  const restNights = withMovementFlag.filter((x) => !x.moved);
  if (movedNights.length >= 3 && restNights.length >= 3) {
    const avgScore = (arr) => arr.reduce((s, x) => s + SLEEP_QUALITY_META[x.n.am.quality].score, 0) / arr.length;
    const movedAvg = avgScore(movedNights);
    const restAvg = avgScore(restNights);
    if (restAvg > 0) {
      const diffPct = Math.round(((movedAvg - restAvg) / restAvg) * 100);
      if (Math.abs(diffPct) >= 5) {
        insights.push({
          icon: "🧘",
          tone: diffPct >= 0 ? "good" : "bad",
          text:
            diffPct >= 0
              ? `Sleep quality was <b>${diffPct}% higher</b> the night after you moved`
              : `Sleep quality was <b>${Math.abs(diffPct)}% lower</b> the night after you moved`,
          pct: Math.min(100, Math.abs(diffPct) + 40),
        });
      }
    }
  }

  const anxiousNights = windowNights.filter((n) => n.pm && n.pm.mood === "anxious" && n.am.hours != null);
  const calmerNights = windowNights.filter((n) => (!n.pm || n.pm.mood !== "anxious") && n.am.hours != null);
  if (anxiousNights.length >= 3 && calmerNights.length >= 3) {
    const avgHours = (arr) => arr.reduce((s, x) => s + x.am.hours, 0) / arr.length;
    const diff = avgHours(calmerNights) - avgHours(anxiousNights);
    if (Math.abs(diff) >= 0.3) {
      insights.push({
        icon: "😟",
        tone: "bad",
        text: `On "Anxious" nights, you slept about <b>${diff.toFixed(1)} fewer hours</b> on average`,
        pct: Math.min(100, Math.round(Math.abs(diff) * 30) + 30),
      });
    }
  }

  return { basedOn: windowNights.length, protectedCount, insights };
}

// Once today's wind-down or last night's log is saved, the card collapses
// to a one-line summary instead of staying open as a full form someone
// might mistake for unfinished — tapping it re-expands for editing. Plain
// in-memory flags, not persisted, same pattern as Home's "Your Spaces"
// collapse: they just reset to collapsed-by-default each fresh session.
let sleepPmExpanded = false;
let sleepAmExpanded = false;

function renderSleepWindDownCollapsed(pm, onExpand) {
  const moodMeta = SLEEP_MOOD_META[pm.mood];
  const row = el(`
    <button type="button" class="card sleep-card sleep-collapsed-row">
      <span class="sleep-collapsed-emoji">${moodMeta ? moodMeta.emoji : "🌙"}</span>
      <span class="sleep-collapsed-text">
        <span class="sleep-collapsed-title">Wind Down &mdash; Tonight</span>
        <span class="sleep-collapsed-sub">${moodMeta ? moodMeta.label + " &middot; " : ""}Saved for tonight</span>
      </span>
      <span class="sleep-collapsed-chevron">${chevronSvg}</span>
    </button>
  `);
  row.addEventListener("click", onExpand);
  return row;
}

function renderSleepMorningCollapsed(am, onExpand) {
  const qualityMeta = SLEEP_QUALITY_META[am.quality];
  const isProtected = sleepNightProtected({ am });
  const row = el(`
    <button type="button" class="card sleep-card sleep-collapsed-row">
      <span class="sleep-collapsed-emoji">${qualityMeta ? qualityMeta.emoji : "😴"}</span>
      <span class="sleep-collapsed-text">
        <span class="sleep-collapsed-title">How was last night?</span>
        <span class="sleep-collapsed-sub">${qualityMeta ? qualityMeta.label + " &middot; " : ""}${am.hours} hrs &middot; ${
    isProtected ? "Protected" : "Below target"
  }</span>
      </span>
      <span class="sleep-collapsed-chevron">${chevronSvg}</span>
    </button>
  `);
  row.addEventListener("click", onExpand);
  return row;
}

function renderSleepWindDownCard(today) {
  const view = sleepPeek(today);
  const pm = view.pm || { mood: null, note: "", noCaffeine: false, phoneOff: false, noAlcohol: false, completedDate: null };
  const isSaved = pm.completedDate === today;

  const withPm = (mutate) => {
    const entry = sleepEntryForDate(today);
    entry.pm ||= { mood: null, note: "", noCaffeine: false, phoneOff: false, noAlcohol: false, completedDate: null };
    mutate(entry.pm);
    scheduleSave();
    return entry.pm;
  };

  const card = el(`<div class="card sleep-card"></div>`);
  card.appendChild(el(`<strong>Wind Down &mdash; Tonight</strong>`));
  card.appendChild(el(`<div class="muted" style="font-size:12px;margin:2px 0 10px;">${escapeHtml(today)}</div>`));
  card.appendChild(el(`<div class="muted" style="font-size:12px;font-weight:600;margin-bottom:8px;">How are you feeling right now?</div>`));

  const moodRow = el(`<div class="sleep-mood-row"></div>`);
  Object.entries(SLEEP_MOOD_META).forEach(([key, meta]) => {
    const btn = el(
      `<button type="button" class="sleep-mood-choice${pm.mood === key ? " sel" : ""}"><span class="emoji">${meta.emoji}</span><span class="lbl">${meta.label}</span></button>`
    );
    btn.addEventListener("click", () => {
      withPm((p) => (p.mood = key));
      renderSleep();
    });
    moodRow.appendChild(btn);
  });
  card.appendChild(moodRow);

  const noteInput = document.createElement("input");
  noteInput.type = "text";
  noteInput.className = "sleep-note-input";
  noteInput.placeholder = "What's on your mind? (optional)";
  noteInput.value = pm.note || "";
  noteInput.addEventListener("change", () => withPm((p) => (p.note = noteInput.value)));
  card.appendChild(noteInput);

  card.appendChild(
    el(
      `<div class="muted" style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.04em;margin:12px 0 6px;">Tonight's habits</div>`
    )
  );
  SLEEP_HABITS.forEach(([key, label]) => {
    const row = el(`<label class="sleep-habit-row"><span class="sleep-habit-check${pm[key] ? " on" : ""}"></span> ${escapeHtml(label)}</label>`);
    row.addEventListener("click", (e) => {
      e.preventDefault();
      withPm((p) => (p[key] = !p[key]));
      renderSleep();
    });
    card.appendChild(row);
  });

  const saveBtn = el(`<button type="button" class="sleep-save-btn">${isSaved ? "Update tonight's wind-down" : "Start wind-down"}</button>`);
  saveBtn.addEventListener("click", () => {
    withPm((p) => (p.completedDate = today));
    sleepPmExpanded = false;
    renderSleep();
  });
  card.appendChild(saveBtn);
  if (isSaved) card.appendChild(el(`<div class="sleep-saved-note">Saved for tonight</div>`));
  return card;
}

function renderSleepMorningCard(nightDate, today) {
  const view = sleepPeek(nightDate);
  const am = view.am || { quality: null, hours: 7, completedDate: null };
  const isSaved = am.completedDate === today;

  const withAm = (mutate) => {
    const entry = sleepEntryForDate(nightDate);
    entry.am ||= { quality: null, hours: 7, completedDate: null };
    mutate(entry.am);
    scheduleSave();
    return entry.am;
  };

  const card = el(`<div class="card sleep-card"></div>`);
  card.appendChild(el(`<strong>How was last night?</strong>`));
  card.appendChild(el(`<div class="muted" style="font-size:12px;margin:2px 0 10px;">${escapeHtml(nightDate)}</div>`));

  const qualityRow = el(`<div class="sleep-mood-row"></div>`);
  Object.entries(SLEEP_QUALITY_META).forEach(([key, meta]) => {
    const btn = el(
      `<button type="button" class="sleep-mood-choice${am.quality === key ? " sel" : ""}"><span class="emoji">${meta.emoji}</span><span class="lbl">${meta.label}</span></button>`
    );
    btn.addEventListener("click", () => {
      withAm((a) => (a.quality = key));
      renderSleep();
    });
    qualityRow.appendChild(btn);
  });
  card.appendChild(qualityRow);

  const hoursRow = el(`
    <div class="sleep-hours-row">
      <div><div class="muted" style="font-size:11px;">Hours slept</div><div class="sleep-hours-big">${am.hours}</div></div>
      <div class="sleep-stepper"><button type="button" data-dir="-1">&minus;</button><button type="button" data-dir="1">+</button></div>
    </div>
  `);
  hoursRow.querySelectorAll("button[data-dir]").forEach((b) => {
    b.addEventListener("click", () => {
      withAm((a) => {
        a.hours = Math.max(0, Math.min(14, Math.round((a.hours + Number(b.dataset.dir) * 0.5) * 2) / 2));
      });
      renderSleep();
    });
  });
  card.appendChild(hoursRow);

  if (am.quality != null) {
    const isProtected = sleepNightProtected({ am });
    card.appendChild(
      el(`
        <div class="sleep-target-feedback ${isProtected ? "good" : "bad"}">
          ${
            isProtected
              ? "Meets your sleep target"
              : `Short of your ${state.sleepSettings.targetHours}hr target${am.quality === "rough" ? " &mdash; rated Rough" : ""}`
          }
        </div>
      `)
    );
  }

  const dayEntry = state.wellness.find((w) => w.logDate === nightDate);
  if (dayEntry?.movement === "Yes") {
    card.appendChild(el(`<div class="sleep-autodetect-chip"><span class="sleep-chip-tick">&#10003;</span> Auto-detected: you moved that day</div>`));
  }

  const saveBtn = el(`<button type="button" class="sleep-save-btn">${isSaved ? "Update last night" : "Save last night"}</button>`);
  saveBtn.addEventListener("click", () => {
    if (am.quality == null) return;
    withAm((a) => (a.completedDate = today));
    sleepAmExpanded = false;
    renderSleep();
  });
  card.appendChild(saveBtn);
  if (isSaved) card.appendChild(el(`<div class="sleep-saved-note">Saved</div>`));
  return card;
}

function renderSleepProgressCard() {
  const count = sleepLoggedNights().length;
  const remaining = SLEEP_NIGHTS_TO_UNLOCK - count;
  const card = el(`<div class="sleep-progress-card"></div>`);
  card.appendChild(el(`<div class="sleep-progress-label">${count} of ${SLEEP_NIGHTS_TO_UNLOCK} nights logged</div>`));
  const dots = el(`<div class="sleep-progress-dots"></div>`);
  for (let i = 0; i < SLEEP_NIGHTS_TO_UNLOCK; i++) {
    dots.appendChild(el(`<span class="${i < count ? "done" : ""}"></span>`));
  }
  card.appendChild(dots);
  card.appendChild(el(`<div class="sleep-progress-sub">${remaining} more night${remaining === 1 ? "" : "s"} and your trend report unlocks</div>`));
  return card;
}

function renderSleepTrendCard(trend) {
  const wrap = el(`<div></div>`);
  const hero = el(`
    <div class="sleep-report-hero">
      <div class="sleep-report-label">Based on your last ${trend.basedOn} nights</div>
      <h3>You protected your sleep on ${trend.protectedCount} of ${trend.basedOn} nights</h3>
      <div class="sleep-report-sub">Refreshes every night &mdash; nothing to unlock again</div>
    </div>
  `);
  wrap.appendChild(hero);
  if (!trend.insights.length) {
    wrap.appendChild(el(`<div class="account-note">No strong patterns yet — keep logging and this will fill in.</div>`));
  }
  trend.insights.forEach((ins) => {
    wrap.appendChild(
      el(`
        <div class="sleep-insight-card">
          <div class="sleep-insight-top">
            <span class="sleep-insight-ic ${ins.tone}">${ins.icon}</span>
            <div class="sleep-insight-text">${ins.text}</div>
          </div>
          <div class="sleep-bar-track"><div class="sleep-bar-fill ${ins.tone}" style="width:${ins.pct}%;"></div></div>
        </div>
      `)
    );
  });
  return wrap;
}

function renderSleepHistory(panel) {
  const nights = sleepLoggedNights().slice(0, 14).reverse();
  if (!nights.length) return;
  panel.appendChild(
    el(
      `<div class="muted" style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.04em;margin:16px 0 8px;">Recent nights &mdash; tap to edit</div>`
    )
  );
  const row = el(`<div class="sleep-dot-cal"></div>`);
  nights.forEach((n) => {
    const tone = n.am.quality === "great" ? "good" : n.am.quality === "rough" ? "bad" : "mid";
    const dot = el(
      `<button type="button" class="sleep-dot ${tone}" title="${escapeHtml(n.date)} — ${SLEEP_QUALITY_META[n.am.quality]?.label || ""}"></button>`
    );
    dot.addEventListener("click", () => openSleepNightEditor(n.date));
    row.appendChild(dot);
  });
  panel.appendChild(row);
}

// A single night's full record, editable regardless of date — the inline
// cards on the tab only ever expose tonight and last night, so this is
// the only way to go back and fix an older night (a typo'd hours value,
// a quality picked in a hurry) the same way Wellness's day editor already
// lets you correct any past day.
function openSleepNightEditor(dateStr) {
  const entry = sleepEntryForDate(dateStr);
  entry.pm ||= { mood: null, note: "", noCaffeine: false, phoneOff: false, noAlcohol: false, completedDate: null };
  entry.am ||= { quality: null, hours: 7, completedDate: null };

  const overlay = el(`
    <div class="modal-overlay">
      <div class="modal-box info-modal-box sleep-editor-box">
        <div class="info-modal-header">
          <h3>${escapeHtml(dateStr)}</h3>
          <button type="button" class="icon-btn info-modal-close" aria-label="Close">${closeSvg}</button>
        </div>
        <div class="info-modal-body">
          <div class="sleep-editor-section-label">Evening</div>
          <div class="sleep-editor-mood-row"></div>
          <input class="sleep-note-input sleep-editor-note" type="text" placeholder="What's on your mind? (optional)" />
          <div class="sleep-editor-habits"></div>
          <div class="sleep-editor-section-label" style="margin-top:16px;">Morning</div>
          <div class="sleep-editor-quality-row"></div>
          <div class="sleep-editor-hours-row"></div>
          <div class="sleep-editor-feedback"></div>
          <div style="margin-top:16px;display:flex;justify-content:flex-end;">
            <button type="button" class="btn-primary sleep-editor-done" style="padding:8px 18px;border-radius:8px;border:none;">Done</button>
          </div>
        </div>
      </div>
    </div>
  `);

  const moodRow = overlay.querySelector(".sleep-editor-mood-row");
  const renderMoodRow = () => {
    moodRow.innerHTML = "";
    Object.entries(SLEEP_MOOD_META).forEach(([key, meta]) => {
      const btn = el(
        `<button type="button" class="sleep-mood-choice${entry.pm.mood === key ? " sel" : ""}"><span class="emoji">${meta.emoji}</span><span class="lbl">${meta.label}</span></button>`
      );
      btn.addEventListener("click", () => {
        entry.pm.mood = key;
        scheduleSave();
        renderMoodRow();
      });
      moodRow.appendChild(btn);
    });
  };
  renderMoodRow();

  const noteInput = overlay.querySelector(".sleep-editor-note");
  noteInput.value = entry.pm.note || "";
  noteInput.addEventListener("change", () => {
    entry.pm.note = noteInput.value;
    scheduleSave();
  });

  const habitsWrap = overlay.querySelector(".sleep-editor-habits");
  const renderHabits = () => {
    habitsWrap.innerHTML = "";
    SLEEP_HABITS.forEach(([key, label]) => {
      const row = el(
        `<label class="sleep-habit-row"><span class="sleep-habit-check${entry.pm[key] ? " on" : ""}"></span> ${escapeHtml(label)}</label>`
      );
      row.addEventListener("click", (e) => {
        e.preventDefault();
        entry.pm[key] = !entry.pm[key];
        scheduleSave();
        renderHabits();
      });
      habitsWrap.appendChild(row);
    });
  };
  renderHabits();

  const qualityRow = overlay.querySelector(".sleep-editor-quality-row");
  const feedbackWrap = overlay.querySelector(".sleep-editor-feedback");
  const renderFeedback = () => {
    feedbackWrap.innerHTML = "";
    if (entry.am.quality == null) return;
    const isProtected = sleepNightProtected(entry);
    feedbackWrap.appendChild(
      el(`
        <div class="sleep-target-feedback ${isProtected ? "good" : "bad"}">
          ${
            isProtected
              ? "Meets your sleep target"
              : `Short of your ${state.sleepSettings.targetHours}hr target${entry.am.quality === "rough" ? " &mdash; rated Rough" : ""}`
          }
        </div>
      `)
    );
  };
  const renderQualityRow = () => {
    qualityRow.innerHTML = "";
    Object.entries(SLEEP_QUALITY_META).forEach(([key, meta]) => {
      const btn = el(
        `<button type="button" class="sleep-mood-choice${entry.am.quality === key ? " sel" : ""}"><span class="emoji">${meta.emoji}</span><span class="lbl">${meta.label}</span></button>`
      );
      btn.addEventListener("click", () => {
        entry.am.quality = key;
        scheduleSave();
        renderQualityRow();
        renderFeedback();
      });
      qualityRow.appendChild(btn);
    });
  };
  renderQualityRow();

  const hoursRow = overlay.querySelector(".sleep-editor-hours-row");
  const renderHoursRow = () => {
    hoursRow.innerHTML = "";
    hoursRow.appendChild(
      el(`
        <div class="sleep-hours-row">
          <div><div class="muted" style="font-size:11px;">Hours slept</div><div class="sleep-hours-big">${entry.am.hours}</div></div>
          <div class="sleep-stepper"><button type="button" data-dir="-1">&minus;</button><button type="button" data-dir="1">+</button></div>
        </div>
      `)
    );
    hoursRow.querySelectorAll("button[data-dir]").forEach((b) => {
      b.addEventListener("click", () => {
        entry.am.hours = Math.max(0, Math.min(14, Math.round((entry.am.hours + Number(b.dataset.dir) * 0.5) * 2) / 2));
        scheduleSave();
        renderHoursRow();
        renderFeedback();
      });
    });
  };
  renderHoursRow();
  renderFeedback();

  const close = () => {
    // Only counts as a real, dated entry once there's actually a quality
    // logged — an editor opened and closed without picking anything
    // shouldn't leave a phantom completedDate behind.
    if (entry.am.quality != null) entry.am.completedDate = entry.am.completedDate || dateStr;
    if (entry.pm.mood != null || entry.pm.note || entry.pm.noCaffeine || entry.pm.phoneOff || entry.pm.noAlcohol) {
      entry.pm.completedDate = entry.pm.completedDate || dateStr;
    }
    scheduleSave();
    overlay.remove();
    renderSleep();
  };
  overlay.querySelector(".info-modal-close").addEventListener("click", close);
  overlay.querySelector(".sleep-editor-done").addEventListener("click", close);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });
  document.body.appendChild(overlay);
}

function renderSleepTargetControl() {
  const wrap = el(`<div class="sleep-target-row"></div>`);
  wrap.appendChild(el(`<span class="muted" style="font-size:12px;">Your target</span>`));
  const big = el(`<span class="sleep-target-value">${state.sleepSettings.targetHours}</span>`);
  wrap.appendChild(big);
  wrap.appendChild(el(`<span class="muted" style="font-size:12px;">hrs a night</span>`));
  const stepper = el(`<div class="sleep-stepper"><button type="button" data-dir="-1">&minus;</button><button type="button" data-dir="1">+</button></div>`);
  stepper.querySelectorAll("button[data-dir]").forEach((b) => {
    b.addEventListener("click", () => {
      state.sleepSettings.targetHours = Math.max(4, Math.min(11, Math.round((state.sleepSettings.targetHours + Number(b.dataset.dir) * 0.5) * 2) / 2));
      scheduleSave();
      renderSleep();
    });
  });
  wrap.appendChild(stepper);
  return wrap;
}

function renderSleep() {
  const panel = document.getElementById("panel-sleep");
  if (!panel) return;
  panel.innerHTML = "";
  const today = todayISO();
  const yesterday = addDays(today, -1);
  panel.appendChild(el(`<h2 class="section-title serif">Sleep</h2>`));
  panel.appendChild(renderSleepTargetControl());

  const pmView = sleepPeek(today);
  const pmSavedToday = pmView.pm?.completedDate === today;
  if (pmSavedToday && !sleepPmExpanded) {
    panel.appendChild(renderSleepWindDownCollapsed(pmView.pm, () => { sleepPmExpanded = true; renderSleep(); }));
  } else {
    panel.appendChild(renderSleepWindDownCard(today));
  }

  const amView = sleepPeek(yesterday);
  const amSavedToday = amView.am?.completedDate === today;
  if (amSavedToday && !sleepAmExpanded) {
    panel.appendChild(renderSleepMorningCollapsed(amView.am, () => { sleepAmExpanded = true; renderSleep(); }));
  } else {
    panel.appendChild(renderSleepMorningCard(yesterday, today));
  }
  const trend = computeSleepTrend();
  panel.appendChild(trend ? renderSleepTrendCard(trend) : renderSleepProgressCard());
  renderSleepHistory(panel);
}

function renderWellness() {
  const panel = document.getElementById("panel-wellness");
  const today = todayISO();
  const todays = ensureTodaysWellnessEntry(today);

  panel.innerHTML = "";
  panel.appendChild(el(`<h2 class="section-title serif">Daily Wellness</h2>`));

  const wellnessHere = computeWellnessProgress(today);
  panel.appendChild(
    buildProgressCard(
      "Wellness Progress",
      wellnessHere.pct,
      `<strong>${wellnessHere.stats.goodCount} of ${wellnessHere.stats.totalCount}</strong> good days so far this cycle<br/>${wellnessHere.prize.cycleStartDate} &mdash; ${wellnessHere.stats.endDate}`,
      wellnessHere.tones,
      "Last 14 days",
      null
    )
  );

  renderIdentityQuote(panel);

  const card = el(`<div class="card"><strong>Today &mdash; ${today}</strong><div style="margin-top:12px;display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:10px;"></div></div>`);
  const grid = card.querySelector("div > div");

  Object.entries(WELLNESS_ENUM_FIELDS).forEach(([key, { label, options }]) => {
    grid.appendChild(
      wellnessSelect(key, label, options, todays[key] || "", (val) => {
        todays[key] = val;
        scheduleSave();
      })
    );
  });
  WELLNESS_YESNO_FIELDS.forEach(([key, label]) => {
    grid.appendChild(
      wellnessSelect(key, label, ["Yes", "No"], todays[key] || "", (val) => {
        todays[key] = val;
        scheduleSave();
      })
    );
  });

  const notesWrap = el(`<div style="margin-top:12px;display:flex;flex-direction:column;gap:10px;"></div>`);
  WELLNESS_NOTE_FIELDS.forEach(([key, label]) => {
    const field = el(`<div></div>`);
    field.appendChild(el(`<label class="muted" style="display:block;font-size:12px;margin-bottom:4px;">${escapeHtml(label)}</label>`));
    const input = document.createElement("input");
    input.type = "text";
    input.style.width = "100%";
    input.style.boxSizing = "border-box";
    input.value = todays[key] || "";
    input.addEventListener("change", () => {
      todays[key] = input.value || null;
      scheduleSave();
    });
    field.appendChild(input);
    notesWrap.appendChild(field);
  });
  card.appendChild(notesWrap);
  panel.appendChild(card);

  const bonusStats = computeBonusCycleStats(state.veronikasPrize, today);
  renderQuarterlyProgress(panel, today, bonusStats);
  renderBonusPrize(panel, today, bonusStats);
  renderWellnessHistory(panel, today);
}

// Shared editor for a single day's wellness log, whether that's a day with
// no data at all yet or one that just needs a correction. Reuses the same
// selects/notes as Today's card so editing history never feels like a
// different, lesser feature.
function openWellnessDayEditor(dateStr, onClose) {
  let entry = state.wellness.find((l) => l.logDate === dateStr);
  if (!entry) {
    entry = { id: nextId(), logDate: dateStr };
    state.wellness.push(entry);
  }
  const overlay = el(`
    <div class="modal-overlay">
      <div class="modal-box info-modal-box wellness-editor-box">
        <div class="info-modal-header">
          <h3>${escapeHtml(dateStr)}</h3>
          <button type="button" class="icon-btn info-modal-close wellness-editor-close" aria-label="Close">${closeSvg}</button>
        </div>
        <div class="info-modal-body">
          <div class="wellness-editor-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:10px;"></div>
          <div class="wellness-editor-notes" style="margin-top:12px;display:flex;flex-direction:column;gap:10px;"></div>
          <div style="margin-top:16px;display:flex;justify-content:flex-end;">
            <button type="button" class="btn-primary wellness-editor-done" style="padding:8px 18px;border-radius:8px;border:none;">Done</button>
          </div>
        </div>
      </div>
    </div>
  `);
  const grid = overlay.querySelector(".wellness-editor-grid");
  Object.entries(WELLNESS_ENUM_FIELDS).forEach(([key, { label, options }]) => {
    grid.appendChild(
      wellnessSelect(key, label, options, entry[key] || "", (val) => {
        entry[key] = val;
        scheduleSave();
      })
    );
  });
  WELLNESS_YESNO_FIELDS.forEach(([key, label]) => {
    grid.appendChild(
      wellnessSelect(key, label, ["Yes", "No"], entry[key] || "", (val) => {
        entry[key] = val;
        scheduleSave();
      })
    );
  });
  const notesWrap = overlay.querySelector(".wellness-editor-notes");
  WELLNESS_NOTE_FIELDS.forEach(([key, label]) => {
    const field = el(`<div></div>`);
    field.appendChild(el(`<label class="muted" style="display:block;font-size:12px;margin-bottom:4px;">${escapeHtml(label)}</label>`));
    const input = document.createElement("input");
    input.type = "text";
    input.style.width = "100%";
    input.style.boxSizing = "border-box";
    input.value = entry[key] || "";
    input.addEventListener("change", () => {
      entry[key] = input.value || null;
      scheduleSave();
    });
    field.appendChild(input);
    notesWrap.appendChild(field);
  });
  const close = () => {
    overlay.remove();
    if (onClose) onClose();
  };
  overlay.querySelector(".wellness-editor-close").addEventListener("click", close);
  overlay.querySelector(".wellness-editor-done").addEventListener("click", close);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });
  document.body.appendChild(overlay);
}

// ------------------------------------------------------------------
// Her Bonus to Myself — an identity statement at the very top of the
// tab, her quarterly progress toward it (dots, not percentages), and a
// self-directed check-in once the window runs out. Never an automatic
// pass/fail: claiming or extending is always her call.
//
// Split into three pieces (quote / progress / prize) so they can sit
// in whatever order the page wants — quote first, then today's
// check-in, then progress, then the prize itself.
// ------------------------------------------------------------------
function computeBonusCycleStats(prize, today) {
  const endDate = addDays(prize.cycleStartDate, prize.cycleLengthDays);
  const reached = today >= endDate;
  const days = [];
  let cursor = prize.cycleStartDate;
  let goodCount = 0;
  let totalCount = 0;
  while (cursor <= endDate && cursor <= today) {
    const entry = state.wellness.find((w) => w.logDate === cursor);
    const positive = isWellnessDayPositive(entry);
    if (positive) goodCount++;
    totalCount++;
    days.push({ date: cursor, positive });
    cursor = addDays(cursor, 1);
  }
  return { endDate, reached, goodCount, totalCount, days };
}

// Same "good day" logic as isWellnessDayPositive, but as a 3-step tone
// instead of a strict yes/no, so a day with SOME logging that just missed
// the 80% bar still reads as "partial" rather than looking identical to a
// day nothing was logged at all. Used by the Home tab's 14-day grid.
function wellnessDayTone(entry) {
  if (!entry) return "none";
  const classes = [];
  WELLNESS_YESNO_FIELDS.forEach(([k]) => {
    if (entry[k]) classes.push(wellnessColorClass(k, entry[k]));
  });
  if (entry.foodQuality) classes.push(wellnessColorClass("foodQuality", entry.foodQuality));
  const good = classes.filter((c) => c === "good").length;
  const bad = classes.filter((c) => c === "bad").length;
  if (good + bad === 0) return "none";
  return good / (good + bad) >= 0.8 ? "good" : "mixed";
}

const TRACKING_TONE_COLOR = {
  none: "var(--border)",
  mixed: "var(--accent)",
  good: "var(--accent-dark)",
};

// Renders the little 14-cell tone strip shared by the Wellness and Workout
// Progress cards — same shape, same color ramp, just fed a different list
// of day tones so the two read as one family rather than two one-off bits
// of UI.
function renderTrackingGrid(tones, caption) {
  const cellsHtml = tones.map((tone) => `<div class="tracking-cell" style="background:${TRACKING_TONE_COLOR[tone] || TRACKING_TONE_COLOR.none};"></div>`).join("");
  return el(`
    <div class="tracking-grid-wrap">
      <div class="tracking-grid">${cellsHtml}</div>
      <div class="tracking-grid-caption">${escapeHtml(caption)}</div>
    </div>
  `);
}

// The ring-plus-grid card shape shared by Wellness Progress and Workout
// Progress. `onOpen` is a click handler for an "Open →" link (used on the
// Home tab, where the card is a teaser for another page); pass null when
// the card is rendered at the top of that page itself, since there's
// nowhere left to open it to.
function buildProgressCard(title, pct, ringCaptionHtml, tones, gridCaption, onOpen) {
  const card = el(`<div class="card"></div>`);
  const header = el(`
    <div class="home-card-header">
      <div style="font-weight:600;">${escapeHtml(title)}</div>
      ${onOpen ? `<button type="button" class="mini-link">Open &rarr;</button>` : ""}
    </div>
  `);
  if (onOpen) header.querySelector(".mini-link").addEventListener("click", onOpen);
  card.appendChild(header);
  card.appendChild(el(`
    <div class="home-streak-row">
      <div class="home-streak-ring" style="background:conic-gradient(var(--accent) ${pct}%, var(--border) ${pct}% 100%);">
        <div class="home-streak-ring-inner">${pct}%</div>
      </div>
      <div class="home-streak-caption">${ringCaptionHtml}</div>
    </div>
  `));
  card.appendChild(renderTrackingGrid(tones, gridCaption));
  return card;
}

// Shared by Home's Wellness Progress card and the same card at the top of
// the Wellness page itself, so the two never drift out of sync.
function computeWellnessProgress(today) {
  const prize = state.veronikasPrize;
  const stats = computeBonusCycleStats(prize, today);
  const pct = stats.totalCount ? Math.round((stats.goodCount / stats.totalCount) * 100) : 0;
  const tones = [];
  for (let i = 13; i >= 0; i--) {
    const date = addDays(today, -i);
    const entry = state.wellness.find((w) => w.logDate === date);
    tones.push(wellnessDayTone(entry));
  }
  return { prize, stats, pct, tones };
}

// ------------------------------------------------------------------
// Home — a quiet, read-only summary that lives dead center in the nav
// on mobile (a fixed circle, never scrolled away) and first in the
// sidebar on desktop. Pulls the same identity quote / wellness
// progress / bonus data straight from Wellness — nothing is editable
// here, tapping "Open" just switches to the Wellness tab for that.
// ------------------------------------------------------------------
function renderHome() {
  const panel = document.getElementById("panel-home");
  if (!panel) return;
  panel.innerHTML = "";

  const today = todayISO();

  panel.appendChild(el(`<div class="home-greeting">Good ${homeGreetingTime()}</div>`));

  panel.appendChild(renderHomeHero(today));
  panel.appendChild(renderYourSpaces());

  panel.appendChild(el(`<div class="muted" style="font-size:12px;text-align:center;margin-top:8px;">Tap a pillar above to log it, or a space below to open it.</div>`));
}

// The new front door: wellness ring + reward + today's four pillars, all in
// one card, so Wellness no longer needs its own bottom-bar slot — Home
// *is* Wellness plus the reward now. Tapping an unfilled pillar logs a
// quick "Yes" for today; tapping one that's already done reopens the full
// day editor in case it needs correcting. "See full wellness history"
// still reaches the original Wellness page (cycle settings, history,
// notes) — that page didn't go away, it's just not pinned to the bar.
function renderHomeHero(today) {
  const todaysEntry = ensureTodaysWellnessEntry(today);
  ensurePillarSourceDefaults();
  applyPillarAutoDetection(todaysEntry, today);
  const wellness = computeWellnessProgress(today);
  const prize = wellness.prize;

  const hero = el(`<div class="card"></div>`);

  hero.appendChild(el(`
    <div class="home-hero-top">
      <div class="home-streak-ring" style="background:conic-gradient(var(--accent) ${wellness.pct}%, var(--border) ${wellness.pct}% 100%);">
        <div class="home-streak-ring-inner">${wellness.pct}%</div>
      </div>
      <div>
        <div class="home-hero-eyebrow">This cycle's progress</div>
        <div class="home-streak-caption"><strong>${wellness.stats.goodCount} of ${wellness.stats.totalCount}</strong> good days &middot; ${wellness.stats.reached ? "ready to claim" : `${wellness.stats.endDate} target`}</div>
      </div>
    </div>
  `));

  const prizeBanner = el(`<div class="home-hero-prize-banner"></div>`);
  if (prize.itemPhoto) {
    prizeBanner.appendChild(el(`<img src="${prize.itemPhoto}" />`));
  } else {
    prizeBanner.appendChild(el(`<div class="home-hero-prize-banner-noimg">No photo yet — tap to add one</div>`));
  }
  prizeBanner.appendChild(el(`
    <div class="home-hero-prize-scrim">
      <div class="home-hero-prize-name">${escapeHtml(prize.itemName || "Not named yet")}</div>
      <div class="home-hero-prize-sub">${wellness.stats.reached ? "Ready to claim" : `Unlocks ${wellness.stats.endDate}`}</div>
    </div>
  `));
  prizeBanner.addEventListener("click", () => activateTab("wellness"));
  hero.appendChild(prizeBanner);

  hero.appendChild(el(`<div class="home-hero-pillars-label">Today</div>`));
  const grid = el(`<div class="home-hero-pillars"></div>`);
  WELLNESS_YESNO_FIELDS.forEach(([key, label]) => {
    const done = todaysEntry[key] === "Yes";
    const source = pillarSourceLabel(key);
    const tile = el(`
      <button type="button" class="home-pillar${done ? " done" : ""}">
        <span class="home-pillar-icon ${done ? "on" : "off"}">${done ? checkSvg : ""}</span>
        <span class="home-pillar-label">${escapeHtml(label)}</span>
        ${source ? `<span class="home-pillar-source">via ${escapeHtml(source)}</span>` : ""}
      </button>
    `);
    tile.addEventListener("click", () => {
      if (done) {
        openWellnessDayEditor(today, () => renderHome());
      } else {
        todaysEntry[key] = "Yes";
        scheduleSave();
        renderHome();
      }
    });
    grid.appendChild(tile);
  });
  hero.appendChild(grid);

  const historyLink = el(`<button type="button" class="home-hero-history-link">See full wellness history &rarr;</button>`);
  historyLink.addEventListener("click", () => activateTab("wellness"));
  hero.appendChild(historyLink);

  return hero;
}

// One card for everything space-related on Home: your added spaces (collapsed
// to a quiet icon preview by default, expandable to the full grid in place)
// plus a single line at the bottom pointing to the Gallery for adding more.
// Nothing here adds a space directly — tapping the gallery line just opens
// Settings on the Gallery sub-tab so you can browse and decide there.
let homeYourSpacesExpanded = false; // resets each session, not persisted

function renderYourSpaces() {
  const wrap = el(`<div class="card"></div>`);
  const visible = state.sheets.filter((s) => s.visible && s.id !== "wellness");

  const head = el(`
    <button type="button" class="home-yourspaces-head">
      <span class="home-yourspaces-head-left">
        <span class="home-yourspaces-title">Your spaces</span>
        <span class="home-yourspaces-count">${visible.length} added</span>
      </span>
      <span class="home-yourspaces-chevron${homeYourSpacesExpanded ? " open" : ""}">${chevronSvg}</span>
    </button>
  `);
  head.addEventListener("click", () => {
    homeYourSpacesExpanded = !homeYourSpacesExpanded;
    renderHome();
  });
  wrap.appendChild(head);

  if (visible.length) {
    if (homeYourSpacesExpanded) {
      const grid = el(`<div class="home-yourspaces-grid"></div>`);
      visible.forEach((s) => {
        const tile = el(`
          <button type="button" class="home-yourspaces-tile">
            <span class="home-yourspaces-tile-icon">${iconSvg(sheetIcon(s))}</span>
            <span class="home-yourspaces-tile-label">${escapeHtml(sheetLabel(s))}</span>
          </button>
        `);
        tile.addEventListener("click", () => activateTab(s.id));
        grid.appendChild(tile);
      });
      wrap.appendChild(grid);
    } else {
      const previewRow = el(`<div class="home-yourspaces-preview-row"></div>`);
      const previewCount = Math.min(4, visible.length);
      visible.slice(0, previewCount).forEach((s) => {
        const dot = el(`<button type="button" class="home-yourspaces-preview-dot">${iconSvg(sheetIcon(s))}</button>`);
        dot.addEventListener("click", (e) => {
          e.stopPropagation();
          activateTab(s.id);
        });
        previewRow.appendChild(dot);
      });
      const remaining = visible.length - previewCount;
      previewRow.appendChild(
        el(`<span class="home-yourspaces-preview-more">${remaining > 0 ? `+${remaining} more · ` : ""}tap to view all</span>`)
      );
      wrap.appendChild(previewRow);
    }
  }

  const galleryLink = el(`
    <button type="button" class="home-yourspaces-gallery-link">
      Add more spaces from the gallery ${chevronSvg}
    </button>
  `);
  galleryLink.style.setProperty("--chevron-rotate", "-90deg");
  galleryLink.querySelector("svg").style.transform = "rotate(-90deg)";
  galleryLink.addEventListener("click", () => {
    settingsSubTab = "gallery";
    activateTab("settings");
  });
  wrap.appendChild(galleryLink);

  return wrap;
}

function homeGreetingTime() {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 18) return "afternoon";
  return "evening";
}

function renderIdentityQuote(panel) {
  const prize = state.veronikasPrize;
  const card = el(`<div class="card"></div>`);

  const quoteBox = el(`
    <div class="prize-quote">
      <textarea class="auto-grow" rows="2" placeholder="Who do you say you are?">${escapeHtml(prize.quote)}</textarea>
    </div>
  `);
  const quoteTextarea = quoteBox.querySelector("textarea");
  const autoGrowQuote = () => {
    quoteTextarea.style.height = "auto";
    quoteTextarea.style.height = quoteTextarea.scrollHeight + "px";
  };
  quoteTextarea.addEventListener("input", autoGrowQuote);
  quoteTextarea.addEventListener("change", (e) => {
    prize.quote = e.target.value;
    scheduleSave();
  });
  card.appendChild(quoteBox);
  requestAnimationFrame(autoGrowQuote);

  panel.appendChild(card);
}

function renderQuarterlyProgress(panel, today, stats) {
  const prize = state.veronikasPrize;
  const { endDate, days } = stats;

  const card = el(`<div class="card"></div>`);
  const headerRow = el(`
    <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:2px;">
      <div style="font-weight:600;">Wellness Progress</div>
      <button type="button" class="btn-ghost small prize-edit-toggle">Edit</button>
    </div>
  `);
  card.appendChild(headerRow);
  card.appendChild(el(`<div class="muted" style="font-size:13px;margin-bottom:2px;">${prize.cycleStartDate} &mdash; ${endDate} &middot; from Daily Wellness</div>`));

  const presetLengths = [
    { value: "30", label: "1 month" },
    { value: "60", label: "2 months" },
    { value: "90", label: "Quarterly (3 months)" },
    { value: "180", label: "6 months" },
    { value: "custom", label: "Custom" },
  ];
  const matchingPreset = presetLengths.find((p) => p.value === String(prize.cycleLengthDays));
  const settingsForm = el(`
    <div class="prize-settings-form" style="display:none;">
      <label class="muted" style="display:block;font-size:12px;margin-bottom:4px;">Timeframe</label>
      <select class="prize-length-select">
        ${presetLengths
          .map((p) => {
            const isSelected = matchingPreset ? p.value === matchingPreset.value : p.value === "custom";
            return `<option value="${p.value}" ${isSelected ? "selected" : ""}>${p.label}</option>`;
          })
          .join("")}
      </select>
      <input type="number" min="1" class="prize-length-custom" placeholder="Number of days" value="${matchingPreset ? "" : prize.cycleLengthDays}" style="${matchingPreset ? "display:none;" : ""}margin-top:8px;width:100%;box-sizing:border-box;" />
      <label class="muted" style="display:block;font-size:12px;margin:10px 0 4px 0;">Start date</label>
      <input type="date" class="prize-start-date" value="${prize.cycleStartDate}" style="width:100%;box-sizing:border-box;" />
      <button type="button" class="btn-primary small prize-save-settings" style="margin-top:10px;width:100%;">Save timeframe</button>
    </div>
  `);
  card.appendChild(settingsForm);

  headerRow.querySelector(".prize-edit-toggle").addEventListener("click", () => {
    settingsForm.style.display = settingsForm.style.display === "none" ? "block" : "none";
  });
  settingsForm.querySelector(".prize-length-select").addEventListener("change", (e) => {
    settingsForm.querySelector(".prize-length-custom").style.display = e.target.value === "custom" ? "block" : "none";
  });
  settingsForm.querySelector(".prize-save-settings").addEventListener("click", () => {
    const lengthSelect = settingsForm.querySelector(".prize-length-select").value;
    const customDays = parseInt(settingsForm.querySelector(".prize-length-custom").value, 10);
    const newLength = lengthSelect === "custom" ? customDays : parseInt(lengthSelect, 10);
    const newStart = settingsForm.querySelector(".prize-start-date").value;
    if (newLength && newLength > 0) prize.cycleLengthDays = newLength;
    if (newStart) prize.cycleStartDate = newStart;
    scheduleSave();
    renderWellness();
  });

  const calGrid = el(`<div class="prize-cal-grid"></div>`);
  days.forEach(({ positive }) => {
    calGrid.appendChild(el(`<div class="prize-cal-cell ${positive ? "good" : ""}"></div>`));
  });
  card.appendChild(calGrid);

  panel.appendChild(card);
}

function renderBonusPrize(panel, today, stats) {
  const prize = state.veronikasPrize;
  const { endDate, reached, goodCount, totalCount } = stats;

  const card = el(`<div class="card"></div>`);
  card.appendChild(el(`<div style="font-weight:600;margin-bottom:10px;">My Bonus to Myself</div>`));

  const photoWrap = el(`<div class="prize-photo-wrap"></div>`);
  const photoEl = prize.itemPhoto
    ? el(`<img class="prize-photo" src="${prize.itemPhoto}" title="Click to change photo" />`)
    : el(`<div class="prize-photo-placeholder">Add a photo</div>`);
  photoWrap.appendChild(photoEl);
  const photoInput = el(`<input type="file" accept="image/*" style="display:none;" />`);
  photoWrap.appendChild(photoInput);
  photoEl.addEventListener("click", () => photoInput.click());
  photoInput.addEventListener("change", () => {
    const file = photoInput.files[0];
    if (!file) return;
    resizeImageToDataUrl(file).then((dataUrl) => {
      prize.itemPhoto = dataUrl;
      scheduleSave();
      renderWellness();
    });
  });
  card.appendChild(photoWrap);

  const itemNameInput = el(`<input type="text" class="prize-item-name" value="${escapeHtml(prize.itemName)}" placeholder="Name this cycle's prize" />`);
  itemNameInput.addEventListener("change", (e) => {
    prize.itemName = e.target.value;
    scheduleSave();
  });
  card.appendChild(itemNameInput);
  card.appendChild(el(`<div class="muted" style="text-align:center;font-size:12px;">${endDate}</div>`));

  if (reached) {
    card.appendChild(el(`<div class="prize-divider"></div>`));
    card.appendChild(el(`<div class="muted" style="text-align:center;margin-bottom:12px;">${goodCount} of the last ${totalCount} days were good days.</div>`));

    const actionRow = el(`<div style="display:flex;gap:10px;"></div>`);
    const itemLabel = prize.itemName ? prize.itemName : "your prize";
    const claimBtn = el(`<button type="button" class="btn-primary" style="flex:1;">Claim ${escapeHtml(itemLabel)}</button>`);
    const extendBtn = el(`<button type="button" class="btn-ghost" style="flex:1;">Give myself more time</button>`);
    actionRow.appendChild(claimBtn);
    actionRow.appendChild(extendBtn);
    card.appendChild(actionRow);

    const extendChips = el(`<div style="display:none;gap:8px;margin-top:10px;justify-content:center;"></div>`);
    [30, 60, 90].forEach((days) => {
      const chip = el(`<button type="button" class="split-chip">+${days} days</button>`);
      chip.addEventListener("click", () => {
        prize.cycleLengthDays += days;
        scheduleSave();
        renderWellness();
      });
      extendChips.appendChild(chip);
    });
    card.appendChild(extendChips);

    claimBtn.addEventListener("click", () => {
      prize.cycleStartDate = todayISO();
      prize.cycleLengthDays = 90;
      prize.itemName = "";
      prize.itemPhoto = null;
      scheduleSave();
      renderWellness();
    });
    extendBtn.addEventListener("click", () => {
      extendChips.style.display = extendChips.style.display === "none" ? "flex" : "none";
    });
  }

  panel.appendChild(card);
}

function renderWellnessHistory(panel, today) {
  const section = el(`
    <details class="card">
      <summary class="book-summary" style="margin-bottom:2px;"><span class="subsection-title serif" style="margin:0;">History</span></summary>
    </details>
  `);
  panel.appendChild(section);
  panel = section;

  const history = state.wellness.filter((l) => l.logDate !== today && Object.keys(l).some((k) => l[k] && k !== "id" && k !== "logDate"));

  if (!history.length) {
    panel.appendChild(el(`<div class="muted">No past entries yet — once you log a few days, they'll show up here grouped by month.</div>`));
    return;
  }

  const byYear = new Map();
  history
    .sort((a, b) => (a.logDate < b.logDate ? 1 : -1))
    .forEach((l) => {
      const [y, m] = l.logDate.split("-");
      const yearKey = y;
      const monthKey = `${y}-${m}`;
      if (!byYear.has(yearKey)) byYear.set(yearKey, new Map());
      const months = byYear.get(yearKey);
      if (!months.has(monthKey)) months.set(monthKey, []);
      months.get(monthKey).push(l);
    });

  [...byYear.entries()].forEach(([year, months], yi) => {
    const yearDetails = el(`<details class="book-group" ${yi === 0 ? "open" : ""}><summary class="book-summary"><span class="book-title">${year}</span></summary></details>`);
    [...months.entries()].forEach(([monthKey, entries], mi) => {
      const monthDetails = el(`
        <details class="book-group" style="padding-left:14px;" ${yi === 0 && mi === 0 ? "open" : ""}>
          <summary class="book-summary"><span>${monthLabel(monthKey)}</span><span class="muted">${entries.length} ${entries.length === 1 ? "entry" : "entries"}</span></summary>
        </details>
      `);
      entries.forEach((l) => {
        const badges = [...WELLNESS_YESNO_FIELDS.map(([k]) => k), ...Object.keys(WELLNESS_ENUM_FIELDS)]
          .filter((k) => l[k])
          .map((k) => `<span class="wellness-badge ${wellnessColorClass(k, l[k])}">${l[k]}</span>`)
          .join(" ");
        const notesHtml = WELLNESS_NOTE_FIELDS.filter(([k]) => l[k])
          .map(([k, label]) => `<div class="wellness-history-note"><span class="muted">${escapeHtml(label)}</span> ${escapeHtml(l[k])}</div>`)
          .join("");
        const entryEl = el(`
          <div class="wellness-history-entry">
            <div class="row wellness-history-row">
              <div style="flex:1;">${l.logDate}</div>
              <div>${badges || '<span class="muted">&mdash;</span>'}</div>
              <button type="button" class="wellness-history-edit-btn" title="Edit ${escapeHtml(l.logDate)}" aria-label="Edit ${escapeHtml(l.logDate)}">Edit</button>
            </div>
            ${notesHtml}
          </div>
        `);
        entryEl.querySelector(".wellness-history-edit-btn").addEventListener("click", () => {
          openWellnessDayEditor(l.logDate, () => renderWellness());
        });
        monthDetails.appendChild(entryEl);
      });
      yearDetails.appendChild(monthDetails);
    });
    panel.appendChild(yearDetails);
  });
}

// ------------------------------------------------------------------
// Boot
// ------------------------------------------------------------------
async function boot() {
  // Sign-in gate first — nothing below runs until someone's identity is
  // known, since the data itself lives behind that identity now.
  const session = await requireAuth();
  currentUserId = session.user.id;
  currentUserEmail = session.user.email || "";

  // Load this account's row. The signup trigger on the database side
  // creates it automatically the moment someone creates an account, so
  // missing entirely here means something went wrong rather than "new
  // user" — falling back to a blank slate either way keeps this from
  // ever showing a dead screen.
  state = await loadStateFromSupabase(currentUserId);
  if (!state) {
    state = { todos: [], budget: [], investmentAccounts: [], bible: [], goals: [], wellness: [], nextId: 1 };
  }
  // Backfill in case any array/field is missing from an older save.
  state.todos ||= [];
  state.todos.forEach((t, i) => (t.sortOrder ??= i));
  // One-time cleanup: the to-do list originally shipped with specific
  // weekdays pre-assigned, which wasn't the intent — it's meant to be one
  // running list. Clear any leftover day assignments once; after that,
  // any day she sets herself (via the day picker) sticks normally.
  if (!state.todoDaysCleared) {
    state.todos.forEach((t) => {
      t.day = null;
    });
    state.todoDaysCleared = true;
  }
  // One-time: the single flat To-Do array becomes the first list in the
  // new "Lists" space, so nothing gets lost when it stops being the only
  // list you can have. A brand-new account with no history gets the same
  // starter list, just empty, so Lists never opens to a totally bare
  // "+ New list" screen with nothing familiar in it.
  state.lists ||= [];
  state.activeListId ??= null;
  if (!state.listsMigrationApplied) {
    if (state.todos.length || !state.lists.length) {
      state.lists.unshift({
        id: "list_" + nextId(),
        name: "To-Do",
        icon: "checklist",
        color: "#8C3F2B",
        style: "task",
        items: state.todos.map((t) => ({
          id: t.id,
          task: t.task,
          priority: t.priority || "2. Medium",
          done: !!t.done,
          sortOrder: t.sortOrder ?? 0,
        })),
      });
    }
    state.listsMigrationApplied = true;
  }
  state.budget ||= [];
  state.budget.forEach((b) => (b.hidden ??= false));
  // One-time merge: fold the old "Subscriptions" and "Fixed Costs" sections
  // into one plain "Categories" section, since not everything in it is
  // actually fixed. Runs once and never touches a section she's since
  // renamed or reassigned herself.
  if (state.budgetSectionMergeVersion !== BUDGET_SECTION_MERGE_VERSION) {
    state.budget.forEach((b) => {
      if (b.section === "Subscriptions" || b.section === "Fixed Costs") b.section = "Categories";
    });
    state.budgetSectionMergeVersion = BUDGET_SECTION_MERGE_VERSION;
  }
  state.investmentAccounts ||= [];
  state.investmentAccounts.forEach((a) => {
    a.holdings ||= [];
    a.deployedMonths ||= [];
  });
  // Migrate a pre-account-tabs save: a flat `investments` array with nowhere
  // to live goes onto the RRSP account, since that's where it always was.
  if (Array.isArray(state.investments) && state.investments.length) {
    const rrsp = state.investmentAccounts.find((a) => a.key === "rrsp");
    if (rrsp) rrsp.holdings = rrsp.holdings.concat(state.investments);
    delete state.investments;
  }
  state.bible ||= [];
  state.bibleSettings ||= { startDate: "2026-01-01" };
  state.goals ||= [];
  state.wellness ||= [];
  state.sleepLogs ||= [];
  state.sleepSettings ||= { targetHours: 7 };
  state.nextId ||= 1;
  state.activeTab ||= "home";
  state.budgetView ||= "sections";
  state.budgetShowHidden ||= false;
  state.theme ||= "cream";
  state.bibleTestament ||= "all";
  state.bibleOpenBooks ||= {};
  // Starts unset; the over/under flags just don't show anything meaningful
  // until this is filled in from the Budget tab.
  state.paycheckSettings ||= { amount: 0, frequency: "semimonthly" };
  state.portfolioChoice ||= "yours";
  state.selectedInvestmentAccount ||= "rrsp";
  // Plan/account info — nothing reads this for gating yet, but every
  // account gets a real shape here from the start so that logic has
  // something safe to check once it exists, instead of treating a missing
  // field as either plan by accident.
  state.account ||= { plan: "free", planLabel: "Free", isFounder: false, unlimitedSpaces: false };

  // Settings — sheet order/visibility, plus any sheets added from the gallery.
  state.deletedBuiltinSheets ||= [];
  state.sheets ||= BUILTIN_SHEET_ORDER.filter((id) => !state.deletedBuiltinSheets.includes(id)).map((id) => ({
    id,
    kind: "builtin",
    visible: true,
  }));
  BUILTIN_SHEET_ORDER.forEach((id) => {
    if (!state.deletedBuiltinSheets.includes(id) && !state.sheets.some((s) => s.id === id)) {
      state.sheets.push({ id, kind: "builtin", visible: true });
    }
  });
  // One-time: Home now shows the wellness ring, the reward, and today's
  // pillars directly, so Wellness no longer needs its own bottom-bar slot —
  // hide it exactly the way the eye toggle in Settings already can, which
  // frees that slot for an actual space. The Wellness page itself is
  // untouched and still reachable from Home's "See full wellness history"
  // link; this only ever runs once, so turning it back on visible from
  // Settings afterward sticks normally.
  if (!state.homeAbsorbsWellnessV1Applied) {
    const wellnessSheet = state.sheets.find((s) => s.id === "wellness");
    if (wellnessSheet) wellnessSheet.visible = false;
    state.homeAbsorbsWellnessV1Applied = true;
  }
  state.customSheets ||= {};
  // Pillar Mapping — which spaces auto-complete each pillar. Defaults to
  // Bible for Spiritual anchor once, the first time someone has a Bible
  // sheet, since that matched what was already in use; everything else
  // starts unmapped (manual-only) until she picks something in the "You"
  // page's Pillar Mapping screen.
  state.pillarSourceMap ||= { movement: [], spiritualAnchor: [], sleepProtected: [], socialConnection: [] };
  if (!state.pillarSourceMapDefaultApplied) {
    if (state.sheets.some((s) => s.id === "bible" && s.visible) && !state.pillarSourceMap.spiritualAnchor.length) {
      state.pillarSourceMap.spiritualAnchor = ["bible"];
    }
    state.pillarSourceMapDefaultApplied = true;
  }
  // One-time upgrade: any Capsule Wardrobe sheet added before it had
  // real category/color/season/price data (just a plain checklist of
  // placeholder items like "Tops", "Bottoms"...) gets replaced with the
  // full seeded item list, tagged schema v2 so this never runs again —
  // items she edits or adds herself after this point stick normally.
  Object.entries(state.customSheets).forEach(([id, sheet]) => {
    if (sheet.templateKey === "wardrobe" && sheet.wardrobeSchemaV !== 2) {
      sheet.items = seedWardrobeItems();
      sheet.wardrobeSchemaV = 2;
      sheet.openCategories ||= {};
      sheet.activeSeason ??= null;
    }
  });
  // One-time backfill: the real product links she'd had in her original
  // spreadsheet only survived in the .xlsx re-export, not the earlier
  // .csv. Matched back onto her already-migrated items by POSITION, not
  // name — a couple of rows (two identical "Long Sleeve Tee, Black"
  // lines) are indistinguishable by name+color alone, and matching by
  // name could cross-assign one item's link to a different item that
  // happens to share the same description. Position is safe here because
  // the prior migration seeded everyone's list in this exact order; the
  // name check is just a sanity guard in case she's since reordered or
  // deleted something, and it only ever fills in a link, never overwrites
  // one she's set herself.
  Object.values(state.customSheets).forEach((sheet) => {
    if (sheet.templateKey === "wardrobe" && !sheet.wardrobeLinksImported) {
      sheet.items.forEach((it, i) => {
        if (it.link) return;
        const seed = WARDROBE_SEED_ITEMS[i];
        if (seed && seed.link && seed.category === it.category && seed.name === it.name && seed.color === it.color) {
          it.link = seed.link;
        }
      });
      sheet.wardrobeLinksImported = true;
    }
  });
  // One-time backfill: the Botanical Satchel's real product photo (she
  // sent it directly). "Botanical Satchel" is a one-of-a-kind name in the
  // seed list, so a plain name+category match is safe here — no duplicate
  // rows to worry about the way the tee links needed position-matching.
  Object.values(state.customSheets).forEach((sheet) => {
    if (sheet.templateKey === "wardrobe" && !sheet.wardrobePhotoImported) {
      const seedPhoto = WARDROBE_SEED_ITEMS.find((s) => s.category === "Bags" && s.name === "Botanical Satchel")?.photo;
      if (seedPhoto) {
        const target = sheet.items.find((it) => it.category === "Bags" && it.name === "Botanical Satchel" && !it.photo);
        if (target) target.photo = seedPhoto;
      }
      sheet.wardrobePhotoImported = true;
    }
  });
  // One-time fix: a couple of exercises came from her spreadsheet with
  // "TBD" as the Target weight — that reflected Matt not having assigned
  // a number YET, not an ongoing state. Since she already has a real
  // logged Actual for those sets, there's no reason to keep showing TBD;
  // backfill the target with that same weight (matching what "Prev" pulls
  // forward for a new week) so it reads as a real number to hit or beat.
  Object.values(state.customSheets).forEach((sheet) => {
    if (sheet.templateKey !== "workout" || sheet.workoutTbdFixed) return;
    (sheet.weeks || []).forEach((week) => {
      week.days.forEach((day) => {
        day.exercises.forEach((ex) => {
          ex.sets.forEach((set) => {
            if (!/^TBD/i.test(set.target || "")) return;
            const parsed = parseWorkoutActual(set.actual);
            if (parsed && parsed.hasWeight) {
              const unit = ex.direction === "down" ? "assist" : "lb";
              set.target = set.target.replace(/^TBD/i, `${parsed.weight} ${unit}`);
            }
          });
        });
      });
    });
    sheet.workoutTbdFixed = true;
  });
  // One-time fix: Target used to repeat the exercise's rep range on every
  // set ("85 lb x 8–10"), which just re-showed the same range three or
  // four times per exercise and crowded the field on mobile. The rep
  // range now shows once, next to the exercise name — trim it back out
  // of any target text already saved.
  Object.values(state.customSheets).forEach((sheet) => {
    if (sheet.templateKey !== "workout" || sheet.workoutTargetSimplified) return;
    (sheet.weeks || []).forEach((week) => {
      week.days.forEach((day) => {
        day.exercises.forEach((ex) => {
          ex.sets.forEach((set) => {
            const match = (set.target || "").match(/^(.*?)\s*x\s*\d+(?:\.\d+)?[–-]\d+(?:\.\d+)?(\/side)?$/);
            if (match) set.target = match[1] + (match[2] || "");
          });
        });
      });
    });
    sheet.workoutTargetSimplified = true;
  });

  // Veronika's Bonus — an identity statement, a quiet rhythm reading
  // from Daily Wellness, and whatever this 90-day cycle's bonus is.
  const DEFAULT_PRIZE_QUOTE = "I show up for myself \u2014 spiritually, physically, and financially \u2014 and I follow through.";
  const OLD_DEFAULT_PRIZE_QUOTE = "I'm someone who shows up for herself spiritually, for her health, and her money \u2014 and treats herself accordingly.";
  state.veronikasPrize ||= {
    quote: DEFAULT_PRIZE_QUOTE,
    cycleStartDate: todayISO(),
    cycleLengthDays: 90,
    itemName: "Your reward",
    itemPhoto: "",
  };
  // Upgrade the default wording once, but never touch it if she's
  // written her own quote (i.e. it no longer matches either default).
  if (state.veronikasPrize.quote === OLD_DEFAULT_PRIZE_QUOTE) {
    state.veronikasPrize.quote = DEFAULT_PRIZE_QUOTE;
  }

  budgetView = state.budgetView;
  budgetShowHidden = state.budgetShowHidden;
  bibleTestament = state.bibleTestament;
  portfolioChoice = state.portfolioChoice;

  // Write straight back after any migrations above so the row reflects
  // the current shape immediately, rather than waiting for the first
  // real edit to trigger a save.
  doSave();

  applyTheme();
  ensureCustomPanels();
  initTabs();
  renderAll();
  syncTopbarHeight();
  window.addEventListener("resize", syncTopbarHeight);

  // The boot-loading overlay (see index.html) covers the very first paint —
  // hide it now that there's something real underneath it. The fade is
  // CSS-driven so this only has to flip a class.
  const bootLoading = document.getElementById("boot-loading");
  if (bootLoading) {
    bootLoading.classList.add("hide");
    setTimeout(() => bootLoading.remove(), 300);
  }

  // Heals anything saved before photos were downscaled on upload (see
  // resizeImageToDataUrl) — a full-size camera photo saved directly can
  // be large enough on its own to push a save past the browser's storage
  // quota, which then silently fails every save afterward, for anything
  // in the app, until the oversized photo is gone. Runs after the first
  // render so it never blocks showing the page.
  healOversizedPhotos();
}

// Anything already bigger than ~150KB as a dataURL (roughly 110KB of
// actual image data) gets re-encoded smaller. A freshly-resized photo
// from resizeImageToDataUrl is nowhere near this, so this is a no-op
// after the first pass — safe to just check size rather than track a
// one-time-migration flag.
const OVERSIZED_PHOTO_THRESHOLD = 150000;

function shrinkDataUrl(dataUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onerror = () => reject(new Error("Could not decode stored image"));
    img.onload = () => {
      const maxDim = 900;
      let { width, height } = img;
      if (width > maxDim || height > maxDim) {
        if (width >= height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      canvas.getContext("2d").drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg", 0.75));
    };
    img.src = dataUrl;
  });
}

async function healOversizedPhotos() {
  const targets = [];
  if (state.veronikasPrize?.itemPhoto?.length > OVERSIZED_PHOTO_THRESHOLD) {
    targets.push({ get: () => state.veronikasPrize.itemPhoto, set: (v) => (state.veronikasPrize.itemPhoto = v) });
  }
  Object.values(state.customSheets || {}).forEach((sheet) => {
    (sheet.items || []).forEach((item) => {
      if (item.photo?.length > OVERSIZED_PHOTO_THRESHOLD) {
        targets.push({ get: () => item.photo, set: (v) => (item.photo = v) });
      }
    });
  });
  if (!targets.length) return;
  let healedAny = false;
  for (const t of targets) {
    try {
      const shrunk = await shrinkDataUrl(t.get());
      t.set(shrunk);
      healedAny = true;
    } catch (err) {
      console.error("Could not shrink a stored photo:", err);
    }
  }
  if (healedAny) {
    scheduleSave();
    // Whatever's currently on screen may be showing one of the photos
    // just swapped out from under it — cheapest fix is just re-rendering.
    renderAll();
  }
}

boot();
