import type { Locale } from "@/lib/i18n";

type PathwayCopy = {
  forkEyebrow: string;
  forkTitle: string;
  investorLead: string;
  investorQualifier: string;
  ownerLead: string;
  ownerQualifier: string;
  convergenceEyebrow: string;
  convergenceTitle: string;
  convergenceBody: string;
  investorStep: string;
  investorStepBody: string;
  ownerStep: string;
  ownerStepBody: string;
  room: string;
  roomBody: string;
  ownerCrossLink: string;
  investorCrossLink: string;
};

const copy: Record<Locale, PathwayCopy> = {
  en: {
    forkEyebrow: "Choose your pathway", forkTitle: "Which best describes you?",
    investorLead: "I am here to deploy capital.", investorQualifier: "For funds, DFIs, lenders, strategic investors and qualified family offices.",
    ownerLead: "I own or develop a project.", ownerQualifier: "For organisations that hold land, a concession or a project requiring structured capital.",
    convergenceEyebrow: "How the paths connect", convergenceTitle: "Two distinct journeys, one controlled review process.", convergenceBody: "Project and asset owners prepare consistent evidence. Investors screen the public record before requesting restricted information.",
    investorStep: "Investor screening", investorStepBody: "Compare disclosed facts, evidence gaps and mandate fit.",
    ownerStep: "Project preparation", ownerStepBody: "Structure the public record and organise supporting evidence.",
    room: "Controlled diligence room", roomBody: "Approved users review restricted material under project-specific access controls.",
    ownerCrossLink: "Here as a project or asset owner?", investorCrossLink: "Here as an investor?",
  },
  fr: {
    forkEyebrow: "Choisissez votre parcours", forkTitle: "Quel profil vous correspond le mieux ?",
    investorLead: "Je souhaite déployer des capitaux.", investorQualifier: "Pour les fonds, IFD, prêteurs, investisseurs stratégiques et family offices qualifiés.",
    ownerLead: "Je détiens ou développe un projet.", ownerQualifier: "Pour les organisations qui détiennent un terrain, une concession ou un projet nécessitant des capitaux structurés.",
    convergenceEyebrow: "Comment les parcours se rejoignent", convergenceTitle: "Deux parcours distincts, un processus d’examen contrôlé.", convergenceBody: "Les porteurs de projets et d’actifs préparent des preuves cohérentes. Les investisseurs examinent le dossier public avant de demander des informations restreintes.",
    investorStep: "Filtrage investisseur", investorStepBody: "Comparer les faits divulgués, les preuves manquantes et l’adéquation au mandat.",
    ownerStep: "Préparation du projet", ownerStepBody: "Structurer le dossier public et organiser les pièces justificatives.",
    room: "Data room contrôlée", roomBody: "Les utilisateurs approuvés examinent les documents restreints selon des contrôles propres au projet.",
    ownerCrossLink: "Vous êtes porteur d’un projet ou d’un actif ?", investorCrossLink: "Vous êtes investisseur ?",
  },
  es: {
    forkEyebrow: "Elija su recorrido", forkTitle: "¿Qué opción le describe mejor?",
    investorLead: "Quiero desplegar capital.", investorQualifier: "Para fondos, IFD, prestamistas, inversores estratégicos y family offices cualificados.",
    ownerLead: "Soy propietario o promotor de un proyecto.", ownerQualifier: "Para organizaciones que poseen terrenos, concesiones o proyectos que requieren capital estructurado.",
    convergenceEyebrow: "Cómo se conectan los recorridos", convergenceTitle: "Dos recorridos distintos, un proceso de revisión controlado.", convergenceBody: "Los propietarios de proyectos y activos preparan pruebas coherentes. Los inversores revisan el expediente público antes de solicitar información restringida.",
    investorStep: "Selección del inversor", investorStepBody: "Comparar hechos divulgados, carencias de pruebas y adecuación al mandato.",
    ownerStep: "Preparación del proyecto", ownerStepBody: "Estructurar el expediente público y organizar las pruebas de respaldo.",
    room: "Sala de diligencia controlada", roomBody: "Los usuarios aprobados revisan material restringido con controles específicos del proyecto.",
    ownerCrossLink: "¿Está aquí como propietario de un proyecto o activo?", investorCrossLink: "¿Está aquí como inversor?",
  },
  pt: {
    forkEyebrow: "Escolha o seu percurso", forkTitle: "Qual opção o descreve melhor?",
    investorLead: "Quero mobilizar capital.", investorQualifier: "Para fundos, IFD, credores, investidores estratégicos e family offices qualificados.",
    ownerLead: "Sou proprietário ou promotor de um projeto.", ownerQualifier: "Para organizações que detêm terrenos, concessões ou projetos que requerem capital estruturado.",
    convergenceEyebrow: "Como os percursos se ligam", convergenceTitle: "Dois percursos distintos, um processo de análise controlado.", convergenceBody: "Os proprietários de projetos e ativos preparam provas coerentes. Os investidores analisam o dossier público antes de pedir informação restrita.",
    investorStep: "Análise do investidor", investorStepBody: "Comparar factos divulgados, lacunas de prova e adequação ao mandato.",
    ownerStep: "Preparação do projeto", ownerStepBody: "Estruturar o dossier público e organizar os documentos de suporte.",
    room: "Sala de diligência controlada", roomBody: "Os utilizadores aprovados analisam material restrito com controlos específicos do projeto.",
    ownerCrossLink: "Está aqui como proprietário de um projeto ou ativo?", investorCrossLink: "Está aqui como investidor?",
  },
  zh: {
    forkEyebrow: "选择您的路径", forkTitle: "以下哪项最符合您的身份？",
    investorLead: "我希望配置资本。", investorQualifier: "适用于基金、开发性金融机构、贷款机构、战略投资者及合资格家族办公室。",
    ownerLead: "我拥有或开发一个项目。", ownerQualifier: "适用于持有土地、特许权或需要结构化资本项目的机构。",
    convergenceEyebrow: "两条路径如何衔接", convergenceTitle: "两条独立路径，共用一个受控审查流程。", convergenceBody: "项目及资产所有方准备一致的证据。投资者先审查公开记录，再申请受限资料。",
    investorStep: "投资者筛选", investorStepBody: "比较已披露事实、证据缺口及投资授权匹配度。",
    ownerStep: "项目准备", ownerStepBody: "整理公开记录并组织支持证据。",
    room: "受控尽调资料室", roomBody: "获批用户按照项目特定的访问控制审查受限资料。",
    ownerCrossLink: "您是项目或资产所有方？", investorCrossLink: "您是投资者？",
  },
};

export function pathwayCopy(locale: Locale) {
  return copy[locale];
}
