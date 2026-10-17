# Website Meisterwerkstatt Osthus

Statische Website (HTML, CSS, JavaScript) für den Kfz-Meisterbetrieb Andre Osthus, Klutestraße 5, 59063 Hamm.
Kein Build-Schritt nötig: Ordnerinhalt auf einen beliebigen Webspace hochladen (z. B. IONOS, Strato, GitHub Pages, Netlify).

## Seiten

| Datei | Inhalt |
| --- | --- |
| `index.html` | Startseite: Hero mit Typenschild, Leistungsübersicht, Galerie, Ablauf, Öffnungszeiten, Kontakt |
| `leistungen.html` | Alle Leistungen im Detail, jeweils mit Button „Termin anfragen“ |
| `werkstatt.html` | Über uns, Galerie |
| `termin.html` | Terminanfrage als „Werkstattauftrag“ |
| `anfahrt.html` | Kontakt, Google-Maps-Route, Karte (lädt erst nach Klick), Öffnungszeiten |
| `impressum.html`, `datenschutz.html` | Rechtstexte (Platzhalter gelb markiert) |

## Vor dem Livegang ausfüllen

Alle Einstellungen stehen oben in `assets/js/main.js` im Objekt `CONFIG`.

1. **Öffnungszeiten**: eingetragen (Mo–Fr 09:00–17:30). Änderungen nur in `oeffnungszeiten` vornehmen, sie gelten dann automatisch auf allen Seiten, im Info-Schild und in der Anzeige „Jetzt geöffnet / Geschlossen“.
2. **Terminformular (Web3Forms)**:
   - Auf <https://web3forms.com> mit `info@meisterwerkstatt-osthus.de` kostenlos einen Access Key erstellen.
   - Den Schlüssel bei `web3formsKey` eintragen.
   - Jede Anfrage kommt dann als E-Mail an. Sie enthält einen Link **„TERMIN BESTÄTIGEN“**, der eine fertig formulierte Bestätigungs-Mail an den Kunden öffnet. Nur noch auf „Senden“ klicken. Daneben gibt es einen Link „Anderen Termin vorschlagen“. Einfaches „Antworten“ geht ebenfalls direkt an den Kunden.
   - Solange kein Schlüssel eingetragen ist, bietet das Formular den Versand über das E-Mail-Programm des Kunden an.
3. **Gutachten-Link**: in `leistungen.html` den Platzhalter „Link zur Gutachten-Website folgt“ durch den echten Link ersetzen.
4. **Fotos**: Platzhalter „Foto folgt“ gegen echte Bilder tauschen.
   - Startseite, Bereich „Ihr Ansprechpartner“: Andre Osthus, Außenansicht.
   - `werkstatt.html`: Andre Osthus, Außenansicht und unter „Werkstatt und Team“ sechs weitere Plätze (Einfahrt mit Stele, Werkstatt von außen, Andre bei der Arbeit, Team, Werkstatthalle, weiteres Foto).
5. **Impressum/Datenschutz**: gelb markierte Stellen ergänzen (USt-IdNr., Handwerkskammer, Hoster) und rechtlich prüfen lassen.
6. **Aussagen prüfen** (Wettbewerbsrecht, § 5 UWG):
   - „Meisterbetrieb“ nur mit Eintragung in die Handwerksrolle.
   - „Steuergeräteoptimierung laut Herstellervorgaben“ nur, wenn tatsächlich im Rahmen der Herstellervorgaben gearbeitet wird.
   - HU/AU: Die Seite stellt klar, dass die Hauptuntersuchung (§ 29 StVZO) von einer Überwachungsorganisation durchgeführt wird und kein Bezug zu den TÜV-Gesellschaften besteht.
   - Vor dem Livegang alle Texte von einem Anwalt oder der Handwerkskammer prüfen lassen.

## Fotos

Liegen in `assets/img/` als JPG und WebP. Alle Kennzeichen sind verpixelt, Metadaten (EXIF/GPS) entfernt.

## Datenschutz-Hinweise zur Technik

- Schriften liegen lokal in `assets/fonts/`, es gibt keine Verbindung zu Google Fonts.
- Google Maps wird erst nach Klick auf „Karte anzeigen“ geladen.
- Keine Cookies, kein Tracking.
