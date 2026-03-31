# DonutSMP Profit Calculator

Dieses Projekt ist eine Single-Page Webanwendung, mit der Minecraft-Spieler (auf dem DonutSMP Server) die lukrativsten Crafting-Trades berechnen können.

## 🏗️ Architektur & Tech Stack
- **Frontend-Technologien:** Vanilla HTML5, CSS3, JavaScript (ES6). Keine externen Frameworks (wie React oder Vue).
- **Designstil:** Apple-Style / Modern UI (viel Weißraum, weiche Schatten, `border-radius: 20px`, Glassmorphism, flüssige Transitionen).
- **Icons:** [Lucide Icons](https://lucide.dev) (via CDN eingebunden).
- **Speicher:** Lokale Datenspeicherung via `localStorage` im Browser.

## 📂 Struktur
- `index.html`: Das HTML-Gerüst. Beinhaltet Header, drei Spalten-Panels (Materialpreise, Ziel-Items, Bester Trade) und Modals für Neueinträge.
- `style.css`: Das komplette Styling inklusive CSS-Variablen für Light/Dark Mode (Attribut `data-theme="dark"` auf `<html>`).
- `app.js`: Die komplette Geschäftslogik und das Render-System.

## 🧠 State Management (`app.js`)
Die App speichert alle Daten in einem globalen `state` Objekt:

```javascript
let state = {
  materials: [],      // Array von Material-Objekten
  recipes: [],        // Array von Rezept-Objekten
  recipePrices: {},   // Map { "recipeId": 50.0 } (vom User gesetzte Verkaufspreise)
  qty: 1,             // Globaler Multiplikator für Crafting-Mengen
  darkMode: false
};
```

### 🔗 Verlinkte Materialien (Erze / Blöcke)
Damit User nicht Barren und Blöcke manuell doppelt pflegen müssen, unterstützen Materialien ein Link-System.
- **Eigenschaften:** Ein Material kann `linkedTo: 'baseId'` und eine `linkRatio: 9` haben.
- **Beispiel:** `iron_block` ist verlinkt mit `iron` (Ratio 9).
- **Logik (in `renderMaterials`):** 
  - Ändert der User den Preis des Blocks (z.B. auf 90), sucht die App das Parent-Material (`iron`) und teilt den Preis (`90 / 9 = 10`).
  - Ändert der User das Parent-Material (`iron` auf 10), sucht die App alle Child-Elemente, die als `linkedTo` dieses Parent haben, und multipliziert (`10 * 9 = 90`).

### 📦 Crafting & "Bester Trade" Kalkulation
Anstatt nur ein Rezept zu berechnen, rendert die End-App in der mittleren Spalte **alle** Rezepte aus `state.recipes`.
In der Funktion `recalculate()` passiert Folgendes:
1. Iteriert über alle Rezepte.
2. Prüft, ob ein `sellPrice` in `state.recipePrices[recipeId]` hinterlegt ist (> 0).
3. Berechnet die kumulierten Crafting-Kosten basierend auf den Ingredients und vergleicht diese mit dem `sellPrice * qty`.
4. Das Item mit dem **höchsten absoluten Gewinn** (`profit = revenue - cost`) wird auf der rechten Seite als "🏆 Bester Trade 🏆" gerendert.

## 💡 Für KI-Assistenten (Notizen für zukünftige Änderungen)
- **DOM-Updates:** Da es kein Virtual-DOM wie React gibt, werden UI-Bereiche in JS durch `innerHTML` immer wieder komplett neu gerendert (z.B. `renderMaterials()`, `renderRecipes()`). Setze nach jedem Re-Render zwingend Event-Listener für Inputs/Buttons neu.
- **Lucide Icons:** Nach *jedem* DOM-Update, das Icons generiert, *muss* am Ende `lucide.createIcons()` ausgeführt werden, damit `<i data-lucide="..."></i>` sich in SVGs umwandeln.
- **Local Storage Versionierung:** Die Keys im Storage heißen aktuell z.B. `donutsmp_materials_v2`. Wenn sich die Datenstruktur gravierend ändert, sollte die Version (Zahl im Key-String) hochgezählt werden, damit alte Speicherstände der User die App nicht kaputt machen.
- **Local Server Testing:** Wegen CORS und File-System-Restriktionen sollte die App zum Testen via `python -m http.server 8765` gestartet und im Browser verifiziert werden.

## 🚀 Todos / Geplante Features (Optional)
- *Import/Export von Preislisten (JSON File)*
- *API Anbindung an echte DonutSMP Marktpreise (wenn verfügbar)*
