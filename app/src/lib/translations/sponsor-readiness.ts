import type { Locale } from "@/lib/i18n";

type SponsorReadinessCopy = {
  standardEyebrow: string;
  standardTitle: string;
  standardBody: string;
  requiredInputs: string;
  areas: Array<{ title: string; body: string }>;
  engagementEyebrow: string;
  engagementTitle: string;
  engagementBody: string;
  engagement: Array<{ title: string; body: string }>;
  standardCta: string;
  modelCta: string;
  emailCta: string;
};

const copy: Record<Locale, SponsorReadinessCopy> = {
  en: {
    standardEyebrow: "Compass Disclosure Standard",
    standardTitle: "Know the publication threshold before preparation begins.",
    standardBody: "A screening-ready public file requires a named legal entity, a dated current capital ask, documented rights, a primary source no older than 18 months, at least 7 of 9 public fields and 4 of 5 risk categories. Files below that threshold remain in preparation.",
    requiredInputs: "Required input",
    areas: [
      { title: "Sponsor information", body: "Legal entity, ownership, accountable principals, track record and related-party relationships." },
      { title: "Project structure", body: "Project company, location, development scope, delivery model and counterparties." },
      { title: "Market case", body: "Demand evidence, customers, pricing assumptions, competition and route to market." },
      { title: "Technical readiness", body: "Design basis, studies, engineering status, delivery plan and technical dependencies." },
      { title: "Financial model", body: "Dated capital ask, proposed instrument, uses of funds, sponsor contribution and sensitivities." },
      { title: "Legal and regulatory position", body: "Entity records, approvals, licences, disputes and applicable regulatory requirements." },
      { title: "Land and permits", body: "Title or access rights, permit status, validity dates and unresolved conditions." },
      { title: "ESG and community", body: "Environmental and social studies, community engagement, safeguards and impact evidence." },
      { title: "Risk disclosure", body: "Material legal, technical, financial, market and execution risks with mitigations." },
      { title: "Supporting documents", body: "Dated primary sources that support each material public statement." },
    ],
    engagementEyebrow: "Scope before engagement",
    engagementTitle: "Preparation effort depends on the evidence already available.",
    engagementBody: "DESCO does not publish a fixed duration or fee before reviewing the file. Scope, deliverables, timing and fees are confirmed in writing after an initial gap assessment.",
    engagement: [
      { title: "What the sponsor supplies", body: "Corporate records, current project evidence, authorised contacts and permission to use each public statement." },
      { title: "What DESCO prepares", body: "A gap register, structured public fields, source references, risk disclosure and a controlled-document plan." },
      { title: "What is agreed first", body: "Named deliverables, sponsor responsibilities, review timetable, publication authority and fees." },
    ],
    standardCta: "Review the disclosure standard",
    modelCta: "View an illustrative model file",
    emailCta: "Email DESCO about project preparation",
  },
  fr: {
    standardEyebrow: "Norme de divulgation Compass", standardTitle: "Connaissez le seuil de publication avant de commencer la préparation.", standardBody: "Un dossier public prêt pour la présélection exige une entité juridique nommée, un besoin actuel en capital daté, des droits documentés, une source primaire de moins de 18 mois, au moins 7 champs publics sur 9 et 4 catégories de risques sur 5. En dessous de ce seuil, le dossier reste en préparation.", requiredInputs: "Élément requis",
    areas: [
      { title: "Informations sur le porteur", body: "Entité juridique, actionnariat, responsables, historique et relations avec des parties liées." }, { title: "Structure du projet", body: "Société de projet, localisation, périmètre, modèle de réalisation et contreparties." }, { title: "Analyse de marché", body: "Preuves de demande, clients, hypothèses de prix, concurrence et accès au marché." }, { title: "Maturité technique", body: "Base de conception, études, ingénierie, plan de réalisation et dépendances techniques." }, { title: "Modèle financier", body: "Besoin en capital daté, instrument proposé, utilisation des fonds, apport du porteur et sensibilités." }, { title: "Position juridique et réglementaire", body: "Documents de l’entité, autorisations, licences, litiges et exigences applicables." }, { title: "Terrains et permis", body: "Titres ou droits d’accès, statut des permis, dates de validité et conditions non résolues." }, { title: "ESG et communautés", body: "Études environnementales et sociales, concertation, garanties et preuves d’impact." }, { title: "Divulgation des risques", body: "Risques juridiques, techniques, financiers, commerciaux et d’exécution, avec mesures d’atténuation." }, { title: "Documents justificatifs", body: "Sources primaires datées étayant chaque déclaration publique importante." },
    ],
    engagementEyebrow: "Périmètre avant engagement", engagementTitle: "L’effort de préparation dépend des preuves déjà disponibles.", engagementBody: "DESCO ne publie ni durée ni tarif fixe avant l’examen du dossier. Le périmètre, les livrables, le calendrier et les honoraires sont confirmés par écrit après une première analyse des lacunes.", engagement: [{ title: "Éléments fournis par le porteur", body: "Documents de l’entité, preuves actuelles, contacts autorisés et permission d’utiliser chaque déclaration publique." }, { title: "Éléments préparés par DESCO", body: "Registre des lacunes, champs publics structurés, références des sources, risques et plan documentaire contrôlé." }, { title: "Éléments convenus en amont", body: "Livrables, responsabilités, calendrier d’examen, autorité de publication et honoraires." }], standardCta: "Examiner la norme de divulgation", modelCta: "Voir un dossier modèle illustratif", emailCta: "Écrire à DESCO sur la préparation du projet",
  },
  es: {
    standardEyebrow: "Norma de divulgación Compass", standardTitle: "Conozca el umbral de publicación antes de iniciar la preparación.", standardBody: "Un expediente público listo para evaluación exige una entidad jurídica identificada, una necesidad actual de capital fechada, derechos documentados, una fuente primaria de menos de 18 meses, al menos 7 de 9 campos públicos y 4 de 5 categorías de riesgo. Por debajo de ese umbral, el expediente permanece en preparación.", requiredInputs: "Dato requerido",
    areas: [{ title: "Información del promotor", body: "Entidad jurídica, propiedad, responsables, trayectoria y relaciones con partes vinculadas." }, { title: "Estructura del proyecto", body: "Sociedad del proyecto, ubicación, alcance, modelo de ejecución y contrapartes." }, { title: "Análisis de mercado", body: "Evidencia de demanda, clientes, precios, competencia y acceso al mercado." }, { title: "Preparación técnica", body: "Base de diseño, estudios, ingeniería, plan de ejecución y dependencias técnicas." }, { title: "Modelo financiero", body: "Necesidad de capital fechada, instrumento, uso de fondos, aportación del promotor y sensibilidades." }, { title: "Situación jurídica y regulatoria", body: "Registros, aprobaciones, licencias, litigios y requisitos aplicables." }, { title: "Terrenos y permisos", body: "Títulos o derechos de acceso, permisos, fechas de validez y condiciones pendientes." }, { title: "ESG y comunidad", body: "Estudios ambientales y sociales, participación comunitaria, salvaguardas y evidencia de impacto." }, { title: "Divulgación de riesgos", body: "Riesgos jurídicos, técnicos, financieros, comerciales y de ejecución, con mitigaciones." }, { title: "Documentos justificativos", body: "Fuentes primarias fechadas para cada declaración pública material." }],
    engagementEyebrow: "Alcance previo", engagementTitle: "El esfuerzo depende de la evidencia ya disponible.", engagementBody: "DESCO no publica un plazo o precio fijo antes de revisar el expediente. El alcance, los entregables, el calendario y los honorarios se confirman por escrito tras una evaluación inicial de brechas.", engagement: [{ title: "Qué aporta el promotor", body: "Registros corporativos, evidencia actual, contactos autorizados y permiso para cada declaración pública." }, { title: "Qué prepara DESCO", body: "Registro de brechas, campos públicos, fuentes, riesgos y plan de documentos controlados." }, { title: "Qué se acuerda primero", body: "Entregables, responsabilidades, calendario, autoridad de publicación y honorarios." }], standardCta: "Revisar la norma de divulgación", modelCta: "Ver un expediente modelo ilustrativo", emailCta: "Escribir a DESCO sobre la preparación",
  },
  pt: {
    standardEyebrow: "Norma de divulgação Compass", standardTitle: "Conheça o limiar de publicação antes de iniciar a preparação.", standardBody: "Um dossiê público pronto para análise exige uma entidade jurídica identificada, uma necessidade atual de capital datada, direitos documentados, uma fonte primária com menos de 18 meses, pelo menos 7 de 9 campos públicos e 4 de 5 categorias de risco. Abaixo desse limiar, o dossiê permanece em preparação.", requiredInputs: "Elemento obrigatório",
    areas: [{ title: "Informação do promotor", body: "Entidade jurídica, propriedade, responsáveis, histórico e relações com partes relacionadas." }, { title: "Estrutura do projeto", body: "Sociedade do projeto, localização, âmbito, modelo de execução e contrapartes." }, { title: "Análise de mercado", body: "Evidência de procura, clientes, preços, concorrência e acesso ao mercado." }, { title: "Preparação técnica", body: "Base de projeto, estudos, engenharia, plano de execução e dependências técnicas." }, { title: "Modelo financeiro", body: "Necessidade de capital datada, instrumento, utilização dos fundos, contribuição do promotor e sensibilidades." }, { title: "Situação jurídica e regulamentar", body: "Registos, aprovações, licenças, litígios e requisitos aplicáveis." }, { title: "Terrenos e licenças", body: "Títulos ou direitos de acesso, licenças, validades e condições pendentes." }, { title: "ESG e comunidade", body: "Estudos ambientais e sociais, participação comunitária, salvaguardas e evidência de impacto." }, { title: "Divulgação de riscos", body: "Riscos jurídicos, técnicos, financeiros, comerciais e de execução, com medidas de mitigação." }, { title: "Documentos de suporte", body: "Fontes primárias datadas para cada afirmação pública material." }],
    engagementEyebrow: "Âmbito prévio", engagementTitle: "O esforço depende da evidência já disponível.", engagementBody: "A DESCO não publica prazo ou preço fixo antes de analisar o dossiê. O âmbito, os entregáveis, o calendário e os honorários são confirmados por escrito após uma avaliação inicial de lacunas.", engagement: [{ title: "O que o promotor fornece", body: "Registos societários, evidência atual, contactos autorizados e permissão para cada afirmação pública." }, { title: "O que a DESCO prepara", body: "Registo de lacunas, campos públicos, fontes, riscos e plano de documentos controlados." }, { title: "O que é acordado primeiro", body: "Entregáveis, responsabilidades, calendário, autoridade de publicação e honorários." }], standardCta: "Rever a norma de divulgação", modelCta: "Ver um dossiê modelo ilustrativo", emailCta: "Escrever à DESCO sobre a preparação",
  },
  zh: {
    standardEyebrow: "Compass 披露标准", standardTitle: "开始准备前，先了解发布门槛。", standardBody: "可进入筛选的公开档案须列明法律实体、注明日期的当前融资需求、已记录的权利状态、18 个月内的主要来源、至少 7/9 个公开字段及 4/5 个风险类别。未达到门槛的档案保持“准备中”状态。", requiredInputs: "必需资料",
    areas: [{ title: "发起方信息", body: "法律实体、所有权、责任人、业绩记录及关联方关系。" }, { title: "项目结构", body: "项目公司、地点、开发范围、交付模式及交易对手。" }, { title: "市场依据", body: "需求证据、客户、定价假设、竞争及市场路径。" }, { title: "技术准备度", body: "设计依据、研究、工程状态、实施计划及技术依赖。" }, { title: "财务模型", body: "注明日期的融资需求、拟议工具、资金用途、发起方投入及敏感性。" }, { title: "法律与监管状况", body: "实体记录、批准、许可、争议及适用监管要求。" }, { title: "土地与许可", body: "产权或使用权、许可状态、有效期及未决条件。" }, { title: "ESG 与社区", body: "环境和社会研究、社区参与、保障措施及影响证据。" }, { title: "风险披露", body: "重大法律、技术、财务、市场及执行风险与缓解措施。" }, { title: "支持文件", body: "支持每项重大公开陈述的注明日期的主要来源。" }],
    engagementEyebrow: "先确定工作范围", engagementTitle: "准备工作取决于现有证据。", engagementBody: "DESCO 在审阅档案前不公布固定周期或费用。初步缺口评估后，双方以书面方式确认范围、交付成果、时间表及费用。", engagement: [{ title: "发起方提供", body: "公司记录、当前项目证据、授权联系人及每项公开陈述的使用许可。" }, { title: "DESCO 准备", body: "缺口清单、结构化公开字段、来源引用、风险披露及受控文件计划。" }, { title: "事先约定", body: "交付成果、发起方责任、审查时间表、发布权限及费用。" }], standardCta: "查看披露标准", modelCta: "查看说明性示例档案", emailCta: "就项目准备联系 DESCO",
  },
};

export function sponsorReadinessCopy(locale: Locale): SponsorReadinessCopy {
  return copy[locale];
}
