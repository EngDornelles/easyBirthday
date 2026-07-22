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

const zodiacRanges = [
  ["capricorn", [1, 19]],
  ["aquarius", [2, 18]],
  ["pisces", [3, 20]],
  ["aries", [4, 19]],
  ["taurus", [5, 20]],
  ["gemini", [6, 20]],
  ["cancer", [7, 22]],
  ["leo", [8, 22]],
  ["virgo", [9, 22]],
  ["libra", [10, 22]],
  ["scorpio", [11, 21]],
  ["sagittarius", [12, 21]],
  ["capricorn", [12, 31]],
];

const elements = {
  fileInput: document.querySelector("#csv-file"),
  dropZone: document.querySelector("#drop-zone"),
  uploadForm: document.querySelector("#upload-form"),
  sampleButton: document.querySelector("#sample-button"),
  clearButton: document.querySelector("#clear-button"),
  statusLine: document.querySelector("#status-line"),
  downloadButton: document.querySelector("#download-button"),
  languageSelect: document.querySelector("#language-select"),
  people: document.querySelector("#metric-people"),
  age: document.querySelector("#metric-age"),
  next: document.querySelector("#metric-next"),
  oldest: document.querySelector("#metric-oldest"),
  ledgerBody: document.querySelector("#ledger-body"),
  queueList: document.querySelector("#queue-list"),
  weekdayChart: document.querySelector("#weekday-chart"),
  zodiacChart: document.querySelector("#zodiac-chart"),
  monthChart: document.querySelector("#month-chart"),
  issueList: document.querySelector("#issue-list"),
};

let currentReport = [];
let currentIssues = [];
let currentStatus = { type: "ready" };

function normalizeHeader(value) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "");
}

function detectDelimiter(text) {
  const firstLine = text.split(/\r\n|\r|\n/).find((line) => line.trim().length > 0) || "";
  const counts = {
    ",": (firstLine.match(/,/g) || []).length,
    "\t": (firstLine.match(/\t/g) || []).length,
    ";": (firstLine.match(/;/g) || []).length,
  };
  const [bestDelimiter, bestCount] = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  return bestCount > 0 ? bestDelimiter : ",";
}

function parseDelimited(text, delimiter) {
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
    } else if (char === delimiter && !quoted) {
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

  for (const [key, [endMonth, endDay]] of zodiacRanges) {
    if (month < endMonth || (month === endMonth && day <= endDay)) {
      return key;
    }
  }

  return "capricorn";
}

function formatDate(date) {
  return new Intl.DateTimeFormat(I18N.locale(), {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatShortDate(date) {
  return new Intl.DateTimeFormat(I18N.locale(), {
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
    throw new Error(I18N.t("errors.missingColumns"));
  }

  const report = dataRows
    .map((row, index) => {
      const rowNumber = index + 2;
      const name = (row[nameIndex] || "").trim();
      const birthday = parseBirthday(row[birthdayIndex] || "");

      if (!name || !birthday) {
        issues.push({ key: !name ? "issues.missingName" : "issues.invalidBirthday", params: { row: rowNumber } });
        return null;
      }

      if (birthday > today) {
        issues.push({ key: "issues.futureBirthday", params: { row: rowNumber } });
        return null;
      }

      const nextBirthday = nextBirthdayDate(birthday, today);
      const daysUntil = daysBetween(today, nextBirthday);

      return {
        name,
        birthday,
        age: calculateAge(birthday, today),
        daysAlive: daysBetween(birthday, today),
        weekdayIndex: birthday.getDay(),
        monthIndex: birthday.getMonth(),
        zodiacKey: zodiacForDate(birthday),
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
  currentIssues = issues;
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
  elements.next.textContent = I18N.t("metrics.nextValue", { name: next.name, days: next.daysUntil });
  elements.oldest.textContent = I18N.t("metrics.oldestValue", { name: oldest.name, age: oldest.age });
}

function renderLedger(report) {
  if (!report.length) {
    elements.ledgerBody.innerHTML = `<tr><td colspan="7" class="empty-cell">${escapeHtml(I18N.t("ledger.empty"))}</td></tr>`;
    return;
  }

  const weekdayLabels = I18N.list("weekdays");

  elements.ledgerBody.innerHTML = report
    .map(
      (row) => `<tr>
        <td><strong>${escapeHtml(row.name)}</strong></td>
        <td>${formatDate(row.birthday)}</td>
        <td>${row.age}</td>
        <td>${row.daysAlive.toLocaleString(I18N.locale())}</td>
        <td>${escapeHtml(weekdayLabels[row.weekdayIndex])}</td>
        <td><span class="tag">${escapeHtml(I18N.t(`zodiac.${row.zodiacKey}`))}</span></td>
        <td>${formatShortDate(row.nextBirthday)} <span class="muted">(${row.daysUntil}d)</span></td>
      </tr>`,
    )
    .join("");
}

function renderQueue(report) {
  if (!report.length) {
    elements.queueList.innerHTML = `<li class="empty-list">${escapeHtml(I18N.t("queue.empty"))}</li>`;
    return;
  }

  elements.queueList.innerHTML = report
    .slice(0, 6)
    .map((row) => {
      const nextAge = row.daysUntil === 0 ? row.age : row.age + 1;
      const line = I18N.t("queue.turning", { date: formatShortDate(row.nextBirthday), age: nextAge, days: row.daysUntil });
      return `<li>
        <strong>${escapeHtml(row.name)}</strong>
        ${escapeHtml(line)}
      </li>`;
    })
    .join("");
}

function renderCharts(report) {
  const weekdayLabels = I18N.list("weekdays");
  const monthLabels = I18N.list("months");

  renderBarChart(
    elements.weekdayChart,
    countBy(report, "weekdayIndex"),
    weekdayLabels.map((label, key) => ({ key, label })),
  );
  renderBarChart(
    elements.zodiacChart,
    countBy(report, "zodiacKey"),
    I18N.ZODIAC_ORDER.map((key) => ({ key, label: I18N.t(`zodiac.${key}`) })),
  );
  renderBarChart(
    elements.monthChart,
    countBy(report, "monthIndex"),
    monthLabels.map((label, key) => ({ key, label })),
  );
}

function countBy(report, key) {
  return report.reduce((accumulator, row) => {
    accumulator[row[key]] = (accumulator[row[key]] || 0) + 1;
    return accumulator;
  }, {});
}

function renderBarChart(container, counts, entries) {
  const max = Math.max(1, ...Object.values(counts));
  container.innerHTML = entries
    .map(({ key, label }) => {
      const count = counts[key] || 0;
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
    elements.issueList.innerHTML = `<li>${escapeHtml(I18N.t("issues.empty"))}</li>`;
    return;
  }

  elements.issueList.innerHTML = issues
    .map((issue) => `<li>${escapeHtml(I18N.t(issue.key, issue.params))}</li>`)
    .join("");
}

function handleText(text, sourceLabel) {
  try {
    const delimiter = detectDelimiter(text);
    const rows = parseDelimited(text, delimiter);
    if (rows.length < 2) {
      throw new Error(I18N.t("errors.needsHeaderRow"));
    }
    const { report, issues } = buildReport(rows);
    renderReport(report, issues);
    currentStatus = { type: "loaded", source: sourceLabel, count: report.length };
    elements.statusLine.textContent = I18N.t("status.loaded", { source: sourceLabel, count: report.length });
  } catch (error) {
    renderReport([], []);
    currentStatus = { type: "error", message: error.message };
    elements.statusLine.textContent = error.message;
  }
}

function handleFile(file) {
  const extension = (file.name.split(".").pop() || "").toLowerCase();

  if (extension === "xlsx" || extension === "xls") {
    file
      .arrayBuffer()
      .then((buffer) => {
        const workbook = XLSX.read(buffer, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const csv = XLSX.utils.sheet_to_csv(sheet);
        handleText(csv, file.name);
      })
      .catch(() => {
        currentStatus = { type: "error", message: I18N.t("errors.readFailed") };
        renderReport([], []);
        elements.statusLine.textContent = I18N.t("errors.readFailed");
      });
    return;
  }

  if (extension === "csv" || extension === "txt" || !extension) {
    file.text().then((text) => handleText(text, file.name));
    return;
  }

  currentStatus = { type: "error", message: I18N.t("errors.unsupportedFile") };
  renderReport([], []);
  elements.statusLine.textContent = I18N.t("errors.unsupportedFile");
}

function downloadReport() {
  if (!currentReport.length) {
    return;
  }

  const weekdayLabels = I18N.list("weekdays");
  const headers = [
    I18N.t("ledger.headers.name"),
    I18N.t("ledger.headers.birthday"),
    I18N.t("ledger.headers.age"),
    I18N.t("ledger.headers.daysAlive"),
    I18N.t("ledger.headers.weekday"),
    I18N.t("ledger.headers.sign"),
    I18N.t("ledger.headers.nextBirthday"),
    I18N.t("export.daysUntil"),
  ];
  const rows = currentReport.map((row) => [
    row.name,
    row.birthday.toISOString().slice(0, 10),
    row.age,
    row.daysAlive,
    weekdayLabels[row.weekdayIndex],
    I18N.t(`zodiac.${row.zodiacKey}`),
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

function refreshStatusLine() {
  if (currentStatus.type === "loaded") {
    elements.statusLine.textContent = I18N.t("status.loaded", { source: currentStatus.source, count: currentStatus.count });
  } else if (currentStatus.type === "ready") {
    elements.statusLine.textContent = I18N.t("upload.statusReady");
  }
}

elements.fileInput.addEventListener("change", (event) => {
  const [file] = event.target.files;
  if (!file) {
    return;
  }

  handleFile(file);
});

elements.sampleButton.addEventListener("click", () => {
  handleText(sampleCsv, I18N.t("status.sampleLabel"));
});

elements.clearButton.addEventListener("click", () => {
  currentReport = [];
  currentIssues = [];
  currentStatus = { type: "ready" };
  renderReport([]);
  elements.statusLine.textContent = I18N.t("upload.statusReady");
  elements.fileInput.value = "";
});

elements.downloadButton.addEventListener("click", downloadReport);

elements.languageSelect.addEventListener("change", (event) => {
  I18N.setLang(event.target.value);
});

document.addEventListener("i18n:change", () => {
  renderReport(currentReport, currentIssues);
  refreshStatusLine();
});

document.addEventListener("paste", (event) => {
  const target = event.target;
  if (target && ["INPUT", "SELECT", "TEXTAREA"].includes(target.tagName)) {
    return;
  }

  const text = event.clipboardData ? event.clipboardData.getData("text/plain") : "";
  if (!text || (!text.includes("\n") && !text.includes("\t"))) {
    return;
  }

  event.preventDefault();
  handleText(text, I18N.t("status.pastedLabel"));
});

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

  handleFile(file);
});

elements.languageSelect.value = I18N.getLang();
document.documentElement.lang = I18N.locale();
I18N.applyStaticTranslations();
renderReport([]);
