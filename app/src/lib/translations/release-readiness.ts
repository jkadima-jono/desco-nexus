import type { Locale } from "@/lib/i18n";

type ReleaseReadinessCopy = {
  relatedTitle: string;
  relatedBody: string;
  relatedLink: string;
  advancedFilters: string;
  advancedFiltersBody: string;
  contactProcess: string;
};

const copy: Record<Locale, ReleaseReadinessCopy> = {
  en: {
    relatedTitle: "Related-party disclosure",
    relatedBody: "Some published opportunities are connected to DESCO Global or one of its proposed business areas. Those opportunities are labelled on every card and project page. A DESCO review is an internal completeness review and is not independent verification.",
    relatedLink: "Read the conflicts and verification approach",
    advancedFilters: "Advanced filters",
    advancedFiltersBody: "Refine by geography, project stage, proposed instrument, sponsor, document readiness or source recency.",
    contactProcess: "DESCO records each request, assigns an internal owner and creates a follow-up task. Submission does not grant workspace or project-room access. Do not include confidential, personal or sensitive project information.",
  },
  fr: {
    relatedTitle: "Information sur les parties liées",
    relatedBody: "Certaines opportunités publiées sont liées à DESCO Global ou à l’un de ses domaines d’activité proposés. Elles sont signalées sur chaque fiche et page projet. Un examen DESCO porte sur la complétude interne et ne constitue pas une vérification indépendante.",
    relatedLink: "Consulter l’approche relative aux conflits et à la vérification",
    advancedFilters: "Filtres avancés",
    advancedFiltersBody: "Affinez par géographie, stade, instrument proposé, porteur, préparation documentaire ou ancienneté de la source.",
    contactProcess: "DESCO enregistre chaque demande, désigne un responsable interne et crée une tâche de suivi. L’envoi n’accorde aucun accès à l’espace ou à une data room. N’incluez aucune information confidentielle, personnelle ou sensible sur un projet.",
  },
  es: {
    relatedTitle: "Divulgación de partes vinculadas",
    relatedBody: "Algunas oportunidades publicadas están vinculadas a DESCO Global o a una de sus áreas de negocio propuestas. Se identifican en cada ficha y página de proyecto. La revisión de DESCO comprueba la integridad interna y no es una verificación independiente.",
    relatedLink: "Consultar el enfoque sobre conflictos y verificación",
    advancedFilters: "Filtros avanzados",
    advancedFiltersBody: "Filtre por geografía, etapa, instrumento propuesto, promotor, preparación documental o antigüedad de la fuente.",
    contactProcess: "DESCO registra cada solicitud, asigna un responsable interno y crea una tarea de seguimiento. El envío no concede acceso al espacio ni a una sala de datos. No incluya información confidencial, personal o sensible del proyecto.",
  },
  pt: {
    relatedTitle: "Divulgação de partes relacionadas",
    relatedBody: "Algumas oportunidades publicadas estão ligadas à DESCO Global ou a uma das suas áreas de negócio propostas. São identificadas em cada cartão e página de projeto. A análise da DESCO verifica a completude interna e não constitui verificação independente.",
    relatedLink: "Consultar a abordagem de conflitos e verificação",
    advancedFilters: "Filtros avançados",
    advancedFiltersBody: "Filtre por geografia, fase, instrumento proposto, promotor, preparação documental ou idade da fonte.",
    contactProcess: "A DESCO regista cada pedido, atribui um responsável interno e cria uma tarefa de acompanhamento. O envio não concede acesso ao espaço ou a uma sala de dados. Não inclua informação confidencial, pessoal ou sensível do projeto.",
  },
  zh: {
    relatedTitle: "关联方披露",
    relatedBody: "部分公开机会与 DESCO Global 或其拟议业务领域有关。每张项目卡及项目页面均会标明此关系。DESCO 审查仅检查内部完整性，不属于独立核验。",
    relatedLink: "查看利益冲突与核验方法",
    advancedFilters: "高级筛选",
    advancedFiltersBody: "可按地区、项目阶段、拟议工具、项目发起方、文件准备度或资料日期进一步筛选。",
    contactProcess: "DESCO 会记录每项请求、指定内部负责人并创建跟进任务。提交请求不会授予工作区或项目资料室权限。请勿提交机密、个人或敏感项目信息。",
  },
};

export function releaseReadinessCopy(locale: Locale): ReleaseReadinessCopy {
  return copy[locale];
}
