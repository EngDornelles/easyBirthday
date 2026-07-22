# Changelog

## Unreleased

- Add handoff documentation for future agents via `prompt.md`, `AGENTS.md`, and `CLAUDE.md`.
- Add `observations.md` with next-session work items for localization, spreadsheet import, pasted table input, and monthly birthday charts.
- Add localization: `src/i18n.js` covers English, Portuguese (pt-BR), and Spanish for every label, message, and date format, with a language switcher that persists to `localStorage` and detects the browser locale on first visit.
- Add XLSX/XLS upload support via a locally vendored SheetJS build (`src/vendor/xlsx.full.min.js`, no CDN dependency) and a global paste handler for cells copied from Excel or Google Sheets.
- Add a "birthdays by month" chart alongside the existing weekday and zodiac summaries.
- Generalize CSV parsing to auto-detect comma, tab, or semicolon delimiters, covering pasted spreadsheet data and locale-specific CSV exports.

## 0.1.0 - 2026-07-22

- Create the first static easyBirthday app.
- Add CSV upload, sample data, birthday calculations, summary metrics, charts, issue reporting, and report CSV export.
- Add generated banner asset and local run instructions.
- Keep local Excel workbook references out of Git history via `.gitignore`.