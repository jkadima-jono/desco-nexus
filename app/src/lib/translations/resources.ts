import type { Locale } from "@/lib/i18n";

type ResourceCopy = {
  metadataTitle: string;
  metadataDescription: string;
  nav: string;
  eyebrow: string;
  title: string;
  body: string;
  updated: string;
  investorTitle: string;
  investorBody: string;
  investorItems: string[];
  sponsorTitle: string;
  sponsorBody: string;
  sponsorItems: string[];
  publicTitle: string;
  publicBody: string;
  publicItems: string[];
  controlledTitle: string;
  controlledBody: string;
  controlledItems: string[];
  caution: string;
  review: string;
  discuss: string;
  print: string;
};

const en: ResourceCopy = {
  metadataTitle: "Investor and sponsor resources — DESCO Compass",
  metadataDescription: "Practical checklists for screening public opportunities and preparing project information for controlled review.",
  nav: "Resources",
  eyebrow: "Screening resources",
  title: "Practical checks before deeper engagement.",
  body: "These checklists explain the information DESCO Compass uses to support public screening and controlled due diligence. They do not replace professional advice or independent verification.",
  updated: "Methodology summary",
  investorTitle: "Investor screening checklist",
  investorBody: "Use the public record to decide whether an opportunity merits further diligence.",
  investorItems: ["Confirm sponsor identity and related-party disclosure", "Distinguish current capital sought from total project cost", "Review stage, instrument, geography and mandate fit", "Read the source date, provenance and disclosure status", "Identify missing financial, legal, technical and ESG information", "Review principal risk categories before requesting access"],
  sponsorTitle: "Project-readiness checklist",
  sponsorBody: "Prepare a coherent public case before inviting restricted review.",
  sponsorItems: ["Identify the sponsoring and project entities", "Define the project scope, stage and current capital requirement", "Explain the proposed instrument and use of funds", "Provide dated sources for material facts", "Disclose title, permit, community, environmental and execution risks", "Separate public information from confidential supporting evidence"],
  publicTitle: "Suitable for public screening",
  publicBody: "Information may be published only after the appropriate authority and disclosure review.",
  publicItems: ["Project thesis and location", "Named sponsor and relationship disclosure", "Current capital requirement or a clear not-disclosed label", "Stage, instrument and source date", "Principal risks and missing fields", "Disclosure and review status"],
  controlledTitle: "Keep within controlled review",
  controlledBody: "Access remains subject to authentication, approval and project-specific permission.",
  controlledItems: ["Detailed financial models and sensitivities", "Technical, title and permit records", "Counterparty and commercial agreements", "Confidential ownership or personal information", "Negotiation and transaction documents", "Restricted sponsor evidence"],
  caution: "A DESCO review addresses structure, completeness and internal consistency. It is not an investment recommendation, legal approval or independent verification.",
  review: "Review public opportunities",
  discuss: "Discuss project readiness",
  print: "Print or save as PDF",
};

const fr: ResourceCopy = {
  metadataTitle: "Ressources pour investisseurs et porteurs — DESCO Compass",
  metadataDescription: "Listes pratiques pour examiner les opportunités publiques et préparer les informations d’un projet pour une revue contrôlée.",
  nav: "Ressources", eyebrow: "Ressources d’examen", title: "Vérifications pratiques avant un examen approfondi.",
  body: "Ces listes expliquent les informations utilisées par DESCO Compass pour l’examen public et la diligence contrôlée. Elles ne remplacent ni les conseils professionnels ni une vérification indépendante.", updated: "Résumé de la méthodologie",
  investorTitle: "Liste d’examen investisseur", investorBody: "Utilisez les informations publiques pour décider si une opportunité mérite une diligence complémentaire.",
  investorItems: ["Confirmer l’identité du porteur et les liens avec DESCO", "Distinguer le capital actuellement recherché du coût total du projet", "Examiner le stade, l’instrument, la géographie et l’adéquation au mandat", "Lire la date, la provenance et le statut de divulgation de la source", "Identifier les informations financières, juridiques, techniques et ESG manquantes", "Examiner les principales catégories de risque avant de demander un accès"],
  sponsorTitle: "Liste de préparation du projet", sponsorBody: "Préparez un dossier public cohérent avant d’ouvrir un examen restreint.",
  sponsorItems: ["Identifier les entités porteuse et de projet", "Définir le périmètre, le stade et le besoin actuel en capital", "Expliquer l’instrument proposé et l’utilisation des fonds", "Fournir des sources datées pour les faits importants", "Divulguer les risques liés aux titres, permis, communautés, environnement et exécution", "Séparer les informations publiques des preuves confidentielles"],
  publicTitle: "Adapté à l’examen public", publicBody: "La publication exige l’autorité appropriée et un examen de la divulgation.",
  publicItems: ["Thèse et localisation du projet", "Porteur nommé et divulgation des liens", "Besoin actuel en capital ou mention claire de non-divulgation", "Stade, instrument et date de source", "Risques principaux et champs manquants", "Statut de divulgation et d’examen"],
  controlledTitle: "À conserver dans l’examen contrôlé", controlledBody: "L’accès exige une authentification, une approbation et une autorisation propre au projet.",
  controlledItems: ["Modèles financiers détaillés et sensibilités", "Dossiers techniques, titres et permis", "Contreparties et accords commerciaux", "Informations confidentielles sur la propriété ou les personnes", "Documents de négociation et de transaction", "Preuves confidentielles du porteur"],
  caution: "La revue DESCO porte sur la structure, l’exhaustivité et la cohérence interne. Elle ne constitue ni une recommandation d’investissement, ni une approbation juridique, ni une vérification indépendante.", review: "Examiner les opportunités publiques", discuss: "Discuter de la préparation du projet", print: "Imprimer ou enregistrer en PDF",
};

const es: ResourceCopy = {
  ...en,
  metadataTitle: "Recursos para inversores y promotores — DESCO Compass", metadataDescription: "Listas prácticas para evaluar oportunidades públicas y preparar información de proyectos para una revisión controlada.", nav: "Recursos", eyebrow: "Recursos de evaluación", title: "Comprobaciones prácticas antes de una revisión más profunda.", body: "Estas listas explican la información que DESCO Compass utiliza para la evaluación pública y la diligencia controlada. No sustituyen el asesoramiento profesional ni la verificación independiente.", updated: "Resumen de la metodología", investorTitle: "Lista de evaluación del inversor", investorBody: "Utilice la información pública para decidir si una oportunidad merece más diligencia.",
  investorItems: ["Confirmar la identidad del promotor y la divulgación de partes vinculadas", "Distinguir el capital solicitado actualmente del coste total del proyecto", "Revisar etapa, instrumento, geografía y ajuste al mandato", "Leer la fecha, procedencia y estado de divulgación de la fuente", "Identificar información financiera, jurídica, técnica y ESG ausente", "Revisar las principales categorías de riesgo antes de solicitar acceso"],
  sponsorTitle: "Lista de preparación del proyecto", sponsorBody: "Prepare un caso público coherente antes de solicitar una revisión restringida.",
  sponsorItems: ["Identificar las entidades promotora y del proyecto", "Definir alcance, etapa y necesidad actual de capital", "Explicar el instrumento propuesto y el uso de fondos", "Aportar fuentes fechadas para los hechos materiales", "Divulgar riesgos de títulos, permisos, comunidades, medioambiente y ejecución", "Separar la información pública de la evidencia confidencial"],
  publicTitle: "Apto para evaluación pública", publicBody: "La información solo puede publicarse tras la autorización y revisión de divulgación correspondientes.", publicItems: ["Tesis y ubicación del proyecto", "Promotor identificado y divulgación de relaciones", "Necesidad actual de capital o indicación clara de no divulgación", "Etapa, instrumento y fecha de fuente", "Riesgos principales y campos ausentes", "Estado de divulgación y revisión"],
  controlledTitle: "Mantener en revisión controlada", controlledBody: "El acceso requiere autenticación, aprobación y permiso específico del proyecto.", controlledItems: ["Modelos financieros detallados y sensibilidades", "Registros técnicos, títulos y permisos", "Contrapartes y acuerdos comerciales", "Información confidencial de propiedad o personal", "Documentos de negociación y transacción", "Evidencia restringida del promotor"], caution: "La revisión de DESCO aborda estructura, integridad y coherencia interna. No es una recomendación de inversión, aprobación legal ni verificación independiente.", review: "Revisar oportunidades públicas", discuss: "Consultar la preparación del proyecto", print: "Imprimir o guardar como PDF",
};

const pt: ResourceCopy = {
  ...en,
  metadataTitle: "Recursos para investidores e promotores — DESCO Compass", metadataDescription: "Listas práticas para avaliar oportunidades públicas e preparar informação de projetos para análise controlada.", nav: "Recursos", eyebrow: "Recursos de análise", title: "Verificações práticas antes de uma análise aprofundada.", body: "Estas listas explicam a informação que a DESCO Compass utiliza na análise pública e na diligência controlada. Não substituem aconselhamento profissional nem verificação independente.", updated: "Resumo da metodologia", investorTitle: "Lista de análise do investidor", investorBody: "Use o registo público para decidir se uma oportunidade justifica diligência adicional.", investorItems: ["Confirmar a identidade do promotor e a divulgação de partes relacionadas", "Distinguir o capital atualmente procurado do custo total do projeto", "Analisar fase, instrumento, geografia e adequação ao mandato", "Ler a data, proveniência e estado de divulgação da fonte", "Identificar informação financeira, jurídica, técnica e ESG em falta", "Analisar as principais categorias de risco antes de solicitar acesso"], sponsorTitle: "Lista de preparação do projeto", sponsorBody: "Prepare um caso público coerente antes de solicitar uma análise restrita.", sponsorItems: ["Identificar as entidades promotora e do projeto", "Definir âmbito, fase e necessidade atual de capital", "Explicar o instrumento proposto e a utilização dos fundos", "Fornecer fontes datadas para factos materiais", "Divulgar riscos de títulos, licenças, comunidades, ambiente e execução", "Separar informação pública de evidência confidencial"], publicTitle: "Adequado para análise pública", publicBody: "A informação só pode ser publicada após a devida autorização e análise da divulgação.", publicItems: ["Tese e localização do projeto", "Promotor identificado e divulgação de relações", "Necessidade atual de capital ou indicação clara de não divulgação", "Fase, instrumento e data da fonte", "Riscos principais e campos em falta", "Estado de divulgação e análise"], controlledTitle: "Manter na análise controlada", controlledBody: "O acesso exige autenticação, aprovação e permissão específica do projeto.", controlledItems: ["Modelos financeiros detalhados e sensibilidades", "Registos técnicos, títulos e licenças", "Contrapartes e acordos comerciais", "Informação confidencial de propriedade ou pessoal", "Documentos de negociação e transação", "Evidência restrita do promotor"], caution: "A análise da DESCO abrange estrutura, completude e coerência interna. Não constitui recomendação de investimento, aprovação jurídica ou verificação independente.", review: "Analisar oportunidades públicas", discuss: "Discutir a preparação do projeto", print: "Imprimir ou guardar em PDF",
};

const zh: ResourceCopy = {
  ...en,
  metadataTitle: "投资者与项目发起方资源 — DESCO Compass", metadataDescription: "用于筛选公开投资机会及准备受控项目审查资料的实用清单。", nav: "资源", eyebrow: "筛选资源", title: "进入深入审查前的实用核对。", body: "这些清单说明 DESCO Compass 用于公开筛选和受控尽调的信息。它们不能替代专业意见或独立核验。", updated: "方法摘要", investorTitle: "投资者筛选清单", investorBody: "利用公开资料判断某项机会是否值得进一步尽调。", investorItems: ["确认项目发起方身份及关联方披露", "区分当前融资需求与项目总成本", "审查阶段、工具、地区及投资授权匹配情况", "查看来源日期、来源说明及披露状态", "识别缺失的财务、法律、技术及 ESG 信息", "申请访问前审查主要风险类别"], sponsorTitle: "项目准备度清单", sponsorBody: "在邀请受限审查前，先准备一致的公开项目说明。", sponsorItems: ["识别项目发起实体和项目实体", "界定项目范围、阶段及当前融资需求", "说明拟议融资工具及资金用途", "为重大事实提供注明日期的来源", "披露权属、许可、社区、环境及执行风险", "区分公开信息与保密支持证据"], publicTitle: "适合公开筛选", publicBody: "信息须经适当授权和披露审查后方可发布。", publicItems: ["项目逻辑和地点", "项目发起方名称及关系披露", "当前融资需求或明确的未披露标签", "阶段、融资工具及来源日期", "主要风险及缺失字段", "披露和审查状态"], controlledTitle: "仅限受控审查", controlledBody: "访问须经过身份验证、审批及项目特定授权。", controlledItems: ["详细财务模型及敏感性分析", "技术、权属及许可记录", "交易对手及商业协议", "保密所有权或个人信息", "谈判及交易文件", "受限的项目发起方证据"], caution: "DESCO 的审查仅涉及结构、完整性和内部一致性，不构成投资建议、法律批准或独立核验。", review: "查看公开机会", discuss: "讨论项目准备度", print: "打印或保存为 PDF",
};

const copies: Record<Locale, ResourceCopy> = { en, fr, es, pt, zh };
export function resourceCopy(locale: Locale) { return copies[locale]; }
