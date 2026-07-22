# easyBirthday Agent Bootstrap

Use this file as the starting context for future agents working on easyBirthday.

## Project

easyBirthday is a static portfolio web app that turns a two-column birthday CSV into a visual birthday report inspired by the included workbook `planilha de aniversarios.xlsx`.

## Current App

- Entry point: `index.html`
- Styling: `src/styles.css`
- CSV parsing and report logic: `src/app.js`
- Sample input: `data/sample-birthdays.csv`
- Generated visual asset: `assets/birthday-report-banner.png`

## Expected CSV

The user uploads a CSV with two columns:

```csv
names,birthday
Ana Silva,1990-03-25
Bruno Costa,17/06/1985
```

The current implementation accepts common aliases for names and birthdays. Slash dates are interpreted as `DD/MM/YYYY` where possible.

## Report Features

- People count
- Average age
- Next birthday
- Oldest person
- Ledger with age, days alive, weekday, zodiac sign, and next birthday
- Upcoming birthday queue
- Weekday and zodiac summary charts
- CSV quality issue list
- Export generated report CSV

## Working Notes

Check `observations.md` first for user-provided topics and planned changes. Preserve the static, no-build-step workflow unless a future requirement justifies adding tooling.

## Local Run

```powershell
python -m http.server 4173
```

Then open `http://localhost:4173`.

