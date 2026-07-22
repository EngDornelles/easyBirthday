# easyBirthday

A lightweight portfolio web app for turning a two-column birthday spreadsheet into a visual birthday report. Available in English, Portuguese, and Spanish.

## Input format

Upload a CSV, XLSX, or XLS file — or paste cells copied straight from Excel or Google Sheets — with columns like:

```csv
names,birthday
Ana Silva,1990-03-25
Bruno Costa,17/06/1985
```

The app accepts common header aliases such as `name`, `names`, `nome`, `birthday`, `birthdate`, `data`, and `d. n.`. Slash dates are interpreted as `DD/MM/YYYY` when possible. Comma, tab, and semicolon delimiters are auto-detected.

## Language

Use the switcher in the top-right corner to change the UI between English, Portuguese, and Spanish. Your choice is remembered for next time.

## Run locally

This is a static app, so either open `index.html` directly or run:

```powershell
python -m http.server 4173
```

Then visit `http://localhost:4173`.

