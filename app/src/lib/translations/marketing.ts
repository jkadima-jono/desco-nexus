import type { Metadata } from "next";
import { publicPageMetadata } from "@/lib/metadata";
import type { Locale } from "../i18n";

type Card = { title: string; body: string };
type Step = Card;
type Hero = {
  eyebrow: string;
  title: string;
  body: string;
  primary: string;
  secondary: string;
};
type PageBase = {
  metadata: { title: string; description: string };
  hero: Hero;
};

type MarketingCopy = {
  home: {
    metadata: { title: string; description: string };
    featured: string;
    whyFeatured: string;
    featuredStatus: string;
    featuredReason: string;
    publicTeaser: string;
    capitalSought: string;
    projectStage: string;
    sector: string;
    location: string;
    disclosure: string;
    sponsorProvided: string;
    dataRoom: string;
    readinessNotPublic: string;
    reviewOpportunity: string;
    investorBenefits: string[];
    sponsorBenefits: string[];
    capitalRepresented: string;
    projectCostCoverage: (count: number, total: number) => string;
    sponsorFigures: string;
    processEyebrow: string;
    processTitle: string;
    processBody: string;
    process: Step[];
    processCta: string;
    trustEyebrow: string;
    trustTitle: string;
    trustBody: string;
    controls: Card[];
    trustNotice: string;
    trustCta: string;
    nextEyebrow: string;
    nextTitle: string;
    nextBody: string;
    reviewCta: string;
    prepareCta: string;
  };
  about: PageBase & {
    notice: string;
    sectionEyebrow: string;
    sectionTitle: string;
    cards: Card[];
    partnersCta: string;
    inquiryCta: string;
  };
  diligence: PageBase & {
    accessState: string;
    statuses: string[];
    accessNote: string;
    processEyebrow: string;
    processTitle: string;
    process: Step[];
    roomEyebrow: string;
    roomTitle: string;
    roomBody: string;
    folderLabel: string;
    folders: string[];
    notice: string;
  };
  investors: PageBase & {
    preview: string;
    mandateFields: string[];
    matchingNote: string;
    previewCopy: {
      title: string;
      instruction: string;
      sector: string;
      stage: string;
      instrument: string;
      all: string;
      resultOne: string;
      resultMany: string;
      empty: string;
      capitalNote: string;
      review: string;
    };
    sectionEyebrow: string;
    sectionTitle: string;
    cards: Card[];
    steps: Step[];
    notice: string;
    applyCta: string;
  };
  sponsors: PageBase & {
    framework: string;
    underReview: string;
    required: string;
    readiness: string[];
    sectionEyebrow: string;
    sectionTitle: string;
    sectionBody: string;
    process: Step[];
    notice: string;
    startCta: string;
  };
  partners: PageBase & {
    sectionEyebrow: string;
    sectionTitle: string;
    cards: Card[];
    notice: string;
    startCta: string;
  };
  pricing: PageBase & {
    heroNotice: string;
    pathsEyebrow: string;
    pathsTitle: string;
    pathsBody: string;
    paths: { audience: string; title: string; model: string; includes: string[] }[];
    defineScope: string;
    safeguardsEyebrow: string;
    safeguardsTitle: string;
    principles: Card[];
    beforeEyebrow: string;
    beforeTitle: string;
    beforeBody: string;
    beforeNotice: string;
    discussCta: string;
  };
  trust: PageBase & {
    heroNotice: string;
    sectionEyebrow: string;
    sectionTitle: string;
    statuses: (Card & { tone: "pending" | "reviewed" | "restricted" | "public" })[];
    controls: Card[];
    notice: string;
  };
};
export type HomeMarketingCopy = MarketingCopy["home"];

const en: MarketingCopy = {
  home: {
    metadata: { title: "DESCO Compass — Structured DRC opportunities", description: "Review selected DRC opportunities through consistent disclosure, mandate-based screening and controlled due diligence." },
    featured: "Featured opportunity briefing", whyFeatured: "Why featured", featuredStatus: "Current public status", featuredReason: "It is the only published opportunity supported by a dated technical proposal and preliminary budget. Selection is not an endorsement or a statement of investment readiness.", publicTeaser: "Public teaser", capitalSought: "Capital sought",
    projectStage: "Project stage", sector: "Sector", location: "Location", disclosure: "Disclosure",
    sponsorProvided: "Sponsor-provided", dataRoom: "Data room", readinessNotPublic: "Readiness not public",
    reviewOpportunity: "Review opportunity", investorBenefits: ["Reduce origination noise with a curated DRC pipeline", "Compare opportunities through one disclosure structure", "Carry source dates, evidence gaps and provenance into investment-committee screening", "Request deeper due diligence only when the public case supports it"],
    sponsorBenefits: ["Prepare an institutional listing", "Control access to confidential information", "Coordinate investor engagement following access review"],
    capitalRepresented: "public opportunities", projectCostCoverage: (_count, total) => `${total} opportunities use a common public-disclosure structure.`, sponsorFigures: "Capital requirements are shown separately by project",
    processEyebrow: "Investor due diligence pathway", processTitle: "A controlled path from screening to deeper review.",
    processBody: "We support screening, information exchange and engagement. Investors remain responsible for their own legal, financial, technical and commercial due diligence.",
    process: [
      { title: "Review the public teaser", body: "Assess the thesis, capital requirement, sponsor, stage, risks and disclosure status." },
      { title: "Evaluate mandate fit", body: "Compare sector, geography, ticket size and instrument with saved investment criteria." },
      { title: "Request controlled access", body: "Ask the sponsor for access to restricted financial, technical and legal material." },
      { title: "Review confidential material", body: "Use the permission-controlled room and recorded activity history." },
      { title: "Meet the sponsor", body: "Request a meeting when the available information supports deeper engagement." },
      { title: "Progress independently", body: "Complete legal, financial, technical and commercial due diligence outside the platform." },
    ],
    processCta: "Review the full due diligence process", trustEyebrow: "Trust and disclosure",
    trustTitle: "Review status and access controls are defined explicitly.",
    trustBody: "We distinguish public, sponsor-provided, DESCO-reviewed, restricted and independently verified information. No status is an investment endorsement.",
    controls: [
      { title: "Structured project review", body: "We review submissions for structure, completeness and internal consistency before publication. This is not independent investment verification." },
      { title: "Clear disclosure status", body: "Public modules identify sponsor-provided, DESCO-reviewed, pending and restricted information." },
      { title: "Permission-controlled rooms", body: "Confidential documents require an authenticated session and an explicit, revocable access grant." },
      { title: "Recorded access activity", body: "Material access decisions, downloads and workflow changes can be logged for operational oversight." },
      { title: "Sponsor-controlled confidentiality", body: "Sponsors decide which approved users can access restricted project information." },
    ],
    trustNotice: "DESCO Compass does not claim completed AML or KYC checks, SOC 2 certification, GDPR compliance, government approval, guaranteed returns or independent project verification unless supported by approved evidence.",
    trustCta: "Read the disclosure framework", nextEyebrow: "Choose your next step",
    nextTitle: "Review opportunities or prepare a project for institutional screening.",
    nextBody: "We keep investor and project-company journeys distinct through screening, access decisions and engagement.",
    reviewCta: "Review opportunities", prepareCta: "Prepare a project",
  },
  about: {
    metadata: { title: "About DESCO Global — DESCO Compass", description: "DESCO Global’s role in connecting structured projects, capital providers and strategic partners." },
    hero: { eyebrow: "About DESCO Global", title: "We connect structured projects, capital and strategic partners.", body: "We operate DESCO Compass as an investment-opportunity and due diligence platform focused initially on the Democratic Republic of the Congo, with the capacity to support selected African markets.", primary: "Contact DESCO Global", secondary: "Review investment pillars" },
    notice: "This page does not claim an investment track record, client list, transaction history, office network or regulatory status that has not been supplied and approved by DESCO Global.",
    sectionEyebrow: "Platform rationale", sectionTitle: "A clearer interface between project preparation and investor review.",
    cards: [
      { title: "Project structure", body: "Help sponsors organise public and restricted information in a consistent review format." },
      { title: "Capital screening", body: "Help investors compare disclosed opportunities with explicit mandate criteria." },
      { title: "Controlled due diligence", body: "Give sponsors permission controls over confidential information and access decisions." },
      { title: "Strategic coordination", body: "Support meetings, communication and next steps between authorised organisations." },
    ],
    partnersCta: "Review the advisory model", inquiryCta: "Submit an enquiry",
  },
  diligence: {
    metadata: { title: "How due diligence works — DESCO Compass", description: "Understand public screening, access requests, restricted documents and sponsor engagement on DESCO Compass." },
    hero: { eyebrow: "Controlled due diligence", title: "Information access should follow a justified screening decision.", body: "DESCO Compass separates public screening information from permission-controlled financial, technical, legal and transaction material.", primary: "Review public opportunities", secondary: "Read disclosure standards" },
    accessState: "Access status", statuses: ["Public teaser", "Request pending", "Restricted", "Approved access"],
    accessNote: "Access decisions should identify the user, organisation, project, permission scope and decision record.",
    processEyebrow: "Investor process", processTitle: "From public screening to controlled review.",
    process: [
      { title: "Review the public teaser", body: "Read the project thesis, sponsor, stage, capital requirement, risks and disclosure summary." },
      { title: "Evaluate mandate fit", body: "Compare disclosed fields with your organisation’s investment criteria." },
      { title: "Request controlled access", body: "Explain your interest and request the restricted material needed for deeper review." },
      { title: "Review confidential material", body: "Access only the folders and documents covered by the sponsor’s permission." },
      { title: "Meet the sponsor", body: "Coordinate a meeting when the available information supports further engagement." },
      { title: "Progress independently", body: "Conduct professional due diligence and negotiate any transaction outside the platform." },
    ],
    roomEyebrow: "Data room structure", roomTitle: "A predictable document structure.",
    roomBody: "Folder availability depends on sponsor submission and approved access.", folderLabel: "Folder",
    folders: ["Executive overview", "Corporate and sponsor information", "Financial information", "Technical studies", "Legal and regulatory", "Land, permits and concessions", "ESG and community", "Commercial agreements", "Risk and insurance", "Transaction documents"],
    notice: "DESCO Compass supports screening, controlled information exchange and engagement. It does not replace legal, financial, technical, tax, ESG or commercial due diligence.",
  },
  investors: {
    metadata: { title: "For investors — DESCO Compass", description: "Screen structured opportunities against an investment mandate before committing resources to deeper due diligence." },
    hero: { eyebrow: "Investor pathway", title: "Assess mandate fit before committing to full due diligence.", body: "We help institutional investors, funds, family offices, lenders and strategic capital providers screen structured opportunities and control the transition into deeper review.", primary: "Apply for investor access", secondary: "Review opportunities" },
    preview: "Mandate builder preview", mandateFields: ["Preferred sectors", "Geographic focus", "Ticket size", "Investment instrument", "Project stage", "Impact requirements", "Risk tolerance", "Control preference"],
    matchingNote: "Matching uses disclosed project fields and deterministic criteria. Ticket-size matching applies only when a current capital ask is disclosed. It is a screening aid, not investment advice.",
    previewCopy: { title: "Test the preparation files", instruction: "Choose criteria to see which public preparation files remain in scope.", sector: "Sector", stage: "Project stage", instrument: "Instrument", all: "All", resultOne: "{count} file matches", resultMany: "{count} files match", empty: "No preparation file matches this combination.", capitalNote: "Ticket-size screening is unavailable because no current public file discloses a current capital ask. Missing data is not treated as a match.", review: "Review" },
    sectionEyebrow: "Investor operating model", sectionTitle: "Review opportunities against defined mandate criteria.",
    cards: [
      { title: "Reduce origination noise", body: "Start with comparable public briefings, named sponsors and visible information gaps before allocating analyst time." },
      { title: "Prepare an IC-ready screening record", body: "Retain source dates, disclosure status and mandate-fit criteria in a consistent review format." },
      { title: "Control the cost of deeper diligence", body: "Request restricted material and sponsor engagement only when the public case supports further work." },
    ],
    steps: [
      { title: "Define investment criteria", body: "Record sectors, geographies, ticket size, instrument, stage and exclusions." },
      { title: "Review public opportunities", body: "Compare project theses, capital requirements, sponsors, risks and disclosure status." },
      { title: "Assess mandate fit", body: "See which explicit criteria are met, partially met, excluded or missing." },
      { title: "Request access", body: "Ask for financial, technical and legal material when the public case supports deeper review." },
      { title: "Collaborate", body: "Save opportunities, compare them and coordinate meetings, messages and next steps." },
      { title: "Progress independently", body: "Complete your own due diligence and investment decision outside the platform." },
    ],
    notice: "This pathway is designed for institutional investors, funds, lenders, strategic investors and qualified family offices. It is not a retail investment service, trading venue or recommendation. Investors remain responsible for independent diligence and decisions.",
    applyCta: "Apply for an investor workspace",
  },
  sponsors: {
    metadata: { title: "For project sponsors — DESCO Compass", description: "Prepare a structured project listing and manage controlled investor due diligence." },
    hero: { eyebrow: "Project-company pathway", title: "We prepare projects for institutional investor review.", body: "We turn fragmented project information into a structured institutional listing, a clear public briefing and permission-controlled due diligence.", primary: "Assess project readiness", secondary: "Discuss project support" },
    framework: "Readiness framework", underReview: "Under review", required: "Required",
    readiness: ["Sponsor information", "Project structure", "Market case", "Technical readiness", "Financial model", "Legal and regulatory position", "Land and permits", "ESG and community", "Risk disclosure", "Supporting documents"],
    sectionEyebrow: "Project preparation", sectionTitle: "Structure the public case, then control the deeper review.",
    sectionBody: "Our project-company pathway covers readiness, submission, disclosure, listing preparation, confidential documents, access decisions and investor engagement.",
    process: [
      { title: "Assess readiness", body: "Identify gaps across sponsor, project, market, financial, legal, ESG and document information." },
      { title: "Prepare structured information", body: "Turn fragmented material into consistent fields, evidence references and clear disclosure." },
      { title: "Complete DESCO review", body: "Resolve completeness and internal-consistency questions before publication." },
      { title: "Publish a public teaser", body: "Provide enough public information for investors to screen without exposing restricted material." },
      { title: "Review access requests", body: "Approve or decline qualified users and retain control over confidential information." },
      { title: "Coordinate engagement", body: "Manage meetings, documents, messages and next steps through the workspace." },
    ],
    notice: "DESCO review addresses structure, completeness and internal consistency. It does not constitute legal approval, project endorsement or independent investment verification.",
    startCta: "Start a structured submission",
  },
  partners: {
    metadata: { title: "Advisory model — DESCO Compass", description: "How legal, financial, technical, government and development specialists can support structured opportunities." },
    hero: { eyebrow: "Advisory model", title: "Specialist work is defined by project, scope and authority.", body: "DESCO can coordinate approved specialists around project preparation, diligence and investor engagement. A role is described as an affiliation only after the appointment and publication authority are documented.", primary: "Discuss a specialist mandate", secondary: "Review the due diligence model" },
    sectionEyebrow: "Participation model", sectionTitle: "Defined roles, authorised access and accountable deliverables.",
    cards: [
      { title: "Legal and transaction advisers", body: "Support legal structuring, disclosure, document review and transaction execution." },
      { title: "Financial advisers and lenders", body: "Support financial modelling, capital structure, credit review and investor engagement." },
      { title: "Technical and ESG specialists", body: "Support feasibility, engineering, environmental, social and operational review." },
      { title: "Government and development institutions", body: "Support public-sector coordination, policy context and development alignment." },
    ],
    notice: "This page describes the advisory capabilities a project may require. It is not a directory of appointed advisers or affiliated institutions.",
    startCta: "Discuss a specialist mandate",
  },
  pricing: {
    metadata: { title: "Commercial model — DESCO Compass", description: "How DESCO Compass proposes to structure investor, sponsor and institutional-partner access." },
    hero: { eyebrow: "Commercial model", title: "Institutional access should have documented scope and terms.", body: "DESCO Compass does not currently process payments, issue invoices or offer self-service subscriptions. These pathways describe a proposed sales-assisted model for discussion, not binding prices or an offer.", primary: "Discuss commercial scope", secondary: "Review the investor pathway" },
    heroNotice: "No payment processor is connected. No displayed workspace configuration is billed, collected revenue or an approved commercial quotation.",
    pathsEyebrow: "Proposed pathways", pathsTitle: "Different users require different commercial structures.",
    pathsBody: "The public product should explain who pays, what the fee covers, what remains project-specific and which services require a separate mandate.",
    paths: [
      { audience: "Investors", title: "Institutional workspace", model: "Proposed annual organisation licence", includes: ["Mandate configuration and opportunity screening", "Comparison, saved research and team workflow", "Project-specific restricted-access requests", "Onboarding and support scope agreed by organisation"] },
      { audience: "Project sponsors", title: "Readiness and controlled due diligence", model: "Proposed scope-based engagement", includes: ["Project intake and disclosure-gap assessment", "Structured public opportunity preparation", "Controlled data room and enquiry workflow", "Additional advisory work contracted separately"] },
      { audience: "DFIs, governments and partners", title: "Programme workspace", model: "Custom programme agreement", includes: ["Portfolio or corridor-level configuration", "Governance, reporting and access design", "Defined implementation and support services", "Commercial terms based on approved scope"] },
    ],
    defineScope: "Define scope", safeguardsEyebrow: "Commercial safeguards",
    safeguardsTitle: "Charges must remain distinct from access decisions and investment claims.",
    principles: [
      { title: "Organisation-level contracting", body: "Institutional use should be contracted with an organisation and defined user roles, not represented as an individual consumer subscription." },
      { title: "Access is separate from investment outcome", body: "Workspace fees must not imply project approval, allocation, investment performance or access to every restricted room." },
      { title: "Advisory scope is explicit", body: "Project preparation, transaction support or specialist due diligence should use a separate statement of work with named deliverables." },
      { title: "Success fees require legal approval", body: "No transaction, placement or success fee should be offered until the activity, jurisdiction, permissions and conflicts framework have been approved." },
    ],
    beforeEyebrow: "Before contracting", beforeTitle: "Commercial terms require an approved scope.",
    beforeBody: "DESCO must confirm the contracting entity, services, user roles, support, data handling, procurement requirements and any jurisdiction-specific restrictions before issuing a quotation.",
    beforeNotice: "Public pricing will remain unpublished until currency, taxes, invoicing, renewal, cancellation, service levels, data retention and regulated compensation have been reviewed and approved.",
    discussCta: "Discuss commercial scope",
  },
  trust: {
    metadata: { title: "Trust and disclosures — DESCO Compass", description: "How DESCO Compass labels project information, review status, restricted access and verification evidence." },
    hero: { eyebrow: "Trust and disclosure", title: "Status and evidence are shown without implying endorsement.", body: "DESCO Compass describes project information and access controls by what has occurred, who supplied the information and what evidence supports the status.", primary: "Read the legal methodology", secondary: "How controlled access works" },
    heroNotice: "Nothing on DESCO Compass constitutes a securities offer, investment recommendation, financial guarantee or legal approval.",
    sectionEyebrow: "Disclosure language", sectionTitle: "Statuses designed to remain clear under scrutiny.",
    statuses: [
      { title: "Sponsor-provided", body: "Information supplied by the project sponsor and not independently verified.", tone: "pending" },
      { title: "DESCO reviewed", body: "Reviewed for structure, completeness and internal consistency.", tone: "reviewed" },
      { title: "Independent verification pending", body: "No approved third-party validation has been recorded.", tone: "pending" },
      { title: "Verified document", body: "A specific document has an approved verification record and stated scope.", tone: "reviewed" },
      { title: "Restricted", body: "Only approved authenticated users may access the information.", tone: "restricted" },
      { title: "Approved for public teaser", body: "An administrator has approved publication; this is not investment endorsement.", tone: "public" },
    ],
    controls: [
      { title: "Project information review", body: "DESCO reviews submissions for structure, completeness and internal consistency before publication. This is not independent investment verification." },
      { title: "Listing status", body: "DESCO administrators record and manage listing status. It should not be interpreted as investment approval or endorsement." },
      { title: "Data room access", body: "Confidential documents are available only to approved users through permission-controlled access." },
      { title: "Activity record", body: "Material workspace activity and access decisions may be logged for operational oversight." },
      { title: "Related-party opportunities", body: "Where DESCO is connected to a sponsor or development platform, the opportunity is labelled accordingly. DESCO review remains an internal completeness review; independent verification requires an approved third party and stated scope." },
      { title: "Country and integrity diligence", body: "Before institutional engagement, each project requires scope-specific review of beneficial ownership, sanctions and PEP exposure, anti-bribery controls, title and permits, responsible sourcing, labour, community and environmental risks." },
      { title: "Sovereign and project data", body: "Before confidential government or project records are uploaded, the contract must define hosting region, subprocessors, authorised access, retention, export, deletion and applicable law. The public site does not promise a specific data-residency location." },
    ],
    notice: "The platform does not claim completed AML or KYC checks, SOC 2 certification, GDPR compliance, government approval, guaranteed returns or independent verification unless supported by approved, scope-specific evidence.",
  },
};

// Complete page-level translations. Project names and legal names remain unchanged.
const fr: MarketingCopy = {
  ...en,
  home: {
    ...en.home,
    metadata: { title: "DESCO Compass — Opportunités structurées en RDC", description: "Examinez des opportunités sélectionnées en RDC grâce à une divulgation cohérente, un filtrage selon le mandat et une diligence contrôlée." },
    featured: "Présentation d’une opportunité", whyFeatured: "Pourquoi cette opportunité", featuredStatus: "Statut public actuel", featuredReason: "C’est la seule opportunité publiée étayée par une proposition technique datée et un budget préliminaire. Cette sélection ne constitue ni une approbation ni une indication de préparation à l’investissement.", publicTeaser: "Présentation publique", capitalSought: "Capital recherché", projectStage: "Stade du projet", sector: "Secteur", location: "Localisation", disclosure: "Divulgation", sponsorProvided: "Fourni par le porteur", dataRoom: "Data room", readinessNotPublic: "État de préparation non public", reviewOpportunity: "Examiner l’opportunité",
    investorBenefits: ["Réduire le bruit d’origination grâce à une sélection de projets en RDC", "Comparer les opportunités selon une structure de divulgation commune", "Intégrer les dates des sources, les lacunes et la provenance au filtrage du comité d’investissement", "Demander une diligence approfondie uniquement lorsque le dossier public le justifie"],
    sponsorBenefits: ["Préparer un dossier institutionnel", "Contrôler l’accès aux informations confidentielles", "Coordonner les échanges investisseurs après examen des accès"],
    capitalRepresented: "opportunités publiques", projectCostCoverage: (_count, total) => `${total} opportunités utilisent une structure commune de divulgation publique.`, sponsorFigures: "Les besoins en capital sont présentés séparément par projet",
    processEyebrow: "Parcours de diligence investisseur", processTitle: "Un parcours contrôlé, du filtrage à l’examen approfondi.", processBody: "Nous organisons le filtrage, l’échange d’informations et les prises de contact. Les investisseurs restent responsables de leur propre diligence juridique, financière, technique et commerciale.",
    process: [
      { title: "Examiner la présentation publique", body: "Évaluer la thèse, le besoin en capital, le porteur, le stade, les risques et le niveau de divulgation." },
      { title: "Évaluer l’adéquation au mandat", body: "Comparer le secteur, la géographie, le ticket et l’instrument aux critères enregistrés." },
      { title: "Demander un accès contrôlé", body: "Demander au porteur l’accès aux documents financiers, techniques et juridiques restreints." },
      { title: "Examiner les documents confidentiels", body: "Utiliser la data room à accès contrôlé et l’historique d’activité." },
      { title: "Rencontrer le porteur", body: "Demander une réunion lorsque les informations disponibles justifient un échange approfondi." },
      { title: "Poursuivre de manière indépendante", body: "Mener la diligence juridique, financière, technique et commerciale hors plateforme." },
    ],
    processCta: "Examiner le processus complet de diligence", trustEyebrow: "Confiance et divulgation", trustTitle: "Les statuts d’examen et les contrôles d’accès sont définis explicitement.", trustBody: "Nous distinguons les informations publiques, fournies par le porteur, examinées par DESCO, restreintes et vérifiées indépendamment. Aucun statut ne constitue une approbation d’investissement.",
    controls: [
      { title: "Examen structuré du projet", body: "DESCO examine la structure, l’exhaustivité et la cohérence interne avant publication. Il ne s’agit pas d’une vérification indépendante." },
      { title: "Statut de divulgation clair", body: "Les modules publics identifient les informations fournies par le porteur, examinées par DESCO, en attente et restreintes." },
      { title: "Data rooms à accès contrôlé", body: "Les documents confidentiels exigent une session authentifiée et une autorisation explicite et révocable." },
      { title: "Activité d’accès enregistrée", body: "Les décisions d’accès, téléchargements et changements de processus peuvent être journalisés." },
      { title: "Confidentialité contrôlée par le porteur", body: "Les porteurs décident quels utilisateurs approuvés accèdent aux informations restreintes." },
    ],
    trustNotice: "DESCO Compass ne revendique pas de contrôles AML ou KYC achevés, de certification SOC 2, de conformité RGPD, d’approbation publique, de rendement garanti ou de vérification indépendante sans preuve approuvée.",
    trustCta: "Lire le cadre de divulgation", nextEyebrow: "Choisissez la prochaine étape", nextTitle: "Examinez les opportunités ou préparez un projet au filtrage institutionnel.", nextBody: "Les parcours investisseur et porteur restent distincts lors du filtrage, des décisions d’accès et des échanges.", reviewCta: "Examiner les opportunités", prepareCta: "Préparer un projet",
  },
  about: {
    metadata: { title: "À propos de DESCO Global — DESCO Compass", description: "Le rôle de DESCO Global dans la mise en relation de projets structurés, de capitaux et de partenaires stratégiques." },
    hero: { eyebrow: "À propos de DESCO Global", title: "Relier projets structurés, capitaux et partenaires stratégiques.", body: "Nous exploitons DESCO Compass comme plateforme d’opportunités et de diligence, initialement centrée sur la République démocratique du Congo et certains marchés africains.", primary: "Contacter DESCO Global", secondary: "Examiner les piliers d’investissement" },
    notice: "Cette page ne revendique aucun historique d’investissement, portefeuille client, historique de transactions, réseau de bureaux ou statut réglementaire non fourni et approuvé par DESCO Global.",
    sectionEyebrow: "Raison d’être de la plateforme", sectionTitle: "Une interface plus claire entre préparation des projets et examen investisseur.",
    cards: [{ title: "Structure du projet", body: "Aider les porteurs à organiser les informations publiques et restreintes dans un format cohérent." }, { title: "Filtrage des capitaux", body: "Aider les investisseurs à comparer les opportunités aux critères explicites de leur mandat." }, { title: "Diligence contrôlée", body: "Donner aux porteurs le contrôle des informations confidentielles et des décisions d’accès." }, { title: "Coordination stratégique", body: "Faciliter réunions, communications et prochaines étapes entre organisations autorisées." }],
    partnersCta: "Examiner le modèle de conseil", inquiryCta: "Transmettre une demande",
  },
  diligence: {
    ...en.diligence,
    metadata: { title: "Fonctionnement de la diligence — DESCO Compass", description: "Comprendre le filtrage public, les demandes d’accès, les documents restreints et les échanges avec les porteurs." },
    hero: { eyebrow: "Diligence contrôlée", title: "L’accès à l’information doit suivre une décision de filtrage justifiée.", body: "DESCO Compass sépare les informations publiques des documents financiers, techniques, juridiques et transactionnels soumis à autorisation.", primary: "Examiner les opportunités publiques", secondary: "Lire les normes de divulgation" },
    accessState: "Statut d’accès", statuses: ["Présentation publique", "Demande en attente", "Restreint", "Accès approuvé"], accessNote: "Les décisions d’accès doivent identifier l’utilisateur, l’organisation, le projet, le périmètre d’autorisation et la décision.",
    processEyebrow: "Processus investisseur", processTitle: "Du filtrage public à l’examen contrôlé.",
    process: [
      { title: "Examiner la présentation publique", body: "Lire la thèse, le porteur, le stade, le besoin en capital, les risques et la synthèse de divulgation." },
      { title: "Évaluer l’adéquation au mandat", body: "Comparer les champs divulgués aux critères d’investissement de votre organisation." },
      { title: "Demander un accès contrôlé", body: "Expliquer votre intérêt et demander les documents restreints nécessaires." },
      { title: "Examiner les documents confidentiels", body: "Accéder uniquement aux dossiers couverts par l’autorisation du porteur." },
      { title: "Rencontrer le porteur", body: "Organiser une réunion lorsque les informations disponibles justifient la poursuite des échanges." },
      { title: "Poursuivre indépendamment", body: "Mener la diligence professionnelle et négocier toute transaction hors plateforme." },
    ],
    roomEyebrow: "Structure de la data room", roomTitle: "Une architecture documentaire prévisible.", roomBody: "La disponibilité des dossiers dépend des documents fournis et de l’accès approuvé.", folderLabel: "Dossier",
    folders: ["Synthèse exécutive", "Informations sur la société et le porteur", "Informations financières", "Études techniques", "Juridique et réglementaire", "Terrains, permis et concessions", "ESG et communautés", "Accords commerciaux", "Risques et assurances", "Documents transactionnels"],
    notice: "Nous facilitons le filtrage, l’échange contrôlé d’informations et les prises de contact. Nous ne remplaçons pas la diligence juridique, financière, technique, fiscale, ESG ou commerciale.",
  },
  investors: {
    ...en.investors,
    metadata: { title: "Pour les investisseurs — DESCO Compass", description: "Filtrer les opportunités structurées selon un mandat avant d’engager des ressources de diligence." },
    hero: { eyebrow: "Parcours investisseur", title: "Évaluez l’adéquation au mandat avant d’engager une diligence complète.", body: "Nous aidons les investisseurs institutionnels, fonds, family offices, prêteurs et investisseurs stratégiques à filtrer les opportunités et à contrôler le passage vers un examen approfondi.", primary: "Demander un accès investisseur", secondary: "Examiner les opportunités" },
    preview: "Aperçu du mandat", mandateFields: ["Secteurs privilégiés", "Ciblage géographique", "Taille du ticket", "Instrument d’investissement", "Stade du projet", "Exigences d’impact", "Tolérance au risque", "Préférence de contrôle"],
    matchingNote: "Le rapprochement utilise les champs divulgués et des critères déterministes. Le critère de ticket ne s’applique que lorsqu’un besoin actuel en capital est communiqué. Il s’agit d’un outil de filtrage, pas d’un conseil en investissement.",
    previewCopy: { title: "Tester les dossiers en préparation", instruction: "Choisissez des critères pour voir quels dossiers publics restent dans le périmètre.", sector: "Secteur", stage: "Stade du projet", instrument: "Instrument", all: "Tous", resultOne: "{count} dossier correspond", resultMany: "{count} dossiers correspondent", empty: "Aucun dossier en préparation ne correspond à cette combinaison.", capitalNote: "Le filtrage par ticket est indisponible car aucun dossier public ne communique actuellement un besoin en capital. Une donnée manquante n’est pas traitée comme une correspondance.", review: "Examiner" },
    sectionEyebrow: "Modèle opérationnel investisseur", sectionTitle: "Examiner les opportunités selon des critères de mandat définis.",
    cards: [{ title: "Réduire le bruit d’origination", body: "Commencer par des présentations comparables, des porteurs identifiés et des lacunes visibles avant de mobiliser les analystes." }, { title: "Préparer une note de filtrage pour le comité", body: "Conserver les dates des sources, le statut de divulgation et les critères d’adéquation au mandat dans un format cohérent." }, { title: "Maîtriser le coût de la diligence approfondie", body: "Demander les documents restreints et l’échange avec le porteur uniquement lorsque le dossier public justifie la suite." }],
    steps: [
      { title: "Définir les critères d’investissement", body: "Enregistrer secteurs, géographies, ticket, instrument, stade et exclusions." },
      { title: "Examiner les opportunités publiques", body: "Comparer thèses, besoins en capital, porteurs, risques et divulgation." },
      { title: "Évaluer l’adéquation au mandat", body: "Identifier les critères satisfaits, partiels, exclus ou manquants." },
      { title: "Demander l’accès", body: "Demander les documents financiers, techniques et juridiques lorsque le dossier public le justifie." },
      { title: "Collaborer", body: "Enregistrer et comparer les opportunités, puis coordonner réunions, messages et étapes." },
      { title: "Poursuivre indépendamment", body: "Mener votre propre diligence et prendre votre décision hors plateforme." },
    ],
    notice: "Ce parcours s’adresse aux investisseurs institutionnels, fonds, prêteurs, investisseurs stratégiques et family offices qualifiés. Il ne s’agit ni d’un service d’investissement de détail, ni d’une plateforme de négociation, ni d’une recommandation. Les investisseurs restent responsables de leur diligence et de leurs décisions.",
    applyCta: "Demander un espace investisseur",
  },
  sponsors: {
    ...en.sponsors,
    metadata: { title: "Pour les porteurs de projet — DESCO Compass", description: "Préparer un dossier structuré et gérer une diligence investisseur contrôlée." },
    hero: { eyebrow: "Parcours porteur de projet", title: "Préparez votre projet à un examen investisseur institutionnel.", body: "Transformez des informations fragmentées en dossier institutionnel structuré, présentation publique claire et diligence à accès contrôlé.", primary: "Évaluer la maturité du projet", secondary: "Discuter de l’accompagnement" },
    framework: "Cadre de préparation", underReview: "En cours d’examen", required: "Requis",
    readiness: ["Informations sur le porteur", "Structure du projet", "Analyse de marché", "Maturité technique", "Modèle financier", "Position juridique et réglementaire", "Terrains et permis", "ESG et communautés", "Divulgation des risques", "Documents justificatifs"],
    sectionEyebrow: "Préparation du projet", sectionTitle: "Structurez le dossier public, puis contrôlez l’examen approfondi.", sectionBody: "Le parcours couvre la préparation, la soumission, la divulgation, la fiche publique, les documents confidentiels, les décisions d’accès et les échanges investisseurs.",
    process: [
      { title: "Évaluer la préparation", body: "Identifier les lacunes concernant le porteur, le projet, le marché, les finances, le juridique, l’ESG et les documents." },
      { title: "Préparer des informations structurées", body: "Transformer les documents fragmentés en champs cohérents, références de preuve et divulgations claires." },
      { title: "Achever l’examen DESCO", body: "Résoudre les questions d’exhaustivité et de cohérence interne avant publication." },
      { title: "Publier une présentation publique", body: "Fournir assez d’informations pour le filtrage sans exposer les documents restreints." },
      { title: "Examiner les demandes d’accès", body: "Approuver ou refuser les utilisateurs qualifiés et garder le contrôle des informations confidentielles." },
      { title: "Coordonner les échanges", body: "Gérer réunions, documents, messages et prochaines étapes dans l’espace." },
    ],
    notice: "L’examen DESCO porte sur la structure, l’exhaustivité et la cohérence interne. Il ne constitue ni approbation juridique, ni recommandation, ni vérification indépendante.",
    startCta: "Commencer une soumission structurée",
  },
  partners: {
    ...en.partners,
    metadata: { title: "Modèle de conseil — DESCO Compass", description: "Comment les spécialistes juridiques, financiers, techniques, publics et de développement peuvent accompagner les opportunités structurées." },
    hero: { eyebrow: "Modèle de conseil", title: "Chaque intervention spécialisée repose sur un projet, un périmètre et une autorisation définis.", body: "DESCO peut coordonner des spécialistes approuvés pour la préparation, la diligence et les échanges investisseurs. Une affiliation n’est publiée qu’après documentation de la mission et de l’autorisation de publication.", primary: "Discuter d’un mandat spécialisé", secondary: "Examiner le modèle de diligence" },
    sectionEyebrow: "Modèle de participation", sectionTitle: "Rôles définis, accès autorisé et livrables attribués.",
    cards: [{ title: "Conseillers juridiques et transactionnels", body: "Accompagner la structuration juridique, la divulgation, l’examen des documents et l’exécution." }, { title: "Conseillers financiers et prêteurs", body: "Accompagner la modélisation financière, la structure du capital, l’analyse crédit et les échanges investisseurs." }, { title: "Spécialistes techniques et ESG", body: "Accompagner les études de faisabilité, l’ingénierie et les examens environnementaux, sociaux et opérationnels." }, { title: "Institutions publiques et de développement", body: "Accompagner la coordination publique, le contexte réglementaire et l’alignement de développement." }],
    notice: "Cette page décrit les compétences de conseil qu’un projet peut exiger. Elle ne constitue pas un annuaire de conseillers nommés ou d’institutions affiliées.",
    startCta: "Discuter d’un mandat spécialisé",
  },
  pricing: {
    ...en.pricing,
    metadata: { title: "Modèle commercial — DESCO Compass", description: "Comment DESCO Compass propose de structurer l’accès des investisseurs, porteurs et partenaires institutionnels." },
    hero: { eyebrow: "Modèle commercial", title: "L’accès institutionnel doit avoir un périmètre et des conditions documentés.", body: "DESCO Compass ne traite actuellement aucun paiement, n’émet aucune facture et ne propose aucun abonnement en libre-service. Ces parcours décrivent un modèle assisté proposé à la discussion.", primary: "Discuter du périmètre commercial", secondary: "Examiner le parcours investisseur" },
    heroNotice: "Aucun prestataire de paiement n’est connecté. Aucune configuration affichée n’est facturée, un revenu encaissé ou un devis approuvé.",
    pathsEyebrow: "Parcours proposés", pathsTitle: "Des utilisateurs différents exigent des structures commerciales différentes.", pathsBody: "Le produit public doit préciser qui paie, ce que couvrent les frais, ce qui reste propre au projet et quels services exigent un mandat distinct.",
    paths: [
      { audience: "Investisseurs", title: "Espace institutionnel", model: "Licence organisationnelle annuelle proposée", includes: ["Configuration du mandat et filtrage", "Comparaison, recherches enregistrées et travail en équipe", "Demandes d’accès restreint par projet", "Périmètre d’intégration et d’assistance convenu"] },
      { audience: "Porteurs de projet", title: "Préparation et diligence contrôlée", model: "Mission proposée selon le périmètre", includes: ["Réception du projet et analyse des lacunes", "Préparation de la présentation publique", "Data room contrôlée et gestion des demandes", "Conseil supplémentaire sous contrat distinct"] },
      { audience: "IFD, gouvernements et partenaires", title: "Espace programme", model: "Accord de programme sur mesure", includes: ["Configuration au niveau portefeuille ou corridor", "Conception de la gouvernance, du reporting et des accès", "Services de mise en œuvre et d’assistance définis", "Conditions commerciales selon le périmètre approuvé"] },
    ],
    defineScope: "Définir le périmètre", safeguardsEyebrow: "Garanties commerciales", safeguardsTitle: "Les frais doivent rester distincts des décisions d’accès et des affirmations d’investissement.",
    principles: [{ title: "Contrat au niveau de l’organisation", body: "L’usage institutionnel doit être contracté avec une organisation et des rôles définis, pas comme un abonnement individuel." }, { title: "L’accès est distinct du résultat", body: "Les frais ne doivent impliquer ni approbation, ni allocation, ni performance, ni accès à toutes les data rooms." }, { title: "Le conseil a un périmètre explicite", body: "La préparation, l’accompagnement transactionnel ou la diligence spécialisée exigent une mission distincte avec des livrables nommés." }, { title: "Les commissions de succès exigent un avis juridique", body: "Aucune commission ne doit être proposée avant approbation de l’activité, de la juridiction, des autorisations et des conflits." }],
    beforeEyebrow: "Avant contractualisation", beforeTitle: "Les conditions commerciales exigent un périmètre approuvé.", beforeBody: "DESCO doit confirmer l’entité contractante, les services, les rôles, l’assistance, le traitement des données, les achats et les restrictions juridictionnelles avant tout devis.", beforeNotice: "Les tarifs publics resteront non publiés tant que devise, taxes, facturation, renouvellement, résiliation, niveaux de service, conservation des données et rémunération réglementée ne sont pas approuvés.", discussCta: "Discuter du périmètre commercial",
  },
  trust: {
    ...en.trust,
    metadata: { title: "Confiance et divulgation — DESCO Compass", description: "Comment DESCO Compass qualifie les informations, le statut d’examen, l’accès restreint et les preuves." },
    hero: { eyebrow: "Confiance et divulgation", title: "Le statut et les preuves sont présentés sans suggérer d’approbation.", body: "DESCO Compass décrit les informations et contrôles d’accès selon les actions effectuées, leur source et les preuves disponibles.", primary: "Lire la méthodologie juridique", secondary: "Comprendre l’accès contrôlé" },
    heroNotice: "Rien sur DESCO Compass ne constitue une offre de titres, un conseil en investissement, une garantie financière ou une approbation juridique.",
    sectionEyebrow: "Langage de divulgation", sectionTitle: "Des statuts conçus pour rester clairs sous examen.",
    statuses: [{ title: "Fourni par le porteur", body: "Information fournie par le porteur et non vérifiée indépendamment.", tone: "pending" }, { title: "Examiné par DESCO", body: "Examiné pour la structure, l’exhaustivité et la cohérence interne.", tone: "reviewed" }, { title: "Vérification indépendante en attente", body: "Aucune validation tierce approuvée n’est enregistrée.", tone: "pending" }, { title: "Document vérifié", body: "Un document précis dispose d’un enregistrement de vérification et d’un périmètre défini.", tone: "reviewed" }, { title: "Restreint", body: "Seuls les utilisateurs authentifiés et approuvés peuvent accéder à l’information.", tone: "restricted" }, { title: "Approuvé pour publication", body: "Un administrateur a approuvé la publication; cela ne constitue pas une recommandation.", tone: "public" }],
    controls: [{ title: "Examen des informations", body: "DESCO examine la structure, l’exhaustivité et la cohérence interne. Il ne s’agit pas d’une vérification indépendante." }, { title: "Statut de la fiche", body: "Les administrateurs DESCO enregistrent et gèrent le statut. Il ne constitue ni approbation ni recommandation." }, { title: "Accès à la data room", body: "Les documents confidentiels sont réservés aux utilisateurs approuvés via un accès contrôlé." }, { title: "Journal d’activité", body: "L’activité significative et les décisions d’accès peuvent être journalisées." }, { title: "Opportunités liées à DESCO", body: "Lorsqu’un lien existe entre DESCO et le porteur ou la plateforme de développement, la fiche l’indique. L’examen DESCO reste interne; toute vérification indépendante exige un tiers approuvé et un périmètre défini." }, { title: "Diligence pays et intégrité", body: "Avant tout échange institutionnel, chaque projet exige un examen adapté de la propriété effective, des sanctions et PEP, de l’anticorruption, des titres, permis, chaînes d’approvisionnement, conditions de travail, communautés et risques environnementaux." }, { title: "Données souveraines et de projet", body: "Avant tout dépôt de données confidentielles, le contrat doit définir la région d’hébergement, les sous-traitants, les accès, la conservation, l’export, la suppression et le droit applicable. Le site public ne promet aucune résidence précise des données." }],
    notice: "La plateforme ne revendique pas de contrôles AML ou KYC achevés, de certification SOC 2, de conformité RGPD, d’approbation publique, de rendement garanti ou de vérification indépendante sans preuve approuvée et délimitée.",
  },
};

const es: MarketingCopy = completeTranslation("es");
const pt: MarketingCopy = completeTranslation("pt");
const zh: MarketingCopy = completeTranslation("zh");

function completeTranslation(locale: "es" | "pt" | "zh"): MarketingCopy {
  const tr = (esText: string, ptText: string, zhText: string) =>
    ({ es: esText, pt: ptText, zh: zhText })[locale];
  const card = (esTitle: string, ptTitle: string, zhTitle: string, esBody: string, ptBody: string, zhBody: string): Card => ({
    title: tr(esTitle, ptTitle, zhTitle),
    body: tr(esBody, ptBody, zhBody),
  });
  const step = card;

  return {
    home: {
      metadata: {
        title: tr("DESCO Compass — Oportunidades estructuradas en la RDC", "DESCO Compass — Oportunidades estruturadas na RDC", "DESCO Compass — 刚果（金）结构化投资机会"),
        description: tr("Revise oportunidades seleccionadas en la RDC mediante divulgación coherente, selección según mandato y diligencia controlada.", "Analise oportunidades selecionadas na RDC através de divulgação coerente, seleção segundo o mandato e diligência controlada.", "通过一致的信息披露、基于投资授权的筛选和受控尽调，审阅刚果民主共和国的精选项目机会。"),
      },
      featured: tr("Ficha de oportunidad destacada", "Ficha de oportunidade em destaque", "重点项目简介"),
      whyFeatured: tr("Por qué se destaca", "Por que está em destaque", "入选原因"),
      featuredStatus: tr("Estado público actual", "Estado público atual", "当前公开状态"),
      featuredReason: tr("Es la única oportunidad publicada respaldada por una propuesta técnica fechada y un presupuesto preliminar. La selección no constituye respaldo ni indica que esté lista para inversión.", "É a única oportunidade publicada sustentada por uma proposta técnica datada e um orçamento preliminar. A seleção não constitui aprovação nem indica preparação para investimento.", "这是唯一具有明确日期技术方案和初步预算支持的公开项目。入选不构成认可，也不表示项目已达到投资准备状态。"),
      publicTeaser: tr("Presentación pública", "Apresentação pública", "公开简介"),
      capitalSought: tr("Capital solicitado", "Capital procurado", "融资需求"),
      projectStage: tr("Etapa del proyecto", "Fase do projeto", "项目阶段"),
      sector: tr("Sector", "Setor", "行业"),
      location: tr("Ubicación", "Localização", "地点"),
      disclosure: tr("Divulgación", "Divulgação", "披露"),
      sponsorProvided: tr("Proporcionado por el promotor", "Fornecido pelo promotor", "项目发起方提供"),
      dataRoom: tr("Sala de datos", "Sala de dados", "数据室"),
      readinessNotPublic: tr("Preparación no pública", "Preparação não pública", "准备状态未公开"),
      reviewOpportunity: tr("Revisar oportunidad", "Analisar oportunidade", "查看项目"),
      investorBenefits: [
        tr("Reducir el ruido de originación con una selección de proyectos de la RDC", "Reduzir o ruído de originação com uma seleção de projetos da RDC", "通过精选刚果民主共和国项目减少低效项目搜寻"),
        tr("Comparar oportunidades mediante una estructura común de divulgación", "Comparar oportunidades através de uma estrutura comum de divulgação", "使用统一披露结构比较项目"),
        tr("Incorporar fechas, lagunas de evidencia y procedencia al análisis del comité de inversión", "Levar datas, lacunas de evidência e proveniência para a análise do comité de investimento", "将来源日期、证据缺口和资料出处用于投委会筛选"),
        tr("Solicitar diligencia adicional solo cuando el caso público lo justifique", "Solicitar diligência adicional apenas quando o caso público o justifique", "仅在公开资料支持时申请进一步尽调"),
      ],
      sponsorBenefits: [
        tr("Preparar una ficha institucional", "Preparar uma ficha institucional", "准备机构级项目资料"),
        tr("Controlar el acceso a la información confidencial", "Controlar o acesso à informação confidencial", "控制保密信息访问"),
        tr("Coordinar la relación con inversores tras revisar el acceso", "Coordenar o contacto com investidores após análise do acesso", "在访问审核后协调投资者沟通"),
      ],
      capitalRepresented: tr("oportunidades públicas", "oportunidades públicas", "个公开项目"),
      projectCostCoverage: (_count, total) => tr(`${total} oportunidades utilizan una estructura común de divulgación pública.`, `${total} oportunidades utilizam uma estrutura comum de divulgação pública.`, `${total} 个项目采用统一的公开披露结构。`),
      sponsorFigures: tr("Las necesidades de capital se presentan por separado para cada proyecto", "As necessidades de capital são apresentadas separadamente por projeto", "融资需求按项目分别披露"),
      processEyebrow: tr("Proceso de diligencia del inversor", "Processo de diligência do investidor", "投资者尽调流程"),
      processTitle: tr("Un proceso controlado desde la selección hasta la revisión detallada.", "Um processo controlado desde a seleção até à análise aprofundada.", "从初步筛选到深入审查的受控流程。"),
      processBody: tr("Organizamos la selección, el intercambio de información y el contacto. Los inversores siguen siendo responsables de su propia diligencia jurídica, financiera, técnica y comercial.", "Organizamos a seleção, a troca de informação e o contacto. Os investidores continuam responsáveis pela sua própria diligência jurídica, financeira, técnica e comercial.", "我们组织项目筛选、信息交换和沟通。投资者仍须自行完成法律、财务、技术和商业尽调。"),
      process: [
        step("Revisar la presentación pública", "Analisar a apresentação pública", "审阅公开简介", "Evaluar la tesis, el capital, el promotor, la etapa, los riesgos y la divulgación.", "Avaliar a tese, o capital, o promotor, a fase, os riscos e a divulgação.", "评估投资逻辑、融资需求、发起方、阶段、风险及披露状态。"),
        step("Evaluar la adecuación al mandato", "Avaliar o alinhamento com o mandato", "评估投资授权匹配度", "Comparar sector, geografía, tamaño de inversión e instrumento con los criterios guardados.", "Comparar setor, geografia, montante e instrumento com os critérios guardados.", "将行业、地区、投资规模和工具与已保存的投资标准比较。"),
        step("Solicitar acceso controlado", "Solicitar acesso controlado", "申请受控访问", "Pedir al promotor acceso a material financiero, técnico y jurídico restringido.", "Pedir ao promotor acesso a material financeiro, técnico e jurídico restrito.", "向项目发起方申请访问受限的财务、技术和法律资料。"),
        step("Revisar material confidencial", "Analisar material confidencial", "审阅保密资料", "Utilizar la sala autorizada y el historial de actividad registrado.", "Utilizar a sala autorizada e o histórico de atividade registado.", "使用权限受控的数据室及已记录的活动历史。"),
        step("Reunirse con el promotor", "Reunir com o promotor", "与项目发起方会谈", "Solicitar una reunión cuando la información disponible justifique avanzar.", "Solicitar uma reunião quando a informação disponível justificar o avanço.", "当现有信息支持进一步接洽时申请会谈。"),
        step("Avanzar de forma independiente", "Prosseguir de forma independente", "独立推进", "Completar la diligencia fuera de la plataforma.", "Concluir a diligência fora da plataforma.", "在平台之外完成独立尽调。"),
      ],
      processCta: tr("Revisar el proceso completo de diligencia", "Analisar o processo completo de diligência", "查看完整尽调流程"),
      trustEyebrow: tr("Confianza y divulgación", "Confiança e divulgação", "信任与披露"),
      trustTitle: tr("Los estados de revisión y los controles de acceso se definen de forma expresa.", "Os estados de análise e os controlos de acesso são definidos de forma expressa.", "明确说明审查状态和访问控制。"),
      trustBody: tr("Distinguimos la información pública, proporcionada por el promotor, revisada por DESCO, restringida y verificada de forma independiente. Ningún estado constituye respaldo de inversión.", "Distinguimos informação pública, fornecida pelo promotor, analisada pela DESCO, restrita e verificada de forma independente. Nenhum estado constitui aprovação de investimento.", "我们区分公开信息、发起方提供的信息、DESCO 已审查信息、受限信息和独立核实信息。任何状态均不构成投资认可。"),
      controls: [
        card("Revisión estructurada del proyecto", "Análise estruturada do projeto", "结构化项目审查", "DESCO revisa estructura, integridad y coherencia interna antes de publicar. No es verificación independiente.", "A DESCO analisa estrutura, completude e coerência interna antes da publicação. Não é verificação independente.", "DESCO 在发布前审查资料的结构、完整性和内部一致性，但这不属于独立投资核实。"),
        card("Estado de divulgación claro", "Estado de divulgação claro", "清晰的披露状态", "Los módulos identifican información del promotor, revisada, pendiente y restringida.", "Os módulos identificam informação do promotor, analisada, pendente e restrita.", "公开模块区分发起方提供、DESCO 已审查、待审查和受限信息。"),
        card("Salas con acceso controlado", "Salas com acesso controlado", "权限受控的数据室", "Los documentos confidenciales requieren una sesión autenticada y una autorización expresa y revocable.", "Os documentos confidenciais exigem uma sessão autenticada e uma autorização expressa e revogável.", "保密文件须通过已验证会话及明确且可撤销的授权访问。"),
        card("Actividad de acceso registrada", "Atividade de acesso registada", "访问活动记录", "Las decisiones de acceso, descargas y cambios de flujo pueden registrarse.", "As decisões de acesso, transferências e alterações de fluxo podem ser registadas.", "重要访问决定、下载及流程变更可被记录。"),
        card("Confidencialidad controlada por el promotor", "Confidencialidade controlada pelo promotor", "发起方控制保密访问", "El promotor decide qué usuarios aprobados acceden a la información restringida.", "O promotor decide que utilizadores aprovados acedem à informação restrita.", "项目发起方决定哪些获批用户可访问受限资料。"),
      ],
      trustNotice: tr("DESCO Compass no declara controles AML/KYC completados, certificación SOC 2, cumplimiento del RGPD, aprobación pública, rentabilidad garantizada ni verificación independiente sin pruebas aprobadas.", "A DESCO Compass não declara controlos AML/KYC concluídos, certificação SOC 2, conformidade com o RGPD, aprovação pública, retornos garantidos ou verificação independente sem provas aprovadas.", "除非有经批准的证据，DESCO Compass 不声称已完成反洗钱或客户身份识别、取得 SOC 2 认证、符合 GDPR、获得政府批准、保证回报或完成独立核实。"),
      trustCta: tr("Leer el marco de divulgación", "Ler o quadro de divulgação", "阅读披露框架"),
      nextEyebrow: tr("Elija el siguiente paso", "Escolha o passo seguinte", "选择下一步"),
      nextTitle: tr("Revise oportunidades o prepare un proyecto para la selección institucional.", "Analise oportunidades ou prepare um projeto para seleção institucional.", "审阅投资机会，或准备项目接受机构筛选。"),
      nextBody: tr("Los recorridos de inversores y promotores permanecen separados durante la selección, el acceso y la relación.", "Os percursos de investidores e promotores permanecem separados durante a seleção, o acesso e o contacto.", "投资者和项目发起方的流程在筛选、访问决定和沟通阶段保持分离。"),
      reviewCta: tr("Revisar oportunidades", "Analisar oportunidades", "审阅投资机会"),
      prepareCta: tr("Preparar un proyecto", "Preparar um projeto", "准备项目"),
    },
    about: {
      metadata: { title: tr("Acerca de DESCO Global — DESCO Compass", "Sobre a DESCO Global — DESCO Compass", "关于 DESCO Global — DESCO Compass"), description: tr("El papel de DESCO Global en la conexión de proyectos estructurados, capital y socios estratégicos.", "O papel da DESCO Global na ligação entre projetos estruturados, capital e parceiros estratégicos.", "DESCO Global 在连接结构化项目、资本和战略合作伙伴方面的角色。") },
      hero: { eyebrow: tr("Acerca de DESCO Global", "Sobre a DESCO Global", "关于 DESCO Global"), title: tr("Conectar proyectos estructurados, capital y socios estratégicos.", "Ligar projetos estruturados, capital e parceiros estratégicos.", "连接结构化项目、资本与战略合作伙伴。"), body: tr("Operamos DESCO Compass como plataforma de oportunidades y diligencia, centrada inicialmente en la RDC y con capacidad para apoyar mercados africanos seleccionados.", "Operamos a DESCO Compass como plataforma de oportunidades e diligência, inicialmente centrada na RDC e com capacidade para apoiar mercados africanos selecionados.", "我们运营 DESCO Compass 投资机会与尽调平台，初期重点覆盖刚果民主共和国，并可支持部分非洲市场。"), primary: tr("Contactar con DESCO Global", "Contactar a DESCO Global", "联系 DESCO Global"), secondary: tr("Revisar los pilares de inversión", "Analisar os pilares de investimento", "查看投资业务支柱") },
      notice: tr("Esta página no atribuye a DESCO Global un historial de inversión, lista de clientes, operaciones, red de oficinas o situación regulatoria que no haya sido aportada y aprobada.", "Esta página não atribui à DESCO Global um histórico de investimento, lista de clientes, transações, rede de escritórios ou estatuto regulamentar que não tenha sido fornecido e aprovado.", "本页不声称 DESCO Global 拥有未经其提供和批准的投资业绩、客户名单、交易记录、办公网络或监管资质。"),
      sectionEyebrow: tr("Función de la plataforma", "Função da plataforma", "平台定位"),
      sectionTitle: tr("Una interfaz más clara entre la preparación de proyectos y la revisión del inversor.", "Uma interface mais clara entre a preparação de projetos e a análise do investidor.", "在项目准备与投资者审查之间建立更清晰的界面。"),
      cards: [
        card("Estructuración del proyecto", "Estruturação do projeto", "项目结构", "Ayudar a organizar información pública y restringida en un formato coherente.", "Ajudar a organizar informação pública e restrita num formato coerente.", "帮助发起方以一致格式组织公开和受限信息。"),
        card("Selección de capital", "Seleção de capital", "资本筛选", "Ayudar a comparar oportunidades divulgadas con criterios expresos del mandato.", "Ajudar a comparar oportunidades divulgadas com critérios expressos do mandato.", "帮助投资者将已披露机会与明确的授权标准比较。"),
        card("Diligencia controlada", "Diligência controlada", "受控尽调", "Dar al promotor control sobre información confidencial y decisiones de acceso.", "Dar ao promotor controlo sobre informação confidencial e decisões de acesso.", "让项目发起方控制保密资料及访问决定。"),
        card("Coordinación estratégica", "Coordenação estratégica", "战略协调", "Apoyar reuniones, comunicaciones y siguientes pasos entre organizaciones autorizadas.", "Apoiar reuniões, comunicações e passos seguintes entre organizações autorizadas.", "支持获授权机构之间的会议、沟通和后续行动。"),
      ],
      partnersCta: tr("Revisar el modelo de asesoramiento", "Analisar o modelo de assessoria", "查看顾问协作模式"),
      inquiryCta: tr("Enviar una consulta", "Enviar um pedido", "提交咨询"),
    },
    diligence: translatedDiligence(locale, tr, step),
    investors: translatedInvestors(locale, tr, card, step),
    sponsors: translatedSponsors(locale, tr, card, step),
    partners: translatedPartners(locale, tr, card),
    pricing: translatedPricing(locale, tr, card),
    trust: translatedTrust(locale, tr, card),
  };
}

type Tr = (es: string, pt: string, zh: string) => string;
type CardFactory = (esTitle: string, ptTitle: string, zhTitle: string, esBody: string, ptBody: string, zhBody: string) => Card;

function translatedDiligence(locale: "es" | "pt" | "zh", tr: Tr, step: CardFactory): MarketingCopy["diligence"] {
  return {
    metadata: { title: tr("Cómo funciona la diligencia — DESCO Compass", "Como funciona a diligência — DESCO Compass", "尽调流程 — DESCO Compass"), description: tr("Comprenda la selección pública, las solicitudes de acceso, los documentos restringidos y la relación con el promotor.", "Compreenda a seleção pública, os pedidos de acesso, os documentos restritos e o contacto com o promotor.", "了解公开筛选、访问申请、受限文件及与项目发起方的沟通。") },
    hero: { eyebrow: tr("Diligencia controlada", "Diligência controlada", "受控尽调"), title: tr("El acceso a la información debe seguir a una decisión de selección justificada.", "O acesso à informação deve seguir uma decisão de seleção fundamentada.", "信息访问应建立在有依据的筛选决定之上。"), body: tr("DESCO Compass separa la información pública del material financiero, técnico, jurídico y transaccional sujeto a permisos.", "A DESCO Compass separa a informação pública do material financeiro, técnico, jurídico e transacional sujeito a autorização.", "DESCO Compass 将公开筛选信息与需要权限的财务、技术、法律和交易资料分开管理。"), primary: tr("Revisar oportunidades públicas", "Analisar oportunidades públicas", "查看公开投资机会"), secondary: tr("Leer las normas de divulgación", "Ler as normas de divulgação", "阅读披露标准") },
    accessState: tr("Estado de acceso", "Estado de acesso", "访问状态"),
    statuses: [tr("Presentación pública", "Apresentação pública", "公开简介"), tr("Solicitud pendiente", "Pedido pendente", "申请待处理"), tr("Restringido", "Restrito", "受限"), tr("Acceso aprobado", "Acesso aprovado", "访问已获批")],
    accessNote: tr("Las decisiones deben identificar al usuario, la organización, el proyecto, el alcance del permiso y el registro de la decisión.", "As decisões devem identificar o utilizador, a organização, o projeto, o âmbito da permissão e o registo da decisão.", "访问决定应记录用户、机构、项目、权限范围及决定记录。"),
    processEyebrow: tr("Proceso del inversor", "Processo do investidor", "投资者流程"),
    processTitle: tr("De la selección pública a la revisión controlada.", "Da seleção pública à análise controlada.", "从公开筛选到受控审查。"),
    process: [
      step("Revisar la presentación pública", "Analisar a apresentação pública", "审阅公开简介", "Leer la tesis, el promotor, la etapa, el capital, los riesgos y la divulgación.", "Ler a tese, o promotor, a fase, o capital, os riscos e a divulgação.", "审阅项目逻辑、发起方、阶段、融资需求、风险及披露摘要。"),
      step("Evaluar la adecuación al mandato", "Avaliar o alinhamento com o mandato", "评估授权匹配度", "Comparar los campos divulgados con los criterios de su organización.", "Comparar os campos divulgados com os critérios da sua organização.", "将已披露字段与机构的投资标准比较。"),
      step("Solicitar acceso controlado", "Solicitar acesso controlado", "申请受控访问", "Explicar su interés y solicitar el material restringido necesario.", "Explicar o seu interesse e solicitar o material restrito necessário.", "说明投资兴趣并申请深入审查所需的受限资料。"),
      step("Revisar material confidencial", "Analisar material confidencial", "审阅保密资料", "Acceder solo a carpetas y documentos autorizados por el promotor.", "Aceder apenas a pastas e documentos autorizados pelo promotor.", "仅访问项目发起方批准范围内的文件夹和文件。"),
      step("Reunirse con el promotor", "Reunir com o promotor", "与项目发起方会谈", "Coordinar una reunión cuando la información disponible justifique avanzar.", "Coordenar uma reunião quando a informação disponível justificar o avanço.", "当现有信息支持进一步接洽时协调会谈。"),
      step("Avanzar de forma independiente", "Prosseguir de forma independente", "独立推进", "Realizar la diligencia profesional y negociar fuera de la plataforma.", "Realizar a diligência profissional e negociar fora da plataforma.", "在平台外完成专业尽调并协商交易。"),
    ],
    roomEyebrow: tr("Estructura de la sala de datos", "Estrutura da sala de dados", "数据室结构"),
    roomTitle: tr("Una arquitectura documental previsible.", "Uma arquitetura documental previsível.", "一致且可预期的文件架构。"),
    roomBody: tr("La disponibilidad depende de lo aportado por el promotor y del acceso aprobado.", "A disponibilidade depende do material fornecido pelo promotor e do acesso aprovado.", "文件夹是否可用取决于发起方提交情况及获批权限。"),
    folderLabel: tr("Carpeta", "Pasta", "文件夹"),
    folders: [
      tr("Resumen ejecutivo", "Resumo executivo", "执行概览"), tr("Información corporativa y del promotor", "Informação societária e do promotor", "公司及发起方信息"),
      tr("Información financiera", "Informação financeira", "财务信息"), tr("Estudios técnicos", "Estudos técnicos", "技术研究"),
      tr("Asuntos jurídicos y regulatorios", "Assuntos jurídicos e regulamentares", "法律与监管"), tr("Terrenos, permisos y concesiones", "Terrenos, licenças e concessões", "土地、许可与特许权"),
      tr("ESG y comunidad", "ESG e comunidade", "ESG 与社区"), tr("Acuerdos comerciales", "Acordos comerciais", "商业协议"),
      tr("Riesgos y seguros", "Riscos e seguros", "风险与保险"), tr("Documentos de transacción", "Documentos da transação", "交易文件"),
    ],
    notice: tr("Facilitamos la selección y el intercambio controlado. No sustituimos la diligencia jurídica, financiera, técnica, fiscal, ESG o comercial.", "Facilitamos a seleção e a troca controlada. Não substituímos a diligência jurídica, financeira, técnica, fiscal, ESG ou comercial.", "我们支持筛选及受控信息交换，但不能替代法律、财务、技术、税务、ESG 或商业尽调。"),
  };
}

function translatedInvestors(locale: "es" | "pt" | "zh", tr: Tr, card: CardFactory, step: CardFactory): MarketingCopy["investors"] {
  return {
    metadata: { title: tr("Para inversores — DESCO Compass", "Para investidores — DESCO Compass", "投资者 — DESCO Compass"), description: tr("Compare oportunidades estructuradas con un mandato antes de dedicar recursos a la diligencia.", "Compare oportunidades estruturadas com um mandato antes de dedicar recursos à diligência.", "在投入深入尽调资源前，根据投资授权筛选结构化机会。") },
    hero: { eyebrow: tr("Recorrido del inversor", "Percurso do investidor", "投资者路径"), title: tr("Evalúe la adecuación al mandato antes de una diligencia completa.", "Avalie o alinhamento com o mandato antes da diligência completa.", "开展全面尽调前，先判断项目是否符合投资授权。"), body: tr("Ayudamos a inversores institucionales, fondos, family offices, prestamistas y capital estratégico a seleccionar oportunidades y controlar el paso a una revisión detallada.", "Ajudamos investidores institucionais, fundos, family offices, credores e capital estratégico a selecionar oportunidades e controlar a passagem para uma análise aprofundada.", "我们帮助机构投资者、基金、家族办公室、贷款机构和战略资本筛选项目，并控制进入深入审查的过程。"), primary: tr("Solicitar acceso de inversor", "Solicitar acesso de investidor", "申请投资者权限"), secondary: tr("Revisar oportunidades", "Analisar oportunidades", "查看投资机会") },
    preview: tr("Vista previa del mandato", "Pré-visualização do mandato", "投资授权设置预览"),
    mandateFields: [tr("Sectores preferidos", "Setores preferidos", "偏好行业"), tr("Enfoque geográfico", "Foco geográfico", "地域重点"), tr("Tamaño de inversión", "Montante de investimento", "投资规模"), tr("Instrumento", "Instrumento", "投资工具"), tr("Etapa del proyecto", "Fase do projeto", "项目阶段"), tr("Requisitos de impacto", "Requisitos de impacto", "影响要求"), tr("Tolerancia al riesgo", "Tolerância ao risco", "风险承受度"), tr("Preferencia de control", "Preferência de controlo", "控制权偏好")],
    matchingNote: tr("La comparación utiliza campos divulgados y criterios deterministas. El tamaño de inversión solo se compara cuando existe una solicitud actual de capital divulgada. Es una ayuda de selección, no asesoramiento.", "A comparação utiliza campos divulgados e critérios determinísticos. O montante só é comparado quando existe um pedido atual de capital divulgado. É uma ajuda à seleção, não aconselhamento.", "匹配使用已披露项目字段及确定性标准。只有在披露当前融资需求时才进行投资规模匹配。该功能仅用于筛选，不构成投资建议。"),
    previewCopy: {
      title: tr("Probar los expedientes en preparación", "Testar os dossiês em preparação", "测试准备中的项目文件"),
      instruction: tr("Elija criterios para ver qué oportunidades publicadas permanecen dentro del mandato.", "Escolha critérios para ver quais oportunidades publicadas permanecem no âmbito.", "选择条件，查看哪些已发布项目仍符合授权范围。"),
      sector: tr("Sector", "Setor", "行业"), stage: tr("Etapa del proyecto", "Fase do projeto", "项目阶段"), instrument: tr("Instrumento", "Instrumento", "投资工具"), all: tr("Todos", "Todos", "全部"),
      resultOne: tr("{count} oportunidad coincide", "{count} oportunidade corresponde", "{count} 个项目符合条件"),
      resultMany: tr("{count} oportunidades coinciden", "{count} oportunidades correspondem", "{count} 个项目符合条件"),
      empty: tr("Ninguna oportunidad publicada coincide con esta combinación.", "Nenhuma oportunidade publicada corresponde a esta combinação.", "没有已发布项目符合此条件组合。"),
      capitalNote: tr("El filtro por tamaño no está disponible porque ninguna oportunidad pública divulga actualmente una solicitud de capital vigente. Los datos ausentes no se consideran coincidencias.", "O filtro por montante não está disponível porque nenhuma oportunidade pública divulga atualmente um pedido de capital vigente. Os dados em falta não são tratados como correspondência.", "由于当前公开项目均未披露现行融资需求，暂不提供投资规模筛选。缺失数据不会被视为匹配。"),
      review: tr("Revisar", "Analisar", "审阅"),
    },
    sectionEyebrow: tr("Modelo operativo del inversor", "Modelo operacional do investidor", "投资者操作模式"),
    sectionTitle: tr("Revise oportunidades con criterios de mandato definidos.", "Analise oportunidades com critérios de mandato definidos.", "按照明确的授权标准审阅项目。"),
    cards: [
      card("Reducir el ruido de originación", "Reduzir o ruído da originação", "减少项目搜寻噪音", "Empiece con presentaciones comparables, promotores identificados y carencias visibles antes de dedicar tiempo de análisis.", "Comece com apresentações comparáveis, promotores identificados e lacunas visíveis antes de mobilizar analistas.", "在投入分析资源前，先审阅可比较的公开简介、明确的发起方及可见的信息缺口。"),
      card("Preparar un registro para el comité", "Preparar um registo para o comité", "形成投委会筛选记录", "Conserve fechas de fuentes, estados de divulgación y criterios de mandato en un formato coherente.", "Registe datas das fontes, estados de divulgação e critérios do mandato num formato coerente.", "以统一格式保留来源日期、披露状态及投资授权匹配标准。"),
      card("Controlar el coste de la diligencia", "Controlar o custo da diligência", "控制深入尽调成本", "Solicite material restringido y contacto con el promotor solo cuando el caso público justifique avanzar.", "Solicite material restrito e contacto com o promotor apenas quando o caso público justificar o avanço.", "仅在公开资料支持进一步工作时申请受限材料及与项目发起方沟通。"),
    ],
    steps: [
      step("Definir criterios de inversión", "Definir critérios de investimento", "定义投资标准", "Registrar sectores, geografías, tamaño, instrumento, etapa y exclusiones.", "Registar setores, geografias, montante, instrumento, fase e exclusões.", "记录行业、地区、投资规模、工具、阶段和排除项。"),
      step("Revisar oportunidades públicas", "Analisar oportunidades públicas", "审阅公开项目", "Comparar tesis, capital, promotores, riesgos y divulgación.", "Comparar teses, capital, promotores, riscos e divulgação.", "比较项目逻辑、融资需求、发起方、风险及披露状态。"),
      step("Evaluar el mandato", "Avaliar o mandato", "评估授权匹配度", "Identificar criterios cumplidos, parciales, excluidos o ausentes.", "Identificar critérios cumpridos, parciais, excluídos ou em falta.", "识别符合、部分符合、排除或缺失的标准。"),
      step("Solicitar acceso", "Solicitar acesso", "申请访问", "Pedir material cuando la información pública justifique avanzar.", "Pedir material quando a informação pública justificar o avanço.", "当公开信息支持进一步审查时申请资料。"),
      step("Colaborar", "Colaborar", "协作", "Guardar, comparar y coordinar reuniones, mensajes y siguientes pasos.", "Guardar, comparar e coordenar reuniões, mensagens e passos seguintes.", "保存并比较项目，协调会议、消息及后续行动。"),
      step("Decidir de forma independiente", "Decidir de forma independente", "独立决策", "Completar su diligencia y decisión fuera de la plataforma.", "Concluir a sua diligência e decisão fora da plataforma.", "在平台外完成独立尽调和投资决定。"),
    ],
    notice: tr("Este recorrido está dirigido a inversores institucionales, fondos, prestamistas, inversores estratégicos y family offices cualificados. No es un servicio minorista, un mercado de negociación ni una recomendación. Los inversores son responsables de su diligencia y decisiones.", "Este percurso destina-se a investidores institucionais, fundos, credores, investidores estratégicos e family offices qualificados. Não é um serviço de retalho, uma plataforma de negociação ou uma recomendação. Os investidores são responsáveis pela diligência e decisões.", "该流程面向机构投资者、基金、贷款机构、战略投资者及合格家族办公室，不属于零售投资服务、交易场所或投资建议。投资者须自行负责尽调和决策。"),
    applyCta: tr("Solicitar un espacio de inversor", "Solicitar um espaço de investidor", "申请投资者工作区"),
  };
}

function translatedSponsors(locale: "es" | "pt" | "zh", tr: Tr, card: CardFactory, step: CardFactory): MarketingCopy["sponsors"] {
  return {
    metadata: { title: tr("Para promotores de proyectos — DESCO Compass", "Para promotores de projetos — DESCO Compass", "项目发起方 — DESCO Compass"), description: tr("Prepare una ficha estructurada y gestione una diligencia controlada.", "Prepare uma ficha estruturada e faça a gestão de uma diligência controlada.", "准备结构化项目资料并管理受控投资者尽调。") },
    hero: { eyebrow: tr("Recorrido del promotor", "Percurso do promotor", "项目发起方路径"), title: tr("Prepare su proyecto para la revisión de inversores institucionales.", "Prepare o seu projeto para a análise de investidores institucionais.", "为机构投资者审查做好项目准备。"), body: tr("Convierta información fragmentada en una ficha institucional, una presentación pública clara y una diligencia con permisos.", "Transforme informação fragmentada numa ficha institucional, numa apresentação pública clara e numa diligência com permissões.", "将分散信息整理为机构级项目资料、清晰的公开简介和权限受控的尽调流程。"), primary: tr("Evaluar la preparación", "Avaliar a preparação", "评估项目准备度"), secondary: tr("Hablar sobre apoyo al promotor", "Discutir apoio ao promotor", "讨论项目支持") },
    framework: tr("Marco de preparación", "Quadro de preparação", "准备度框架"),
    underReview: tr("En revisión", "Em análise", "审核中"),
    required: tr("Obligatorio", "Obrigatório", "必需"),
    readiness: [tr("Información del promotor", "Informação do promotor", "发起方信息"), tr("Estructura del proyecto", "Estrutura do projeto", "项目结构"), tr("Análisis de mercado", "Análise de mercado", "市场依据"), tr("Preparación técnica", "Preparação técnica", "技术准备度"), tr("Modelo financiero", "Modelo financeiro", "财务模型"), tr("Situación jurídica y regulatoria", "Situação jurídica e regulamentar", "法律与监管状况"), tr("Terrenos y permisos", "Terrenos e licenças", "土地与许可"), tr("ESG y comunidad", "ESG e comunidade", "ESG 与社区"), tr("Divulgación de riesgos", "Divulgação de riscos", "风险披露"), tr("Documentos justificativos", "Documentos de suporte", "支持文件")],
    sectionEyebrow: tr("Preparación del proyecto", "Preparação do projeto", "项目准备"),
    sectionTitle: tr("Estructure el caso público y controle la revisión detallada.", "Estruture o caso público e controle a análise aprofundada.", "先建立公开投资依据，再控制深入审查。"),
    sectionBody: tr("El recorrido cubre preparación, presentación, divulgación, documentos confidenciales, acceso y contacto con inversores.", "O percurso cobre preparação, submissão, divulgação, documentos confidenciais, acesso e contacto com investidores.", "该流程涵盖准备、提交、披露、公开资料、保密文件、访问决定及投资者沟通。"),
    process: [
      step("Evaluar la preparación", "Avaliar a preparação", "评估准备度", "Identificar carencias sobre promotor, proyecto, mercado, finanzas, asuntos jurídicos, ESG y documentos.", "Identificar lacunas sobre promotor, projeto, mercado, finanças, matérias jurídicas, ESG e documentos.", "识别发起方、项目、市场、财务、法律、ESG 和文件方面的缺口。"),
      step("Preparar información estructurada", "Preparar informação estruturada", "准备结构化信息", "Convertir material fragmentado en campos coherentes, referencias de evidencia y divulgación clara.", "Converter material fragmentado em campos coerentes, referências de prova e divulgação clara.", "将零散资料转化为一致字段、证据引用和清晰披露。"),
      step("Completar la revisión DESCO", "Concluir a análise DESCO", "完成 DESCO 审查", "Resolver cuestiones de integridad y coherencia antes de publicar.", "Resolver questões de completude e coerência antes da publicação.", "在发布前解决完整性和内部一致性问题。"),
      step("Publicar una presentación", "Publicar uma apresentação", "发布公开简介", "Ofrecer información suficiente para seleccionar sin exponer material restringido.", "Fornecer informação suficiente para seleção sem expor material restrito.", "提供足够的公开筛选信息，同时保护受限资料。"),
      step("Revisar solicitudes de acceso", "Analisar pedidos de acesso", "审查访问申请", "Aprobar o rechazar usuarios y mantener el control de la información confidencial.", "Aprovar ou recusar utilizadores e manter o controlo da informação confidencial.", "批准或拒绝用户，并保持对保密信息的控制。"),
      step("Coordinar la relación", "Coordenar o contacto", "协调沟通", "Gestionar reuniones, documentos, mensajes y siguientes pasos.", "Gerir reuniões, documentos, mensagens e passos seguintes.", "管理会议、文件、消息和后续行动。"),
    ],
    notice: tr("La revisión DESCO cubre estructura, integridad y coherencia interna. No es aprobación jurídica, respaldo del proyecto ni verificación independiente.", "A análise DESCO cobre estrutura, completude e coerência interna. Não é aprovação jurídica, apoio ao projeto ou verificação independente.", "DESCO 审查仅涉及结构、完整性和内部一致性，不构成法律批准、项目认可或独立投资核实。"),
    startCta: tr("Iniciar una presentación estructurada", "Iniciar uma submissão estruturada", "开始结构化提交"),
  };
}

function translatedPartners(locale: "es" | "pt" | "zh", tr: Tr, card: CardFactory): MarketingCopy["partners"] {
  return {
    metadata: { title: tr("Modelo de asesoramiento — DESCO Compass", "Modelo de assessoria — DESCO Compass", "顾问协作模式 — DESCO Compass"), description: tr("Cómo pueden apoyar las oportunidades los especialistas jurídicos, financieros, técnicos, públicos y de desarrollo.", "Como especialistas jurídicos, financeiros, técnicos, públicos e de desenvolvimento podem apoiar as oportunidades.", "法律、财务、技术、政府及发展领域专家如何支持结构化项目。") },
    hero: { eyebrow: tr("Modelo de asesoramiento", "Modelo de assessoria", "顾问协作模式"), title: tr("El trabajo especializado se define por proyecto, alcance y autoridad.", "O trabalho especializado é definido por projeto, âmbito e autoridade.", "专业工作按项目、范围和授权进行界定。"), body: tr("DESCO puede coordinar especialistas aprobados para la preparación, la diligencia y la relación con inversores. Una afiliación solo se publica después de documentar el nombramiento y la autorización.", "A DESCO pode coordenar especialistas aprovados para preparação, diligência e contacto com investidores. Uma afiliação só é publicada após documentar a nomeação e a autorização.", "DESCO 可协调获批专家参与项目准备、尽调和投资者沟通。只有在委任及发布授权形成文件后，才会公布关联关系。"), primary: tr("Analizar un mandato especializado", "Discutir um mandato especializado", "讨论专项委任"), secondary: tr("Revisar el modelo de diligencia", "Analisar o modelo de diligência", "查看尽调模式") },
    sectionEyebrow: tr("Modelo de participación", "Modelo de participação", "参与模式"),
    sectionTitle: tr("Funciones definidas, acceso autorizado y entregables responsables.", "Funções definidas, acesso autorizado e entregáveis atribuídos.", "明确角色、授权访问和可追责的交付成果。"),
    cards: [
      card("Asesores jurídicos y de transacción", "Consultores jurídicos e de transação", "法律与交易顾问", "Apoyar la estructura jurídica, la divulgación, la revisión documental y la ejecución.", "Apoiar a estrutura jurídica, a divulgação, a análise documental e a execução.", "支持法律架构、披露、文件审查及交易执行。"),
      card("Asesores financieros y prestamistas", "Consultores financeiros e credores", "财务顾问与贷款机构", "Apoyar el modelo financiero, la estructura de capital, el crédito y la relación con inversores.", "Apoiar o modelo financeiro, a estrutura de capital, o crédito e o contacto com investidores.", "支持财务建模、资本结构、信贷审查及投资者沟通。"),
      card("Especialistas técnicos y ESG", "Especialistas técnicos e ESG", "技术与 ESG 专家", "Apoyar la viabilidad, la ingeniería y las revisiones ambientales, sociales y operativas.", "Apoiar a viabilidade, a engenharia e as análises ambientais, sociais e operacionais.", "支持可行性、工程、环境、社会和运营审查。"),
      card("Instituciones públicas y de desarrollo", "Instituições públicas e de desenvolvimento", "政府与发展机构", "Apoyar la coordinación pública, el contexto de políticas y el desarrollo.", "Apoiar a coordenação pública, o contexto de políticas e o desenvolvimento.", "支持公共部门协调、政策背景及发展目标衔接。"),
    ],
    notice: tr("Esta página describe las capacidades de asesoramiento que puede requerir un proyecto. No es un directorio de asesores nombrados o instituciones afiliadas.", "Esta página descreve as capacidades de assessoria que um projeto pode exigir. Não é um diretório de consultores nomeados ou instituições afiliadas.", "本页说明项目可能需要的顾问能力，并非已委任顾问或关联机构名录。"),
    startCta: tr("Analizar un mandato especializado", "Discutir um mandato especializado", "讨论专项委任"),
  };
}

function translatedPricing(locale: "es" | "pt" | "zh", tr: Tr, card: CardFactory): MarketingCopy["pricing"] {
  return {
    metadata: { title: tr("Modelo comercial — DESCO Compass", "Modelo comercial — DESCO Compass", "商业模式 — DESCO Compass"), description: tr("Cómo propone DESCO Compass estructurar el acceso de inversores, promotores y socios institucionales.", "Como a DESCO Compass propõe estruturar o acesso de investidores, promotores e parceiros institucionais.", "DESCO Compass 拟如何安排投资者、项目发起方和机构合作伙伴的访问。") },
    hero: { eyebrow: tr("Modelo comercial", "Modelo comercial", "商业模式"), title: tr("El acceso institucional debe tener alcance y condiciones documentados.", "O acesso institucional deve ter âmbito e condições documentados.", "机构访问应有明确并记录在案的范围和条款。"), body: tr("DESCO Compass no procesa pagos, emite facturas ni ofrece suscripciones de autoservicio. Estas vías describen un modelo asistido propuesto, no precios vinculantes ni una oferta.", "A DESCO Compass não processa pagamentos, emite faturas ou oferece subscrições self-service. Estes percursos descrevem um modelo assistido proposto, não preços vinculativos nem uma oferta.", "DESCO Compass 目前不处理付款、不出具发票，也不提供自助订阅。以下路径仅说明拟议的销售支持模式，不构成约束性价格或要约。"), primary: tr("Hablar del alcance comercial", "Discutir o âmbito comercial", "讨论商业合作范围"), secondary: tr("Revisar el recorrido del inversor", "Analisar o percurso do investidor", "查看投资者路径") },
    heroNotice: tr("No hay procesador de pagos conectado. Ninguna configuración mostrada constituye facturación, ingresos cobrados o una cotización aprobada.", "Não existe processador de pagamentos ligado. Nenhuma configuração apresentada constitui faturação, receita cobrada ou cotação aprovada.", "目前未连接支付处理商。所展示的工作区配置不代表已计费、已收收入或经批准的报价。"),
    pathsEyebrow: tr("Vías propuestas", "Percursos propostos", "拟议路径"),
    pathsTitle: tr("Cada tipo de usuario requiere una estructura comercial distinta.", "Cada tipo de utilizador exige uma estrutura comercial distinta.", "不同用户需要不同的商业结构。"),
    pathsBody: tr("El producto debe explicar quién paga, qué cubre la tarifa, qué depende del proyecto y qué servicios requieren un mandato separado.", "O produto deve explicar quem paga, o que a tarifa cobre, o que depende do projeto e que serviços exigem um mandato separado.", "公开产品应说明由谁付费、费用涵盖什么、哪些事项取决于具体项目，以及哪些服务需要单独委托。"),
    paths: [
      { audience: tr("Inversores", "Investidores", "投资者"), title: tr("Espacio institucional", "Espaço institucional", "机构工作区"), model: tr("Licencia anual propuesta para la organización", "Licença anual proposta para a organização", "拟议年度机构许可"), includes: [tr("Configuración del mandato y selección", "Configuração do mandato e seleção", "投资授权设置及项目筛选"), tr("Comparación, investigación guardada y trabajo en equipo", "Comparação, pesquisa guardada e trabalho em equipa", "比较、保存研究及团队流程"), tr("Solicitudes de acceso restringido por proyecto", "Pedidos de acesso restrito por projeto", "特定项目受限访问申请"), tr("Incorporación y apoyo acordados con la organización", "Integração e apoio acordados com a organização", "与机构约定的入驻和支持范围")] },
      { audience: tr("Promotores de proyectos", "Promotores de projetos", "项目发起方"), title: tr("Preparación y diligencia controlada", "Preparação e diligência controlada", "项目准备与受控尽调"), model: tr("Encargo propuesto según el alcance", "Prestação proposta segundo o âmbito", "按范围拟定的服务"), includes: [tr("Recepción del proyecto y análisis de carencias", "Receção do projeto e análise de lacunas", "项目接收及披露缺口评估"), tr("Preparación de la oportunidad pública", "Preparação da oportunidade pública", "结构化公开项目准备"), tr("Sala documental y consultas controladas", "Sala documental e pedidos controlados", "受控文件室及咨询流程"), tr("Asesoramiento adicional contratado por separado", "Consultoria adicional contratada separadamente", "额外顾问服务另行签约")] },
      { audience: tr("IFD, gobiernos y socios", "IFD, governos e parceiros", "开发性金融机构、政府与合作伙伴"), title: tr("Espacio de programa", "Espaço de programa", "计划工作区"), model: tr("Acuerdo de programa a medida", "Acordo de programa à medida", "定制计划协议"), includes: [tr("Configuración de cartera o corredor", "Configuração de carteira ou corredor", "投资组合或走廊级配置"), tr("Gobernanza, informes y diseño de acceso", "Governação, relatórios e desenho de acesso", "治理、报告及访问设计"), tr("Servicios definidos de implantación y apoyo", "Serviços definidos de implementação e apoio", "明确的实施与支持服务"), tr("Condiciones comerciales según el alcance aprobado", "Condições comerciais segundo o âmbito aprovado", "按批准范围确定商业条款")] },
    ],
    defineScope: tr("Definir el alcance", "Definir o âmbito", "确定范围"),
    safeguardsEyebrow: tr("Salvaguardas comerciales", "Salvaguardas comerciais", "商业保障"),
    safeguardsTitle: tr("Las tarifas deben mantenerse separadas del acceso y de las afirmaciones de inversión.", "As tarifas devem permanecer separadas do acesso e das afirmações de investimento.", "收费必须与访问决定及投资主张相互独立。"),
    principles: [
      card("Contratación con la organización", "Contratação com a organização", "机构层面签约", "El uso institucional debe contratarse con una organización y funciones definidas, no como suscripción individual.", "O uso institucional deve ser contratado com uma organização e funções definidas, não como subscrição individual.", "机构使用应与组织及明确的用户角色签约，不应描述为个人消费订阅。"),
      card("El acceso es independiente del resultado", "O acesso é independente do resultado", "访问与投资结果分离", "Las tarifas no implican aprobación, asignación, rentabilidad ni acceso a todas las salas.", "As tarifas não implicam aprovação, alocação, desempenho ou acesso a todas as salas.", "工作区费用不得暗示项目批准、配置、投资表现或所有数据室权限。"),
      card("El asesoramiento tiene alcance expreso", "A consultoria tem âmbito expresso", "明确顾问服务范围", "La preparación, apoyo transaccional o diligencia especializada exige un encargo separado con entregables definidos.", "A preparação, apoio à transação ou diligência especializada exige uma prestação separada com entregáveis definidos.", "项目准备、交易支持或专项尽调应采用单独的服务说明并列明交付成果。"),
      card("Las comisiones de éxito requieren aprobación jurídica", "As comissões de sucesso exigem aprovação jurídica", "成功费须经法律批准", "No debe ofrecerse una comisión transaccional, de colocación o de éxito sin aprobar actividad, jurisdicción, permisos y conflictos.", "Não deve ser oferecida comissão de transação, colocação ou sucesso sem aprovação da atividade, jurisdição, permissões e conflitos.", "在活动、司法管辖区、许可及利益冲突框架获批前，不应提供交易费、配售费或成功费。"),
    ],
    beforeEyebrow: tr("Antes de contratar", "Antes da contratação", "签约前"),
    beforeTitle: tr("Las condiciones comerciales requieren un alcance aprobado.", "As condições comerciais exigem um âmbito aprovado.", "商业条款须基于已批准的范围。"),
    beforeBody: tr("DESCO debe confirmar la entidad contratante, servicios, funciones, apoyo, datos, compras y restricciones jurisdiccionales antes de cotizar.", "A DESCO deve confirmar a entidade contratante, os serviços, as funções, o apoio, os dados, as compras e as restrições jurisdicionais antes de cotar.", "DESCO 在报价前须确认签约主体、服务、用户角色、支持、数据处理、采购要求及司法管辖区限制。"),
    beforeNotice: tr("Los precios públicos permanecerán sin publicar hasta revisar moneda, impuestos, facturación, renovación, cancelación, niveles de servicio, retención y compensación regulada.", "Os preços públicos permanecerão por publicar até à análise de moeda, impostos, faturação, renovação, cancelamento, níveis de serviço, retenção e remuneração regulada.", "在货币、税务、开票、续约、取消、服务水平、数据保存及受监管报酬获审查批准前，不发布公开价格。"),
    discussCta: tr("Hablar del alcance comercial", "Discutir o âmbito comercial", "讨论商业合作范围"),
  };
}

function translatedTrust(locale: "es" | "pt" | "zh", tr: Tr, card: CardFactory): MarketingCopy["trust"] {
  return {
    metadata: { title: tr("Confianza y divulgación — DESCO Compass", "Confiança e divulgação — DESCO Compass", "信任与披露 — DESCO Compass"), description: tr("Cómo etiqueta DESCO Compass la información, la revisión, el acceso restringido y las pruebas.", "Como a DESCO Compass classifica a informação, a análise, o acesso restrito e as provas.", "DESCO Compass 如何标注项目信息、审查状态、受限访问及核实证据。") },
    hero: { eyebrow: tr("Confianza y divulgación", "Confiança e divulgação", "信任与披露"), title: tr("El estado y las pruebas se muestran sin dar a entender respaldo.", "O estado e as provas são apresentados sem sugerir apoio.", "展示状态和证据，不暗示认可。"), body: tr("DESCO Compass describe qué ocurrió, quién aportó la información y qué pruebas sustentan cada estado.", "A DESCO Compass descreve o que ocorreu, quem forneceu a informação e que provas sustentam cada estado.", "DESCO Compass 根据实际完成的工作、信息提供方和支持该状态的证据进行说明。"), primary: tr("Leer la metodología jurídica", "Ler a metodologia jurídica", "阅读法律方法说明"), secondary: tr("Cómo funciona el acceso controlado", "Como funciona o acesso controlado", "了解受控访问") },
    heroNotice: tr("Nada en DESCO Compass constituye oferta de valores, recomendación, garantía financiera o aprobación jurídica.", "Nada na DESCO Compass constitui oferta de valores mobiliários, recomendação, garantia financeira ou aprovação jurídica.", "DESCO Compass 的任何内容均不构成证券要约、投资建议、财务保证或法律批准。"),
    sectionEyebrow: tr("Lenguaje de divulgación", "Linguagem de divulgação", "披露用语"),
    sectionTitle: tr("El significado de cada estado.", "O significado de cada estado.", "各状态的含义。"),
    statuses: [
      { ...card("Proporcionado por el promotor", "Fornecido pelo promotor", "项目发起方提供", "Información aportada por el promotor y no verificada de forma independiente.", "Informação fornecida pelo promotor e não verificada de forma independente.", "由项目发起方提供，未经独立核实。"), tone: "pending" },
      { ...card("Revisado por DESCO", "Analisado pela DESCO", "DESCO 已审查", "Revisado en cuanto a estructura, integridad y coherencia interna.", "Analisado quanto a estrutura, completude e coerência interna.", "已审查结构、完整性和内部一致性。"), tone: "reviewed" },
      { ...card("Verificación independiente pendiente", "Verificação independente pendente", "独立核实待完成", "No consta una validación aprobada de terceros.", "Não existe registo de validação aprovada por terceiros.", "尚无经批准的第三方验证记录。"), tone: "pending" },
      { ...card("Documento verificado", "Documento verificado", "已核实文件", "Un documento específico tiene un registro aprobado y un alcance indicado.", "Um documento específico tem um registo aprovado e um âmbito indicado.", "特定文件具有经批准的核实记录及明确范围。"), tone: "reviewed" },
      { ...card("Restringido", "Restrito", "受限", "Solo usuarios autenticados y aprobados pueden acceder.", "Apenas utilizadores autenticados e aprovados podem aceder.", "仅获批并已验证身份的用户可访问。"), tone: "restricted" },
      { ...card("Aprobado para presentación pública", "Aprovado para apresentação pública", "已批准公开展示", "Un administrador aprobó la publicación; no es respaldo de inversión.", "Um administrador aprovou a publicação; não é apoio ao investimento.", "管理员已批准发布，但这不构成投资认可。"), tone: "public" },
    ],
    controls: [
      card("Revisión de información", "Análise da informação", "项目信息审查", "DESCO revisa estructura, integridad y coherencia. No es verificación independiente.", "A DESCO analisa estrutura, completude e coerência. Não é verificação independente.", "DESCO 审查资料结构、完整性和内部一致性，但不构成独立核实。"),
      card("Estado de la ficha", "Estado da ficha", "项目状态", "Los administradores registran y gestionan el estado; no es aprobación ni respaldo.", "Os administradores registam e gerem o estado; não é aprovação nem apoio.", "状态由 DESCO 管理员记录和管理，不应理解为批准或认可。"),
      card("Acceso a la sala de datos", "Acesso à sala de dados", "数据室访问", "Los documentos confidenciales solo están disponibles mediante permisos.", "Os documentos confidenciais só estão disponíveis mediante permissões.", "保密文件仅向获批用户提供权限受控的访问。"),
      card("Registro de actividad", "Registo de atividade", "活动记录", "La actividad relevante y las decisiones de acceso pueden registrarse.", "A atividade relevante e as decisões de acesso podem ser registadas.", "重要工作区活动和访问决定可能会被记录。"),
      card("Oportunidades vinculadas a DESCO", "Oportunidades ligadas à DESCO", "DESCO 关联机会", "Cuando DESCO está vinculado al promotor o a la plataforma de desarrollo, la ficha lo indica. La revisión DESCO sigue siendo interna; la verificación independiente exige un tercero aprobado y un alcance definido.", "Quando a DESCO está ligada ao promotor ou à plataforma de desenvolvimento, a ficha identifica essa relação. A análise DESCO continua interna; a verificação independente exige um terceiro aprovado e um âmbito definido.", "当 DESCO 与项目发起方或开发平台存在关联时，项目页面会明确标注。DESCO 审查仍属内部审查；独立核实须由获批第三方在明确范围内完成。"),
      card("Diligencia de país e integridad", "Diligência de país e integridade", "国家与廉洁尽调", "Antes de la relación institucional, cada proyecto requiere revisión específica de titularidad real, sanciones y PEP, anticorrupción, títulos, permisos, abastecimiento responsable, trabajo, comunidades y riesgos ambientales.", "Antes do envolvimento institucional, cada projeto exige análise específica de beneficiários efetivos, sanções e PEP, anticorrupção, títulos, licenças, abastecimento responsável, trabalho, comunidades e riscos ambientais.", "开展机构合作前，每个项目均须按范围审查实际受益所有权、制裁与政治公众人物风险、反贿赂控制、权利与许可、负责任采购、劳工、社区及环境风险。"),
      card("Datos soberanos y del proyecto", "Dados soberanos e do projeto", "主权与项目数据", "Antes de cargar información confidencial, el contrato debe definir región de alojamiento, subencargados, acceso, conservación, exportación, eliminación y ley aplicable. El sitio público no promete una residencia específica.", "Antes de carregar informação confidencial, o contrato deve definir região de alojamento, subcontratantes, acesso, retenção, exportação, eliminação e lei aplicável. O site público não promete uma residência específica.", "上传政府或项目保密资料前，合同须明确托管区域、分包处理方、访问权限、保存、导出、删除及适用法律。公开网站不承诺特定数据驻留地点。"),
    ],
    notice: tr("La plataforma no declara controles AML/KYC completados, SOC 2, cumplimiento del RGPD, aprobación pública, rentabilidad garantizada ni verificación independiente sin pruebas aprobadas y específicas.", "A plataforma não declara controlos AML/KYC concluídos, SOC 2, conformidade com o RGPD, aprovação pública, retornos garantidos ou verificação independente sem provas aprovadas e específicas.", "除非有经批准且范围明确的证据，平台不声称已完成反洗钱或客户身份识别、取得 SOC 2 认证、符合 GDPR、获得政府批准、保证回报或完成独立核实。"),
  };
}

const COPY: Record<Locale, MarketingCopy> = { en, fr, es, pt, zh };

export function getMarketingCopy<L extends keyof MarketingCopy>(locale: Locale, page: L): MarketingCopy[L] {
  return COPY[locale][page];
}

export function getMarketingMetadata(locale: Locale, page: keyof MarketingCopy): Metadata {
  const { title, description } = COPY[locale][page].metadata;
  const canonical: Record<keyof MarketingCopy, string> = {
    home: "/",
    about: "/about",
    diligence: "/diligence",
    investors: "/investors",
    sponsors: "/sponsors",
    partners: "/partners",
    pricing: "/pricing",
    trust: "/trust",
  };
  return publicPageMetadata(String(title), String(description), { canonical: canonical[page] });
}
