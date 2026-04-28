import { useEffect, useMemo, useState } from "react";
import { Capacitor, CapacitorHttp } from "@capacitor/core";
import "./index.css";

const HEADER_PARTNERSHIP =
  "Parceria PET Saúde Digital Unifal e UFAM / UNESP SJC Odontologia / LABODIGIT UFPB / GLIPMO";

const STORAGE_KEY = "app_tabaco_controle_casos_v1";
const LANGUAGE_STORAGE_KEY = "app_tabaco_controle_idioma_v1";
const MAX_SCORE_USO = 10;
const MAX_SCORE_FAGERSTROM = 10;
const MAX_SCORE_AUDIT = 40;
const MAX_SCORE_UPENN = 24;
const MAX_SCORE_ELETRONICO = 12;
const MAX_SCORE_TOTAL =
  MAX_SCORE_USO +
  MAX_SCORE_FAGERSTROM +
  MAX_SCORE_AUDIT +
  MAX_SCORE_UPENN +
  MAX_SCORE_ELETRONICO;

const GOOGLE_SCRIPT_URL = (import.meta.env.VITE_GOOGLE_SCRIPT_URL || "").trim();
const GOOGLE_SCRIPT_NOT_CONFIGURED_MESSAGE =
  "Configure a URL do Apps Script do laboratório para habilitar o envio ao Google Sheets.";

const TRANSLATIONS_ES = {
  "Parceria PET Saúde Digital Unifal e UFAM / UNESP SJC Odontologia / LABODIGIT UFPB / GLIPMO":
    "Alianza PET Salud Digital Unifal y UFAM / UNESP SJC Odontología / LABODIGIT UFPB / GLIPMO",
  "Apoio para cuidado, vigilância e cessação do tabagismo":
    "Apoyo para el cuidado, la vigilancia y la cesación del tabaquismo",
  "Traduzir para espanhol": "Traducir al español",
  "Voltar para português": "Volver al portugués",
  "Interface em espanhol": "Interfaz en español",
  "Interface em português": "Interfaz en portugués",
  "Identificação": "Identificación",
  "Inclui local de residência/circulação e presença de equipe de saúde.":
    "Incluye lugar de residencia/circulación y presencia del equipo de salud.",
  "Nome do usuário": "Nombre del usuario",
  "Telefone": "Teléfono",
  "Idade": "Edad",
  "Sexo": "Sexo",
  "Escolaridade": "Escolaridad",
  "Raça/cor": "Raza/color",
  "Ocupação": "Ocupación",
  "Município": "Municipio",
  "Estado": "Estado",
  "País": "País",
  "INE (Identificação Nacional de Equipe)": "INE (Identificación Nacional del Equipo)",
  "Tipo de equipe": "Tipo de equipo",
  "Profissional responsável": "Profesional responsable",
  "Entrevistador": "Entrevistador",
  "Data da entrevista": "Fecha de la entrevista",
  "Idioma principal": "Idioma principal",
  "Local de residência": "Lugar de residencia",
  "Vive na cidade": "Vive en la ciudad",
  "Vive em área rural": "Vive en zona rural",
  "Recebe visita de equipe de saúde?": "¿Recibe visita del equipo de salud?",
  "1. Uso do tabaco": "1. Uso de tabaco",
  "2. Fagerström": "2. Fagerström",
  "3. AUDIT": "3. AUDIT",
  "4. Cigarro eletrônico": "4. Cigarrillo electrónico",
  "5. UPenn": "5. UPenn",
  "Módulo 1 - Questionário de uso de tabaco": "Módulo 1 - Cuestionario de uso de tabaco",
  "Diferencia início ritual e início regular, contempla recaída, apoio prévio e encaminhamento.":
    "Diferencia inicio ritual e inicio regular, contempla recaída, apoyo previo y derivación.",
  "Uso atual?": "¿Uso actual?",
  "Sim": "Sí",
  "Não": "No",
  "Ex-usuário": "Exusuario",
  "Frequência": "Frecuencia",
  "Diário": "Diario",
  "Semanal": "Semanal",
  "Ocasional": "Ocasional",
  "Não usa atualmente": "No usa actualmente",
  "Idade de início do uso regular": "Edad de inicio del uso regular",
  "Unidades por dia": "Unidades por día",
  "Exposição de fumantes em casa": "Exposición a fumadores en casa",
  "Exposição no trabalho/escola/comunidade": "Exposición en el trabajo/escuela/comunidad",
  "Já tentou parar?": "¿Ya intentó dejarlo?",
  "Quantas tentativas?": "¿Cuántos intentos?",
  "Tempo desde a última tentativa de parar": "Tiempo desde el último intento de dejarlo",
  "Motivo principal de recaída": "Motivo principal de recaída",
  "Teve apoio prévio?": "¿Tuvo apoyo previo?",
  "Nenhum": "Ninguno",
  "Apoio profissional": "Apoyo profesional",
  "Apoio medicamentoso": "Apoyo farmacológico",
  "Profissional + medicamentoso": "Profesional + farmacológico",
  "Já usou medicação ou apoio estruturado?": "¿Ya usó medicación o apoyo estructurado?",
  "Não sabe informar": "No sabe informar",
  "Procurou grupo de cessação e não conseguiu acesso?":
    "¿Buscó un grupo de cesación y no consiguió acceso?",
  "Não se aplica": "No se aplica",
  "Interesse em parar": "Interés en dejarlo",
  "Talvez": "Tal vez",
  "Estágio motivacional": "Etapa motivacional",
  "Pré-contemplação": "Precontemplación",
  "Contemplação": "Contemplación",
  "Preparação": "Preparación",
  "Ação": "Acción",
  "Manutenção": "Mantenimiento",
  "Necessita encaminhamento/orientação agora?": "¿Necesita derivación/orientación ahora?",
  "Sim, imediato": "Sí, inmediata",
  "Sim, programado": "Sí, programada",
  "Como obtém o produto de tabaco?": "¿Cómo obtiene el producto de tabaco?",
  "Há cultivo local de tabaco/outras plantas?": "¿Hay cultivo local de tabaco/u otras plantas?",
  "Não sabe": "No sabe",
  "Produto principal (pode marcar mais de um)": "Producto principal (puede marcar más de uno)",
  "Outros produtos (especificar)": "Otros productos (especificar)",
  "Observações": "Observaciones",
  "Módulo 2 - Teste de Fagerström": "Módulo 2 - Test de Fagerström",
  "Aplicável somente quando o produto principal inclui cigarro industrializado.":
    "Aplicable solo cuando el producto principal incluye cigarrillo industrializado.",
  "Para liberar este bloco, marque \"cigarro industrializado\" em \"Uso de\ntabaco\" > \"Produto principal\".":
    "Para liberar este bloque, marque \"cigarrillo industrializado\" en \"Uso de tabaco\" > \"Producto principal\".",
  "Tipo principal de usuário (bloqueado)": "Tipo principal de usuario (bloqueado)",
  "Cigarro industrializado": "Cigarrillo industrializado",
  "Primeiro cigarro após acordar": "Primer cigarrillo después de despertar",
  "Até 5 minutos": "Hasta 5 minutos",
  "6 a 30 minutos": "6 a 30 minutos",
  "31 a 60 minutos": "31 a 60 minutos",
  "Após 60 minutos": "Después de 60 minutos",
  "Dificuldade em locais proibidos?": "¿Dificultad en lugares prohibidos?",
  "Mais difícil abandonar": "Más difícil de abandonar",
  "Primeiro da manhã": "Primero de la mañana",
  "Outro": "Otro",
  "Quantos cigarros por dia?": "¿Cuántos cigarrillos por día?",
  "10 ou menos": "10 o menos",
  "11 a 20": "11 a 20",
  "21 a 30": "21 a 30",
  "31 ou mais": "31 o más",
  "Fuma mais pela manhã?": "¿Fuma más por la mañana?",
  "Fuma quando está doente?": "¿Fuma cuando está enfermo/a?",
  "Desperta à noite para fumar?": "¿Se despierta por la noche para fumar?",
  "Apresenta sintomas de abstinência?": "¿Presenta síntomas de abstinencia?",
  "Múltiplas tentativas sem sucesso?": "¿Múltiples intentos sin éxito?",
  "Módulo 3 - AUDIT (Triagem do consumo de bebidas alcoólicas)":
    "Módulo 3 - AUDIT (Tamizaje del consumo de bebidas alcohólicas)",
  "O AUDIT complementa a avaliação do tabagismo: uso de álcool e tabaco frequentemente\n            aparecem juntos e aumentam risco de recaída, piora clínica e necessidade de cuidado\n            mais intensivo.":
    "El AUDIT complementa la evaluación del tabaquismo: el uso de alcohol y tabaco frecuentemente aparecen juntos y aumentan el riesgo de recaída, deterioro clínico y necesidad de cuidado más intensivo.",
  "Selecione": "Seleccione",
  "1. Com que frequência você consome bebidas alcoólicas?":
    "1. ¿Con qué frecuencia consume bebidas alcohólicas?",
  "2. Quantas doses alcoólicas você consome tipicamente ao beber?":
    "2. ¿Cuántas dosis alcohólicas consume típicamente al beber?",
  "3. Com que frequência você consome seis ou mais doses em uma ocasião?":
    "3. ¿Con qué frecuencia consume seis o más dosis en una ocasión?",
  "4. Com que frequência, durante o último ano, você achou que não conseguiria parar de beber depois de começar?":
    "4. ¿Con qué frecuencia, durante el último año, pensó que no podría dejar de beber después de empezar?",
  "5. Com que frequência, durante o último ano, você não conseguiu fazer o que era esperado por causa da bebida?":
    "5. ¿Con qué frecuencia, durante el último año, no pudo hacer lo esperado a causa de la bebida?",
  "6. Com que frequência, durante o último ano, você precisou beber pela manhã para se sentir melhor após ter bebido muito?":
    "6. ¿Con qué frecuencia, durante el último año, necesitó beber por la mañana para sentirse mejor después de haber bebido mucho?",
  "7. Com que frequência, durante o último ano, você sentiu culpa ou remorso após beber?":
    "7. ¿Con qué frecuencia, durante el último año, sintió culpa o remordimiento después de beber?",
  "8. Com que frequência, durante o último ano, você não conseguiu lembrar do que aconteceu na noite anterior por causa da bebida?":
    "8. ¿Con qué frecuencia, durante el último año, no pudo recordar lo ocurrido la noche anterior a causa de la bebida?",
  "9. Você ou outra pessoa já se machucou em consequência do seu consumo de álcool?":
    "9. ¿Usted u otra persona se lesionó como consecuencia de su consumo de alcohol?",
  "10. Algum parente, amigo ou profissional de saúde já se preocupou com seu modo de beber ou sugeriu que você parasse?":
    "10. ¿Algún familiar, amigo o profesional de salud se preocupó por su forma de beber o sugirió que dejara de hacerlo?",
  "Nunca": "Nunca",
  "Mensalmente ou menos": "Mensualmente o menos",
  "2 a 4 vezes por mês": "2 a 4 veces por mes",
  "2 a 3 vezes por semana": "2 a 3 veces por semana",
  "4 ou mais vezes por semana": "4 o más veces por semana",
  "1 ou 2 doses": "1 o 2 dosis",
  "3 ou 4 doses": "3 o 4 dosis",
  "5 ou 6 doses": "5 o 6 dosis",
  "7 a 9 doses": "7 a 9 dosis",
  "10 ou mais doses": "10 o más dosis",
  "Menos de uma vez por mês": "Menos de una vez por mes",
  "Mensalmente": "Mensualmente",
  "Diariamente ou quase diariamente": "Diariamente o casi diariamente",
  "Sim, mas não no último ano": "Sí, pero no en el último año",
  "Sim, durante o último ano": "Sí, durante el último año",
  "Módulo 4 - Cigarro eletrônico": "Módulo 4 - Cigarrillo electrónico",
  "Avalia padrão de uso, uso dual e perfil do dispositivo para qualificar o cuidado.":
    "Evalúa patrón de uso, uso dual y perfil del dispositivo para cualificar el cuidado.",
  "Já usou cigarro eletrônico alguma vez?": "¿Alguna vez usó cigarrillo electrónico?",
  "Uso atual de cigarro eletrônico?": "¿Uso actual de cigarrillo electrónico?",
  "Idade do primeiro uso": "Edad del primer uso",
  "Idade de uso frequente": "Edad de uso frecuente",
  "Tempo total de uso (meses/anos)": "Tiempo total de uso (meses/años)",
  "Frequência de uso": "Frecuencia de uso",
  "Vezes por dia (quando usa)": "Veces por día (cuando usa)",
  "Tipo de dispositivo": "Tipo de dispositivo",
  "Descartável": "Desechable",
  "Usa mais de um dispositivo?": "¿Usa más de un dispositivo?",
  "Compartilha dispositivo?": "¿Comparte el dispositivo?",
  "Onde costuma comprar? (pode marcar mais de uma opção)":
    "¿Dónde suele comprar? (puede marcar más de una opción)",
  "Outro local de compra (especificar)": "Otro lugar de compra (especificar)",
  "O líquido contém nicotina?": "¿El líquido contiene nicotina?",
  "Concentração de nicotina (se souber)": "Concentración de nicotina (si la sabe)",
  "Usa líquidos com sabor?": "¿Usa líquidos con sabor?",
  "Quais são os sabores mais usados? (múltipla escolha)":
    "¿Cuáles son los sabores más usados? (opción múltiple)",
  "Outros sabores (especificar)": "Otros sabores (especificar)",
  "Outras substâncias no dispositivo (múltipla escolha)":
    "Otras sustancias en el dispositivo (opción múltiple)",
  "Outras substâncias (especificar)": "Otras sustancias (especificar)",
  "Usa junto com cigarro convencional?": "¿Usa junto con cigarrillo convencional?",
  "Usa logo ao acordar?": "¿Usa apenas al despertar?",
  "Já tentou parar de usar cigarro eletrônico?": "¿Ya intentó dejar de usar cigarrillo electrónico?",
  "Interesse em parar de usar cigarro eletrônico": "Interés en dejar de usar cigarrillo electrónico",
  "Observações sobre uso de cigarro eletrônico": "Observaciones sobre uso de cigarrillo electrónico",
  "Módulo 5 - UPenn (Penn State E-cigarette Dependence Index)":
    "Módulo 5 - UPenn (Penn State E-cigarette Dependence Index)",
  "PSECDI original: pontuação total de 0 a 24, com faixas de dependência 0-3, 4-8,\n            9-12 e 13+.":
    "PSECDI original: puntuación total de 0 a 24, con rangos de dependencia 0-3, 4-8, 9-12 y 13+.",
  "1. Quantas vezes por dia você costuma usar seu cigarro eletrônico? (Considere que uma 'vez' corresponde a cerca de 15 tragadas ou dura aproximadamente 10 minutos)":
    "1. ¿Cuántas veces por día suele usar su cigarrillo electrónico? (Considere que una 'vez' corresponde a cerca de 15 caladas o dura aproximadamente 10 minutos)",
  "2. Nos dias em que você pode usar seu cigarro eletrônico livremente, quanto tempo após acordar você usa o primeiro?":
    "2. En los días en que puede usar su cigarrillo electrónico libremente, ¿cuánto tiempo después de despertar usa el primero?",
  "3. Você às vezes acorda durante a noite para usar cigarro eletrônico?":
    "3. ¿A veces se despierta durante la noche para usar cigarrillo electrónico?",
  "4. Se sim, em quantas noites por semana você costuma acordar para usar cigarro eletrônico?":
    "4. Si la respuesta es sí, ¿en cuántas noches por semana suele despertarse para usar cigarrillo electrónico?",
  "5. Você usa cigarro eletrônico atualmente porque é muito difícil parar?":
    "5. ¿Usa cigarrillo electrónico actualmente porque es muy difícil dejarlo?",
  "6. Você tem vontade forte de usar cigarro eletrônico?":
    "6. ¿Tiene ganas fuertes de usar cigarrillo electrónico?",
  "7. Na última semana, quão intensas foram as vontades de usar cigarro eletrônico?":
    "7. En la última semana, ¿qué tan intensas fueron las ganas de usar cigarrillo electrónico?",
  "8. É difícil deixar de usar cigarro eletrônico em locais onde não é permitido?":
    "8. ¿Es difícil dejar de usar cigarrillo electrónico en lugares donde no está permitido?",
  "9. Quando você ficou sem usar cigarro eletrônico por um tempo ou tentou parar, sentiu-se mais irritado(a) por não poder usar?":
    "9. Cuando estuvo sin usar cigarrillo electrónico por un tiempo o intentó dejarlo, ¿se sintió más irritado/a por no poder usarlo?",
  "10. Você se sentiu nervoso(a), inquieto(a) ou ansioso(a) por não poder usar cigarro eletrônico?":
    "10. ¿Se sintió nervioso/a, inquieto/a o ansioso/a por no poder usar cigarrillo electrónico?",
  "Resumo do caso atual": "Resumen del caso actual",
  "Uso do tabaco:": "Uso de tabaco:",
  "Fagerström:": "Fagerström:",
  "AUDIT:": "AUDIT:",
  "Cigarro eletrônico:": "Cigarrillo electrónico:",
  "UPenn (Penn State):": "UPenn (Penn State):",
  "Risco integrado tabaco + álcool:": "Riesgo integrado tabaco + alcohol:",
  "Prioridade final:": "Prioridad final:",
  "Conduta sugerida:": "Conducta sugerida:",
  "pontos —": "puntos -",
  "Nível de dependência geral": "Nivel de dependencia general",
  "Salvar caso": "Guardar caso",
  "Enviando...": "Enviando...",
  "Enviar todos para Google Sheets": "Enviar todos a Google Sheets",
  "Limpar formulário": "Limpiar formulario",
  "Casos cadastrados": "Casos registrados",
  "Apagar todos": "Borrar todos",
  "Nenhum caso salvo ainda.": "Aún no hay casos guardados.",
  "Residência": "Residencia",
  "Uso atual": "Uso actual",
  "Total": "Total",
  "Prioridade": "Prioridad",
  "Remover": "Eliminar",
  "Muito baixa": "Muy baja",
  "Baixa": "Baja",
  "Média": "Media",
  "Elevada": "Elevada",
  "Muito elevada": "Muy elevada",
  "Escala não aplicável diretamente; usar avaliação clínica complementar":
    "Escala no aplicable directamente; usar evaluación clínica complementaria",
  "Baixo padrão de uso": "Bajo patrón de uso",
  "Padrão intermediário": "Patrón intermedio",
  "Padrão elevado": "Patrón elevado",
  "Baixo risco": "Bajo riesgo",
  "Uso de risco": "Uso de riesgo",
  "Uso nocivo": "Uso nocivo",
  "Provável dependência": "Probable dependencia",
  "Não dependente": "No dependiente",
  "Baixa dependência": "Baja dependencia",
  "Dependência média": "Dependencia media",
  "Alta dependência": "Alta dependencia",
  "Risco moderado": "Riesgo moderado",
  "Risco elevado": "Riesgo elevado",
  "Alto": "Alto",
  "Moderado": "Moderado",
  "Baixo": "Bajo",
  "Baixa prioridade": "Baja prioridad",
  "Prioridade moderada": "Prioridad moderada",
  "Alta prioridade para abordagem": "Alta prioridad para el abordaje",
  "Ausente / Baixo": "Ausente / Bajo",
  "Realizar abordagem breve para cessação do tabaco na consulta.":
    "Realizar abordaje breve para la cesación del tabaco en la consulta.",
  "Priorizar plano de parada com data-alvo e acompanhamento em curto prazo.":
    "Priorizar plan de abandono con fecha objetivo y seguimiento a corto plazo.",
  "Encaminhar imediatamente para equipe de referência da APS.":
    "Derivar inmediatamente al equipo de referencia de la APS.",
  "Programar encaminhamento e retorno para seguimento em até 30 dias.":
    "Programar derivación y retorno para seguimiento en hasta 30 días.",
  "Avaliar necessidade de cuidado intensivo para uso nocivo de álcool.":
    "Evaluar necesidad de cuidado intensivo por uso nocivo de alcohol.",
  "Incluir aconselhamento breve para álcool e monitorar evolução.":
    "Incluir consejería breve para alcohol y monitorear evolución.",
  "Intensificar suporte para dependência nicotínica elevada no módulo UPenn.":
    "Intensificar soporte para dependencia nicotínica elevada en el módulo UPenn.",
  "Incluir plano de cessação também para cigarro eletrônico.":
    "Incluir plan de cesación también para cigarrillo electrónico.",
  "Sinalizar maior atenção clínica por uso combinado de tabaco e álcool.":
    "Señalar mayor atención clínica por uso combinado de tabaco y alcohol.",
  "Definir prioridade alta de cuidado e seguimento próximo pela equipe.":
    "Definir alta prioridad de cuidado y seguimiento cercano por el equipo.",
  "Manter educação em saúde e acompanhamento de rotina na APS.":
    "Mantener educación en salud y seguimiento de rutina en la APS.",
  "Dados enviados com sucesso para a planilha.": "Datos enviados correctamente a la hoja.",
  "Configure a URL do Apps Script do laboratório para habilitar o envio ao Google Sheets.":
    "Configure la URL de Apps Script del laboratorio para habilitar el envío a Google Sheets.",
  "Sem escolarização": "Sin escolarización",
  "Fundamental incompleto": "Primaria incompleta",
  "Fundamental completo": "Primaria completa",
  "Médio incompleto": "Secundaria incompleta",
  "Médio completo": "Secundaria completa",
  "Superior incompleto": "Educación superior incompleta",
  "Superior completo": "Educación superior completa",
  "Pós-graduação": "Posgrado",
  "Prefere não responder": "Prefiere no responder",
  "Indígena": "Indígena",
  "Preta": "Negra",
  "Parda": "Parda",
  "Branca": "Blanca",
  "Amarela": "Amarilla",
  "Outra": "Otra",
  "cigarro industrializado": "cigarrillo industrializado",
  "fumo de rolo": "tabaco de liar",
  "cigarro de palha/artesanal": "cigarrillo de paja/artesanal",
  "rapé": "rapé",
  "cachimbo": "pipa",
  "charuto": "puro",
  "cigarro eletrônico": "cigarrillo electrónico",
  "narguilé": "narguile",
  "outra planta para fumar": "otra planta para fumar",
  "outros": "otros",
  "Tabacaria": "Tabaquería",
  "Loja de conveniência": "Tienda de conveniencia",
  "Internet / redes sociais": "Internet / redes sociales",
  "Aplicativos de mensagem": "Aplicaciones de mensajería",
  "Com amigos/conhecidos": "Con amigos/conocidos",
  "Ambulante": "Vendedor ambulante",
  "Viagem internacional": "Viaje internacional",
  "Frutas": "Frutas",
  "Mentol / hortelã": "Mentol / menta",
  "Doces / sobremesas": "Dulces / postres",
  "Bebidas": "Bebidas",
  "Tabaco": "Tabaco",
  "Sem sabor": "Sin sabor",
  "Outros": "Otros",
  "Cannabis (THC/CBD)": "Cannabis (THC/CBD)",
  "Haxixe": "Hachís",
  "Óleo de cannabis artesanal": "Aceite de cannabis artesanal",
  "Cocaína / crack": "Cocaína / crack",
  "Anfetaminas / metanfetamina": "Anfetaminas / metanfetamina",
  "Cetamina": "Ketamina",
  "Solventes / inalantes": "Solventes / inhalantes",
  "Não usa outras substâncias": "No usa otras sustancias",
  "sim": "sí",
  "nao": "no",
  "ex": "exusuario",
  "cidade": "ciudad",
  "rural": "rural",
  "outro": "otro",
};

const NORMALIZED_TRANSLATIONS_ES = Object.fromEntries(
  Object.entries(TRANSLATIONS_ES).map(([key, value]) => [
    key.replace(/\s+/g, " ").trim(),
    value,
  ])
);
const PORTUGUESE_TEXTS = new Set([
  ...Object.keys(TRANSLATIONS_ES),
  ...Object.keys(NORMALIZED_TRANSLATIONS_ES),
]);

function translateText(text, language) {
  if (language !== "es") return text;
  const normalized = String(text).replace(/\s+/g, " ").trim();
  return TRANSLATIONS_ES[text] || NORMALIZED_TRANSLATIONS_ES[normalized] || text;
}

function getInitialLanguage() {
  try {
    return localStorage.getItem(LANGUAGE_STORAGE_KEY) === "es" ? "es" : "pt";
  } catch {
    return "pt";
  }
}

const TIPO_EQUIPE_OPTIONS = [
  "ESF",
  "eSB",
  "eMulti",
  "Equipe de Consultório na Rua",
  "Outra",
];

const ESCOLARIDADE_OPTIONS = [
  "Sem escolarização",
  "Fundamental incompleto",
  "Fundamental completo",
  "Médio incompleto",
  "Médio completo",
  "Superior incompleto",
  "Superior completo",
  "Pós-graduação",
  "Não sabe informar",
  "Prefere não responder",
];

const RACA_COR_OPTIONS = [
  "Indígena",
  "Preta",
  "Parda",
  "Branca",
  "Amarela",
  "Outra",
  "Prefere não responder",
];

const PRODUTOS_SUBSTANCIAS = [
  "cigarro industrializado",
  "fumo de rolo",
  "cigarro de palha/artesanal",
  "rapé",
  "cachimbo",
  "charuto",
  "cigarro eletrônico",
  "narguilé",
  "outra planta para fumar",
  "outros",
];

const AUDIT_Q1_OPTIONS = [
  { label: "Nunca", value: "0" },
  { label: "Mensalmente ou menos", value: "1" },
  { label: "2 a 4 vezes por mês", value: "2" },
  { label: "2 a 3 vezes por semana", value: "3" },
  { label: "4 ou mais vezes por semana", value: "4" },
];

const AUDIT_Q2_OPTIONS = [
  { label: "1 ou 2 doses", value: "0" },
  { label: "3 ou 4 doses", value: "1" },
  { label: "5 ou 6 doses", value: "2" },
  { label: "7 a 9 doses", value: "3" },
  { label: "10 ou mais doses", value: "4" },
];

const AUDIT_Q3_OPTIONS = [
  { label: "Nunca", value: "0" },
  { label: "Menos de uma vez por mês", value: "1" },
  { label: "Mensalmente", value: "2" },
  { label: "Semanalmente", value: "3" },
  { label: "Diariamente ou quase diariamente", value: "4" },
];

const AUDIT_Q4_TO_Q8_OPTIONS = [
  { label: "Nunca", value: "0" },
  { label: "Menos de uma vez por mês", value: "1" },
  { label: "Mensalmente", value: "2" },
  { label: "Semanalmente", value: "3" },
  { label: "Diariamente ou quase diariamente", value: "4" },
];

const AUDIT_Q9_Q10_OPTIONS = [
  { label: "Não", value: "0" },
  { label: "Sim, mas não no último ano", value: "2" },
  { label: "Sim, durante o último ano", value: "4" },
];

const UPENN_Q1_OPTIONS = [
  { label: "0-4 vezes/dia", value: "0" },
  { label: "5-9", value: "1" },
  { label: "10-14", value: "2" },
  { label: "15-19", value: "3" },
  { label: "20-29", value: "4" },
  { label: "30 ou mais", value: "5" },
];

const UPENN_Q2_OPTIONS = [
  { label: "0-5 min", value: "5" },
  { label: "6-15", value: "4" },
  { label: "16-30", value: "3" },
  { label: "31-60", value: "2" },
  { label: "61-120", value: "1" },
  { label: "121 ou mais", value: "0" },
];

const UPENN_YES_NO_OPTIONS = [
  { label: "Sim", value: "1" },
  { label: "Não", value: "0" },
];

const UPENN_Q4_OPTIONS = [
  { label: "0-1 noites", value: "0" },
  { label: "2-3 noites", value: "1" },
  { label: "4 ou mais noites", value: "2" },
];

const UPENN_Q7_OPTIONS = [
  { label: "Nenhuma/Leve", value: "0" },
  { label: "Moderada/Forte", value: "1" },
  { label: "Muito forte/Extremamente forte", value: "2" },
];

const ELETRONICO_LOCAL_COMPRA_OPTIONS = [
  "Tabacaria",
  "Loja de conveniência",
  "Internet / redes sociais",
  "Aplicativos de mensagem",
  "Com amigos/conhecidos",
  "Ambulante",
  "Viagem internacional",
  "Outro",
];

const ELETRONICO_SABORES_OPTIONS = [
  "Frutas",
  "Mentol / hortelã",
  "Doces / sobremesas",
  "Bebidas",
  "Tabaco",
  "Sem sabor",
  "Outros",
];

const ELETRONICO_OUTRAS_SUBSTANCIAS_OPTIONS = [
  "Cannabis (THC/CBD)",
  "Haxixe",
  "Óleo de cannabis artesanal",
  "Cocaína / crack",
  "Anfetaminas / metanfetamina",
  "Cetamina",
  "Solventes / inalantes",
  "Não usa outras substâncias",
  "Outras",
];
const ELETRONICO_SEM_OUTRAS_SUBSTANCIAS = "Não usa outras substâncias";

const INITIAL_FAGERSTROM = {
  tipoUsuario: "",
  primeiroCigarro: "",
  dificuldadeLocais: "",
  cigarroMaisDificil: "",
  cigarrosDia: "",
  fumaMaisManha: "",
  fumaDoente: "",
  despertaNoiteFumar: "",
  sintomasAbstinencia: "",
  tentativasSemSucesso: "",
};

const initialState = {
  participante: {
    identificacao: "",
    telefone: "",
    idade: "",
    sexo: "",
    escolaridade: "",
    racaCor: "",
    ocupacao: "",
    municipio: "",
    estado: "",
    pais: "",
    ine: "",
    tipoEquipe: "",
    profissionalResponsavel: "",
    entrevistador: "",
    data: "",
    idioma: "",
    localResidencia: "",
    recebeVisitaSaude: "",
  },
  uso: {
    usoAtual: "",
    frequencia: "",
    idadeInicioRegular: "",
    produtoPrincipal: [],
    produtoOutros: "",
    cigarrosDia: "",
    exposicaoDomiciliar: "",
    exposicaoTrabalhoEscola: "",
    tentativaParar: "",
    vezesTentou: "",
    motivoRecaida: "",
    apoioPrevio: "",
    tempoUltimaTentativa: "",
    usouMedicacaoApoioEstruturado: "",
    procurouGrupoCessacaoSemAcesso: "",
    interesseParar: "",
    estagioMotivacional: "",
    encaminhamentoNecessario: "",
    formaObtencao: "",
    cultivoLocal: "",
    observacoes: "",
  },
  fagerstrom: { ...INITIAL_FAGERSTROM },
  audit: {
    q1: "",
    q2: "",
    q3: "",
    q4: "",
    q5: "",
    q6: "",
    q7: "",
    q8: "",
    q9: "",
    q10: "",
  },
  upenn: {
    q1: "",
    q2: "",
    q3: "",
    q4: "",
    q5: "",
    q6: "",
    q7: "",
    q8: "",
    q9: "",
    q10: "",
  },
  eletronico: {
    jaUsouAlgumaVez: "",
    usoAtual: "",
    idadePrimeiroUso: "",
    idadeUsoFrequente: "",
    tempoUso: "",
    frequenciaUso: "",
    vezesPorDia: "",
    tipoDispositivo: "",
    usaMaisDeUm: "",
    compartilhaDispositivo: "",
    localCompra: [],
    localCompraOutros: "",
    contemNicotina: "",
    concentracaoNicotina: "",
    usaSabores: "",
    saboresMaisUsados: [],
    saboresOutros: "",
    outrasSubstancias: [],
    outrasSubstanciasOutras: "",
    usoDualTabacoCombustivel: "",
    usaAoAcordar: "",
    tentativasParar: "",
    interesseParar: "",
    observacoes: "",
  },
};

function toggleArray(arr, value) {
  return arr.includes(value)
    ? arr.filter((item) => item !== value)
    : [...arr, value];
}

function scoreFagerstrom(f) {
  if (f.tipoUsuario !== "cigarro_industrializado") return 0;

  let score = 0;

  if (f.primeiroCigarro === "5") score += 3;
  else if (f.primeiroCigarro === "30") score += 2;
  else if (f.primeiroCigarro === "60") score += 1;

  if (f.dificuldadeLocais === "sim") score += 1;
  if (f.cigarroMaisDificil === "primeiro") score += 1;

  if (f.cigarrosDia === "20") score += 1;
  else if (f.cigarrosDia === "30") score += 2;
  else if (f.cigarrosDia === "31+") score += 3;

  if (f.fumaMaisManha === "sim") score += 1;
  if (f.fumaDoente === "sim") score += 1;

  return score;
}

function classifyFagerstrom(score, tipoUsuario) {
  if (tipoUsuario !== "cigarro_industrializado") {
    return "Escala não aplicável diretamente; usar avaliação clínica complementar";
  }
  if (score <= 2) return "Muito baixa";
  if (score <= 4) return "Baixa";
  if (score === 5) return "Média";
  if (score <= 7) return "Elevada";
  return "Muito elevada";
}

function scoreUso(uso) {
  let score = 0;

  if (uso.usoAtual === "sim") score += 2;
  if (uso.frequencia === "diario") score += 2;
  else if (uso.frequencia === "semanal") score += 1;

  const cig = Number(uso.cigarrosDia || 0);
  if (cig >= 20) score += 2;
  else if (cig >= 1) score += 1;

  if (uso.exposicaoDomiciliar === "sim") score += 1;
  if (uso.exposicaoTrabalhoEscola === "sim") score += 1;
  if (uso.tentativaParar === "nao") score += 1;
  if (uso.interesseParar === "sim") score += 1;

  return Math.min(score, 10);
}

function classifyUso(score) {
  if (score <= 3) return "Baixo padrão de uso";
  if (score <= 6) return "Padrão intermediário";
  return "Padrão elevado";
}

function scoreAUDIT(audit) {
  return Object.values(audit).reduce((acc, value) => acc + Number(value || 0), 0);
}

function classifyAUDIT(score) {
  if (score <= 7) return "Baixo risco";
  if (score <= 15) return "Uso de risco";
  if (score <= 19) return "Uso nocivo";
  return "Provável dependência";
}

function scoreUPenn(upenn) {
  return Object.values(upenn).reduce((acc, value) => acc + Number(value || 0), 0);
}

function classifyUPenn(score) {
  if (score <= 3) return "Não dependente";
  if (score <= 8) return "Baixa dependência";
  if (score <= 12) return "Dependência média";
  return "Alta dependência";
}

function scoreEletronico(eletronico) {
  if (eletronico.usoAtual !== "sim") return 0;

  let score = 0;
  const vezesDia = Number(eletronico.vezesPorDia || 0);

  if (eletronico.frequenciaUso === "diario") score += 4;
  else if (eletronico.frequenciaUso === "semanal") score += 2;
  else if (eletronico.frequenciaUso === "ocasional") score += 1;

  if (vezesDia >= 20) score += 2;
  else if (vezesDia >= 5) score += 1;

  if (eletronico.contemNicotina === "sim") score += 1;
  if (eletronico.usaMaisDeUm === "sim") score += 1;
  if (eletronico.usoDualTabacoCombustivel === "sim") score += 3;
  if (eletronico.usaAoAcordar === "sim") score += 3;
  if (eletronico.tentativasParar === "nao") score += 1;
  if (eletronico.interesseParar === "nao") score += 1;

  return Math.min(score, MAX_SCORE_ELETRONICO);
}

function classifyEletronico(score, usoAtual) {
  if (usoAtual !== "sim") return "Não usa atualmente";
  if (score <= 3) return "Baixo risco";
  if (score <= 7) return "Risco moderado";
  return "Risco elevado";
}

function classifyIntegratedRisk(totalScore, auditScore, usoAtual) {
  const hasComorbidadeTabacoAlcool = usoAtual === "sim" && auditScore >= 8;
  if (hasComorbidadeTabacoAlcool || totalScore > 84) return "Alto";
  if (totalScore > 42 || auditScore >= 8) return "Moderado";
  return "Baixo";
}

function buildConductRecommendations({
  totalScore,
  auditScore,
  upennScore,
  eletronicoScore,
  usoAtual,
  interesseParar,
  encaminhamentoNecessario,
  estagioMotivacional,
}) {
  const recommendations = [];
  const hasComorbidadeTabacoAlcool = usoAtual === "sim" && auditScore >= 8;

  if (usoAtual === "sim") {
    recommendations.push("Realizar abordagem breve para cessação do tabaco na consulta.");
  }

  if (interesseParar === "sim" || estagioMotivacional === "preparacao") {
    recommendations.push("Priorizar plano de parada com data-alvo e acompanhamento em curto prazo.");
  }

  if (encaminhamentoNecessario === "sim_imediato") {
    recommendations.push("Encaminhar imediatamente para equipe de referência da APS.");
  } else if (encaminhamentoNecessario === "sim_programado") {
    recommendations.push("Programar encaminhamento e retorno para seguimento em até 30 dias.");
  }

  if (auditScore >= 16) {
    recommendations.push("Avaliar necessidade de cuidado intensivo para uso nocivo de álcool.");
  } else if (auditScore >= 8) {
    recommendations.push("Incluir aconselhamento breve para álcool e monitorar evolução.");
  }

  if (upennScore >= 13) {
    recommendations.push("Intensificar suporte para dependência nicotínica elevada no módulo UPenn.");
  }

  if (eletronicoScore >= 8) {
    recommendations.push("Incluir plano de cessação também para cigarro eletrônico.");
  }

  if (hasComorbidadeTabacoAlcool) {
    recommendations.push("Sinalizar maior atenção clínica por uso combinado de tabaco e álcool.");
  }

  if (totalScore > 84) {
    recommendations.push("Definir prioridade alta de cuidado e seguimento próximo pela equipe.");
  }

  if (recommendations.length === 0) {
    recommendations.push("Manter educação em saúde e acompanhamento de rotina na APS.");
  }

  return recommendations;
}

function classifyDependenciaGeral(total) {
  if (total <= 42) return "Ausente / Baixo";
  if (total <= 84) return "Moderado";
  return "Alto";
}

function getDependenciaBarClass(total) {
  if (total <= 42) return "level-low";
  if (total <= 84) return "level-medium";
  return "level-high";
}

function getDependenciaBarWidth(total) {
  const percent = Math.max(0, Math.min((total / MAX_SCORE_TOTAL) * 100, 100));
  return `${percent}%`;
}

function normalizeCasePhone(caso) {
  if (!caso || typeof caso !== "object") return caso;

  const currentPhone = String(caso.telefone || "").trim();
  if (currentPhone) return caso;

  const identificacao = String(caso.identificacao || "").trim();
  const digits = identificacao.replace(/\D/g, "");
  if (digits.length < 8) return caso;

  return {
    ...caso,
    telefone: identificacao,
  };
}

function loadCasesFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Limpeza de casos legados incompatíveis com a versão atual.
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    return [];
  } catch {
    return [];
  }
}

function AuditQuestion({ title, value, onChange, options }) {
  return (
    <div className="audit-question">
      <label className="audit-label">{title}</label>
      <select value={value} onChange={onChange}>
        <option value="">Selecione</option>
        {options.map((option) => (
          <option key={`${title}-${option.label}`} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function SectionHint({ children }) {
  return <p className="section-hint">{children}</p>;
}

export default function App() {
  const [tab, setTab] = useState("uso");
  const [language, setLanguage] = useState(getInitialLanguage);
  const [form, setForm] = useState(initialState);
  const [casos, setCasos] = useState(loadCasesFromStorage);
  const [enviandoSheets, setEnviandoSheets] = useState(false);
  const [mensagemEnvio, setMensagemEnvio] = useState("");
  const googleScriptConfigured = GOOGLE_SCRIPT_URL.length > 0;
  const fagerstromDisponivel = form.uso.produtoPrincipal.includes("cigarro industrializado");
  const exibeCampoCultivoLocal =
    form.participante.localResidencia === "rural";

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(casos));
  }, [casos]);

  useEffect(() => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  }, [language]);

  useEffect(() => {
    const root = document.getElementById("root");
    if (!root) return undefined;

    const translateNode = (node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const original = node.__ptText || node.nodeValue;
        const normalized = String(original).replace(/\s+/g, " ").trim();
        if (PORTUGUESE_TEXTS.has(original) || PORTUGUESE_TEXTS.has(normalized)) {
          node.__ptText = original;
          const translated = translateText(original, language);
          if (node.nodeValue !== translated) node.nodeValue = translated;
        }
        return;
      }

      if (node.nodeType !== Node.ELEMENT_NODE) return;

      ["placeholder", "title", "aria-label"].forEach((attr) => {
        if (!node.hasAttribute(attr)) return;
        const storageAttr = `data-pt-${attr}`;
        const original = node.getAttribute(storageAttr) || node.getAttribute(attr);
        if (!original) return;
        const normalized = original.replace(/\s+/g, " ").trim();
        if (!PORTUGUESE_TEXTS.has(original) && !PORTUGUESE_TEXTS.has(normalized)) return;
        node.setAttribute(storageAttr, original);
        const translated = translateText(original, language);
        if (node.getAttribute(attr) !== translated) node.setAttribute(attr, translated);
      });
    };

    const translateTree = () => {
      translateNode(root);
      const walker = document.createTreeWalker(
        root,
        NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT
      );
      while (walker.nextNode()) {
        translateNode(walker.currentNode);
      }
    };

    translateTree();
    const observer = new MutationObserver(translateTree);
    observer.observe(root, { childList: true, subtree: true, characterData: true });

    return () => observer.disconnect();
  }, [language, tab, casos.length, mensagemEnvio]);

  useEffect(() => {
    setForm((prev) => {
      if (!fagerstromDisponivel) {
        const jaLimpo = Object.values(prev.fagerstrom).every((value) => value === "");
        if (jaLimpo) return prev;
        return {
          ...prev,
          fagerstrom: { ...INITIAL_FAGERSTROM },
        };
      }

      if (prev.fagerstrom.tipoUsuario === "cigarro_industrializado") return prev;
      return {
        ...prev,
        fagerstrom: {
          ...prev.fagerstrom,
          tipoUsuario: "cigarro_industrializado",
        },
      };
    });
  }, [fagerstromDisponivel]);

  useEffect(() => {
    setForm((prev) => {
      if (prev.uso.tentativaParar === "sim") return prev;
      const semDadosTentativa =
        prev.uso.vezesTentou === "" &&
        prev.uso.motivoRecaida === "" &&
        prev.uso.tempoUltimaTentativa === "";
      if (semDadosTentativa) return prev;
      return {
        ...prev,
        uso: {
          ...prev.uso,
          vezesTentou: "",
          motivoRecaida: "",
          tempoUltimaTentativa: "",
        },
      };
    });
  }, [form.uso.tentativaParar]);

  useEffect(() => {
    setForm((prev) => {
      if (exibeCampoCultivoLocal) return prev;
      if (prev.uso.cultivoLocal === "") return prev;
      return {
        ...prev,
        uso: {
          ...prev.uso,
          cultivoLocal: "",
        },
      };
    });
  }, [exibeCampoCultivoLocal]);

  useEffect(() => {
    setForm((prev) => {
      if (prev.upenn.q3 !== "0") return prev;
      if (prev.upenn.q4 === "0") return prev;
      return {
        ...prev,
        upenn: {
          ...prev.upenn,
          q4: "0",
        },
      };
    });
  }, [form.upenn.q3]);

  useEffect(() => {
    setForm((prev) => {
      const limparCompraOutro = !prev.eletronico.localCompra.includes("Outro");
      const limparSaboresOutros = !prev.eletronico.saboresMaisUsados.includes("Outros");
      const limparSubstanciasOutras = !prev.eletronico.outrasSubstancias.includes("Outras");

      if (
        (!limparCompraOutro || prev.eletronico.localCompraOutros === "") &&
        (!limparSaboresOutros || prev.eletronico.saboresOutros === "") &&
        (!limparSubstanciasOutras || prev.eletronico.outrasSubstanciasOutras === "")
      ) {
        return prev;
      }

      return {
        ...prev,
        eletronico: {
          ...prev.eletronico,
          localCompraOutros: limparCompraOutro ? "" : prev.eletronico.localCompraOutros,
          saboresOutros: limparSaboresOutros ? "" : prev.eletronico.saboresOutros,
          outrasSubstanciasOutras: limparSubstanciasOutras
            ? ""
            : prev.eletronico.outrasSubstanciasOutras,
        },
      };
    });
  }, [
    form.eletronico.localCompra,
    form.eletronico.saboresMaisUsados,
    form.eletronico.outrasSubstancias,
  ]);

  const updateNested = (section, key, value) => {
    setForm((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  };

  const toggleOutrasSubstanciasEletronico = (item) => {
    const atual = form.eletronico.outrasSubstancias;

    if (item === ELETRONICO_SEM_OUTRAS_SUBSTANCIAS) {
      const proximo = atual.includes(item) ? [] : [item];
      updateNested("eletronico", "outrasSubstancias", proximo);
      return;
    }

    const semOpcaoExclusiva = atual.filter(
      (value) => value !== ELETRONICO_SEM_OUTRAS_SUBSTANCIAS
    );
    updateNested(
      "eletronico",
      "outrasSubstancias",
      toggleArray(semOpcaoExclusiva, item)
    );
  };

  const fagerScore = useMemo(
    () => scoreFagerstrom(form.fagerstrom),
    [form.fagerstrom]
  );

  const usoScore = useMemo(() => scoreUso(form.uso), [form.uso]);
  const auditScore = useMemo(() => scoreAUDIT(form.audit), [form.audit]);
  const upennScore = useMemo(() => scoreUPenn(form.upenn), [form.upenn]);
  const eletronicoScore = useMemo(
    () => scoreEletronico(form.eletronico),
    [form.eletronico]
  );
  const total = fagerScore + usoScore + auditScore + upennScore + eletronicoScore;
  const riscoIntegrado = classifyIntegratedRisk(total, auditScore, form.uso.usoAtual);
  const condutasSugeridas = useMemo(
    () =>
      buildConductRecommendations({
        totalScore: total,
        auditScore,
        upennScore,
        eletronicoScore,
        usoAtual: form.uso.usoAtual,
        interesseParar: form.uso.interesseParar,
        encaminhamentoNecessario: form.uso.encaminhamentoNecessario,
        estagioMotivacional: form.uso.estagioMotivacional,
      }),
    [
      total,
      auditScore,
      upennScore,
      eletronicoScore,
      form.uso.usoAtual,
      form.uso.interesseParar,
      form.uso.encaminhamentoNecessario,
      form.uso.estagioMotivacional,
    ]
  );

  const prioridade =
    total <= 42
      ? "Baixa prioridade"
      : total <= 84
      ? "Prioridade moderada"
      : "Alta prioridade para abordagem";

  const validarAntesDeSalvar = () => {
    const requiredFields = [
      { key: "identificacao", label: "Nome do usuário" },
      { key: "idade", label: "Idade" },
      { key: "sexo", label: "Sexo" },
      { key: "municipio", label: "Município" },
      { key: "data", label: "Data da entrevista" },
    ];

    const faltando = requiredFields
      .filter(({ key }) => !String(form.participante[key] || "").trim())
      .map(({ label }) => label);

    if (!form.uso.usoAtual) {
      faltando.push("Uso atual");
    }

    if (faltando.length > 0) {
      return `Preencha os campos obrigatórios: ${faltando.join(", ")}.`;
    }

    const jaExiste = casos.some((caso) => {
      const mesmoNome =
        String(caso.identificacao || "").trim().toLowerCase() ===
        String(form.participante.identificacao || "").trim().toLowerCase();
      const mesmaData = String(caso.data || "") === String(form.participante.data || "");
      const telefoneAtual = String(form.participante.telefone || "").trim();
      const telefoneCaso = String(caso.telefone || "").trim();
      const mesmoTelefone = telefoneAtual !== "" && telefoneAtual === telefoneCaso;
      return mesmoNome && mesmaData && (mesmoTelefone || telefoneAtual === "");
    });

    if (jaExiste) {
      return "Já existe um caso semelhante (mesmo usuário e data). Verifique para evitar duplicidade.";
    }

    return "";
  };

  const salvarCaso = () => {
    const erroValidacao = validarAntesDeSalvar();
    if (erroValidacao) {
      alert(erroValidacao);
      return;
    }

    const upennFlat = Object.fromEntries(
      Object.entries(form.upenn).map(([key, value]) => [`upenn_${key}`, value])
    );

    const novoCaso = {
      id: Date.now(),
      ...form.participante,
      ...form.uso,
      ...form.fagerstrom,
      ...form.audit,
      ...upennFlat,
      ...form.eletronico,
      produtoPrincipal: form.uso.produtoPrincipal.join(", "),
      localCompra: form.eletronico.localCompra.join(", "),
      saboresMaisUsados: form.eletronico.saboresMaisUsados.join(", "),
      outrasSubstancias: form.eletronico.outrasSubstancias.join(", "),
      scoreUso: usoScore,
      classificacaoUso: classifyUso(usoScore),
      scoreFagerstrom: fagerScore,
      classificacaoFagerstrom: classifyFagerstrom(
        fagerScore,
        form.fagerstrom.tipoUsuario
      ),
      scoreAUDIT: auditScore,
      classificacaoAUDIT: classifyAUDIT(auditScore),
      scoreUPenn: upennScore,
      classificacaoUPenn: classifyUPenn(upennScore),
      scoreEletronico: eletronicoScore,
      classificacaoEletronico: classifyEletronico(
        eletronicoScore,
        form.eletronico.usoAtual
      ),
      riscoIntegrado,
      condutaSugerida: condutasSugeridas.join(" | "),
      scoreTotal: total,
      prioridadeFinal: prioridade,
      classificacaoGeral: classifyDependenciaGeral(total),
      dataRegistro: new Date().toISOString(),
    };

    setCasos((prev) => [...prev, novoCaso]);
    setForm(initialState);
    setTab("uso");
    setMensagemEnvio("");
    alert("Caso salvo com sucesso.");
  };

  const enviarParaGoogleSheets = async () => {
    if (!googleScriptConfigured) {
      setMensagemEnvio(GOOGLE_SCRIPT_NOT_CONFIGURED_MESSAGE);
      alert("Defina a URL do Apps Script do laboratório antes de enviar.");
      return;
    }

    if (casos.length === 0) {
      alert("Nenhum caso foi salvo ainda.");
      return;
    }

    setEnviandoSheets(true);
    setMensagemEnvio("");

    try {
      const casosNormalizados = casos.map(normalizeCasePhone);
      const payload = JSON.stringify({
        origem: "app-tabaco-controle",
        timestampEnvio: new Date().toISOString(),
        quantidadeCasos: casosNormalizados.length,
        casos: casosNormalizados,
      });
      const requestBody = new URLSearchParams({ payload }).toString();
      const isNativeRuntime = Capacitor.getPlatform() !== "web";
      let rawText = "";
      let rawNativeData = null;

      if (isNativeRuntime) {
        const nativeResponse = await CapacitorHttp.post({
          url: GOOGLE_SCRIPT_URL,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
          data: requestBody,
          readTimeout: 20000,
          connectTimeout: 10000,
        });

        const nativeStatus = Number(nativeResponse?.status || 0);
        if (nativeStatus < 200 || nativeStatus >= 300) {
          throw new Error(`Falha HTTP ${nativeStatus || "desconhecida"} ao enviar para a planilha.`);
        }

        rawNativeData = nativeResponse?.data ?? null;
      } else {
        const controller = new AbortController();
        const timeoutId = window.setTimeout(() => controller.abort(), 15000);
        let response;
        try {
          response = await fetch(GOOGLE_SCRIPT_URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
            },
            body: requestBody,
            signal: controller.signal,
          });
        } finally {
          window.clearTimeout(timeoutId);
        }

        if (!response.ok) {
          throw new Error(`Falha HTTP ${response.status} ao enviar para a planilha.`);
        }

        rawText = await response.text();
      }

      let result = null;

      if (rawNativeData && typeof rawNativeData === "object") {
        result = rawNativeData;
      } else {
        const rawData =
          typeof rawNativeData === "string" && rawNativeData.trim() !== ""
            ? rawNativeData
            : rawText;
        try {
          result = JSON.parse(rawData);
        } catch (_error) {
          throw new Error(
            "Resposta inválida do Apps Script. Verifique se o deploy publicado é o correto."
          );
        }
      }

      if (!result || result.sucesso !== true) {
        const messageFromServer =
          result && typeof result.mensagem === "string"
            ? result.mensagem
            : "Apps Script respondeu sem confirmação de sucesso.";
        throw new Error(messageFromServer);
      }

      const envioId = String(result.envioId || "").trim();
      const planilhaId = String(result.planilhaId || result.spreadsheetId || "").trim();
      const schemaVersion = String(result.schemaVersion || "").trim();
      const detalhesEnvio = [
        "Dados enviados com sucesso para a planilha.",
        envioId ? `envioId: ${envioId}` : "",
        planilhaId ? `planilhaId: ${planilhaId}` : "",
        schemaVersion ? `schema: ${schemaVersion}` : "",
      ]
        .filter(Boolean)
        .join(" ");

      setMensagemEnvio(detalhesEnvio);
      alert(detalhesEnvio);
    } catch (error) {
      console.error("Erro ao enviar para Google Sheets:", error);
      const erroMensagem =
        error instanceof Error && error.message
          ? error.message
          : "Não foi possível enviar os dados ao Google Sheets.";
      setMensagemEnvio(erroMensagem);
      alert(erroMensagem);
    } finally {
      setEnviandoSheets(false);
    }
  };

  const resetAll = () => {
    setForm(initialState);
    setTab("uso");
    setMensagemEnvio("");
  };

  const removerCaso = (id) => {
    setCasos((prev) => prev.filter((caso) => caso.id !== id));
  };

  const limparTodosCasos = () => {
    const confirmar = window.confirm("Deseja realmente apagar todos os casos salvos?");
    if (!confirmar) return;
    setCasos([]);
    localStorage.removeItem(STORAGE_KEY);
    setMensagemEnvio("");
  };

  return (
    <div className="container">
      <header className="hero">
        <div className="hero-brand">
          <img
            src={`${import.meta.env.BASE_URL}logo-tabaco-controle.png`}
            alt="Logo Tabaco Controle"
            className="hero-logo"
          />
          <img
            src={`${import.meta.env.BASE_URL}glipmo-logo.jpg`}
            alt="Logo GLIPMO"
            className="hero-logo-secondary"
          />
          <div className="hero-text">
            <div className="hero-top">{HEADER_PARTNERSHIP}</div>
            <h1>Tabaco Controle</h1>
            <p className="subtitle">Apoio para cuidado, vigilância e cessação do tabagismo</p>
            <button
              className="language-toggle"
              type="button"
              aria-label={
                language === "es"
                  ? translateText("Interface em espanhol", language)
                  : "Traduzir para espanhol"
              }
              title={
                language === "es"
                  ? translateText("Interface em espanhol", language)
                  : "Traduzir para espanhol"
              }
              onClick={() => setLanguage((current) => (current === "es" ? "pt" : "es"))}
            >
              {language === "es"
                ? translateText("Voltar para português", language)
                : "Traduzir para espanhol"}
            </button>
          </div>
        </div>
      </header>

      <div className="card">
        <h2>Identificação</h2>
        <SectionHint>
          Inclui local de residência/circulação e presença de equipe de saúde.
        </SectionHint>

        <div className="grid">
          <input
            placeholder="Nome do usuário"
            value={form.participante.identificacao}
            onChange={(e) =>
              updateNested("participante", "identificacao", e.target.value)
            }
          />
          <input
            placeholder="Telefone"
            value={form.participante.telefone}
            onChange={(e) => updateNested("participante", "telefone", e.target.value)}
          />
          <input
            placeholder="Idade"
            value={form.participante.idade}
            onChange={(e) => updateNested("participante", "idade", e.target.value)}
          />
          <input
            placeholder="Sexo"
            value={form.participante.sexo}
            onChange={(e) => updateNested("participante", "sexo", e.target.value)}
          />
          <select
            value={form.participante.escolaridade}
            onChange={(e) =>
              updateNested("participante", "escolaridade", e.target.value)
            }
          >
            <option value="">Escolaridade</option>
            {ESCOLARIDADE_OPTIONS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <select
            value={form.participante.racaCor}
            onChange={(e) => updateNested("participante", "racaCor", e.target.value)}
          >
            <option value="">Raça/cor</option>
            {RACA_COR_OPTIONS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <input
            placeholder="Ocupação"
            value={form.participante.ocupacao}
            onChange={(e) => updateNested("participante", "ocupacao", e.target.value)}
          />
          <input
            placeholder="Município"
            value={form.participante.municipio}
            onChange={(e) => updateNested("participante", "municipio", e.target.value)}
          />
          <input
            placeholder="Estado"
            value={form.participante.estado}
            onChange={(e) => updateNested("participante", "estado", e.target.value)}
          />
          <input
            placeholder="País"
            value={form.participante.pais}
            onChange={(e) => updateNested("participante", "pais", e.target.value)}
          />
          <input
            placeholder="INE (Identificação Nacional de Equipe)"
            value={form.participante.ine}
            onChange={(e) => updateNested("participante", "ine", e.target.value)}
          />
          <select
            value={form.participante.tipoEquipe}
            onChange={(e) =>
              updateNested("participante", "tipoEquipe", e.target.value)
            }
          >
            <option value="">Tipo de equipe</option>
            {TIPO_EQUIPE_OPTIONS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <input
            placeholder="Profissional responsável"
            value={form.participante.profissionalResponsavel}
            onChange={(e) =>
              updateNested("participante", "profissionalResponsavel", e.target.value)
            }
          />
          <input
            placeholder="Entrevistador"
            value={form.participante.entrevistador}
            onChange={(e) =>
              updateNested("participante", "entrevistador", e.target.value)
            }
          />
          <div className="field-with-label field-date">
            <label htmlFor="data-entrevista">Data da entrevista</label>
            <input
              id="data-entrevista"
              type="date"
              aria-label="Data da entrevista"
              title="Data da entrevista"
              value={form.participante.data}
              onChange={(e) => updateNested("participante", "data", e.target.value)}
            />
          </div>
          <input
            placeholder="Idioma principal"
            value={form.participante.idioma}
            onChange={(e) => updateNested("participante", "idioma", e.target.value)}
          />

          <select
            value={form.participante.localResidencia}
            onChange={(e) =>
              updateNested("participante", "localResidencia", e.target.value)
            }
          >
            <option value="">Local de residência</option>
            <option value="cidade">Vive na cidade</option>
            <option value="rural">Vive em área rural</option>
            <option value="outro">Outro</option>
          </select>

          <select
            value={form.participante.recebeVisitaSaude}
            onChange={(e) =>
              updateNested("participante", "recebeVisitaSaude", e.target.value)
            }
          >
            <option value="">Recebe visita de equipe de saúde?</option>
            <option value="sim">Sim</option>
            <option value="nao">Não</option>
            <option value="nao_sabe">Não sabe</option>
          </select>

        </div>
      </div>

      <div className="tabs">
        <button className={tab === "uso" ? "active" : ""} onClick={() => setTab("uso")}>
          1. Uso do tabaco
        </button>
        <button
          className={tab === "fagerstrom" ? "active" : ""}
          onClick={() => setTab("fagerstrom")}
        >
          2. Fagerström
        </button>
        <button className={tab === "audit" ? "active" : ""} onClick={() => setTab("audit")}>
          3. AUDIT
        </button>
        <button
          className={tab === "eletronico" ? "active" : ""}
          onClick={() => setTab("eletronico")}
        >
          4. Cigarro eletrônico
        </button>
        <button className={tab === "upenn" ? "active" : ""} onClick={() => setTab("upenn")}>
          5. UPenn
        </button>
      </div>

      {tab === "uso" && (
        <div className="card">
          <h2>Módulo 1 - Questionário de uso de tabaco</h2>
          <SectionHint>
            Diferencia início ritual e início regular, contempla recaída, apoio prévio e encaminhamento.
          </SectionHint>

          <div className="grid">
            <select
              value={form.uso.usoAtual}
              onChange={(e) => updateNested("uso", "usoAtual", e.target.value)}
            >
              <option value="">Uso atual?</option>
              <option value="sim">Sim</option>
              <option value="nao">Não</option>
              <option value="ex">Ex-usuário</option>
            </select>

            <select
              value={form.uso.frequencia}
              onChange={(e) => updateNested("uso", "frequencia", e.target.value)}
            >
              <option value="">Frequência</option>
              <option value="diario">Diário</option>
              <option value="semanal">Semanal</option>
              <option value="ocasional">Ocasional</option>
              <option value="nao_usa">Não usa atualmente</option>
            </select>

            <input
              placeholder="Idade de início do uso regular"
              value={form.uso.idadeInicioRegular}
              onChange={(e) =>
                updateNested("uso", "idadeInicioRegular", e.target.value)
              }
            />

            <input
              placeholder="Unidades por dia"
              value={form.uso.cigarrosDia}
              onChange={(e) => updateNested("uso", "cigarrosDia", e.target.value)}
            />

            <select
              value={form.uso.exposicaoDomiciliar}
              onChange={(e) =>
                updateNested("uso", "exposicaoDomiciliar", e.target.value)
              }
            >
              <option value="">Exposição de fumantes em casa</option>
              <option value="sim">Sim</option>
              <option value="nao">Não</option>
            </select>

            <select
              value={form.uso.exposicaoTrabalhoEscola}
              onChange={(e) =>
                updateNested("uso", "exposicaoTrabalhoEscola", e.target.value)
              }
            >
              <option value="">Exposição no trabalho/escola/comunidade</option>
              <option value="sim">Sim</option>
              <option value="nao">Não</option>
            </select>

            <select
              value={form.uso.tentativaParar}
              onChange={(e) =>
                updateNested("uso", "tentativaParar", e.target.value)
              }
            >
              <option value="">Já tentou parar?</option>
              <option value="sim">Sim</option>
              <option value="nao">Não</option>
            </select>

            <input
              placeholder="Quantas tentativas?"
              value={form.uso.vezesTentou}
              onChange={(e) => updateNested("uso", "vezesTentou", e.target.value)}
            />
            <input
              placeholder="Tempo desde a última tentativa de parar"
              value={form.uso.tempoUltimaTentativa}
              onChange={(e) =>
                updateNested("uso", "tempoUltimaTentativa", e.target.value)
              }
            />

            <input
              placeholder="Motivo principal de recaída"
              value={form.uso.motivoRecaida}
              onChange={(e) => updateNested("uso", "motivoRecaida", e.target.value)}
            />

            <select
              value={form.uso.apoioPrevio}
              onChange={(e) => updateNested("uso", "apoioPrevio", e.target.value)}
            >
              <option value="">Teve apoio prévio?</option>
              <option value="nenhum">Nenhum</option>
              <option value="profissional">Apoio profissional</option>
              <option value="medicamentoso">Apoio medicamentoso</option>
              <option value="ambos">Profissional + medicamentoso</option>
            </select>
            <select
              value={form.uso.usouMedicacaoApoioEstruturado}
              onChange={(e) =>
                updateNested("uso", "usouMedicacaoApoioEstruturado", e.target.value)
              }
            >
              <option value="">Já usou medicação ou apoio estruturado?</option>
              <option value="sim">Sim</option>
              <option value="nao">Não</option>
              <option value="nao_sabe">Não sabe informar</option>
            </select>
            <select
              value={form.uso.procurouGrupoCessacaoSemAcesso}
              onChange={(e) =>
                updateNested("uso", "procurouGrupoCessacaoSemAcesso", e.target.value)
              }
            >
              <option value="">Procurou grupo de cessação e não conseguiu acesso?</option>
              <option value="sim">Sim</option>
              <option value="nao">Não</option>
              <option value="nao_se_aplica">Não se aplica</option>
            </select>

            <select
              value={form.uso.interesseParar}
              onChange={(e) => updateNested("uso", "interesseParar", e.target.value)}
            >
              <option value="">Interesse em parar</option>
              <option value="sim">Sim</option>
              <option value="nao">Não</option>
              <option value="talvez">Talvez</option>
            </select>

            <select
              value={form.uso.estagioMotivacional}
              onChange={(e) =>
                updateNested("uso", "estagioMotivacional", e.target.value)
              }
            >
              <option value="">Estágio motivacional</option>
              <option value="pre_contemplacao">Pré-contemplação</option>
              <option value="contemplacao">Contemplação</option>
              <option value="preparacao">Preparação</option>
              <option value="acao">Ação</option>
              <option value="manutencao">Manutenção</option>
            </select>

            <select
              value={form.uso.encaminhamentoNecessario}
              onChange={(e) =>
                updateNested("uso", "encaminhamentoNecessario", e.target.value)
              }
            >
              <option value="">Necessita encaminhamento/orientação agora?</option>
              <option value="sim_imediato">Sim, imediato</option>
              <option value="sim_programado">Sim, programado</option>
              <option value="nao">Não</option>
            </select>

            <input
              placeholder="Como obtém o produto de tabaco?"
              value={form.uso.formaObtencao}
              onChange={(e) => updateNested("uso", "formaObtencao", e.target.value)}
            />

            {exibeCampoCultivoLocal && (
              <select
                value={form.uso.cultivoLocal}
                onChange={(e) => updateNested("uso", "cultivoLocal", e.target.value)}
              >
                <option value="">Há cultivo local de tabaco/outras plantas?</option>
                <option value="sim">Sim</option>
                <option value="nao">Não</option>
                <option value="nao_sabe">Não sabe</option>
              </select>
            )}

            <div className="multi-group full">
              <p>Produto principal (pode marcar mais de um)</p>
              <div className="checks">
              {PRODUTOS_SUBSTANCIAS.map((item) => (
                  <label key={item}>
                    <input
                      type="checkbox"
                      checked={form.uso.produtoPrincipal.includes(item)}
                      onChange={() =>
                        updateNested(
                          "uso",
                          "produtoPrincipal",
                          toggleArray(form.uso.produtoPrincipal, item)
                        )
                      }
                    />
                    {item}
                  </label>
                ))}
              </div>
            </div>

            {form.uso.produtoPrincipal.includes("outros") && (
              <input
                className="full"
                placeholder="Outros produtos (especificar)"
                value={form.uso.produtoOutros}
                onChange={(e) =>
                  updateNested("uso", "produtoOutros", e.target.value)
                }
              />
            )}

          </div>

          <textarea
            placeholder="Observações"
            value={form.uso.observacoes}
            onChange={(e) => updateNested("uso", "observacoes", e.target.value)}
          />
        </div>
      )}

      {tab === "fagerstrom" && (
        <div className="card">
          <h2>Módulo 2 - Teste de Fagerström</h2>
          <SectionHint>
            Aplicável somente quando o produto principal inclui cigarro industrializado.
          </SectionHint>
          {!fagerstromDisponivel && (
            <p className="blocked-note">
              Para liberar este bloco, marque "cigarro industrializado" em "Uso de
              tabaco" {">"} "Produto principal".
            </p>
          )}

          <div className={`grid ${!fagerstromDisponivel ? "section-locked" : ""}`}>
            <select
              value={form.fagerstrom.tipoUsuario}
              onChange={(e) =>
                updateNested("fagerstrom", "tipoUsuario", e.target.value)
              }
              disabled={!fagerstromDisponivel}
            >
              <option value="">Tipo principal de usuário (bloqueado)</option>
              <option value="cigarro_industrializado">Cigarro industrializado</option>
            </select>

            <select
              value={form.fagerstrom.primeiroCigarro}
              onChange={(e) =>
                updateNested("fagerstrom", "primeiroCigarro", e.target.value)
              }
              disabled={!fagerstromDisponivel}
            >
              <option value="">Primeiro cigarro após acordar</option>
              <option value="5">Até 5 minutos</option>
              <option value="30">6 a 30 minutos</option>
              <option value="60">31 a 60 minutos</option>
              <option value="61+">Após 60 minutos</option>
            </select>

            <select
              value={form.fagerstrom.dificuldadeLocais}
              onChange={(e) =>
                updateNested("fagerstrom", "dificuldadeLocais", e.target.value)
              }
              disabled={!fagerstromDisponivel}
            >
              <option value="">Dificuldade em locais proibidos?</option>
              <option value="sim">Sim</option>
              <option value="nao">Não</option>
            </select>

            <select
              value={form.fagerstrom.cigarroMaisDificil}
              onChange={(e) =>
                updateNested("fagerstrom", "cigarroMaisDificil", e.target.value)
              }
              disabled={!fagerstromDisponivel}
            >
              <option value="">Mais difícil abandonar</option>
              <option value="primeiro">Primeiro da manhã</option>
              <option value="outro">Outro</option>
            </select>

            <select
              value={form.fagerstrom.cigarrosDia}
              onChange={(e) =>
                updateNested("fagerstrom", "cigarrosDia", e.target.value)
              }
              disabled={!fagerstromDisponivel}
            >
              <option value="">Quantos cigarros por dia?</option>
              <option value="10">10 ou menos</option>
              <option value="20">11 a 20</option>
              <option value="30">21 a 30</option>
              <option value="31+">31 ou mais</option>
            </select>

            <select
              value={form.fagerstrom.fumaMaisManha}
              onChange={(e) =>
                updateNested("fagerstrom", "fumaMaisManha", e.target.value)
              }
              disabled={!fagerstromDisponivel}
            >
              <option value="">Fuma mais pela manhã?</option>
              <option value="sim">Sim</option>
              <option value="nao">Não</option>
            </select>

            <select
              value={form.fagerstrom.fumaDoente}
              onChange={(e) =>
                updateNested("fagerstrom", "fumaDoente", e.target.value)
              }
              disabled={!fagerstromDisponivel}
            >
              <option value="">Fuma quando está doente?</option>
              <option value="sim">Sim</option>
              <option value="nao">Não</option>
            </select>

            <select
              value={form.fagerstrom.despertaNoiteFumar}
              onChange={(e) =>
                updateNested("fagerstrom", "despertaNoiteFumar", e.target.value)
              }
              disabled={!fagerstromDisponivel}
            >
              <option value="">Desperta à noite para fumar?</option>
              <option value="sim">Sim</option>
              <option value="nao">Não</option>
            </select>

            <select
              value={form.fagerstrom.sintomasAbstinencia}
              onChange={(e) =>
                updateNested("fagerstrom", "sintomasAbstinencia", e.target.value)
              }
              disabled={!fagerstromDisponivel}
            >
              <option value="">Apresenta sintomas de abstinência?</option>
              <option value="sim">Sim</option>
              <option value="nao">Não</option>
              <option value="nao_sabe">Não sabe</option>
            </select>

            <select
              value={form.fagerstrom.tentativasSemSucesso}
              onChange={(e) =>
                updateNested("fagerstrom", "tentativasSemSucesso", e.target.value)
              }
              disabled={!fagerstromDisponivel}
            >
              <option value="">Múltiplas tentativas sem sucesso?</option>
              <option value="sim">Sim</option>
              <option value="nao">Não</option>
            </select>
          </div>
        </div>
      )}

      {tab === "eletronico" && (
        <div className="card">
          <h2>Módulo 4 - Cigarro eletrônico</h2>
          <SectionHint>
            Avalia padrão de uso, uso dual e perfil do dispositivo para qualificar o cuidado.
          </SectionHint>

          <div className="grid">
            <select
              value={form.eletronico.jaUsouAlgumaVez}
              onChange={(e) => updateNested("eletronico", "jaUsouAlgumaVez", e.target.value)}
            >
              <option value="">Já usou cigarro eletrônico alguma vez?</option>
              <option value="sim">Sim</option>
              <option value="nao">Não</option>
            </select>
            <select
              value={form.eletronico.usoAtual}
              onChange={(e) => updateNested("eletronico", "usoAtual", e.target.value)}
            >
              <option value="">Uso atual de cigarro eletrônico?</option>
              <option value="sim">Sim</option>
              <option value="nao">Não</option>
              <option value="ex">Ex-usuário</option>
            </select>
            <input
              placeholder="Idade do primeiro uso"
              value={form.eletronico.idadePrimeiroUso}
              onChange={(e) => updateNested("eletronico", "idadePrimeiroUso", e.target.value)}
            />
            <input
              placeholder="Idade de uso frequente"
              value={form.eletronico.idadeUsoFrequente}
              onChange={(e) => updateNested("eletronico", "idadeUsoFrequente", e.target.value)}
            />
            <input
              placeholder="Tempo total de uso (meses/anos)"
              value={form.eletronico.tempoUso}
              onChange={(e) => updateNested("eletronico", "tempoUso", e.target.value)}
            />
            <select
              value={form.eletronico.frequenciaUso}
              onChange={(e) => updateNested("eletronico", "frequenciaUso", e.target.value)}
            >
              <option value="">Frequência de uso</option>
              <option value="diario">Diário</option>
              <option value="semanal">Semanal</option>
              <option value="ocasional">Ocasional</option>
              <option value="nao_usa">Não usa atualmente</option>
            </select>
            <input
              placeholder="Vezes por dia (quando usa)"
              value={form.eletronico.vezesPorDia}
              onChange={(e) => updateNested("eletronico", "vezesPorDia", e.target.value)}
            />
            <select
              value={form.eletronico.tipoDispositivo}
              onChange={(e) => updateNested("eletronico", "tipoDispositivo", e.target.value)}
            >
              <option value="">Tipo de dispositivo</option>
              <option value="descartavel">Descartável</option>
              <option value="pod">Pod</option>
              <option value="mod">Mod</option>
              <option value="outro">Outro</option>
              <option value="nao_sabe">Não sabe informar</option>
            </select>
            <select
              value={form.eletronico.usaMaisDeUm}
              onChange={(e) => updateNested("eletronico", "usaMaisDeUm", e.target.value)}
            >
              <option value="">Usa mais de um dispositivo?</option>
              <option value="sim">Sim</option>
              <option value="nao">Não</option>
            </select>
            <select
              value={form.eletronico.compartilhaDispositivo}
              onChange={(e) =>
                updateNested("eletronico", "compartilhaDispositivo", e.target.value)
              }
            >
              <option value="">Compartilha dispositivo?</option>
              <option value="sim">Sim</option>
              <option value="nao">Não</option>
            </select>
            <div className="multi-group full">
              <p>Onde costuma comprar? (pode marcar mais de uma opção)</p>
              <div className="checks">
                {ELETRONICO_LOCAL_COMPRA_OPTIONS.map((item) => (
                  <label key={item}>
                    <input
                      type="checkbox"
                      checked={form.eletronico.localCompra.includes(item)}
                      onChange={() =>
                        updateNested(
                          "eletronico",
                          "localCompra",
                          toggleArray(form.eletronico.localCompra, item)
                        )
                      }
                    />
                    {item}
                  </label>
                ))}
              </div>
            </div>
            {form.eletronico.localCompra.includes("Outro") && (
              <input
                className="full"
                placeholder="Outro local de compra (especificar)"
                value={form.eletronico.localCompraOutros}
                onChange={(e) => updateNested("eletronico", "localCompraOutros", e.target.value)}
              />
            )}
            <select
              value={form.eletronico.contemNicotina}
              onChange={(e) => updateNested("eletronico", "contemNicotina", e.target.value)}
            >
              <option value="">O líquido contém nicotina?</option>
              <option value="sim">Sim</option>
              <option value="nao">Não</option>
              <option value="nao_sabe">Não sabe informar</option>
            </select>
            <input
              placeholder="Concentração de nicotina (se souber)"
              value={form.eletronico.concentracaoNicotina}
              onChange={(e) =>
                updateNested("eletronico", "concentracaoNicotina", e.target.value)
              }
            />
            <select
              value={form.eletronico.usaSabores}
              onChange={(e) => updateNested("eletronico", "usaSabores", e.target.value)}
            >
              <option value="">Usa líquidos com sabor?</option>
              <option value="sim">Sim</option>
              <option value="nao">Não</option>
            </select>
            <div className="multi-group full">
              <p>Quais são os sabores mais usados? (múltipla escolha)</p>
              <div className="checks">
                {ELETRONICO_SABORES_OPTIONS.map((item) => (
                  <label key={item}>
                    <input
                      type="checkbox"
                      checked={form.eletronico.saboresMaisUsados.includes(item)}
                      onChange={() =>
                        updateNested(
                          "eletronico",
                          "saboresMaisUsados",
                          toggleArray(form.eletronico.saboresMaisUsados, item)
                        )
                      }
                    />
                    {item}
                  </label>
                ))}
              </div>
            </div>
            {form.eletronico.saboresMaisUsados.includes("Outros") && (
              <input
                className="full"
                placeholder="Outros sabores (especificar)"
                value={form.eletronico.saboresOutros}
                onChange={(e) => updateNested("eletronico", "saboresOutros", e.target.value)}
              />
            )}
            <div className="multi-group full">
              <p>Outras substâncias no dispositivo (múltipla escolha)</p>
              <div className="checks">
                {ELETRONICO_OUTRAS_SUBSTANCIAS_OPTIONS.map((item) => (
                  <label key={item}>
                    <input
                      type="checkbox"
                      checked={form.eletronico.outrasSubstancias.includes(item)}
                      onChange={() => toggleOutrasSubstanciasEletronico(item)}
                    />
                    {item}
                  </label>
                ))}
              </div>
            </div>
            {form.eletronico.outrasSubstancias.includes("Outras") && (
              <input
                className="full"
                placeholder="Outras substâncias (especificar)"
                value={form.eletronico.outrasSubstanciasOutras}
                onChange={(e) =>
                  updateNested("eletronico", "outrasSubstanciasOutras", e.target.value)
                }
              />
            )}
            <select
              value={form.eletronico.usoDualTabacoCombustivel}
              onChange={(e) =>
                updateNested("eletronico", "usoDualTabacoCombustivel", e.target.value)
              }
            >
              <option value="">Usa junto com cigarro convencional?</option>
              <option value="sim">Sim</option>
              <option value="nao">Não</option>
            </select>
            <select
              value={form.eletronico.usaAoAcordar}
              onChange={(e) => updateNested("eletronico", "usaAoAcordar", e.target.value)}
            >
              <option value="">Usa logo ao acordar?</option>
              <option value="sim">Sim</option>
              <option value="nao">Não</option>
            </select>
            <select
              value={form.eletronico.tentativasParar}
              onChange={(e) => updateNested("eletronico", "tentativasParar", e.target.value)}
            >
              <option value="">Já tentou parar de usar cigarro eletrônico?</option>
              <option value="sim">Sim</option>
              <option value="nao">Não</option>
            </select>
            <select
              value={form.eletronico.interesseParar}
              onChange={(e) => updateNested("eletronico", "interesseParar", e.target.value)}
            >
              <option value="">Interesse em parar de usar cigarro eletrônico</option>
              <option value="sim">Sim</option>
              <option value="nao">Não</option>
              <option value="talvez">Talvez</option>
            </select>
          </div>

          <textarea
            placeholder="Observações sobre uso de cigarro eletrônico"
            value={form.eletronico.observacoes}
            onChange={(e) => updateNested("eletronico", "observacoes", e.target.value)}
          />
        </div>
      )}

      {tab === "upenn" && (
        <div className="card">
          <h2>Módulo 5 - UPenn (Penn State E-cigarette Dependence Index)</h2>
          <SectionHint>
            PSECDI original: pontuação total de 0 a 24, com faixas de dependência 0-3, 4-8,
            9-12 e 13+.
          </SectionHint>

          <div className="audit-grid">
            <AuditQuestion
              title="1. Quantas vezes por dia você costuma usar seu cigarro eletrônico? (Considere que uma 'vez' corresponde a cerca de 15 tragadas ou dura aproximadamente 10 minutos)"
              value={form.upenn.q1}
              onChange={(e) => updateNested("upenn", "q1", e.target.value)}
              options={UPENN_Q1_OPTIONS}
            />
            <AuditQuestion
              title="2. Nos dias em que você pode usar seu cigarro eletrônico livremente, quanto tempo após acordar você usa o primeiro?"
              value={form.upenn.q2}
              onChange={(e) => updateNested("upenn", "q2", e.target.value)}
              options={UPENN_Q2_OPTIONS}
            />
            <AuditQuestion
              title="3. Você às vezes acorda durante a noite para usar cigarro eletrônico?"
              value={form.upenn.q3}
              onChange={(e) => updateNested("upenn", "q3", e.target.value)}
              options={UPENN_YES_NO_OPTIONS}
            />
            <AuditQuestion
              title="4. Se sim, em quantas noites por semana você costuma acordar para usar cigarro eletrônico?"
              value={form.upenn.q4}
              onChange={(e) => updateNested("upenn", "q4", e.target.value)}
              options={UPENN_Q4_OPTIONS}
            />
            <AuditQuestion
              title="5. Você usa cigarro eletrônico atualmente porque é muito difícil parar?"
              value={form.upenn.q5}
              onChange={(e) => updateNested("upenn", "q5", e.target.value)}
              options={UPENN_YES_NO_OPTIONS}
            />
            <AuditQuestion
              title="6. Você tem vontade forte de usar cigarro eletrônico?"
              value={form.upenn.q6}
              onChange={(e) => updateNested("upenn", "q6", e.target.value)}
              options={UPENN_YES_NO_OPTIONS}
            />
            <AuditQuestion
              title="7. Na última semana, quão intensas foram as vontades de usar cigarro eletrônico?"
              value={form.upenn.q7}
              onChange={(e) => updateNested("upenn", "q7", e.target.value)}
              options={UPENN_Q7_OPTIONS}
            />
            <AuditQuestion
              title="8. É difícil deixar de usar cigarro eletrônico em locais onde não é permitido?"
              value={form.upenn.q8}
              onChange={(e) => updateNested("upenn", "q8", e.target.value)}
              options={UPENN_YES_NO_OPTIONS}
            />
            <AuditQuestion
              title="9. Quando você ficou sem usar cigarro eletrônico por um tempo ou tentou parar, sentiu-se mais irritado(a) por não poder usar?"
              value={form.upenn.q9}
              onChange={(e) => updateNested("upenn", "q9", e.target.value)}
              options={UPENN_YES_NO_OPTIONS}
            />
            <AuditQuestion
              title="10. Você se sentiu nervoso(a), inquieto(a) ou ansioso(a) por não poder usar cigarro eletrônico?"
              value={form.upenn.q10}
              onChange={(e) => updateNested("upenn", "q10", e.target.value)}
              options={UPENN_YES_NO_OPTIONS}
            />
          </div>
        </div>
      )}

      {tab === "audit" && (
        <div className="card">
          <h2>Módulo 3 - AUDIT (Triagem do consumo de bebidas alcoólicas)</h2>
          <SectionHint>
            O AUDIT complementa a avaliação do tabagismo: uso de álcool e tabaco frequentemente
            aparecem juntos e aumentam risco de recaída, piora clínica e necessidade de cuidado
            mais intensivo.
          </SectionHint>

          <div className="audit-grid">
            <AuditQuestion
              title="1. Com que frequência você consome bebidas alcoólicas?"
              value={form.audit.q1}
              onChange={(e) => updateNested("audit", "q1", e.target.value)}
              options={AUDIT_Q1_OPTIONS}
            />
            <AuditQuestion
              title="2. Quantas doses alcoólicas você consome tipicamente ao beber?"
              value={form.audit.q2}
              onChange={(e) => updateNested("audit", "q2", e.target.value)}
              options={AUDIT_Q2_OPTIONS}
            />
            <AuditQuestion
              title="3. Com que frequência você consome seis ou mais doses em uma ocasião?"
              value={form.audit.q3}
              onChange={(e) => updateNested("audit", "q3", e.target.value)}
              options={AUDIT_Q3_OPTIONS}
            />
            <AuditQuestion
              title="4. Com que frequência, durante o último ano, você achou que não conseguiria parar de beber depois de começar?"
              value={form.audit.q4}
              onChange={(e) => updateNested("audit", "q4", e.target.value)}
              options={AUDIT_Q4_TO_Q8_OPTIONS}
            />
            <AuditQuestion
              title="5. Com que frequência, durante o último ano, você não conseguiu fazer o que era esperado por causa da bebida?"
              value={form.audit.q5}
              onChange={(e) => updateNested("audit", "q5", e.target.value)}
              options={AUDIT_Q4_TO_Q8_OPTIONS}
            />
            <AuditQuestion
              title="6. Com que frequência, durante o último ano, você precisou beber pela manhã para se sentir melhor após ter bebido muito?"
              value={form.audit.q6}
              onChange={(e) => updateNested("audit", "q6", e.target.value)}
              options={AUDIT_Q4_TO_Q8_OPTIONS}
            />
            <AuditQuestion
              title="7. Com que frequência, durante o último ano, você sentiu culpa ou remorso após beber?"
              value={form.audit.q7}
              onChange={(e) => updateNested("audit", "q7", e.target.value)}
              options={AUDIT_Q4_TO_Q8_OPTIONS}
            />
            <AuditQuestion
              title="8. Com que frequência, durante o último ano, você não conseguiu lembrar do que aconteceu na noite anterior por causa da bebida?"
              value={form.audit.q8}
              onChange={(e) => updateNested("audit", "q8", e.target.value)}
              options={AUDIT_Q4_TO_Q8_OPTIONS}
            />
            <AuditQuestion
              title="9. Você ou outra pessoa já se machucou em consequência do seu consumo de álcool?"
              value={form.audit.q9}
              onChange={(e) => updateNested("audit", "q9", e.target.value)}
              options={AUDIT_Q9_Q10_OPTIONS}
            />
            <AuditQuestion
              title="10. Algum parente, amigo ou profissional de saúde já se preocupou com seu modo de beber ou sugeriu que você parasse?"
              value={form.audit.q10}
              onChange={(e) => updateNested("audit", "q10", e.target.value)}
              options={AUDIT_Q9_Q10_OPTIONS}
            />
          </div>
        </div>
      )}

      <div className="card result">
        <h2>Resumo do caso atual</h2>

        <p><strong>Uso do tabaco:</strong> {usoScore} pontos — {classifyUso(usoScore)}</p>
        <p>
          <strong>Fagerström:</strong> {fagerScore} pontos —{" "}
          {classifyFagerstrom(fagerScore, form.fagerstrom.tipoUsuario)}
        </p>
        <p><strong>AUDIT:</strong> {auditScore} pontos — {classifyAUDIT(auditScore)}</p>
        <p>
          <strong>Cigarro eletrônico:</strong> {eletronicoScore} pontos —{" "}
          {classifyEletronico(eletronicoScore, form.eletronico.usoAtual)}
        </p>
        <p><strong>UPenn (Penn State):</strong> {upennScore} pontos — {classifyUPenn(upennScore)}</p>
        <p><strong>Risco integrado tabaco + álcool:</strong> {riscoIntegrado}</p>
        <p><strong>Prioridade final:</strong> {prioridade}</p>
        <p><strong>Conduta sugerida:</strong></p>
        <ul>
          {condutasSugeridas.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <div className="chart-box">
          <div className="chart-title">Nível de dependência geral</div>
          <div className="chart-track">
            <div
              className={`chart-fill ${getDependenciaBarClass(total)}`}
              style={{ width: getDependenciaBarWidth(total) }}
            />
          </div>
          <div className="chart-label">{classifyDependenciaGeral(total)}</div>
        </div>

        {mensagemEnvio && <div className="status-envio">{mensagemEnvio}</div>}
        {!googleScriptConfigured && (
          <div className="status-envio status-envio-warning">
            {GOOGLE_SCRIPT_NOT_CONFIGURED_MESSAGE}
          </div>
        )}

        <div className="buttons">
          <button onClick={salvarCaso}>Salvar caso</button>
          <button onClick={enviarParaGoogleSheets} disabled={enviandoSheets}>
            {enviandoSheets ? "Enviando..." : "Enviar todos para Google Sheets"}
          </button>
          <button onClick={resetAll}>Limpar formulário</button>
        </div>
      </div>

      <div className="card">
        <div className="header-casos">
          <h2>Casos cadastrados</h2>
          <button className="btn-apagar-todos" onClick={limparTodosCasos}>
            Apagar todos
          </button>
        </div>

        {casos.length === 0 ? (
          <p>Nenhum caso salvo ainda.</p>
        ) : (
          <div className="table-wrap">
            <table className="tabela-casos">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Nome do usuário</th>
                  <th>Telefone</th>
                  <th>Residência</th>
                  <th>Município</th>
                  <th>Uso atual</th>
                  <th>AUDIT</th>
                  <th>Total</th>
                  <th>Prioridade</th>
                  <th>Ação</th>
                </tr>
              </thead>
              <tbody>
                {casos.map((caso, index) => (
                  <tr key={caso.id}>
                    <td>{index + 1}</td>
                    <td>{caso.identificacao}</td>
                    <td>{caso.telefone || "-"}</td>
                    <td>{caso.localResidencia}</td>
                    <td>{caso.municipio}</td>
                    <td>{caso.usoAtual}</td>
                    <td>{caso.classificacaoAUDIT}</td>
                    <td>{caso.scoreTotal}</td>
                    <td>{caso.prioridadeFinal}</td>
                    <td>
                      <button
                        className="btn-remover"
                        onClick={() => removerCaso(caso.id)}
                      >
                        Remover
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
