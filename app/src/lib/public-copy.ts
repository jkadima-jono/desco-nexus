import type { Locale } from "./i18n";

type HeroCopy = {
  eyebrow: string;
  title: string;
  body: string;
  primary: string;
  secondary: string;
};

// Opportunities is the only public route whose filter-led hero is maintained
// separately. All narrative marketing pages use the governed marketing copy.
const opportunityHero: Record<Locale, HeroCopy> = {
  en: {
    eyebrow: "Current preparation files",
    title: "Project files under active preparation.",
    body: "Review the available public information, dated sources and named blocking gaps. A file remains in preparation until it passes the Compass Disclosure Standard.",
    primary: "Apply for investor access",
    secondary: "Understand the diligence process",
  },
  fr: {
    eyebrow: "Dossiers en préparation",
    title: "Dossiers de projets en cours de préparation.",
    body: "Examinez les informations publiques, les sources datées et les blocages nommés. Un dossier reste en préparation jusqu’à ce qu’il respecte la norme de divulgation Compass.",
    primary: "Demander un accès investisseur",
    secondary: "Comprendre la diligence",
  },
  es: {
    eyebrow: "Expedientes en preparación",
    title: "Expedientes de proyectos en preparación activa.",
    body: "Revise la información pública, las fuentes fechadas y los bloqueos identificados. Un expediente permanece en preparación hasta cumplir la Norma de divulgación Compass.",
    primary: "Solicitar acceso de inversor",
    secondary: "Entender la diligencia",
  },
  pt: {
    eyebrow: "Dossiês em preparação",
    title: "Dossiês de projetos em preparação ativa.",
    body: "Analise a informação pública, as fontes datadas e os bloqueios identificados. Um dossiê permanece em preparação até cumprir a Norma de divulgação Compass.",
    primary: "Solicitar acesso de investidor",
    secondary: "Compreender a diligência",
  },
  zh: {
    eyebrow: "当前准备文件",
    title: "正在准备中的项目文件。",
    body: "请审阅公开信息、注明日期的来源及明确列出的阻碍事项。项目文件达到 Compass 披露标准前均标记为准备中。",
    primary: "申请投资者权限",
    secondary: "了解尽职调查流程",
  },
};

export function getOpportunityHero(locale: Locale): HeroCopy {
  return opportunityHero[locale];
}
