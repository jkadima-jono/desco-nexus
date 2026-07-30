import type { Locale } from "@/lib/i18n";
import type { MatchReason, MatchSource, MatchExplanation } from "@/lib/matching";

type ReasonCopy = Record<MatchReason["code"], (values: Record<string, string | number>) => string>;

const value = (values: Record<string, string | number>, key: string) => String(values[key] ?? "");

const reasons: Record<Locale, ReasonCopy> = {
  en: {
    "excluded-sector": (v) => `Sector “${value(v, "sector")}” is excluded by your mandate.`,
    "excluded-country": (v) => `Country “${value(v, "country")}” is excluded by your mandate.`,
    "missing-sector": () => "No sector is recorded for comparison.",
    "sector-match": (v) => `Sector “${value(v, "sector")}” matches your mandate.`,
    "sector-mismatch": (v) => `Sector “${value(v, "sector")}” does not match your targets (${value(v, "targets")}).`,
    "missing-country": () => "No country is recorded for comparison.",
    "country-match": (v) => `Country “${value(v, "country")}” matches your mandate.`,
    "country-mismatch": (v) => `Country “${value(v, "country")}” does not match your targets (${value(v, "targets")}).`,
    "missing-capital": () => "No capital requirement is recorded for comparison.",
    "capital-match": (v) => `Capital required ($${value(v, "capitalM")}M) is within your ticket range.`,
    "capital-near": (v) => `Capital required ($${value(v, "capitalM")}M) is within 15% of your ticket range.`,
    "capital-mismatch": (v) => `Capital required ($${value(v, "capitalM")}M) is outside your ticket range.`,
    "missing-instrument": () => "No instrument is recorded for comparison.",
    "instrument-match": (v) => `Instrument “${value(v, "instrument")}” matches your preferences.`,
    "instrument-mismatch": (v) => `Instrument “${value(v, "instrument")}” does not match your preferences (${value(v, "targets")}).`,
    "esg-disclosed": () => "ESG information is disclosed and still requires investor review.",
    "esg-missing": () => "No structured public ESG evidence is available.",
    "government-match": () => "Government involvement is disclosed as required by your mandate.",
    "government-mismatch": () => "No government involvement is disclosed, although your mandate requires it.",
  },
  fr: {
    "excluded-sector": (v) => `Le secteur « ${value(v, "sector")} » est exclu par votre mandat.`,
    "excluded-country": (v) => `Le pays « ${value(v, "country")} » est exclu par votre mandat.`,
    "missing-sector": () => "Aucun secteur n’est renseigné pour la comparaison.",
    "sector-match": (v) => `Le secteur « ${value(v, "sector")} » correspond à votre mandat.`,
    "sector-mismatch": (v) => `Le secteur « ${value(v, "sector")} » ne correspond pas à vos cibles (${value(v, "targets")}).`,
    "missing-country": () => "Aucun pays n’est renseigné pour la comparaison.",
    "country-match": (v) => `Le pays « ${value(v, "country")} » correspond à votre mandat.`,
    "country-mismatch": (v) => `Le pays « ${value(v, "country")} » ne correspond pas à vos cibles (${value(v, "targets")}).`,
    "missing-capital": () => "Aucun besoin en capital n’est renseigné pour la comparaison.",
    "capital-match": (v) => `Le capital requis (${value(v, "capitalM")} M$) est compris dans votre fourchette.`,
    "capital-near": (v) => `Le capital requis (${value(v, "capitalM")} M$) se situe à moins de 15 % de votre fourchette.`,
    "capital-mismatch": (v) => `Le capital requis (${value(v, "capitalM")} M$) est hors de votre fourchette.`,
    "missing-instrument": () => "Aucun instrument n’est renseigné pour la comparaison.",
    "instrument-match": (v) => `L’instrument « ${value(v, "instrument")} » correspond à vos préférences.`,
    "instrument-mismatch": (v) => `L’instrument « ${value(v, "instrument")} » ne correspond pas à vos préférences (${value(v, "targets")}).`,
    "esg-disclosed": () => "Des informations ESG sont publiées et doivent encore être examinées.",
    "esg-missing": () => "Aucune preuve ESG publique structurée n’est disponible.",
    "government-match": () => "Une implication publique est déclarée comme l’exige votre mandat.",
    "government-mismatch": () => "Aucune implication publique n’est déclarée alors que votre mandat l’exige.",
  },
  es: {
    "excluded-sector": (v) => `El sector «${value(v, "sector")}» está excluido por su mandato.`,
    "excluded-country": (v) => `El país «${value(v, "country")}» está excluido por su mandato.`,
    "missing-sector": () => "No consta un sector para la comparación.",
    "sector-match": (v) => `El sector «${value(v, "sector")}» coincide con su mandato.`,
    "sector-mismatch": (v) => `El sector «${value(v, "sector")}» no coincide con sus objetivos (${value(v, "targets")}).`,
    "missing-country": () => "No consta un país para la comparación.",
    "country-match": (v) => `El país «${value(v, "country")}» coincide con su mandato.`,
    "country-mismatch": (v) => `El país «${value(v, "country")}» no coincide con sus objetivos (${value(v, "targets")}).`,
    "missing-capital": () => "No consta una necesidad de capital para la comparación.",
    "capital-match": (v) => `El capital requerido (${value(v, "capitalM")} M$) está dentro de su rango.`,
    "capital-near": (v) => `El capital requerido (${value(v, "capitalM")} M$) está a menos del 15 % de su rango.`,
    "capital-mismatch": (v) => `El capital requerido (${value(v, "capitalM")} M$) está fuera de su rango.`,
    "missing-instrument": () => "No consta un instrumento para la comparación.",
    "instrument-match": (v) => `El instrumento «${value(v, "instrument")}» coincide con sus preferencias.`,
    "instrument-mismatch": (v) => `El instrumento «${value(v, "instrument")}» no coincide con sus preferencias (${value(v, "targets")}).`,
    "esg-disclosed": () => "Hay información ESG publicada que aún requiere revisión.",
    "esg-missing": () => "No hay evidencia ESG pública estructurada.",
    "government-match": () => "Se declara participación pública, como exige su mandato.",
    "government-mismatch": () => "No se declara participación pública, aunque su mandato la exige.",
  },
  pt: {
    "excluded-sector": (v) => `O setor «${value(v, "sector")}» está excluído pelo seu mandato.`,
    "excluded-country": (v) => `O país «${value(v, "country")}» está excluído pelo seu mandato.`,
    "missing-sector": () => "Não existe setor registado para comparação.",
    "sector-match": (v) => `O setor «${value(v, "sector")}» corresponde ao seu mandato.`,
    "sector-mismatch": (v) => `O setor «${value(v, "sector")}» não corresponde aos seus alvos (${value(v, "targets")}).`,
    "missing-country": () => "Não existe país registado para comparação.",
    "country-match": (v) => `O país «${value(v, "country")}» corresponde ao seu mandato.`,
    "country-mismatch": (v) => `O país «${value(v, "country")}» não corresponde aos seus alvos (${value(v, "targets")}).`,
    "missing-capital": () => "Não existe necessidade de capital registada para comparação.",
    "capital-match": (v) => `O capital necessário (US$ ${value(v, "capitalM")} M) está dentro do seu intervalo.`,
    "capital-near": (v) => `O capital necessário (US$ ${value(v, "capitalM")} M) está a menos de 15% do seu intervalo.`,
    "capital-mismatch": (v) => `O capital necessário (US$ ${value(v, "capitalM")} M) está fora do seu intervalo.`,
    "missing-instrument": () => "Não existe instrumento registado para comparação.",
    "instrument-match": (v) => `O instrumento «${value(v, "instrument")}» corresponde às suas preferências.`,
    "instrument-mismatch": (v) => `O instrumento «${value(v, "instrument")}» não corresponde às suas preferências (${value(v, "targets")}).`,
    "esg-disclosed": () => "Existe informação ESG publicada que ainda requer análise.",
    "esg-missing": () => "Não existe evidência ESG pública estruturada.",
    "government-match": () => "Existe participação pública declarada, conforme exige o seu mandato.",
    "government-mismatch": () => "Não existe participação pública declarada, embora o seu mandato a exija.",
  },
  zh: {
    "excluded-sector": (v) => `“${value(v, "sector")}”行业被您的授权条件排除。`,
    "excluded-country": (v) => `“${value(v, "country")}”被您的授权条件排除。`,
    "missing-sector": () => "未记录可供比较的行业。",
    "sector-match": (v) => `“${value(v, "sector")}”行业符合您的授权条件。`,
    "sector-mismatch": (v) => `“${value(v, "sector")}”行业不符合您的目标（${value(v, "targets")}）。`,
    "missing-country": () => "未记录可供比较的国家。",
    "country-match": (v) => `“${value(v, "country")}”符合您的授权条件。`,
    "country-mismatch": (v) => `“${value(v, "country")}”不符合您的目标（${value(v, "targets")}）。`,
    "missing-capital": () => "未记录可供比较的融资需求。",
    "capital-match": (v) => `融资需求（${value(v, "capitalM")} 百万美元）在您的投资区间内。`,
    "capital-near": (v) => `融资需求（${value(v, "capitalM")} 百万美元）与您的投资区间相差不超过 15%。`,
    "capital-mismatch": (v) => `融资需求（${value(v, "capitalM")} 百万美元）不在您的投资区间内。`,
    "missing-instrument": () => "未记录可供比较的融资工具。",
    "instrument-match": (v) => `融资工具“${value(v, "instrument")}”符合您的偏好。`,
    "instrument-mismatch": (v) => `融资工具“${value(v, "instrument")}”不符合您的偏好（${value(v, "targets")}）。`,
    "esg-disclosed": () => "已披露 ESG 信息，但仍需投资者审查。",
    "esg-missing": () => "暂无结构化公开 ESG 证据。",
    "government-match": () => "已按您的授权条件披露政府参与。",
    "government-mismatch": () => "您的授权条件要求政府参与，但项目未作相关披露。",
  },
};

const panel: Record<Locale, {
  match: string; confidence: Record<MatchExplanation["confidence"], string>; configured: (value: number) => string;
  sources: string; calculated: string; edit: string; unavailable: string; unavailableBody: string; create: string;
  source: Record<MatchSource, string>;
}> = {
  en: { match: "Match against", confidence: { high: "high", medium: "medium", low: "low", excluded: "excluded" }, configured: (n) => `${n}% of mandate dimensions configured`, sources: "Sources", calculated: "Calculated", edit: "Edit this mandate", unavailable: "Mandate fit not calculated", unavailableBody: "Create an investment mandate to evaluate sector, geography, ticket size, instrument and stated ESG criteria against this opportunity.", create: "Create or select a mandate", source: { mandate: "Saved mandate (self-reported)", sector: "Listing sector (sponsor-provided)", country: "Listing country (sponsor-provided)", capital: "Capital required (sponsor-provided)", instrument: "Listing instrument (sponsor-provided)", esg: "ESG disclosure (sponsor-provided)", government: "Government-involvement disclosure (sponsor-provided)" } },
  fr: { match: "Correspondance avec", confidence: { high: "élevée", medium: "moyenne", low: "faible", excluded: "exclue" }, configured: (n) => `${n} % des dimensions du mandat renseignées`, sources: "Sources", calculated: "Calculé le", edit: "Modifier ce mandat", unavailable: "Correspondance non calculée", unavailableBody: "Créez un mandat d’investissement pour comparer le secteur, la géographie, le ticket, l’instrument et les critères ESG déclarés.", create: "Créer ou sélectionner un mandat", source: { mandate: "Mandat enregistré (autodéclaré)", sector: "Secteur de la fiche (fourni par le porteur)", country: "Pays de la fiche (fourni par le porteur)", capital: "Capital requis (fourni par le porteur)", instrument: "Instrument de la fiche (fourni par le porteur)", esg: "Information ESG (fournie par le porteur)", government: "Implication publique (fournie par le porteur)" } },
  es: { match: "Coincidencia con", confidence: { high: "alta", medium: "media", low: "baja", excluded: "excluida" }, configured: (n) => `${n} % de las dimensiones del mandato configuradas`, sources: "Fuentes", calculated: "Calculado el", edit: "Editar este mandato", unavailable: "Coincidencia no calculada", unavailableBody: "Cree un mandato de inversión para comparar sector, geografía, importe, instrumento y criterios ESG declarados.", create: "Crear o seleccionar un mandato", source: { mandate: "Mandato guardado (autodeclarado)", sector: "Sector de la ficha (promotor)", country: "País de la ficha (promotor)", capital: "Capital requerido (promotor)", instrument: "Instrumento de la ficha (promotor)", esg: "Divulgación ESG (promotor)", government: "Participación pública (promotor)" } },
  pt: { match: "Correspondência com", confidence: { high: "alta", medium: "média", low: "baixa", excluded: "excluída" }, configured: (n) => `${n}% das dimensões do mandato configuradas`, sources: "Fontes", calculated: "Calculado em", edit: "Editar este mandato", unavailable: "Correspondência não calculada", unavailableBody: "Crie um mandato de investimento para comparar setor, geografia, montante, instrumento e critérios ESG declarados.", create: "Criar ou selecionar um mandato", source: { mandate: "Mandato guardado (autodeclarado)", sector: "Setor da ficha (promotor)", country: "País da ficha (promotor)", capital: "Capital necessário (promotor)", instrument: "Instrumento da ficha (promotor)", esg: "Divulgação ESG (promotor)", government: "Participação pública (promotor)" } },
  zh: { match: "授权条件匹配", confidence: { high: "高", medium: "中", low: "低", excluded: "已排除" }, configured: (n) => `已配置 ${n}% 的授权条件维度`, sources: "来源", calculated: "计算日期", edit: "编辑此授权条件", unavailable: "尚未计算授权条件匹配", unavailableBody: "创建投资授权条件，以比较行业、地区、投资金额、融资工具及已披露的 ESG 条件。", create: "创建或选择授权条件", source: { mandate: "已保存的授权条件（自行申报）", sector: "项目行业（发起方提供）", country: "项目国家（发起方提供）", capital: "融资需求（发起方提供）", instrument: "融资工具（发起方提供）", esg: "ESG 披露（发起方提供）", government: "政府参与披露（发起方提供）" } },
};

export function matchReasonCopy(locale: Locale, reason: MatchReason): string {
  return reasons[locale][reason.code](reason.values ?? {});
}

const canonicalValues: Record<Locale, Record<string, string>> = {
  en: {},
  fr: { Agriculture: "Agriculture", Healthcare: "Santé", Water: "Eau", Mining: "Mines", Infrastructure: "Infrastructures", Energy: "Énergie", "DR Congo": "R. D. du Congo", Equity: "Fonds propres", Debt: "Dette", Grant: "Subvention", Guarantee: "Garantie", "Blended finance": "Financement mixte" },
  es: { Agriculture: "Agricultura", Healthcare: "Salud", Water: "Agua", Mining: "Minería", Infrastructure: "Infraestructura", Energy: "Energía", "DR Congo": "R. D. del Congo", Equity: "Capital", Debt: "Deuda", Grant: "Subvención", Guarantee: "Garantía", "Blended finance": "Financiación combinada" },
  pt: { Agriculture: "Agricultura", Healthcare: "Saúde", Water: "Água", Mining: "Mineração", Infrastructure: "Infraestrutura", Energy: "Energia", "DR Congo": "R. D. do Congo", Equity: "Capital próprio", Debt: "Dívida", Grant: "Subvenção", Guarantee: "Garantia", "Blended finance": "Financiamento misto" },
  zh: { Agriculture: "农业", Healthcare: "医疗健康", Water: "水务", Mining: "采矿", Infrastructure: "基础设施", Energy: "能源", "DR Congo": "刚果民主共和国", Equity: "股权", Debt: "债务", Grant: "赠款", Guarantee: "担保", "Blended finance": "混合融资" },
};

export function localizedMatchReason(
  locale: Locale,
  reason: MatchReason,
  listingLabels?: { sector?: string; country?: string; instrument?: string },
): string {
  const values = { ...(reason.values ?? {}) };
  if (typeof values.sector === "string") {
    values.sector = listingLabels?.sector ?? canonicalValues[locale][values.sector] ?? values.sector;
  }
  if (typeof values.country === "string") {
    values.country = listingLabels?.country ?? canonicalValues[locale][values.country] ?? values.country;
  }
  if (typeof values.instrument === "string" && listingLabels?.instrument) {
    values.instrument = listingLabels.instrument;
  }
  if (typeof values.targets === "string") {
    values.targets = values.targets
      .split(",")
      .map((item) => item.trim())
      .map((item) => canonicalValues[locale][item] ?? item)
      .join(", ");
  }
  return matchReasonCopy(locale, { ...reason, values });
}

export function matchPanelCopy(locale: Locale) {
  return panel[locale];
}
