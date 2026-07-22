# Observations

Add topics, defects, polish notes, and next-session decisions here.

## Resolved

1. ~~Simple CFG file that changes idioms for all the labels (ptbr, english, spanish).~~ Done via `src/i18n.js` + a language switcher in the top bar. Detects browser locale on first visit, persists choice in `localStorage`.
2. ~~Feed xlsx and xls files, or paste a copy extracted from Google Sheets or Excel.~~ Done. SheetJS is vendored locally at `src/vendor/xlsx.full.min.js` (no CDN calls) for `.xlsx`/`.xls`. A global paste listener accepts tab-separated cells copied from Excel/Sheets.
3. ~~Graph with count(birthdays) over months.~~ Done — a third mini bar chart (`#month-chart`) next to the weekday/zodiac ones.