# easyBirthday

A lightweight portfolio web app for turning a two-column birthday CSV into a visual birthday report.

## CSV format

Upload a CSV with headers like:

```csv
names,birthday
Ana Silva,1990-03-25
Bruno Costa,17/06/1985
```

The app accepts common header aliases such as `name`, `names`, `nome`, `birthday`, `birthdate`, `data`, and `d. n.`. Slash dates are interpreted as `DD/MM/YYYY` when possible.

## Run locally

This is a static app, so either open `index.html` directly or run:

```powershell
python -m http.server 4173
```

Then visit `http://localhost:4173`.

