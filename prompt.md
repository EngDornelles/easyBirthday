# easyBirthday Agent Bootstrap

Use this file as the starting context for future agents working on easyBirthday.

## Project

easyBirthday is a static portfolio web app that turns a two-column birthday CSV into a visual birthday report inspired by the included workbook `planilha de aniversarios.xlsx`.

## Current App

- Entry point: `index.html`
- Styling: `src/styles.css`
- CSV/XLSX parsing and report logic: `src/app.js`
- Localization (en/pt/es labels, dates, pluralization): `src/i18n.js`
- Vendored spreadsheet parser (no CDN calls): `src/vendor/xlsx.full.min.js` (SheetJS)
- Sample input: `data/sample-birthdays.csv`
- Generated visual asset: `assets/birthday-report-banner.png`

## Expected Input

The user uploads a CSV, XLSX, or XLS file (or pastes cells copied from Excel/Google Sheets) with two columns:

```csv
names,birthday
Ana Silva,1990-03-25
Bruno Costa,17/06/1985
```

The current implementation accepts common aliases for names and birthdays (including Portuguese/Spanish variants). Slash dates are interpreted as `DD/MM/YYYY` where possible. Delimiters (comma, tab, semicolon) are auto-detected, so pasted spreadsheet cells and locale-specific CSV exports both work.

## Localization

`src/i18n.js` holds every UI string, weekday/month/zodiac name, and pluralization rule for English, Portuguese (pt-BR), and Spanish. The language switcher in the top bar calls `I18N.setLang()`, which re-applies `[data-i18n]`/`[data-i18n-attr]` static text and fires an `i18n:change` event that `app.js` listens for to re-render the current report (dates, weekday/zodiac/month labels, pluralized messages) without reparsing the source data. Internally, report rows store language-agnostic keys (`weekdayIndex`, `monthIndex`, `zodiacKey`) and only translate at render time — add new UI strings as new keys in all three language blocks, not as hardcoded text in `index.html` or `app.js`. Default language is detected from `navigator.language` and persisted in `localStorage` after the user picks one.

## Report Features

- People count
- Average age
- Next birthday
- Oldest person
- Ledger with age, days alive, weekday, zodiac sign, and next birthday
- Upcoming birthday queue
- Weekday, zodiac, and month-of-birthday summary charts
- CSV quality issue list
- Export generated report CSV

## Working Notes

Check `observations.md` first for user-provided topics and planned changes. Preserve the static, no-build-step workflow unless a future requirement justifies adding tooling.

## Local Run

```powershell
python -m http.server 4173
```

Then open `http://localhost:4173`.

