const sampleCsv = `names,birthday
Paulo Roberto,1983-02-18
Janaina Flores,1975-01-24
Maria Izabel,1960-02-05
Iara Araujo,1991-03-25
Suellen Maia,1983-03-25
Fabio Souza,1981-03-26
Vilma Bento,1954-04-04
Gabriella Silva,1982-07-01
Larissa Valadares,1988-01-01
Ana Passarella,1984-01-02`;

const weekdayNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const zodiacSigns = [
  ["Capricorn", [1, 19]],
  ["Aquarius", [2, 18]],
  ["Pisces", [3, 20]],
  ["Aries", [4, 19]],
  ["Taurus", [5, 20]],
  ["Gemini", [6, 20]],
  ["Cancer", [7, 22]],
  ["Leo", [8, 22]],
  ["Virgo", [9, 22]],
  ["Libra", [10, 22]],
  ["Scorpio", [11, 21]],
  ["Sagittarius", [12, 21]],
  ["Capricorn", [12, 31]],
];

const elements = {
  fileInput: document.querySelector("#csv-file"),
  dropZone: document.querySelector("#drop-zone"),
  uploadForm: document.querySelector("#upload-form"),
  sampleButton: document.querySelector("#sample-button"),
  clearButton: document.querySelector("#clear-button"),
  statusLine: document.querySelector("#status-line"),
  downloadButton: document.querySelector("#download-button"),
  people: document.querySelector("#metric-people"),
  age: document.querySelector("#metric-age"),
  next: document.querySelector("#metric-next"),
  oldest: document.querySelector("#metric-oldest"),
  ledgerBody: document.querySelector("#ledger-body"),
  queueList: document.querySelector("#queue-list"),
  weekdayChart: document.querySelector("#weekday-chart"),
  zodiacChart: document.querySelector("#zodiac-chart"),
  issueList: document.querySelector("#issue-list"),
};

let currentReport = [];

function normalizeHeader(value) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "");
}

function parseCsv(text) {
  const rows = [];
  let field = "";
  let row = [];
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];

    if (char === '"' && quoted && next === '"') {
      field += '"';
      index += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      row.push(field.trim());
      field = "";
    } else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && next === "\n") {
        index += 1;
      }
      row.push(field.trim());
      if (row.some(Boolean)) {
        rows.push(row);
      }
      field = "";
      row = [];
    } else {
      field += char;
    }
  }

  row.push(field.trim());
  if (row.some(Boolean)) {
    rows.push(row);
  }

  return rows;
}

function findColumns(headers) {
  const normalized = headers.map(normalizeHeader);
  const nameAliases = new Set(["name", "names", "nome", "nomes", "pessoa", "person"]);
  const birthdayAliases = new Set([
    "birthday",
    "birthdate",
    "birth",
    "dob",
    "data",
    "nascimento",
    "datadenascimento",
    "dn",
    "dnasc",
  ]);

  return {
    nameIndex: normalized.findIndex((header) => nameAliases.has(header)),
    birthdayIndex: normalized.findIndex((header) => birthdayAliases.has(header)),
  };
}

function parseBirthday(rawValue) {
  const value = rawValue.trim();
  if (!value) {
    return null;
  }

  const iso = value.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (iso) {
    return buildDate(Number(iso[1]), Number(iso[2]), Number(iso[3]));
  }

  const slash = value.match(/^(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{2,4})$/);
  if (slash) {
    const first = Number(slash[1]);
    const second = Number(slash[2]);
    const year = normalizeYear(Number(slash[3]));
    const dayFirst = buildDate(year, second, first);

    if (dayFirst) {
      return dayFirst;
    }

    return buildDate(year, first, second);
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
}

function normalizeYear(year) {
  if (year < 100) {
    return year > 30 ? 1900 + year : 2000 + year;
  }
  return year;
}

function buildDate(year, month, day) {
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return null;
  }
  return date;
}

function calculateAge(birthday, today) {
  let age = today.getFullYear() - birthday.getFullYear();
  const hadBirthday =
    today.getMonth() > birthday.getMonth() ||
    (today.getMonth() === birthday.getMonth() && today.getDate() >= birthday.getDate());

  if (!hadBirthday) {
    age -= 1;
  }

  return age;
}

function daysBetween(start, end) {
  const startUtc = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
  const endUtc = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());
  return Math.round((endUtc - startUtc) / 86400000);
}

function nextBirthdayDate(birthday, today) {
  let year = today.getFullYear();
  let next = new Date(year, birthday.getMonth(), birthday.getDate());

  if (birthday.getMonth() === 1 && birthday.getDate() === 29 && next.getMonth() !== 1) {
    next = new Date(year, 1, 28);
  }

  if (daysBetween(today, next) < 0) {
    year += 1;
    next = new Date(year, birthday.getMonth(), birthday.getDate());
    if (birthday.getMonth() === 1 && birthday.getDate() === 29 && next.getMonth() !== 1) {
      next = new Date(year, 1, 28);
    }
  }

  return next;
}

function zodiacForDate(date) {
  const month = date.getMonth() + 1;
  const day = date.getDate();

  for (const [sign, [endMonth, endDay]] of zodiacSigns) {
    if (month < endMonth || (month === endMonth && day <= endDay)) {
      return sign;
    }
  }

  return "Capricorn";
}

function formatDate(date) {
  return new Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatShortDate(date) {
  return new Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "short",
  }).format(date);
}

function buildReport(rows) {
  const [headers, ...dataRows] = rows;
  const today = new Date();
  const { nameIndex, birthdayIndex } = findColumns(headers);
  const issues = [];

  if (nameIndex === -1 || birthdayIndex === -1) {
    throw new Error("Could not find name and birthday columns. Try headers: names,birthday.");
  }

  const report = dataRows
    .map((row, index) => {
      const rowNumber = index + 2;
      const name = (row[nameIndex] || "").trim();
      const birthday = parseBirthday(row[birthdayIndex] || "");

      if (!name || !birthday) {
        issues.push(`Row ${rowNumber}: ${!name ? "missing name" : "invalid birthday"}.`);
        return null;
      }

      if (birthday > today) {
        issues.push(`Row ${rowNumber}: birthday is in the future.`);
        return null;
      }

      const nextBirthday = nextBirthdayDate(birthday, today);
      const daysUntil = daysBetween(today, nextBirthday);

      return {
        name,
        birthday,
        age: calculateAge(birthday, today),
        daysAlive: daysBetween(birthday, today),
        weekday: weekdayNames[birthday.getDay()],
        zodiac: zodiacForDate(birthday),
        nextBirthday,
        daysUntil,
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.daysUntil - b.daysUntil || a.name.localeCompare(b.name));

  return { report, issues };
}

function renderReport(report, issues = []) {
  currentReport = report;
  renderMetrics(report);
  renderLedger(report);
  renderQueue(report);
  renderCharts(report);
  renderIssues(issues);
  elements.downloadButton.disabled = report.length === 0;
}

function renderMetrics(report) {
  elements.people.textContent = report.length.toString();

  if (!report.length) {
    elements.age.textContent = "0";
    elements.next.textContent = "-";
    elements.oldest.textContent = "-";
    return;
  }

  const totalAge = report.reduce((sum, row) => sum + row.age, 0);
  const oldest = [...report].sort((a, b) => b.age - a.age)[0];
  const next = report[0];

  elements.age.textContent = (totalAge / report.length).toFixed(1);
  elements.next.textContent = `${next.name} (${next.daysUntil === 0 ? "today" : `${next.daysUntil}d`})`;
  elements.oldest.textContent = `${oldest.name} (${oldest.age})`;
}

function renderLedger(report) {
  if (!report.length) {
    elements.ledgerBody.innerHTML = `<tr><td colspan="7" class="empty-cell">Upload a CSV to generate the report.</td></tr>`;
    return;
  }

  elements.ledgerBody.innerHTML = report
    .map(
      (row) => `<tr>
        <td><strong>${escapeHtml(row.name)}</strong></td>
        <td>${formatDate(row.birthday)}</td>
        <td>${row.age}</td>
        <td>${row.daysAlive.toLocaleString("en")}</td>
        <td>${row.weekday}</td>
        <td><span class="tag">${row.zodiac}</span></td>
        <td>${formatShortDate(row.nextBirthday)} <span class="muted">(${row.daysUntil}d)</span></td>
      </tr>`,
    )
    .join("");
}

function renderQueue(report) {
  if (!report.length) {
    elements.queueList.innerHTML = `<li class="empty-list">No birthdays loaded.</li>`;
    return;
  }

  elements.queueList.innerHTML = report
    .slice(0, 6)
    .map((row) => {
      const nextAge = row.daysUntil === 0 ? row.age : row.age + 1;
      return `<li>
        <strong>${escapeHtml(row.name)}</strong>
        ${formatShortDate(row.nextBirthday)} - turning ${nextAge} in ${row.daysUntil} day${row.daysUntil === 1 ? "" : "s"}
      </li>`;
    })
    .join("");
}

function renderCharts(report) {
  renderBarChart(elements.weekdayChart, countBy(report, "weekday"), weekdayNames);
  renderBarChart(
    elements.zodiacChart,
    countBy(report, "zodiac"),
    [...new Set(zodiacSigns.map(([sign]) => sign))],
  );
}

function countBy(report, key) {
  return report.reduce((accumulator, row) => {
    accumulator[row[key]] = (accumulator[row[key]] || 0) + 1;
    return accumulator;
  }, {});
}

function renderBarChart(container, counts, labels) {
  const max = Math.max(1, ...Object.values(counts));
  container.innerHTML = labels
    .map((label) => {
      const count = counts[label] || 0;
      const width = `${Math.max(3, (count / max) * 100)}%`;
      return `<div class="bar-row">
        <span class="bar-label" title="${escapeHtml(label)}">${escapeHtml(label)}</span>
        <span class="bar-track"><span class="bar-fill" style="width: ${width}"></span></span>
        <strong>${count}</strong>
      </div>`;
    })
    .join("");
}

function renderIssues(issues) {
  if (!issues.length) {
    elements.issueList.innerHTML = `<li>No row issues found.</li>`;
    return;
  }

  elements.issueList.innerHTML = issues.map((issue) => `<li>${escapeHtml(issue)}</li>`).join("");
}

function handleText(text, sourceLabel) {
  try {
    const rows = parseCsv(text);
    if (rows.length < 2) {
      throw new Error("The CSV needs a header row and at least one data row.");
    }
    const { report, issues } = buildReport(rows);
    renderReport(report, issues);
    elements.statusLine.textContent = `${sourceLabel}: loaded ${report.length} birthday${report.length === 1 ? "" : "s"}.`;
  } catch (error) {
    renderReport([], [error.message]);
    elements.statusLine.textContent = error.message;
  }
}

function downloadReport() {
  if (!currentReport.length) {
    return;
  }

  const headers = ["name", "birthday", "age", "days_alive", "weekday", "zodiac", "next_birthday", "days_until"];
  const rows = currentReport.map((row) => [
    row.name,
    row.birthday.toISOString().slice(0, 10),
    row.age,
    row.daysAlive,
    row.weekday,
    row.zodiac,
    row.nextBirthday.toISOString().slice(0, 10),
    row.daysUntil,
  ]);
  const csv = [headers, ...rows].map((row) => row.map(csvEscape).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "easybirthday-report.csv";
  link.click();
  URL.revokeObjectURL(url);
}

function csvEscape(value) {
  const stringValue = String(value);
  if (/[",\n\r]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

elements.fileInput.addEventListener("change", (event) => {
  const [file] = event.target.files;
  if (!file) {
    return;
  }

  file.text().then((text) => handleText(text, file.name));
});

elements.sampleButton.addEventListener("click", () => {
  handleText(sampleCsv, "Sample data");
});

elements.clearButton.addEventListener("click", () => {
  currentReport = [];
  renderReport([]);
  elements.statusLine.textContent = "Ready for a two-column CSV.";
  elements.fileInput.value = "";
});

elements.downloadButton.addEventListener("click", downloadReport);

["dragenter", "dragover"].forEach((eventName) => {
  elements.dropZone.addEventListener(eventName, (event) => {
    event.preventDefault();
    elements.dropZone.classList.add("is-dragging");
  });
});

["dragleave", "drop"].forEach((eventName) => {
  elements.dropZone.addEventListener(eventName, (event) => {
    event.preventDefault();
    elements.dropZone.classList.remove("is-dragging");
  });
});

elements.dropZone.addEventListener("drop", (event) => {
  const [file] = event.dataTransfer.files;
  if (!file) {
    return;
  }

  file.text().then((text) => handleText(text, file.name));
});

renderReport([]);
