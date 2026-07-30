import type { Locale } from "@/lib/i18n";

const en = {
  metadataTitle: "Submit a project — DESCO Compass",
  metadataDescription: "Present a project for structured DESCO review.",
  pageTitle: "Submit a project",
  pageIntro: "Complete the sections below, then submit the project for DESCO review. A reviewer checks completeness and internal consistency before publication. Submission does not create an automatic listing.",
  loading: "Loading your submissions…",
  loadError: "We could not load your submissions. Retry.",
  retry: "Retry",
  untitled: "Untitled project",
  complete: (value: number) => `${value}% complete`,
  reviewerNote: "Reviewer note",
  published: "View published listing",
  edit: "Edit",
  submit: "Submit for review",
  withdraw: "Withdraw",
  delete: "Delete",
  newProject: "New project submission",
  editTitle: "Edit submission",
  newTitle: "New submission",
  select: "Select",
  optional: "optional",
  documentsOptional: "optional; document upload becomes available after approval",
  required: "Required to submit for review",
  saving: "Saving…",
  save: "Save draft",
  cancel: "Cancel",
  deleteConfirm: "Delete this draft? This cannot be undone.",
  saveError: "The draft could not be saved. Review the form and retry.",
  submitError: "The submission could not be sent for review.",
  withdrawError: "The submission could not be withdrawn. Retry.",
  deleteError: "The draft could not be deleted. Retry.",
  networkError: "The service could not be reached. Check your connection and retry.",
  labels: {
    orgName: "Organization", title: "Project title", ownershipStatement: "Ownership statement",
    country: "Country", region: "Region", sector: "Sector", stage: "Development stage",
    raiseUsd: "Capital required ($)", fundingSecuredUsd: "Funding secured ($)",
    sponsorContributionUsd: "Sponsor contribution ($)", instrument: "Instrument",
    useOfFunds: "Use of funds", revenueModel: "Revenue model", financialSummary: "Financial information",
    permitsStatus: "Permits status", landRights: "Land / operating rights",
    governmentInvolvement: "Government involvement", governmentBacked: "This project has disclosed, evidenced government backing",
    esgSummary: "ESG information", keyRisks: "Key risks", managementTeam: "Management team",
    advisors: "Advisors", documentsNote: "Documents you can provide", timetable: "Target timetable",
  },
  placeholders: {
    ownership: "Describe your organization’s legal ownership or development rights over this project",
    stage: "For example: feasibility documentation available; evidence pending",
    financial: "Historical and/or projected figures, clearly labelled",
  },
  statuses: {
    draft: "Draft", submitted: "Submitted", under_review: "Under review",
    changes_requested: "Changes requested", approved: "Approved", withdrawn: "Withdrawn",
  } as Record<string, string>,
};

type SubmissionCopy = typeof en;

const fr: SubmissionCopy = {
  ...en, metadataTitle: "Soumettre un projet — DESCO Compass", metadataDescription: "Présentez un projet pour un examen structuré par DESCO.",
  pageTitle: "Soumettre un projet", pageIntro: "Complétez les sections ci-dessous, puis soumettez le projet à l’examen DESCO. Une personne chargée de l’examen contrôle l’exhaustivité et la cohérence interne avant publication. La soumission ne crée pas automatiquement une annonce.",
  loading: "Chargement de vos soumissions…", loadError: "Impossible de charger vos soumissions. Réessayez.", retry: "Réessayer", untitled: "Projet sans titre",
  complete: (v) => `${v} % complété`, reviewerNote: "Note d’examen", published: "Voir l’annonce publiée", edit: "Modifier", submit: "Soumettre à l’examen", withdraw: "Retirer", delete: "Supprimer", newProject: "Nouvelle soumission de projet", editTitle: "Modifier la soumission", newTitle: "Nouvelle soumission", select: "Sélectionner", optional: "facultatif", documentsOptional: "facultatif ; le dépôt de documents est disponible après approbation", required: "Requis pour soumettre à l’examen", saving: "Enregistrement…", save: "Enregistrer le brouillon", cancel: "Annuler", deleteConfirm: "Supprimer ce brouillon ? Cette action est irréversible.", saveError: "Impossible d’enregistrer le brouillon. Vérifiez le formulaire et réessayez.", submitError: "Impossible de soumettre le projet à l’examen.", withdrawError: "Impossible de retirer la soumission. Réessayez.", deleteError: "Impossible de supprimer le brouillon. Réessayez.", networkError: "Service inaccessible. Vérifiez votre connexion et réessayez.",
  labels: { orgName: "Organisation", title: "Titre du projet", ownershipStatement: "Déclaration de propriété", country: "Pays", region: "Région", sector: "Secteur", stage: "Stade de développement", raiseUsd: "Capital requis ($)", fundingSecuredUsd: "Financement obtenu ($)", sponsorContributionUsd: "Contribution du porteur ($)", instrument: "Instrument", useOfFunds: "Utilisation des fonds", revenueModel: "Modèle de revenus", financialSummary: "Informations financières", permitsStatus: "État des permis", landRights: "Droits fonciers / d’exploitation", governmentInvolvement: "Implication publique", governmentBacked: "Ce projet déclare un soutien public documenté", esgSummary: "Informations ESG", keyRisks: "Risques principaux", managementTeam: "Équipe de direction", advisors: "Conseillers", documentsNote: "Documents disponibles", timetable: "Calendrier cible" },
  placeholders: { ownership: "Décrivez la propriété juridique ou les droits de développement de votre organisation sur ce projet", stage: "Exemple : documentation de faisabilité disponible ; preuves en attente", financial: "Données historiques et/ou prévisionnelles, clairement identifiées" },
  statuses: { draft: "Brouillon", submitted: "Soumis", under_review: "En cours d’examen", changes_requested: "Modifications demandées", approved: "Approuvé", withdrawn: "Retiré" },
};

const es: SubmissionCopy = {
  ...en, metadataTitle: "Presentar un proyecto — DESCO Compass", metadataDescription: "Presente un proyecto para la revisión estructurada de DESCO.",
  pageTitle: "Presentar un proyecto", pageIntro: "Complete las secciones y envíe el proyecto a revisión de DESCO. Un revisor comprueba la integridad y coherencia interna antes de publicarlo. El envío no crea una publicación automática.",
  loading: "Cargando sus proyectos…", loadError: "No se pudieron cargar sus proyectos. Inténtelo de nuevo.", retry: "Reintentar", untitled: "Proyecto sin título", complete: (v) => `${v}% completado`, reviewerNote: "Nota del revisor", published: "Ver publicación", edit: "Editar", submit: "Enviar a revisión", withdraw: "Retirar", delete: "Eliminar", newProject: "Nueva presentación de proyecto", editTitle: "Editar presentación", newTitle: "Nueva presentación", select: "Seleccionar", optional: "opcional", documentsOptional: "opcional; la carga de documentos se habilita tras la aprobación", required: "Obligatorio para enviar a revisión", saving: "Guardando…", save: "Guardar borrador", cancel: "Cancelar", deleteConfirm: "¿Eliminar este borrador? Esta acción no se puede deshacer.", saveError: "No se pudo guardar el borrador. Revise el formulario y reintente.", submitError: "No se pudo enviar el proyecto a revisión.", withdrawError: "No se pudo retirar la presentación. Reintente.", deleteError: "No se pudo eliminar el borrador. Reintente.", networkError: "No se pudo contactar con el servicio. Compruebe la conexión y reintente.",
  labels: { orgName: "Organización", title: "Título del proyecto", ownershipStatement: "Declaración de propiedad", country: "País", region: "Región", sector: "Sector", stage: "Fase de desarrollo", raiseUsd: "Capital requerido ($)", fundingSecuredUsd: "Financiación obtenida ($)", sponsorContributionUsd: "Aportación del promotor ($)", instrument: "Instrumento", useOfFunds: "Uso de fondos", revenueModel: "Modelo de ingresos", financialSummary: "Información financiera", permitsStatus: "Estado de permisos", landRights: "Derechos sobre terrenos / explotación", governmentInvolvement: "Participación pública", governmentBacked: "El proyecto declara respaldo público documentado", esgSummary: "Información ESG", keyRisks: "Riesgos principales", managementTeam: "Equipo directivo", advisors: "Asesores", documentsNote: "Documentos disponibles", timetable: "Calendario previsto" },
  placeholders: { ownership: "Describa la propiedad legal o los derechos de desarrollo de su organización sobre el proyecto", stage: "Ejemplo: documentación de viabilidad disponible; evidencia pendiente", financial: "Cifras históricas y/o proyectadas, claramente identificadas" },
  statuses: { draft: "Borrador", submitted: "Enviado", under_review: "En revisión", changes_requested: "Cambios solicitados", approved: "Aprobado", withdrawn: "Retirado" },
};

const pt: SubmissionCopy = {
  ...en, metadataTitle: "Submeter um projeto — DESCO Compass", metadataDescription: "Apresente um projeto para análise estruturada pela DESCO.",
  pageTitle: "Submeter um projeto", pageIntro: "Preencha as secções abaixo e submeta o projeto para análise da DESCO. Um revisor verifica a completude e a coerência interna antes da publicação. A submissão não cria automaticamente uma listagem.",
  loading: "A carregar as suas submissões…", loadError: "Não foi possível carregar as submissões. Tente novamente.", retry: "Tentar novamente", untitled: "Projeto sem título", complete: (v) => `${v}% concluído`, reviewerNote: "Nota do revisor", published: "Ver listagem publicada", edit: "Editar", submit: "Submeter para análise", withdraw: "Retirar", delete: "Eliminar", newProject: "Nova submissão de projeto", editTitle: "Editar submissão", newTitle: "Nova submissão", select: "Selecionar", optional: "opcional", documentsOptional: "opcional; o carregamento fica disponível após aprovação", required: "Obrigatório para submeter para análise", saving: "A guardar…", save: "Guardar rascunho", cancel: "Cancelar", deleteConfirm: "Eliminar este rascunho? Esta ação não pode ser anulada.", saveError: "Não foi possível guardar o rascunho. Reveja o formulário e tente novamente.", submitError: "Não foi possível submeter o projeto para análise.", withdrawError: "Não foi possível retirar a submissão. Tente novamente.", deleteError: "Não foi possível eliminar o rascunho. Tente novamente.", networkError: "Não foi possível contactar o serviço. Verifique a ligação e tente novamente.",
  labels: { orgName: "Organização", title: "Título do projeto", ownershipStatement: "Declaração de propriedade", country: "País", region: "Região", sector: "Setor", stage: "Fase de desenvolvimento", raiseUsd: "Capital necessário ($)", fundingSecuredUsd: "Financiamento obtido ($)", sponsorContributionUsd: "Contribuição do promotor ($)", instrument: "Instrumento", useOfFunds: "Utilização dos fundos", revenueModel: "Modelo de receitas", financialSummary: "Informação financeira", permitsStatus: "Estado das licenças", landRights: "Direitos fundiários / de exploração", governmentInvolvement: "Envolvimento público", governmentBacked: "O projeto declara apoio público documentado", esgSummary: "Informação ESG", keyRisks: "Riscos principais", managementTeam: "Equipa de gestão", advisors: "Consultores", documentsNote: "Documentos disponíveis", timetable: "Calendário previsto" },
  placeholders: { ownership: "Descreva a propriedade legal ou os direitos de desenvolvimento da organização sobre o projeto", stage: "Exemplo: documentação de viabilidade disponível; evidência pendente", financial: "Valores históricos e/ou projetados, claramente identificados" },
  statuses: { draft: "Rascunho", submitted: "Submetido", under_review: "Em análise", changes_requested: "Alterações solicitadas", approved: "Aprovado", withdrawn: "Retirado" },
};

const zh: SubmissionCopy = {
  ...en, metadataTitle: "提交项目 — DESCO Compass", metadataDescription: "提交项目供 DESCO 进行结构化审查。",
  pageTitle: "提交项目", pageIntro: "请填写以下内容，然后提交项目供 DESCO 审查。项目发布前，审查人员会检查资料完整性和内部一致性。提交项目不会自动生成公开项目页面。",
  loading: "正在加载项目提交记录…", loadError: "无法加载项目提交记录，请重试。", retry: "重试", untitled: "未命名项目", complete: (v) => `已完成 ${v}%`, reviewerNote: "审查备注", published: "查看已发布项目", edit: "编辑", submit: "提交审查", withdraw: "撤回", delete: "删除", newProject: "新建项目提交", editTitle: "编辑项目提交", newTitle: "新建项目提交", select: "请选择", optional: "选填", documentsOptional: "选填；项目获批后可上传文件", required: "提交审查前必须填写", saving: "正在保存…", save: "保存草稿", cancel: "取消", deleteConfirm: "确定删除此草稿？此操作无法撤销。", saveError: "无法保存草稿。请检查表单后重试。", submitError: "无法提交项目审查。", withdrawError: "无法撤回项目，请重试。", deleteError: "无法删除草稿，请重试。", networkError: "无法连接服务。请检查网络后重试。",
  labels: { orgName: "机构", title: "项目名称", ownershipStatement: "所有权说明", country: "国家", region: "地区", sector: "行业", stage: "开发阶段", raiseUsd: "所需资金（美元）", fundingSecuredUsd: "已落实资金（美元）", sponsorContributionUsd: "发起方出资（美元）", instrument: "融资工具", useOfFunds: "资金用途", revenueModel: "收入模式", financialSummary: "财务信息", permitsStatus: "许可状态", landRights: "土地 / 经营权", governmentInvolvement: "政府参与", governmentBacked: "本项目已披露并提供政府支持依据", esgSummary: "ESG 信息", keyRisks: "主要风险", managementTeam: "管理团队", advisors: "顾问", documentsNote: "可提供的文件", timetable: "目标时间表" },
  placeholders: { ownership: "说明贵机构对本项目的合法所有权或开发权", stage: "例如：已有可行性文件，证据待审查", financial: "请清楚标明历史数据和/或预测数据" },
  statuses: { draft: "草稿", submitted: "已提交", under_review: "审查中", changes_requested: "需修改", approved: "已批准", withdrawn: "已撤回" },
};

const copies: Record<Locale, SubmissionCopy> = { en, fr, es, pt, zh };
export function submissionCopy(locale: Locale): SubmissionCopy { return copies[locale]; }

const successCopy = {
  en: { saved: "Draft saved.", submitted: "Project submitted for review.", withdrawn: "Submission withdrawn.", deleted: "Draft deleted." },
  fr: { saved: "Brouillon enregistré.", submitted: "Projet soumis à l’examen.", withdrawn: "Soumission retirée.", deleted: "Brouillon supprimé." },
  es: { saved: "Borrador guardado.", submitted: "Proyecto enviado a revisión.", withdrawn: "Presentación retirada.", deleted: "Borrador eliminado." },
  pt: { saved: "Rascunho guardado.", submitted: "Projeto submetido para análise.", withdrawn: "Submissão retirada.", deleted: "Rascunho eliminado." },
  zh: { saved: "草稿已保存。", submitted: "项目已提交审查。", withdrawn: "项目提交已撤回。", deleted: "草稿已删除。" },
} satisfies Record<Locale, Record<"saved" | "submitted" | "withdrawn" | "deleted", string>>;

export function submissionSuccess(locale: Locale, action: keyof (typeof successCopy)["en"]): string {
  return successCopy[locale][action];
}
