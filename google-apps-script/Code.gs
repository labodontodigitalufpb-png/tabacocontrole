const CONFIG = {
  spreadsheetId: "1PQTTNZfqeHJRL7FOmfDeRgGsKxJCGMxEWQOsg2Lo0io",
  enviosSheetName: "Envios",
  casosSheetName: "Casos",
  timezone: "America/Fortaleza",
};

const SCRIPT_SCHEMA_VERSION = "2026-04-28-tabaco-controle-v6";

const METADATA_HEADERS = [
  "envioId",
  "recebidoEm",
  "origem",
  "timestampEnvio",
  "schemaVersion",
  "indiceCaso",
];

const CASE_KEY_ORDER = [
  "id",
  "dataRegistro",
  "identificacao",
  "telefone",
  "idade",
  "sexo",
  "escolaridade",
  "racaCor",
  "ocupacao",
  "municipio",
  "estado",
  "pais",
  "ine",
  "tipoEquipe",
  "profissionalResponsavel",
  "entrevistador",
  "data",
  "idioma",
  "localResidencia",
  "recebeVisitaSaude",
  "usoAtual",
  "frequencia",
  "idadeInicioRegular",
  "produtoPrincipal",
  "produtoOutros",
  "cigarrosDia",
  "exposicaoDomiciliar",
  "exposicaoTrabalhoEscola",
  "tentativaParar",
  "vezesTentou",
  "tempoUltimaTentativa",
  "motivoRecaida",
  "apoioPrevio",
  "usouMedicacaoApoioEstruturado",
  "procurouGrupoCessacaoSemAcesso",
  "interesseParar",
  "estagioMotivacional",
  "encaminhamentoNecessario",
  "formaObtencao",
  "cultivoLocal",
  "observacoes",
  "tipoUsuario",
  "primeiroCigarro",
  "dificuldadeLocais",
  "cigarroMaisDificil",
  "fumaMaisManha",
  "fumaDoente",
  "despertaNoiteFumar",
  "sintomasAbstinencia",
  "tentativasSemSucesso",
  "q1",
  "q2",
  "q3",
  "q4",
  "q5",
  "q6",
  "q7",
  "q8",
  "q9",
  "q10",
  "upenn_q1",
  "upenn_q2",
  "upenn_q3",
  "upenn_q4",
  "upenn_q5",
  "upenn_q6",
  "upenn_q7",
  "upenn_q8",
  "upenn_q9",
  "upenn_q10",
  "jaUsouAlgumaVez",
  "idadePrimeiroUso",
  "idadeUsoFrequente",
  "tempoUso",
  "frequenciaUso",
  "vezesPorDia",
  "tipoDispositivo",
  "usaMaisDeUm",
  "compartilhaDispositivo",
  "localCompra",
  "localCompraOutros",
  "contemNicotina",
  "concentracaoNicotina",
  "usaSabores",
  "saboresMaisUsados",
  "saboresOutros",
  "outrasSubstancias",
  "outrasSubstanciasOutras",
  "usoDualTabacoCombustivel",
  "usaAoAcordar",
  "tentativasParar",
  "scoreUso",
  "classificacaoUso",
  "scoreFagerstrom",
  "classificacaoFagerstrom",
  "scoreAUDIT",
  "classificacaoAUDIT",
  "scoreUPenn",
  "classificacaoUPenn",
  "scoreEletronico",
  "classificacaoEletronico",
  "riscoIntegrado",
  "condutaSugerida",
  "scoreTotal",
  "prioridadeFinal",
  "classificacaoGeral",
];

const CASE_HEADER_LABELS = {
  identificacao: "Nome do usuário",
  racaCor: "Raça/cor",
  ine: "INE",
  q1: "AUDIT Q1",
  q2: "AUDIT Q2",
  q3: "AUDIT Q3",
  q4: "AUDIT Q4",
  q5: "AUDIT Q5",
  q6: "AUDIT Q6",
  q7: "AUDIT Q7",
  q8: "AUDIT Q8",
  q9: "AUDIT Q9",
  q10: "AUDIT Q10",
  upenn_q1: "UPenn Q1",
  upenn_q2: "UPenn Q2",
  upenn_q3: "UPenn Q3",
  upenn_q4: "UPenn Q4",
  upenn_q5: "UPenn Q5",
  upenn_q6: "UPenn Q6",
  upenn_q7: "UPenn Q7",
  upenn_q8: "UPenn Q8",
  upenn_q9: "UPenn Q9",
  upenn_q10: "UPenn Q10",
};

const HEADER_TO_CASE_KEY = Object.keys(CASE_HEADER_LABELS).reduce((acc, key) => {
  acc[CASE_HEADER_LABELS[key]] = key;
  return acc;
}, {});

function doGet() {
  return jsonOutput_({
    sucesso: true,
    mensagem: "Tabaco Controle Apps Script ativo.",
    schemaVersion: SCRIPT_SCHEMA_VERSION,
    spreadsheetId: CONFIG.spreadsheetId,
    casosSheetName: CONFIG.casosSheetName,
    enviosSheetName: CONFIG.enviosSheetName,
    scriptId: ScriptApp.getScriptId(),
    timestamp: new Date().toISOString(),
  });
}

function doPost(e) {
  const lock = LockService.getScriptLock();

  try {
    lock.waitLock(20000);

    const payload = parsePayload_(e);
    const spreadsheet = getSpreadsheet_();
    const envioId = Utilities.getUuid();
    const recebidoEm = new Date();

    appendResumoEnvio_(spreadsheet, payload, envioId, recebidoEm);
    const quantidadeCasos = appendCasos_(spreadsheet, payload, envioId, recebidoEm);

    return jsonOutput_({
      sucesso: true,
      mensagem: "Dados registrados com sucesso.",
      schemaVersion: SCRIPT_SCHEMA_VERSION,
      envioId: envioId,
      planilhaId: spreadsheet.getId(),
      quantidadeCasos: quantidadeCasos,
    });
  } catch (error) {
    console.error(error);
    return jsonOutput_({
      sucesso: false,
      mensagem: error && error.message ? error.message : "Falha ao registrar dados.",
      schemaVersion: SCRIPT_SCHEMA_VERSION,
    });
  } finally {
    try {
      lock.releaseLock();
    } catch (_error) {
      // O lock pode não ter sido obtido se o erro ocorreu antes do waitLock.
    }
  }
}

function setupPlanilha() {
  const spreadsheet = getSpreadsheet_();
  ensureSheet_(spreadsheet, CONFIG.enviosSheetName, getResumoHeaders_());
  ensureSheet_(spreadsheet, CONFIG.casosSheetName, METADATA_HEADERS);

  return {
    sucesso: true,
    mensagem: "Abas verificadas/criadas com sucesso.",
    spreadsheetId: spreadsheet.getId(),
    schemaVersion: SCRIPT_SCHEMA_VERSION,
  };
}

function parsePayload_(e) {
  const rawPayload = extractRawPayload_(e);

  if (!rawPayload) {
    throw new Error("Payload ausente.");
  }

  let parsed;
  try {
    parsed = JSON.parse(rawPayload);
  } catch (_error) {
    throw new Error("Payload JSON inválido.");
  }

  if (!parsed || !Array.isArray(parsed.casos)) {
    throw new Error("O payload precisa conter um array 'casos'.");
  }

  return parsed;
}

function extractRawPayload_(e) {
  if (e && e.parameter && e.parameter.payload) {
    return e.parameter.payload;
  }

  const rawBody = e && e.postData && e.postData.contents ? e.postData.contents : "";
  if (!rawBody) return "";

  const trimmed = String(rawBody).trim();
  if (trimmed.charAt(0) === "{" || trimmed.charAt(0) === "[") {
    return trimmed;
  }

  const parts = trimmed.split("&");
  for (let i = 0; i < parts.length; i += 1) {
    const pair = parts[i].split("=");
    if (decodeURIComponent(pair[0] || "") === "payload") {
      return decodeURIComponent((pair.slice(1).join("=") || "").replace(/\+/g, " "));
    }
  }

  return trimmed;
}

function getSpreadsheet_() {
  if (!CONFIG.spreadsheetId || String(CONFIG.spreadsheetId).indexOf("PREENCHA_") === 0) {
    throw new Error("Configure o spreadsheetId no arquivo Code.gs.");
  }
  return SpreadsheetApp.openById(CONFIG.spreadsheetId);
}

function appendResumoEnvio_(spreadsheet, payload, envioId, recebidoEm) {
  const headers = getResumoHeaders_();
  const row = [
    envioId,
    formatDate_(recebidoEm),
    sanitizeValue_(payload.origem),
    sanitizeValue_(payload.timestampEnvio),
    Number(payload.quantidadeCasos || 0),
    Array.isArray(payload.casos) ? payload.casos.length : 0,
    SCRIPT_SCHEMA_VERSION,
  ];

  const sheet = ensureSheet_(spreadsheet, CONFIG.enviosSheetName, headers);
  sheet.appendRow(row);
}

function appendCasos_(spreadsheet, payload, envioId, recebidoEm) {
  const cases = Array.isArray(payload.casos) ? payload.casos : [];
  if (cases.length === 0) return 0;

  const caseKeys = orderCaseKeys_(collectCaseKeys_(cases));
  const desiredHeaders = METADATA_HEADERS.concat(caseKeys.map((key) => headerForKey_(key)));
  const sheet = ensureSheet_(spreadsheet, CONFIG.casosSheetName, desiredHeaders);
  const finalHeaders = syncHeaders_(sheet, desiredHeaders);

  const rows = cases.map((item, index) =>
    finalHeaders.map((header) =>
      valueForCaseHeader_(header, item, payload, envioId, recebidoEm, index)
    )
  );

  sheet
    .getRange(sheet.getLastRow() + 1, 1, rows.length, finalHeaders.length)
    .setValues(rows);

  return cases.length;
}

function valueForCaseHeader_(header, item, payload, envioId, recebidoEm, index) {
  const metadata = {
    envioId: envioId,
    recebidoEm: formatDate_(recebidoEm),
    origem: sanitizeValue_(payload.origem),
    timestampEnvio: sanitizeValue_(payload.timestampEnvio),
    schemaVersion: SCRIPT_SCHEMA_VERSION,
    indiceCaso: index + 1,
  };

  if (Object.prototype.hasOwnProperty.call(metadata, header)) {
    return metadata[header];
  }

  const caseKey = HEADER_TO_CASE_KEY[header] || header;
  return sanitizeValue_(item ? item[caseKey] : "");
}

function getResumoHeaders_() {
  return [
    "envioId",
    "recebidoEm",
    "origem",
    "timestampEnvio",
    "quantidadeCasosInformada",
    "quantidadeCasosRecebida",
    "schemaVersion",
  ];
}

function ensureSheet_(spreadsheet, sheetName, headers) {
  let sheet = spreadsheet.getSheetByName(sheetName);
  if (!sheet) sheet = spreadsheet.insertSheet(sheetName);

  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    styleHeader_(sheet, headers.length);
    return sheet;
  }

  syncHeaders_(sheet, headers);
  return sheet;
}

function syncHeaders_(sheet, desiredHeaders) {
  const width = Math.max(sheet.getLastColumn(), desiredHeaders.length, 1);
  const currentHeaders =
    sheet.getLastRow() > 0 ? sheet.getRange(1, 1, 1, width).getValues()[0] : [];

  const finalHeaders = currentHeaders.filter((header) => String(header || "").trim() !== "");
  desiredHeaders.forEach((header) => {
    if (finalHeaders.indexOf(header) === -1) finalHeaders.push(header);
  });

  sheet.getRange(1, 1, 1, finalHeaders.length).setValues([finalHeaders]);
  styleHeader_(sheet, finalHeaders.length);
  return finalHeaders;
}

function styleHeader_(sheet, columnCount) {
  sheet
    .getRange(1, 1, 1, columnCount)
    .setBackground("#1d4ed8")
    .setFontColor("#ffffff")
    .setFontWeight("bold");
  sheet.setFrozenRows(1);
}

function collectCaseKeys_(cases) {
  const map = {};
  cases.forEach((item) => {
    Object.keys(item || {}).forEach((key) => {
      map[key] = true;
    });
  });
  return Object.keys(map).sort();
}

function orderCaseKeys_(keys) {
  const list = Array.isArray(keys) ? keys : [];
  const known = CASE_KEY_ORDER.filter((key) => list.indexOf(key) !== -1);
  const remaining = list.filter((key) => CASE_KEY_ORDER.indexOf(key) === -1).sort();
  return known.concat(remaining);
}

function headerForKey_(key) {
  return CASE_HEADER_LABELS[key] || key;
}

function sanitizeValue_(value) {
  if (value === null || value === undefined) return "";
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

function formatDate_(date) {
  return Utilities.formatDate(date, CONFIG.timezone, "yyyy-MM-dd'T'HH:mm:ssXXX");
}

function jsonOutput_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON
  );
}
