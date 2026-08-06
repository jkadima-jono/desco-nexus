import type { Locale } from "@/lib/i18n";

type EntityDisclosureCopy = {
  eyebrow: string;
  title: string;
  body: string;
  fields: Array<{ label: string; value: string }>;
  recordTitle: string;
  record: string[];
  note: string;
};

const copy: Record<Locale, EntityDisclosureCopy> = {
  en: {
    eyebrow: "DESCO self-disclosure",
    title: "We apply the same missing-information convention to DESCO Global.",
    body: "Compass requires project files to name the legal entity, state a dated capital ask, document rights and cite a current source. The corporate facts below remain visible when no approved public evidence has been supplied.",
    fields: [
      { label: "Legal entity", value: "Not publicly disclosed" },
      { label: "Registration number", value: "Not publicly disclosed" },
      { label: "Domicile", value: "Not publicly disclosed" },
      { label: "Date of incorporation", value: "Not publicly disclosed" },
      { label: "Directors and accountable principal", value: "Not publicly disclosed" },
      { label: "Beneficial ownership", value: "Not publicly disclosed" },
    ],
    recordTitle: "Public operating record",
    record: ["Completed transactions: none disclosed on this site", "Capital raised: none disclosed on this site", "Assets under management: none disclosed on this site", "Fees collected: none disclosed on this site", "Regulatory authorisation: none claimed on this site"],
    note: "These statements describe this site’s public evidence record. They are not a company-registry search or independent verification.",
  },
  fr: {
    eyebrow: "Auto-divulgation DESCO",
    title: "Nous appliquons à DESCO Global la même convention sur les informations manquantes.",
    body: "Compass exige que les dossiers nomment l’entité juridique, indiquent un besoin actuel en capital daté, documentent les droits et citent une source récente. Les faits non étayés restent visibles ci-dessous.",
    fields: [{ label: "Entité juridique", value: "Non communiqué publiquement" }, { label: "Numéro d’immatriculation", value: "Non communiqué publiquement" }, { label: "Domicile", value: "Non communiqué publiquement" }, { label: "Date de constitution", value: "Non communiqué publiquement" }, { label: "Administrateurs et responsable", value: "Non communiqué publiquement" }, { label: "Bénéficiaires effectifs", value: "Non communiqué publiquement" }],
    recordTitle: "Historique opérationnel public",
    record: ["Transactions réalisées : aucune communiquée sur ce site", "Capitaux levés : aucun communiqué sur ce site", "Actifs sous gestion : aucun communiqué sur ce site", "Honoraires perçus : aucun communiqué sur ce site", "Autorisation réglementaire : aucune revendiquée sur ce site"],
    note: "Ces mentions décrivent les preuves publiques de ce site. Elles ne constituent ni une recherche au registre ni une vérification indépendante.",
  },
  es: {
    eyebrow: "Autodivulgación de DESCO",
    title: "Aplicamos a DESCO Global la misma convención sobre información ausente.",
    body: "Compass exige que los expedientes identifiquen la entidad jurídica, indiquen una necesidad actual de capital fechada, documenten los derechos y citen una fuente reciente. Los datos sin evidencia pública permanecen visibles.",
    fields: [{ label: "Entidad jurídica", value: "No divulgado públicamente" }, { label: "Número de registro", value: "No divulgado públicamente" }, { label: "Domicilio", value: "No divulgado públicamente" }, { label: "Fecha de constitución", value: "No divulgado públicamente" }, { label: "Directores y responsable", value: "No divulgado públicamente" }, { label: "Titularidad real", value: "No divulgado públicamente" }],
    recordTitle: "Historial operativo público",
    record: ["Transacciones completadas: ninguna divulgada en este sitio", "Capital captado: ninguno divulgado en este sitio", "Activos bajo gestión: ninguno divulgado en este sitio", "Honorarios cobrados: ninguno divulgado en este sitio", "Autorización regulatoria: ninguna declarada en este sitio"],
    note: "Estas menciones describen el registro público de este sitio. No son una consulta registral ni una verificación independiente.",
  },
  pt: {
    eyebrow: "Autodivulgação da DESCO",
    title: "Aplicamos à DESCO Global a mesma convenção sobre informação em falta.",
    body: "A Compass exige que os dossiês identifiquem a entidade jurídica, indiquem uma necessidade atual de capital datada, documentem os direitos e citem uma fonte recente. Os factos sem prova pública permanecem visíveis.",
    fields: [{ label: "Entidade jurídica", value: "Não divulgado publicamente" }, { label: "Número de registo", value: "Não divulgado publicamente" }, { label: "Domicílio", value: "Não divulgado publicamente" }, { label: "Data de constituição", value: "Não divulgado publicamente" }, { label: "Administradores e responsável", value: "Não divulgado publicamente" }, { label: "Beneficiários efetivos", value: "Não divulgado publicamente" }],
    recordTitle: "Histórico operacional público",
    record: ["Transações concluídas: nenhuma divulgada neste site", "Capital angariado: nenhum divulgado neste site", "Ativos sob gestão: nenhum divulgado neste site", "Honorários cobrados: nenhum divulgado neste site", "Autorização regulamentar: nenhuma alegada neste site"],
    note: "Estas menções descrevem o registo público deste site. Não constituem pesquisa registral nem verificação independente.",
  },
  zh: {
    eyebrow: "DESCO 自我披露",
    title: "我们对 DESCO Global 采用相同的缺失信息标示规则。",
    body: "Compass 要求项目文件列明法律实体、注明日期的当前融资需求、记录权利状态并引用近期来源。缺少获批公开证据的公司事实继续明确显示。",
    fields: [{ label: "法律实体", value: "尚未公开披露" }, { label: "注册号", value: "尚未公开披露" }, { label: "注册地", value: "尚未公开披露" }, { label: "成立日期", value: "尚未公开披露" }, { label: "董事及责任人", value: "尚未公开披露" }, { label: "实际受益所有权", value: "尚未公开披露" }],
    recordTitle: "公开运营记录",
    record: ["已完成交易：本网站未披露", "已募集资本：本网站未披露", "管理资产：本网站未披露", "已收费用：本网站未披露", "监管授权：本网站未作相关声明"],
    note: "以上内容仅描述本网站的公开证据记录，不构成公司注册查询或独立核验。",
  },
};

export function entityDisclosureCopy(locale: Locale): EntityDisclosureCopy {
  return copy[locale];
}
