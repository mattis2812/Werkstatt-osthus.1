/* =========================================================
   Meisterwerkstatt Osthus – Skripte
   Alle anpassbaren Daten stehen gesammelt in CONFIG.
   ========================================================= */

const CONFIG = {
  telefon: "+491744533817",
  telefonAnzeige: "+49 174 4533817",
  email: "info@meisterwerkstatt-osthus.de",
  adresse: "Klutestraße 5, 59063 Hamm (Westf)",


  // Öffnungszeiten der Werkstatt
  // 0 = Sonntag, 1 = Montag … 6 = Samstag. Mehrere Zeitfenster möglich, z. B. [["08:00","12:30"],["13:30","17:00"]]
  oeffnungszeiten: {
    1: [["09:00", "17:30"]],
    2: [["09:00", "17:30"]],
    3: [["09:00", "17:30"]],
    4: [["09:00", "17:30"]],
    5: [["09:00", "17:30"]],
    6: [],
    0: []
  },
  zeitzone: "Europe/Berlin"
};

const TAGE = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];
const REIHENFOLGE = [1, 2, 3, 4, 5, 6, 0];

/* ---------- Navigation ---------- */
(() => {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("main-nav");
  if (!toggle || !nav) return;
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Menü schließen" : "Menü öffnen");
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("is-open")) {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.focus();
    }
  });
})();

/* ---------- Öffnungszeiten & Live-Status ---------- */
function jetztInBerlin() {
  const teile = new Intl.DateTimeFormat("en-GB", {
    timeZone: CONFIG.zeitzone, weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23"
  }).formatToParts(new Date());
  const get = (t) => teile.find((p) => p.type === t).value;
  const tag = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
  return { tag, minuten: Number(get("hour")) * 60 + Number(get("minute")) };
}
const KURZ = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
// Fasst Tage mit gleichen Zeiten zusammen, z. B. "Mo–Fr 09:00–17:30"
function zeitenKurz() {
  const gruppen = [];
  for (const t of REIHENFOLGE) {
    const f = CONFIG.oeffnungszeiten[t] || [];
    if (!f.length) continue;
    const text = f.map(([a, b]) => `${a}–${b}`).join(", ");
    const letzte = gruppen[gruppen.length - 1];
    if (letzte && letzte.text === text && REIHENFOLGE.indexOf(t) === REIHENFOLGE.indexOf(letzte.bis) + 1) letzte.bis = t;
    else gruppen.push({ von: t, bis: t, text });
  }
  return gruppen.map((g) => `${KURZ[g.von]}${g.bis !== g.von ? "–" + KURZ[g.bis] : ""} ${g.text}`).join(" · ");
}
const zuMinuten = (hhmm) => { const [h, m] = hhmm.split(":").map(Number); return h * 60 + m; };
const fensterText = (f) => f.length ? f.map(([a, b]) => `${a} – ${b}`).join(", ") : "geschlossen";

function oeffnungsStatus() {
  const { tag, minuten } = jetztInBerlin();
  const heute = CONFIG.oeffnungszeiten[tag] || [];
  for (const [a, b] of heute) {
    if (minuten >= zuMinuten(a) && minuten < zuMinuten(b)) {
      return { offen: true, text: `bis ${b} Uhr` };
    }
  }
  const spaeterHeute = heute.find(([a]) => zuMinuten(a) > minuten);
  if (spaeterHeute) return { offen: false, text: `öffnet heute um ${spaeterHeute[0]} Uhr` };
  for (let i = 1; i <= 7; i++) {
    const t = (tag + i) % 7;
    const f = CONFIG.oeffnungszeiten[t] || [];
    if (f.length) return { offen: false, text: `öffnet ${i === 1 ? "morgen" : TAGE[t]} um ${f[0][0]} Uhr` };
  }
  return { offen: false, text: "" };
}

function statusAktualisieren() {
  const s = oeffnungsStatus();
  document.querySelectorAll("[data-status]").forEach((el) => {
    el.dataset.state = s.offen ? "open" : "closed";
    el.innerHTML =
      `<span class="status__dot" aria-hidden="true"></span>` +
      `<span class="status__label">${s.offen ? "Jetzt geöffnet" : "Geschlossen"}</span>` +
      (s.text && !el.hasAttribute("data-status-short") ? `<span class="status__detail">· ${s.text}</span>` : "");
  });
  document.querySelectorAll("[data-hours-short]").forEach((el) => { el.textContent = zeitenKurz(); });
  const { tag } = jetztInBerlin();
  document.querySelectorAll("[data-hours]").forEach((tbl) => {
    tbl.innerHTML = "<caption class='hp'>Öffnungszeiten</caption><tbody>" + REIHENFOLGE.map((t) =>
      `<tr${t === tag ? " class='is-today'" : ""}><th scope="row">${TAGE[t]}</th><td>${fensterText(CONFIG.oeffnungszeiten[t] || [])}</td></tr>`
    ).join("") + "</tbody>";
  });
}
statusAktualisieren();
setInterval(statusAktualisieren, 60 * 1000);

/* ---------- Kopieren-Buttons ---------- */
document.querySelectorAll("[data-copy]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const text = btn.dataset.copy;
    const fertig = () => {
      btn.classList.add("is-done");
      btn.setAttribute("aria-label", "Kopiert");
      setTimeout(() => { btn.classList.remove("is-done"); btn.setAttribute("aria-label", btn.dataset.label || "Kopieren"); }, 1600);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(fertig).catch(() => fallbackCopy(text, fertig));
    } else {
      fallbackCopy(text, fertig);
    }
  });
});
function fallbackCopy(text, done) {
  const ta = document.createElement("textarea");
  ta.value = text; ta.setAttribute("readonly", ""); ta.style.position = "absolute"; ta.style.left = "-9999px";
  document.body.appendChild(ta); ta.select();
  try { document.execCommand("copy"); done(); } catch (e) { /* Text bleibt markierbar */ }
  ta.remove();
}

/* ---------- Google Maps (erst nach Klick laden) ---------- */
document.querySelectorAll("[data-map]").forEach((box) => {
  const btn = box.querySelector("[data-map-load]");
  if (!btn) return;
  btn.addEventListener("click", () => {
    const iframe = document.createElement("iframe");
    iframe.src = "https://www.google.com/maps?q=" + encodeURIComponent("Klutestraße 5, 59063 Hamm") + "&z=16&output=embed";
    iframe.title = "Karte: Meisterwerkstatt Osthus, Klutestraße 5, Hamm";
    iframe.loading = "lazy";
    iframe.referrerPolicy = "no-referrer-when-downgrade";
    box.querySelector(".map__consent").remove();
    box.appendChild(iframe);
  });
});

/* ---------- Jahr im Footer ---------- */
document.querySelectorAll("[data-year]").forEach((el) => { el.textContent = new Date().getFullYear(); });
