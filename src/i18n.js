const I18N = (() => {
  const STORAGE_KEY = "easybirthday-lang";
  const SUPPORTED = ["en", "pt", "es"];
  const LOCALE_MAP = { en: "en", pt: "pt-BR", es: "es-ES" };

  const ZODIAC_ORDER = [
    "capricorn",
    "aquarius",
    "pisces",
    "aries",
    "taurus",
    "gemini",
    "cancer",
    "leo",
    "virgo",
    "libra",
    "scorpio",
    "sagittarius",
  ];

  const translations = {
    en: {
      language: { label: "Language" },
      brand: {
        eyebrow: "CSV birthday report",
        lede: "Upload names and birthdays, then get the same useful spreadsheet-style calculations with cleaner summaries and quick visual checks.",
      },
      upload: {
        dropTitle: "Drop a CSV, XLSX, or XLS, or choose a file",
        dropNote: "Expected columns: names, birthday",
        dropPasteHint: "or paste (Ctrl+V) cells copied from Excel or Sheets",
        sample: "Load sample",
        clear: "Clear",
        statusReady: "Ready for a CSV, XLSX, XLS, or pasted table.",
      },
      metrics: {
        people: "People",
        age: "Average age",
        next: "Next birthday",
        oldest: "Oldest person",
        nextValue: (p) => `${p.name} (${p.days === 0 ? "today" : `${p.days}d`})`,
        oldestValue: (p) => `${p.name} (${p.age})`,
      },
      ledger: {
        eyebrow: "Calculated table",
        title: "Birthday ledger",
        export: "Export report CSV",
        empty: "Upload a CSV to generate the report.",
        headers: {
          name: "Name",
          birthday: "Birthday",
          age: "Age",
          daysAlive: "Days alive",
          weekday: "Weekday",
          sign: "Sign",
          nextBirthday: "Next birthday",
        },
      },
      queue: {
        eyebrow: "Next up",
        title: "Birthday queue",
        empty: "No birthdays loaded.",
        turning: (p) => `${p.date} - turning ${p.age} in ${p.days} day${p.days === 1 ? "" : "s"}`,
      },
      checks: {
        eyebrow: "Workbook echoes",
        title: "Summary checks",
        weekdayAria: "Birthdays by weekday",
        zodiacAria: "Birthdays by zodiac sign",
        monthAria: "Birthdays by month",
      },
      issues: {
        eyebrow: "CSV quality",
        title: "Rows needing attention",
        empty: "No row issues found.",
        missingName: "Row {row}: missing name.",
        invalidBirthday: "Row {row}: invalid birthday.",
        futureBirthday: "Row {row}: birthday is in the future.",
      },
      errors: {
        missingColumns: "Could not find name and birthday columns. Try headers: names,birthday.",
        needsHeaderRow: "The file needs a header row and at least one data row.",
        unsupportedFile: "Unsupported file type. Use CSV, XLSX, or XLS.",
        readFailed: "Could not read the file.",
      },
      status: {
        sampleLabel: "Sample data",
        pastedLabel: "Pasted data",
        loaded: (p) => `${p.source}: loaded ${p.count} birthday${p.count === 1 ? "" : "s"}.`,
      },
      export: {
        daysUntil: "Days until",
      },
      weekdays: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      zodiac: {
        capricorn: "Capricorn",
        aquarius: "Aquarius",
        pisces: "Pisces",
        aries: "Aries",
        taurus: "Taurus",
        gemini: "Gemini",
        cancer: "Cancer",
        leo: "Leo",
        virgo: "Virgo",
        libra: "Libra",
        scorpio: "Scorpio",
        sagittarius: "Sagittarius",
      },
    },
    pt: {
      language: { label: "Idioma" },
      brand: {
        eyebrow: "Relatório de aniversários por CSV",
        lede: "Envie nomes e datas de nascimento para obter os mesmos cálculos úteis de uma planilha, com resumos mais claros e checagens visuais rápidas.",
      },
      upload: {
        dropTitle: "Solte um CSV, XLSX ou XLS, ou escolha um arquivo",
        dropNote: "Colunas esperadas: names, birthday",
        dropPasteHint: "ou cole (Ctrl+V) células copiadas do Excel ou Google Sheets",
        sample: "Carregar exemplo",
        clear: "Limpar",
        statusReady: "Pronto para um CSV, XLSX, XLS ou tabela colada.",
      },
      metrics: {
        people: "Pessoas",
        age: "Idade média",
        next: "Próximo aniversário",
        oldest: "Pessoa mais velha",
        nextValue: (p) => `${p.name} (${p.days === 0 ? "hoje" : `${p.days}d`})`,
        oldestValue: (p) => `${p.name} (${p.age})`,
      },
      ledger: {
        eyebrow: "Tabela calculada",
        title: "Registro de aniversários",
        export: "Exportar relatório CSV",
        empty: "Envie um CSV para gerar o relatório.",
        headers: {
          name: "Nome",
          birthday: "Nascimento",
          age: "Idade",
          daysAlive: "Dias de vida",
          weekday: "Dia da semana",
          sign: "Signo",
          nextBirthday: "Próximo aniversário",
        },
      },
      queue: {
        eyebrow: "A seguir",
        title: "Fila de aniversários",
        empty: "Nenhum aniversário carregado.",
        turning: (p) => `${p.date} - completa ${p.age} anos em ${p.days} dia${p.days === 1 ? "" : "s"}`,
      },
      checks: {
        eyebrow: "Ecos da planilha",
        title: "Resumo",
        weekdayAria: "Aniversários por dia da semana",
        zodiacAria: "Aniversários por signo",
        monthAria: "Aniversários por mês",
      },
      issues: {
        eyebrow: "Qualidade do CSV",
        title: "Linhas que precisam de atenção",
        empty: "Nenhum problema encontrado nas linhas.",
        missingName: "Linha {row}: nome ausente.",
        invalidBirthday: "Linha {row}: data de nascimento inválida.",
        futureBirthday: "Linha {row}: data de nascimento está no futuro.",
      },
      errors: {
        missingColumns: "Não foi possível encontrar as colunas de nome e nascimento. Tente os cabeçalhos: names,birthday.",
        needsHeaderRow: "O arquivo precisa de uma linha de cabeçalho e ao menos uma linha de dados.",
        unsupportedFile: "Tipo de arquivo não suportado. Use CSV, XLSX ou XLS.",
        readFailed: "Não foi possível ler o arquivo.",
      },
      status: {
        sampleLabel: "Dados de exemplo",
        pastedLabel: "Dados colados",
        loaded: (p) => `${p.source}: ${p.count} aniversário${p.count === 1 ? "" : "s"} carregado${p.count === 1 ? "" : "s"}.`,
      },
      export: {
        daysUntil: "Dias até",
      },
      weekdays: ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"],
      months: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
      zodiac: {
        capricorn: "Capricórnio",
        aquarius: "Aquário",
        pisces: "Peixes",
        aries: "Áries",
        taurus: "Touro",
        gemini: "Gêmeos",
        cancer: "Câncer",
        leo: "Leão",
        virgo: "Virgem",
        libra: "Libra",
        scorpio: "Escorpião",
        sagittarius: "Sagitário",
      },
    },
    es: {
      language: { label: "Idioma" },
      brand: {
        eyebrow: "Informe de cumpleaños por CSV",
        lede: "Sube nombres y fechas de nacimiento para obtener los mismos cálculos útiles de una hoja de cálculo, con resúmenes más claros y verificaciones visuales rápidas.",
      },
      upload: {
        dropTitle: "Suelta un CSV, XLSX o XLS, o elige un archivo",
        dropNote: "Columnas esperadas: names, birthday",
        dropPasteHint: "o pega (Ctrl+V) celdas copiadas de Excel o Google Sheets",
        sample: "Cargar ejemplo",
        clear: "Limpiar",
        statusReady: "Listo para un CSV, XLSX, XLS o tabla pegada.",
      },
      metrics: {
        people: "Personas",
        age: "Edad media",
        next: "Próximo cumpleaños",
        oldest: "Persona mayor",
        nextValue: (p) => `${p.name} (${p.days === 0 ? "hoy" : `${p.days}d`})`,
        oldestValue: (p) => `${p.name} (${p.age})`,
      },
      ledger: {
        eyebrow: "Tabla calculada",
        title: "Registro de cumpleaños",
        export: "Exportar informe CSV",
        empty: "Sube un CSV para generar el informe.",
        headers: {
          name: "Nombre",
          birthday: "Nacimiento",
          age: "Edad",
          daysAlive: "Días de vida",
          weekday: "Día de la semana",
          sign: "Signo",
          nextBirthday: "Próximo cumpleaños",
        },
      },
      queue: {
        eyebrow: "A continuación",
        title: "Cola de cumpleaños",
        empty: "No hay cumpleaños cargados.",
        turning: (p) => `${p.date} - cumple ${p.age} años en ${p.days} día${p.days === 1 ? "" : "s"}`,
      },
      checks: {
        eyebrow: "Ecos de la hoja de cálculo",
        title: "Resumen",
        weekdayAria: "Cumpleaños por día de la semana",
        zodiacAria: "Cumpleaños por signo zodiacal",
        monthAria: "Cumpleaños por mes",
      },
      issues: {
        eyebrow: "Calidad del CSV",
        title: "Filas que necesitan atención",
        empty: "No se encontraron problemas en las filas.",
        missingName: "Fila {row}: falta el nombre.",
        invalidBirthday: "Fila {row}: fecha de nacimiento inválida.",
        futureBirthday: "Fila {row}: la fecha de nacimiento está en el futuro.",
      },
      errors: {
        missingColumns: "No se pudieron encontrar las columnas de nombre y nacimiento. Prueba con los encabezados: names,birthday.",
        needsHeaderRow: "El archivo necesita una fila de encabezado y al menos una fila de datos.",
        unsupportedFile: "Tipo de archivo no compatible. Usa CSV, XLSX o XLS.",
        readFailed: "No se pudo leer el archivo.",
      },
      status: {
        sampleLabel: "Datos de ejemplo",
        pastedLabel: "Datos pegados",
        loaded: (p) => `${p.source}: ${p.count} cumpleaños cargado${p.count === 1 ? "" : "s"}.`,
      },
      export: {
        daysUntil: "Días hasta",
      },
      weekdays: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
      months: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
      zodiac: {
        capricorn: "Capricornio",
        aquarius: "Acuario",
        pisces: "Piscis",
        aries: "Aries",
        taurus: "Tauro",
        gemini: "Géminis",
        cancer: "Cáncer",
        leo: "Leo",
        virgo: "Virgo",
        libra: "Libra",
        scorpio: "Escorpio",
        sagittarius: "Sagitario",
      },
    },
  };

  let current = detectInitial();

  function detectInitial() {
    const stored = typeof localStorage !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    if (stored && SUPPORTED.includes(stored)) {
      return stored;
    }
    const nav = (typeof navigator !== "undefined" && navigator.language ? navigator.language : "en").toLowerCase();
    if (nav.startsWith("pt")) return "pt";
    if (nav.startsWith("es")) return "es";
    return "en";
  }

  function resolve(key, lang) {
    return key.split(".").reduce((acc, part) => (acc == null ? undefined : acc[part]), translations[lang]);
  }

  function t(key, params) {
    let value = resolve(key, current);
    if (value === undefined) {
      value = resolve(key, "en");
    }
    if (typeof value === "function") {
      return value(params || {});
    }
    if (typeof value === "string" && params) {
      return value.replace(/\{(\w+)\}/g, (_, name) => (params[name] !== undefined ? params[name] : ""));
    }
    return value !== undefined ? value : key;
  }

  function list(key) {
    return resolve(key, current) || resolve(key, "en") || [];
  }

  function setLang(lang) {
    if (!SUPPORTED.includes(lang) || lang === current) {
      return;
    }
    current = lang;
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(STORAGE_KEY, lang);
    }
    document.documentElement.lang = LOCALE_MAP[lang];
    applyStaticTranslations();
    document.dispatchEvent(new CustomEvent("i18n:change", { detail: { lang } }));
  }

  function getLang() {
    return current;
  }

  function locale() {
    return LOCALE_MAP[current];
  }

  function applyStaticTranslations() {
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      el.textContent = t(el.getAttribute("data-i18n"));
    });
    document.querySelectorAll("[data-i18n-attr]").forEach((el) => {
      el.getAttribute("data-i18n-attr")
        .split(",")
        .forEach((pair) => {
          const [attr, key] = pair.split(":");
          el.setAttribute(attr, t(key));
        });
    });
  }

  return {
    SUPPORTED,
    ZODIAC_ORDER,
    t,
    list,
    setLang,
    getLang,
    locale,
    applyStaticTranslations,
  };
})();
