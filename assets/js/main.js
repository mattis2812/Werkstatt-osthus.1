/* =========================================================
   Meisterwerkstatt Osthus – Skripte
   Alle anpassbaren Daten stehen gesammelt in CONFIG.
   ========================================================= */

const CONFIG = {
  telefon: "+491744533817",
  telefonAnzeige: "+49 174 4533817",
  email: "info@meisterwerkstatt-osthus.de",
  adresse: "Klutestraße 5, 59063 Hamm (Westf)",

  // Zugangsschlüssel von https://web3forms.com (kostenlos, mit info@meisterwerkstatt-osthus.de anlegen).
  // Solange hier der Platzhalter steht, bietet das Formular den Versand per E-Mail-Programm an.
  web3formsKey: "HIER-WEB3FORMS-ZUGANGSSCHLUESSEL-EINTRAGEN",

  // PLATZHALTER – echte Öffnungszeiten folgen.
  // 0 = Sonntag, 1 = Montag … 6 = Samstag. Mehrere Zeitfenster möglich, z. B. [["08:00","12:30"],["13:30","17:00"]]
  oeffnungszeiten: {
    1: [["08:00", "17:00"]],
    2: [["08:00", "17:00"]],
    3: [["08:00", "17:00"]],
    4: [["08:00", "17:00"]],
    5: [["08:00", "17:00"]],
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

/* ---------- Terminanfrage ---------- */
(() => {
  const form = document.getElementById("booking-form");
  if (!form) return;

  const nrEl = document.querySelectorAll("[data-anfrage-nr]");
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  const anfrageNr = `T-${String(d.getFullYear()).slice(2)}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${Math.floor(1000 + Math.random() * 9000)}`;
  nrEl.forEach((el) => { el.textContent = anfrageNr; });

  // Leistung aus Link vorauswählen: termin.html?leistung=reifen
  const vorwahl = new URLSearchParams(location.search).get("leistung");
  if (vorwahl) {
    const box = form.querySelector(`input[name="leistung"][data-id="${CSS.escape(vorwahl)}"]`);
    if (box) box.checked = true;
  }

  // Frühester Wunschtermin: morgen; Sonntage ausschließen
  const datum = form.querySelector("#wunschtermin");
  const morgen = new Date(); morgen.setDate(morgen.getDate() + 1);
  const iso = (x) => `${x.getFullYear()}-${pad(x.getMonth() + 1)}-${pad(x.getDate())}`;
  datum.min = iso(morgen);
  const datumFehler = document.getElementById("wunschtermin-error");
  datum.addEventListener("change", () => {
    const tag = datum.value ? new Date(datum.value + "T12:00:00").getDay() : -1;
    const geschlossen = tag >= 0 && !(CONFIG.oeffnungszeiten[tag] || []).length;
    datum.setCustomValidity(geschlossen ? "An diesem Tag ist die Werkstatt geschlossen. Bitte wählen Sie einen anderen Tag." : "");
    datumFehler.textContent = geschlossen ? "An diesem Tag ist die Werkstatt geschlossen. Bitte wählen Sie einen anderen Tag." : "";
  });

  const msg = document.getElementById("form-msg");
  const submitBtn = form.querySelector("button[type=submit]");
  const leistungFehler = document.getElementById("leistung-error");

  const datumDeutsch = (v) => v ? new Date(v + "T12:00:00").toLocaleDateString("de-DE", { weekday: "long", day: "2-digit", month: "2-digit", year: "numeric" }) : "";

  function daten() {
    const fd = new FormData(form);
    const leistungen = fd.getAll("leistung");
    return {
      name: (fd.get("name") || "").trim(),
      telefon: (fd.get("telefon") || "").trim(),
      email: (fd.get("email") || "").trim(),
      fahrzeug: (fd.get("fahrzeug") || "").trim(),
      baujahr: (fd.get("baujahr") || "").trim(),
      kennzeichen: (fd.get("kennzeichen") || "").trim(),
      km: (fd.get("km") || "").trim(),
      leistungen,
      datum: fd.get("wunschtermin"),
      zeit: fd.get("zeitfenster") || "egal",
      holbring: fd.get("holbring") ? "Ja, bitte abholen und zurückbringen" : "Nein",
      nachricht: (fd.get("nachricht") || "").trim()
    };
  }

  function bestaetigungsLinks(x) {
    const anrede = `Guten Tag ${x.name},`;
    const an = encodeURIComponent(x.email).replace("%40", "@");
    const ja = "mailto:" + an +
      "?subject=" + encodeURIComponent(`Terminbestätigung ${anfrageNr} – Meisterwerkstatt Osthus`) +
      "&body=" + encodeURIComponent(
        `${anrede}\n\nvielen Dank für Ihre Anfrage. Wir bestätigen Ihren Termin am ${datumDeutsch(x.datum)} (${x.zeit}) für: ${x.leistungen.join(", ")}.\n\n` +
        `Bitte bringen Sie Fahrzeugschein und ggf. Serviceheft mit.\n\nMit freundlichen Grüßen\nAndre Osthus\nMeisterwerkstatt Osthus\nKlutestraße 5, 59063 Hamm\nTel. ${CONFIG.telefonAnzeige}`);
    const alt = "mailto:" + an +
      "?subject=" + encodeURIComponent(`Ihre Terminanfrage ${anfrageNr} – Terminvorschlag`) +
      "&body=" + encodeURIComponent(
        `${anrede}\n\nvielen Dank für Ihre Anfrage. Am ${datumDeutsch(x.datum)} ist leider kein Termin mehr frei. Wir können Ihnen folgenden Termin anbieten:\n\n[Datum / Uhrzeit eintragen]\n\nBitte bestätigen Sie kurz per Antwort oder telefonisch.\n\nMit freundlichen Grüßen\nAndre Osthus\nMeisterwerkstatt Osthus\nTel. ${CONFIG.telefonAnzeige}`);
    return { ja, alt };
  }

  function zusammenfassung(x) {
    return [
      `Anfrage-Nr.: ${anfrageNr}`,
      `Name: ${x.name}`,
      `Telefon: ${x.telefon}`,
      `E-Mail: ${x.email}`,
      `Fahrzeug: ${x.fahrzeug}${x.baujahr ? ` (Bj. ${x.baujahr})` : ""}`,
      x.kennzeichen ? `Kennzeichen: ${x.kennzeichen}` : "",
      x.km ? `Kilometerstand: ${x.km}` : "",
      `Leistungen: ${x.leistungen.join(", ")}`,
      `Wunschtermin: ${datumDeutsch(x.datum)}, ${x.zeit}`,
      `Hol- und Bringservice: ${x.holbring}`,
      x.nachricht ? `Nachricht: ${x.nachricht}` : ""
    ].filter(Boolean).join("\n");
  }

  function zeigeFehler(html) {
    msg.hidden = false;
    msg.className = "form-msg form-msg--error";
    msg.innerHTML = html;
    msg.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }

  function mailtoFallback(x) {
    return "mailto:" + CONFIG.email +
      "?subject=" + encodeURIComponent(`Terminanfrage ${anfrageNr}: ${x.leistungen.join(", ")}`) +
      "&body=" + encodeURIComponent(zusammenfassung(x));
  }

  function erfolg(x) {
    const ok = document.getElementById("booking-done");
    ok.querySelector("[data-done-summary]").innerHTML = [
      ["Anfrage-Nr.", anfrageNr],
      ["Leistung", x.leistungen.join(", ")],
      ["Wunschtermin", `${datumDeutsch(x.datum)}, ${x.zeit}`],
      ["Fahrzeug", x.fahrzeug],
      ["Rückmeldung an", `${x.email} / ${x.telefon}`]
    ].map(([k, v]) => `<dt>${k}</dt><dd>${escapeHtml(v)}</dd>`).join("");
    form.hidden = true;
    ok.hidden = false;
    ok.scrollIntoView({ block: "start", behavior: "smooth" });
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    msg.hidden = true;

    const gewaehlt = form.querySelectorAll('input[name="leistung"]:checked').length;
    leistungFehler.textContent = gewaehlt ? "" : "Bitte wählen Sie mindestens eine Leistung aus.";
    if (!gewaehlt) { leistungFehler.scrollIntoView({ block: "center", behavior: "smooth" }); return; }
    if (!form.reportValidity()) return;

    const x = daten();
    if (form.querySelector('input[name="botcheck"]').checked) return;

    if (!CONFIG.web3formsKey || CONFIG.web3formsKey.startsWith("HIER-")) {
      zeigeFehler(`<strong>Der Online-Versand ist noch nicht eingerichtet.</strong>
        <span>Senden Sie Ihre Anfrage bitte über Ihr E-Mail-Programm. Alle Angaben sind schon eingetragen:
        <a href="${mailtoFallback(x)}">Anfrage per E-Mail senden</a>. Oder rufen Sie uns an: <a href="tel:${CONFIG.telefon}">${CONFIG.telefonAnzeige}</a>.</span>`);
      return;
    }

    const links = bestaetigungsLinks(x);
    const payload = {
      access_key: CONFIG.web3formsKey,
      subject: `Terminanfrage ${anfrageNr}: ${x.leistungen.join(", ")} – ${datumDeutsch(x.datum)}`,
      from_name: "Website Meisterwerkstatt Osthus",
      replyto: x.email,
      botcheck: "",
      "Anfrage-Nr.": anfrageNr,
      "Name": x.name,
      "Telefon": x.telefon,
      "email": x.email,
      "Fahrzeug": x.fahrzeug,
      "Baujahr": x.baujahr || "–",
      "Kennzeichen": x.kennzeichen || "–",
      "Kilometerstand": x.km || "–",
      "Leistungen": x.leistungen.join(", "),
      "Wunschtermin": `${datumDeutsch(x.datum)}, ${x.zeit}`,
      "Hol- und Bringservice": x.holbring,
      "Nachricht": x.nachricht || "–",
      "TERMIN BESTÄTIGEN (1 Klick, öffnet fertige Antwort-Mail)": links.ja,
      "ANDEREN TERMIN VORSCHLAGEN": links.alt,
      "Kunde anrufen": "tel:" + x.telefon.replace(/[^\d+]/g, "")
    };

    submitBtn.disabled = true;
    const label = submitBtn.innerHTML;
    submitBtn.textContent = "Wird gesendet …";
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload)
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.success) throw new Error(json.message || "Versand fehlgeschlagen");
      erfolg(x);
    } catch (err) {
      zeigeFehler(`<strong>Die Anfrage konnte gerade nicht gesendet werden.</strong>
        <span>Bitte versuchen Sie es erneut, senden Sie sie <a href="${mailtoFallback(x)}">per E-Mail</a>
        oder rufen Sie an: <a href="tel:${CONFIG.telefon}">${CONFIG.telefonAnzeige}</a>.</span>`);
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = label;
    }
  });
})();

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
