# Website Meisterwerkstatt Osthus

Statische Website (HTML, CSS, JavaScript) für den Kfz-Meisterbetrieb Andre Osthus, Klutestraße 5, 59063 Hamm.
Gehostet bei Netlify im Konto der Werkstatt (AV-Vertrag: netlify.com/pdf/netlify-dpa.pdf).
Kein Build-Schritt nötig: Ordnerinhalt auf einen beliebigen Webspace hochladen (z. B. IONOS, Strato, GitHub Pages, Netlify).

## Seiten

| Datei | Inhalt |
| --- | --- |
| `index.html` | Startseite: Hero mit Typenschild, Leistungsübersicht, Galerie, Ablauf, Öffnungszeiten, Kontakt |
| `leistungen.html` | Alle Leistungen im Detail, jeweils mit Button „Termin anfragen“ |
| `werkstatt.html` | Über uns, Galerie |
| `termin.html` | Termin vereinbaren per Telefon |
| `anfahrt.html` | Kontakt, Google-Maps-Route, Karte (lädt erst nach Klick), Öffnungszeiten |
| `impressum.html`, `datenschutz.html` | Rechtstexte (Platzhalter gelb markiert) |
| `rechtliche-hinweise.html` | Haftung für Inhalte und Links, Urheberrecht, Bildnachweis (unten auf jeder Seite verlinkt) |
| `hinweis-hu-au.html` | Rechtlicher Hinweis zur HU/AU (§ 29 StVZO, DEKRA und KÜS), verlinkt unten auf jeder Seite |

## Vor dem Livegang ausfüllen

Alle Einstellungen stehen oben in `assets/js/main.js` im Objekt `CONFIG`.

1. **Öffnungszeiten**: eingetragen (Mo–Fr 09:00–17:30). Änderungen nur in `oeffnungszeiten` vornehmen, sie gelten dann automatisch auf allen Seiten, im Info-Schild und in der Anzeige „Jetzt geöffnet / Geschlossen“.
2. **Terminvereinbarung**: bewusst ohne Online-Formular. `termin.html` verweist auf Telefon und Öffnungszeiten.
3. **Gutachten-Link**: in `leistungen.html` den Platzhalter „Link zur Gutachten-Website folgt“ durch den echten Link ersetzen.
4. **Fotos**: Alle „Foto folgt“-Platzhalter sind entfernt, es werden nur echte Werkstattfotos gezeigt.
   - Sehr empfehlenswert: ein Foto von Andre Osthus (Startseite „Ihr Ansprechpartner“ und `werkstatt.html` „Über uns“), ein Teamfoto und eine Außenansicht mit Stele. Neue Bilder als JPG und WebP in `assets/img/` ablegen und dort die bestehenden Bilder austauschen.
5. **Impressum/Datenschutz**: USt-IdNr., Handwerkskammer Dortmund und Hoster (Netlify) sind eingetragen. Gelb markierte Stellen ergänzen und rechtlich prüfen lassen.
6. **Aussagen prüfen** (Wettbewerbsrecht, § 5 UWG):
   - „Meisterbetrieb“ nur mit Eintragung in die Handwerksrolle.
   - „Steuergeräteoptimierung laut Herstellervorgaben“ nur, wenn tatsächlich im Rahmen der Herstellervorgaben gearbeitet wird.
   - HU/AU: Die Seite stellt klar, dass die Hauptuntersuchung (§ 29 StVZO) von einer Überwachungsorganisation durchgeführt wird und kein Bezug zu den TÜV-Gesellschaften besteht.
   - Vor dem Livegang alle Texte von einem Anwalt oder der Handwerkskammer prüfen lassen.

## Gestaltung

Farben: warmes Hellgrau, Anthrazit und Werkstatt-Rot (`--accent` in `assets/css/style.css`). Alle Farben stehen oben in der CSS-Datei.

## Fotos

Liegen in `assets/img/` als JPG und WebP. Alle Kennzeichen sind verpixelt, Metadaten (EXIF/GPS) entfernt.

## Datenschutz-Hinweise zur Technik

- Schriften liegen lokal in `assets/fonts/`, es gibt keine Verbindung zu Google Fonts.
- Google Maps wird erst nach Klick auf „Karte anzeigen“ geladen.
- Keine Cookies, kein Tracking.

## Sicherheit

Die Website ist rein statisch: kein Admin-Bereich, kein Login, keine Datenbank, keine Preise, keine KI, keine Server-Schlüssel.

- `_headers`: Sicherheits-Header für Netlify (Content-Security-Policy, Schutz vor Einbetten in fremde Seiten, HSTS u. a.).
- `_redirects`: `/admin`, `/login`, `/wp-admin`, `/.env`, `/.git`, `README.md` usw. liefern immer „Seite nicht gefunden“ (`404.html`).
- Kein Formular und keine Eingabefelder: Es gibt keine Stelle, an der Besucher Daten oder Code einschleusen können.
- Kein Formulardienst und keine API-Schlüssel im Browser.
- `.gitignore` schließt `.env` und Schlüsseldateien aus. Geheimnisse gehören nie ins Repo.
