import type { Locale } from "@/lib/i18n";
import type { CapitalPresentation } from "@/lib/data";

type InvestmentUi = {
  opportunities: {
    metadataTitle: string; metadataDescription: string;
    screeningPrinciple: string; screeningTitle: string; screeningBody: string;
    browse: string; result: (count: number) => string; disclosureBody: string;
    filterLabel: string; sector: string; geography: string; stage: string; instrument: string; sponsor: string;
    capital: string; allSizes: string; under10: string; evidence: string; allStatuses: string;
    pending: string; reviewed: string; roomReadiness: string; documentsRecorded: string; notConfirmed: string;
    updated: string; anyDate: string; past30: string; past90: string; older90: string; sort: string;
    latest: string; recentlyUpdated: string; capitalSize: string; apply: string; clear: string; empty: string;
    all: string;
  };
  compare: {
    instruction: string; count: (selected: number) => string; limit: string; button: string; checkbox: string;
    metadataTitle: string; title: string; intro: (notDisclosed: string) => string; back: string; none: string;
    notDisclosed: string; field: string; missing: string; noneMissing: string; exportCsv: string;
    truncated: string; rows: Record<string, string>;
  };
  card: {
    capitalSought: string; capitalNotDisclosed: string; reviewed: string; pending: string; sponsor: string;
    updated: string; source: string; ageMonths: (months: number) => string; sourceUndated: string;
    evidence: string; risks: string; review: string; relatedParty: string;
  };
  images: {
    regional: string; example: string; preview: string; previewDialog: string; closePreview: string;
    replaceVisual: string; captionSource: string; captionPlaceholder: string; uploadHelp: string;
    noApproved: string; sponsorImage: string;
  };
  contact: {
    metadataTitle: string; metadataDescription: string; title: string; intro: string; notice: string;
    fullName: string; email: string; organization: string; optional: string; topic: string; message: string;
    sending: string; send: string; received: string; receivedBody: string; retry: string; network: string;
    acknowledgement: string; legalStatus: string;
    topics: Record<string, string>;
  };
  project: {
    sought: string; capitalNotDisclosed: string; opportunityIn: string; publicBriefing: string;
    capitalSought: string; programmeAllocation: string; returnInformation: string;
    sponsorTarget: string; sponsorFigures: string; lastUpdated: string; sponsor: string; publicRestricted: string;
    publicEvidence: string; fieldsDisclosed: string; principalRisks: string; categoriesDisclosed: string;
    evidenceDate: string; projectRoom: string; restrictedDocs: string; readinessNotPublic: string;
    thesis: string; figuresNote: string; publicInvestmentEvidence: string; missingVisible: string; source: string;
    riskDisclosure: string; riskNote: string; financialStructure: string; useOfFunds: string;
    fundingSecured: string; sponsorContribution: string; roomEmpty: string; roomLocked: string;
    roomLockedPublic: string; roomBullets: string[]; demoDocument: string; download: string;
    meetingLocked: string; actions: string; reviewEvidence: string; manageRoom: string; reviewMeetings: string;
    requested: string; requestInformation: string; saved: string; applyAccess: string; workspaceAccess: string;
    provenance: string; classification: string; sourceDate: string; reviewStatus: string; noSponsorHistory: string;
    reviewEvidenceShort: string; manageRoomShort: string; meetings: string; requestInfo: string; reportInformation: string;
  };
};

const en: InvestmentUi = {
  opportunities: {
    metadataTitle: "Opportunities — DESCO Compass", metadataDescription: "Review selected DRC investment opportunities by sector, stage, instrument and disclosure status.",
    screeningPrinciple: "Screening principle", screeningTitle: "Public value before gated diligence.", screeningBody: "Missing disclosure remains visible and should influence whether deeper review is warranted.",
    browse: "Browse and compare", result: (n) => `${n} public ${n === 1 ? "opportunity" : "opportunities"}`, disclosureBody: "Figures and project claims remain sponsor-provided unless a module expressly identifies reviewed or independently verified evidence.",
    filterLabel: "Filter opportunities", sector: "Sector", geography: "Geography", stage: "Project stage", instrument: "Instrument", sponsor: "Sponsor",
    capital: "Capital requirement", allSizes: "All sizes", under10: "Under $10M", evidence: "Evidence review", allStatuses: "All statuses",
    pending: "Review pending", reviewed: "Evidence review recorded", roomReadiness: "Data-room readiness", documentsRecorded: "Documents recorded", notConfirmed: "Not publicly confirmed",
    updated: "Last updated", anyDate: "Any date", past30: "Past 30 days", past90: "Past 90 days", older90: "More than 90 days ago", sort: "Sort",
    latest: "Latest listed", recentlyUpdated: "Recently updated", capitalSize: "Capital size", apply: "Apply filters", clear: "Clear filters", empty: "No public opportunity currently matches these filters. Clear one or more criteria to broaden the screening set.", all: "All",
  },
  compare: {
    instruction: "Select up to four opportunities for a field-by-field comparison.", count: (n) => `${n} of 4 selected.`, limit: " Selection limit reached.", button: "Compare selected", checkbox: "Compare",
    metadataTitle: "Compare opportunities — DESCO Compass", title: "Compare opportunities", intro: (x) => `Side-by-side data only. Compass does not recommend or rank these opportunities. Review all fields, including any marked “${x}”, before deciding.`, back: "Back to saved", none: "No opportunities selected. Return to Saved and choose at least one opportunity.", notDisclosed: "Not disclosed", field: "Field", missing: "Missing data", noneMissing: "None — all fields disclosed", exportCsv: "Export CSV", truncated: "Only the first four selected opportunities are shown.", rows: { "Capital required": "Capital required", Instrument: "Instrument", Geography: "Geography", Stage: "Stage", "Revenue model": "Revenue model", "Use of funds": "Use of funds", "Sponsor contribution": "Sponsor contribution", "Funding secured": "Funding secured", "Return information": "Return information", Timetable: "Timetable", "Evidence review": "Evidence review", "Principal risks": "Principal risks", "Evidence source date": "Evidence source date" },
  },
  card: { capitalSought: "capital sought", capitalNotDisclosed: "capital requirement not publicly disclosed", reviewed: "DESCO evidence review recorded", pending: "Sponsor-provided · review pending", sponsor: "Sponsor", updated: "Updated", source: "Source", ageMonths: (months) => `${months} months old`, sourceUndated: "Source document undated", evidence: "Public disclosure", risks: "Risks addressed", review: "Review", relatedParty: "DESCO-related opportunity" },
  images: { regional: "Regional context", example: "Concept visual", preview: "Preview", previewDialog: "Project image preview", closePreview: "Close image preview", replaceVisual: "Replace visual", captionSource: "Image caption and source", captionPlaceholder: "What the image shows · source or owner · month/year", uploadHelp: "Uploading an approved sponsor image replaces the current regional or concept visual across project cards and this page.", noApproved: "No approved public project imagery is available.", sponsorImage: "Sponsor-provided project image" },
  contact: {
    metadataTitle: "Contact — DESCO Compass", metadataDescription: "Contact DESCO Global about investment opportunities, partnerships or platform access.", title: "Get in touch", intro: "Select the purpose of your inquiry so it can be reviewed through the appropriate investor, sponsor, partnership or support workflow.", notice: "Workspace approval and project-specific data-room access are separate decisions. Submitting this form does not grant access or constitute investor qualification.",
    fullName: "Full name", email: "Email", organization: "Organization", optional: "optional", topic: "Topic", message: "Message", sending: "Sending…", send: "Send message", received: "Message received", receivedBody: "A DESCO team member will review the inquiry. No response time is guaranteed during the private beta.", retry: "Could not send. Please retry.", network: "Network error. Please retry.", acknowledgement: "I understand that DESCO Compass is in private beta and that its full privacy notice and terms are pending legal review. See the", legalStatus: "current legal and privacy status",
    topics: { general: "General inquiry", "investor-access": "Investor workspace access", "project-submission": "Submit a project", "data-room": "Data-room access question", "institutional-partnership": "Institutional partnership", "commercial-model": "Commercial scope and workspace model", "government-dfi": "Government or DFI collaboration", "inaccurate-information": "Report inaccurate project information", "technical-support": "Technical support" },
  },
  project: {
    sought: "sought", capitalNotDisclosed: "capital requirement not publicly disclosed", opportunityIn: "opportunity in", publicBriefing: "Public opportunity briefing", capitalSought: "Project capital sought", programmeAllocation: "Programme allocation, not a project-specific ask", returnInformation: "Return information", sponsorTarget: "Sponsor target", sponsorFigures: "Sponsor-provided figures", lastUpdated: "Last updated", sponsor: "Sponsor", publicRestricted: "Public disclosure · confidential documents restricted",
    publicEvidence: "Public evidence", fieldsDisclosed: "fields disclosed", principalRisks: "Principal risks", categoriesDisclosed: "categories disclosed", evidenceDate: "Evidence date", projectRoom: "Project room", restrictedDocs: "Documents recorded · restricted", readinessNotPublic: "Readiness not public",
    thesis: "Investment thesis", figuresNote: "Sponsor-provided figures, not independently verified unless stated otherwise.", publicInvestmentEvidence: "Public investment evidence", missingVisible: "Missing fields remain visible so absent disclosure is not mistaken for a negative finding.", source: "Source", riskDisclosure: "Principal risk disclosure", riskNote: "These are required disclosure categories. “Not publicly disclosed” means the public record does not yet support an assessment.", financialStructure: "Financial structure", useOfFunds: "Use of funds", fundingSecured: "Funding already secured", sponsorContribution: "Sponsor contribution",
    roomEmpty: "Access is recorded, but the sponsor has not uploaded any documents to this project room.", roomLocked: "Confidential filenames and documents remain hidden until the sponsor grants data-room access.", roomLockedPublic: "Confidential filenames and documents remain hidden until workspace and project-specific access have been approved.", roomBullets: ["Sponsor-approved diligence documents", "Financial, legal, technical and impact evidence where supplied", "Access that the sponsor can grant or revoke"], demoDocument: "Demo document (no file)", download: "Download", meetingLocked: "Meeting requests become available after investor workspace access is approved.",
    actions: "Actions", reviewEvidence: "Review project evidence", manageRoom: "Manage project room", reviewMeetings: "Review meeting requests", requested: "Requested", requestInformation: "Request information", saved: "Saved", applyAccess: "Apply for investor access", workspaceAccess: "An approved investor workspace adds mandate matching, project-specific access requests and sponsor meetings.", provenance: "Evidence provenance", classification: "Classification", sourceDate: "Source date", reviewStatus: "Review status", noSponsorHistory: "No response-time or transaction-history data has been collected for this sponsor.", reviewEvidenceShort: "Review evidence", manageRoomShort: "Manage room", meetings: "Meetings", requestInfo: "Request info", reportInformation: "Report inaccurate project information",
  },
};

const fr: InvestmentUi = {
  opportunities: { ...en.opportunities, metadataTitle: "Opportunités — DESCO Compass", metadataDescription: "Examinez des opportunités d’investissement sélectionnées en RDC selon le secteur, le stade, l’instrument et la divulgation.", screeningPrinciple: "Principe de sélection", screeningTitle: "Une information publique utile avant la diligence restreinte.", screeningBody: "Les informations manquantes restent visibles et doivent peser dans la décision d’approfondir l’analyse.", browse: "Parcourir et comparer", result: (n) => `${n} ${n === 1 ? "opportunité publique" : "opportunités publiques"}`, disclosureBody: "Les chiffres et déclarations restent fournis par le porteur sauf mention expresse d’un examen ou d’une vérification indépendante.", filterLabel: "Filtrer les opportunités", sector: "Secteur", geography: "Géographie", stage: "Stade du projet", instrument: "Instrument", sponsor: "Porteur", capital: "Besoin en capital", allSizes: "Tous les montants", under10: "Moins de 10 M$", evidence: "Examen des preuves", allStatuses: "Tous les statuts", pending: "Examen en attente", reviewed: "Examen des preuves enregistré", roomReadiness: "Préparation de la data room", documentsRecorded: "Documents enregistrés", notConfirmed: "Non confirmé publiquement", updated: "Dernière mise à jour", anyDate: "Toute date", past30: "30 derniers jours", past90: "90 derniers jours", older90: "Plus de 90 jours", sort: "Trier", latest: "Publication récente", recentlyUpdated: "Mise à jour récente", capitalSize: "Montant du capital", apply: "Appliquer les filtres", clear: "Effacer les filtres", empty: "Aucune opportunité publique ne correspond à ces filtres. Retirez un ou plusieurs critères.", all: "Tous" },
  compare: { ...en.compare, instruction: "Sélectionnez jusqu’à quatre opportunités pour une comparaison champ par champ.", count: (n) => `${n} sur 4 sélectionnée${n > 1 ? "s" : ""}.`, limit: " Limite atteinte.", button: "Comparer la sélection", checkbox: "Comparer", metadataTitle: "Comparer les opportunités — DESCO Compass", title: "Comparer les opportunités", intro: (x) => `Données côte à côte uniquement. Compass ne recommande ni ne classe ces opportunités. Examinez tous les champs, y compris « ${x} ».`, back: "Retour aux favoris", none: "Aucune opportunité sélectionnée. Revenez aux favoris et choisissez-en au moins une.", notDisclosed: "Non communiqué", field: "Champ", missing: "Données manquantes", noneMissing: "Aucune — tous les champs sont renseignés", exportCsv: "Exporter en CSV", truncated: "Seules les quatre premières opportunités sélectionnées sont affichées.", rows: { "Capital required": "Capital requis", Instrument: "Instrument", Geography: "Géographie", Stage: "Stade", "Revenue model": "Modèle de revenus", "Use of funds": "Utilisation des fonds", "Sponsor contribution": "Contribution du porteur", "Funding secured": "Financement obtenu", "Return information": "Informations de rendement", Timetable: "Calendrier", "Evidence review": "Examen des preuves", "Principal risks": "Risques principaux", "Evidence source date": "Date de la source" } },
  card: { capitalSought: "capital recherché", capitalNotDisclosed: "besoin en capital non communiqué publiquement", reviewed: "Examen des preuves DESCO enregistré", pending: "Fourni par le porteur · examen en attente", sponsor: "Porteur", updated: "Mis à jour", source: "Source", ageMonths: (months) => `document datant de ${months} mois`, sourceUndated: "Document source non daté", evidence: "Information publique", risks: "Risques traités", review: "Examiner", relatedParty: "Opportunité liée à DESCO" },
  images: { regional: "Contexte régional", example: "Visuel conceptuel", preview: "Aperçu", previewDialog: "Aperçu de l’image du projet", closePreview: "Fermer l’aperçu", replaceVisual: "Remplacer le visuel", captionSource: "Légende et source de l’image", captionPlaceholder: "Contenu · source ou propriétaire · mois/année", uploadHelp: "Une image approuvée du porteur remplacera le visuel régional ou conceptuel.", noApproved: "Aucune image publique approuvée n’est disponible.", sponsorImage: "Image fournie par le porteur" },
  contact: { ...en.contact, metadataTitle: "Contact — DESCO Compass", metadataDescription: "Contactez DESCO Global au sujet des opportunités, partenariats ou accès.", title: "Nous contacter", intro: "Sélectionnez l’objet de votre demande afin qu’elle soit orientée vers le parcours approprié.", notice: "L’approbation de l’espace et l’accès à une salle de données sont deux décisions distinctes. Ce formulaire n’accorde aucun accès et ne qualifie pas l’investisseur.", fullName: "Nom complet", organization: "Organisation", optional: "facultatif", topic: "Objet", message: "Message", sending: "Envoi…", send: "Envoyer", received: "Message reçu", receivedBody: "Un membre de l’équipe DESCO examinera la demande. Aucun délai de réponse n’est garanti pendant la bêta privée.", retry: "Envoi impossible. Réessayez.", network: "Erreur réseau. Réessayez.", acknowledgement: "Je comprends que DESCO Compass est en bêta privée et que son avis de confidentialité complet et ses conditions attendent un examen juridique. Voir le", legalStatus: "statut juridique et de confidentialité actuel", topics: { general: "Demande générale", "investor-access": "Accès à l’espace investisseur", "project-submission": "Soumettre un projet", "data-room": "Question sur l’accès à la salle de données", "institutional-partnership": "Partenariat institutionnel", "commercial-model": "Périmètre commercial et modèle d’espace", "government-dfi": "Collaboration publique ou IFD", "inaccurate-information": "Signaler une information inexacte", "technical-support": "Support technique" } },
  project: { ...en.project, sought: "recherchés", capitalNotDisclosed: "besoin en capital non communiqué publiquement", opportunityIn: "opportunité en", publicBriefing: "Présentation publique de l’opportunité", sponsorTarget: "Objectif du porteur", sponsorFigures: "Chiffres fournis par le porteur", lastUpdated: "Dernière mise à jour", sponsor: "Porteur", publicRestricted: "Information publique · documents confidentiels restreints", publicEvidence: "Preuves publiques", fieldsDisclosed: "champs renseignés", principalRisks: "Risques principaux", categoriesDisclosed: "catégories renseignées", evidenceDate: "Date des preuves", projectRoom: "Espace projet", restrictedDocs: "Documents enregistrés · accès restreint", readinessNotPublic: "Préparation non publique", thesis: "Thèse d’investissement", figuresNote: "Chiffres fournis par le porteur, non vérifiés indépendamment sauf mention contraire.", publicInvestmentEvidence: "Éléments publics d’investissement", missingVisible: "Les champs manquants restent visibles afin de ne pas être interprétés comme un constat négatif.", source: "Source", riskDisclosure: "Divulgation des risques principaux", riskNote: "Il s’agit de catégories obligatoires. « Non communiqué publiquement » signifie que le dossier public ne permet pas encore une évaluation.", financialStructure: "Structure financière", useOfFunds: "Utilisation des fonds", fundingSecured: "Financement déjà obtenu", sponsorContribution: "Contribution du porteur", roomEmpty: "L’accès est enregistré, mais aucun document n’a été téléversé.", roomLocked: "Les noms et documents confidentiels restent masqués jusqu’à l’autorisation du porteur.", roomLockedPublic: "Les noms et documents confidentiels restent masqués jusqu’à l’approbation de l’espace et de l’accès au projet.", roomBullets: ["Documents de diligence approuvés par le porteur", "Preuves financières, juridiques, techniques et d’impact lorsqu’elles sont fournies", "Accès que le porteur peut accorder ou révoquer"], demoDocument: "Document de démonstration (sans fichier)", download: "Télécharger", meetingLocked: "Les demandes de rendez-vous sont disponibles après approbation de l’espace investisseur.", actions: "Actions", reviewEvidence: "Examiner les preuves du projet", manageRoom: "Gérer l’espace projet", reviewMeetings: "Examiner les demandes de rendez-vous", requested: "Demandé", requestInformation: "Demander des informations", saved: "Enregistré", applyAccess: "Demander un accès investisseur", workspaceAccess: "Un espace investisseur approuvé ajoute le matching de mandat, les demandes d’accès et les rendez-vous avec le porteur.", provenance: "Provenance des preuves", classification: "Classification", sourceDate: "Date de la source", reviewStatus: "Statut de l’examen", noSponsorHistory: "Aucune donnée de délai de réponse ou d’historique de transaction n’a été collectée pour ce porteur.", reviewEvidenceShort: "Examiner les preuves", manageRoomShort: "Gérer l’espace", meetings: "Rendez-vous", requestInfo: "Demander des infos" },
};

const es: InvestmentUi = {
  ...fr,
  opportunities: { ...en.opportunities, metadataTitle: "Oportunidades — DESCO Compass", metadataDescription: "Revise oportunidades seleccionadas en la RDC por sector, etapa, instrumento y estado de divulgación.", screeningPrinciple: "Principio de selección", screeningTitle: "Valor público antes de la diligencia restringida.", screeningBody: "La información no divulgada permanece visible y debe influir en la decisión de profundizar.", browse: "Explorar y comparar", result: (n) => `${n} ${n === 1 ? "oportunidad pública" : "oportunidades públicas"}`, disclosureBody: "Las cifras y afirmaciones proceden del promotor salvo que se indique una revisión o verificación independiente.", filterLabel: "Filtrar oportunidades", sector: "Sector", geography: "Geografía", stage: "Etapa del proyecto", instrument: "Instrumento", sponsor: "Promotor", capital: "Capital requerido", allSizes: "Todos los importes", under10: "Menos de 10 M$", evidence: "Revisión de evidencia", allStatuses: "Todos los estados", pending: "Revisión pendiente", reviewed: "Revisión de evidencia registrada", roomReadiness: "Preparación de la sala de datos", documentsRecorded: "Documentos registrados", notConfirmed: "No confirmado públicamente", updated: "Última actualización", anyDate: "Cualquier fecha", past30: "Últimos 30 días", past90: "Últimos 90 días", older90: "Más de 90 días", sort: "Ordenar", latest: "Publicación más reciente", recentlyUpdated: "Actualización reciente", capitalSize: "Importe de capital", apply: "Aplicar filtros", clear: "Borrar filtros", empty: "Ninguna oportunidad pública coincide con estos filtros. Elimine uno o varios criterios.", all: "Todos" },
  compare: { ...en.compare, instruction: "Seleccione hasta cuatro oportunidades para compararlas campo por campo.", count: (n) => `${n} de 4 seleccionadas.`, limit: " Límite alcanzado.", button: "Comparar selección", checkbox: "Comparar", metadataTitle: "Comparar oportunidades — DESCO Compass", title: "Comparar oportunidades", intro: (x) => `Solo datos comparativos. Compass no recomienda ni clasifica estas oportunidades. Revise todos los campos, incluidos los marcados «${x}».`, back: "Volver a guardados", none: "No hay oportunidades seleccionadas. Vuelva a Guardados y elija al menos una.", notDisclosed: "No divulgado", field: "Campo", missing: "Datos ausentes", noneMissing: "Ninguno — todos los campos divulgados", exportCsv: "Exportar CSV", truncated: "Solo se muestran las cuatro primeras oportunidades seleccionadas.", rows: { "Capital required": "Capital requerido", Instrument: "Instrumento", Geography: "Geografía", Stage: "Etapa", "Revenue model": "Modelo de ingresos", "Use of funds": "Uso de fondos", "Sponsor contribution": "Aportación del promotor", "Funding secured": "Financiación obtenida", "Return information": "Información de rendimiento", Timetable: "Calendario", "Evidence review": "Revisión de evidencia", "Principal risks": "Riesgos principales", "Evidence source date": "Fecha de la fuente" } },
  card: { capitalSought: "capital solicitado", capitalNotDisclosed: "capital requerido no divulgado públicamente", reviewed: "Revisión de evidencia DESCO registrada", pending: "Datos del promotor · revisión pendiente", sponsor: "Promotor", updated: "Actualizado", source: "Fuente", ageMonths: (months) => `documento de hace ${months} meses`, sourceUndated: "Documento fuente sin fecha", evidence: "Divulgación pública", risks: "Riesgos tratados", review: "Revisar", relatedParty: "Oportunidad vinculada a DESCO" },
  images: { regional: "Contexto regional", example: "Visual conceptual", preview: "Vista previa", previewDialog: "Vista previa de la imagen del proyecto", closePreview: "Cerrar vista previa", replaceVisual: "Sustituir imagen", captionSource: "Pie y fuente de la imagen", captionPlaceholder: "Contenido · fuente o propietario · mes/año", uploadHelp: "Una imagen aprobada del promotor sustituirá la imagen regional o conceptual.", noApproved: "No hay imágenes públicas aprobadas.", sponsorImage: "Imagen facilitada por el promotor" },
  contact: { ...en.contact, metadataTitle: "Contacto — DESCO Compass", metadataDescription: "Contacte con DESCO Global sobre oportunidades, alianzas o acceso.", title: "Contacto", intro: "Seleccione el motivo para dirigir la consulta al proceso adecuado.", notice: "La aprobación del espacio y el acceso a una sala de datos son decisiones separadas. El formulario no concede acceso ni acredita al inversor.", fullName: "Nombre completo", organization: "Organización", optional: "opcional", topic: "Asunto", message: "Mensaje", sending: "Enviando…", send: "Enviar mensaje", received: "Mensaje recibido", receivedBody: "Un miembro del equipo DESCO revisará la consulta. No se garantiza un plazo de respuesta durante la beta privada.", retry: "No se pudo enviar. Inténtelo de nuevo.", network: "Error de red. Inténtelo de nuevo.", acknowledgement: "Entiendo que DESCO Compass está en beta privada y que su aviso de privacidad completo y sus condiciones están pendientes de revisión jurídica. Consulte el", legalStatus: "estado jurídico y de privacidad actual", topics: { general: "Consulta general", "investor-access": "Acceso al espacio del inversor", "project-submission": "Presentar un proyecto", "data-room": "Consulta sobre la sala de datos", "institutional-partnership": "Alianza institucional", "commercial-model": "Alcance comercial y modelo de espacio", "government-dfi": "Colaboración pública o IFD", "inaccurate-information": "Comunicar información inexacta", "technical-support": "Soporte técnico" } },
  project: { ...en.project, publicBriefing: "Presentación pública de la oportunidad", sponsorTarget: "Objetivo del promotor", sponsorFigures: "Cifras facilitadas por el promotor", lastUpdated: "Última actualización", sponsor: "Promotor", publicRestricted: "Divulgación pública · documentos confidenciales restringidos", publicEvidence: "Evidencia pública", fieldsDisclosed: "campos divulgados", principalRisks: "Riesgos principales", categoriesDisclosed: "categorías divulgadas", evidenceDate: "Fecha de evidencia", projectRoom: "Sala del proyecto", restrictedDocs: "Documentos registrados · restringidos", readinessNotPublic: "Preparación no pública", thesis: "Tesis de inversión", figuresNote: "Cifras facilitadas por el promotor, sin verificación independiente salvo indicación.", publicInvestmentEvidence: "Evidencia pública de inversión", missingVisible: "Los campos ausentes siguen visibles para que la falta de divulgación no se interprete como un hallazgo negativo.", source: "Fuente", riskDisclosure: "Divulgación de riesgos principales", riskNote: "Son categorías obligatorias. «No divulgado públicamente» significa que el registro público aún no permite evaluarlo.", financialStructure: "Estructura financiera", useOfFunds: "Uso de fondos", fundingSecured: "Financiación ya obtenida", sponsorContribution: "Aportación del promotor", roomEmpty: "El acceso está registrado, pero el promotor no ha cargado documentos.", roomLocked: "Los nombres y documentos confidenciales permanecen ocultos hasta la autorización del promotor.", roomLockedPublic: "Los nombres y documentos confidenciales permanecen ocultos hasta aprobar el espacio y el acceso al proyecto.", roomBullets: ["Documentos de diligencia aprobados por el promotor", "Evidencia financiera, jurídica, técnica y de impacto cuando se aporte", "Acceso que el promotor puede conceder o revocar"], demoDocument: "Documento de demostración (sin archivo)", download: "Descargar", meetingLocked: "Las solicitudes de reunión estarán disponibles tras aprobar el espacio del inversor.", actions: "Acciones", reviewEvidence: "Revisar la evidencia del proyecto", manageRoom: "Gestionar la sala del proyecto", reviewMeetings: "Revisar solicitudes de reunión", requested: "Solicitado", requestInformation: "Solicitar información", saved: "Guardado", applyAccess: "Solicitar acceso de inversor", workspaceAccess: "Un espacio aprobado añade comparación con el mandato, solicitudes de acceso y reuniones con el promotor.", provenance: "Procedencia de la evidencia", classification: "Clasificación", sourceDate: "Fecha de la fuente", reviewStatus: "Estado de revisión", noSponsorHistory: "Aún no se han recopilado datos de respuesta o transacciones de este promotor.", reviewEvidenceShort: "Revisar evidencia", manageRoomShort: "Gestionar sala", meetings: "Reuniones", requestInfo: "Solicitar información" },
};

const pt: InvestmentUi = {
  ...es,
  opportunities: { ...es.opportunities, metadataTitle: "Oportunidades — DESCO Compass", metadataDescription: "Analise oportunidades selecionadas na RDC por setor, fase, instrumento e estado de divulgação.", screeningPrinciple: "Princípio de seleção", screeningTitle: "Valor público antes da diligência restrita.", screeningBody: "A informação em falta permanece visível e deve influenciar a decisão de aprofundar a análise.", browse: "Explorar e comparar", result: (n) => `${n} ${n === 1 ? "oportunidade pública" : "oportunidades públicas"}`, disclosureBody: "Os valores e afirmações são fornecidos pelo promotor, salvo indicação de análise ou verificação independente.", filterLabel: "Filtrar oportunidades", sector: "Setor", geography: "Geografia", stage: "Fase do projeto", instrument: "Instrumento", sponsor: "Promotor", capital: "Capital necessário", allSizes: "Todos os montantes", under10: "Menos de 10 M$", evidence: "Análise de evidência", allStatuses: "Todos os estados", pending: "Análise pendente", reviewed: "Análise de evidência registada", roomReadiness: "Preparação da sala de dados", documentsRecorded: "Documentos registados", notConfirmed: "Não confirmado publicamente", updated: "Última atualização", anyDate: "Qualquer data", past30: "Últimos 30 dias", past90: "Últimos 90 dias", older90: "Mais de 90 dias", sort: "Ordenar", latest: "Publicação mais recente", recentlyUpdated: "Atualização recente", capitalSize: "Montante de capital", apply: "Aplicar filtros", clear: "Limpar filtros", empty: "Nenhuma oportunidade pública corresponde aos filtros. Remova um ou mais critérios.", all: "Todos" },
  compare: { ...es.compare, instruction: "Selecione até quatro oportunidades para comparar campo a campo.", count: (n) => `${n} de 4 selecionadas.`, limit: " Limite atingido.", button: "Comparar seleção", metadataTitle: "Comparar oportunidades — DESCO Compass", title: "Comparar oportunidades", intro: (x) => `Apenas dados lado a lado. A Compass não recomenda nem classifica estas oportunidades. Analise todos os campos, incluindo “${x}”.`, back: "Voltar aos guardados", none: "Nenhuma oportunidade selecionada. Volte aos Guardados e escolha pelo menos uma.", notDisclosed: "Não divulgado", field: "Campo", missing: "Dados em falta", noneMissing: "Nenhum — todos os campos divulgados", exportCsv: "Exportar CSV", truncated: "Apenas são apresentadas as quatro primeiras oportunidades selecionadas.", rows: { "Capital required": "Capital necessário", Instrument: "Instrumento", Geography: "Geografia", Stage: "Fase", "Revenue model": "Modelo de receitas", "Use of funds": "Utilização dos fundos", "Sponsor contribution": "Contribuição do promotor", "Funding secured": "Financiamento obtido", "Return information": "Informação de retorno", Timetable: "Calendário", "Evidence review": "Análise de evidência", "Principal risks": "Riscos principais", "Evidence source date": "Data da fonte" } },
  card: { capitalSought: "capital procurado", capitalNotDisclosed: "capital necessário não divulgado publicamente", reviewed: "Análise de evidência DESCO registada", pending: "Fornecido pelo promotor · análise pendente", sponsor: "Promotor", updated: "Atualizado", source: "Fonte", ageMonths: (months) => `documento com ${months} meses`, sourceUndated: "Documento-fonte sem data", evidence: "Divulgação pública", risks: "Riscos abordados", review: "Analisar", relatedParty: "Oportunidade ligada à DESCO" },
  images: { ...es.images, regional: "Contexto regional", example: "Visual conceptual", preview: "Pré-visualizar", previewDialog: "Pré-visualização da imagem do projeto", closePreview: "Fechar pré-visualização", replaceVisual: "Substituir imagem", captionSource: "Legenda e fonte da imagem", captionPlaceholder: "Conteúdo · fonte ou proprietário · mês/ano", uploadHelp: "Uma imagem aprovada do promotor substituirá a imagem regional ou conceptual.", noApproved: "Não existem imagens públicas aprovadas.", sponsorImage: "Imagem fornecida pelo promotor" },
  contact: { ...es.contact, metadataTitle: "Contacto — DESCO Compass", metadataDescription: "Contacte a DESCO Global sobre oportunidades, parcerias ou acesso.", title: "Contacte-nos", intro: "Selecione o motivo para encaminhar o pedido para o processo adequado.", notice: "A aprovação do espaço e o acesso a uma sala de dados são decisões separadas. O formulário não concede acesso nem qualifica o investidor.", fullName: "Nome completo", organization: "Organização", optional: "opcional", topic: "Assunto", message: "Mensagem", sending: "A enviar…", send: "Enviar mensagem", received: "Mensagem recebida", receivedBody: "Um membro da equipa DESCO analisará o pedido. Não é garantido qualquer prazo de resposta durante a beta privada.", retry: "Não foi possível enviar. Tente novamente.", network: "Erro de rede. Tente novamente.", acknowledgement: "Compreendo que a DESCO Compass está em beta privada e que o aviso de privacidade completo e os termos aguardam revisão jurídica. Consulte o", legalStatus: "estado jurídico e de privacidade atual", topics: { general: "Pedido geral", "investor-access": "Acesso ao espaço do investidor", "project-submission": "Submeter um projeto", "data-room": "Questão sobre a sala de dados", "institutional-partnership": "Parceria institucional", "commercial-model": "Âmbito comercial e modelo de espaço", "government-dfi": "Colaboração pública ou IFD", "inaccurate-information": "Comunicar informação incorreta", "technical-support": "Suporte técnico" } },
  project: { ...es.project, publicBriefing: "Apresentação pública da oportunidade", sponsorTarget: "Objetivo do promotor", sponsorFigures: "Valores fornecidos pelo promotor", lastUpdated: "Última atualização", sponsor: "Promotor", publicRestricted: "Divulgação pública · documentos confidenciais restritos", publicEvidence: "Evidência pública", fieldsDisclosed: "campos divulgados", principalRisks: "Riscos principais", categoriesDisclosed: "categorias divulgadas", evidenceDate: "Data da evidência", projectRoom: "Sala do projeto", restrictedDocs: "Documentos registados · restritos", readinessNotPublic: "Preparação não pública", thesis: "Tese de investimento", figuresNote: "Valores fornecidos pelo promotor, sem verificação independente salvo indicação.", publicInvestmentEvidence: "Evidência pública de investimento", missingVisible: "Os campos em falta permanecem visíveis para que a ausência de divulgação não seja interpretada como uma conclusão negativa.", source: "Fonte", riskDisclosure: "Divulgação dos riscos principais", riskNote: "São categorias obrigatórias. “Não divulgado publicamente” significa que o registo público ainda não permite uma avaliação.", financialStructure: "Estrutura financeira", useOfFunds: "Utilização dos fundos", fundingSecured: "Financiamento já obtido", sponsorContribution: "Contribuição do promotor", roomEmpty: "O acesso está registado, mas o promotor não carregou documentos.", roomLocked: "Os nomes e documentos confidenciais permanecem ocultos até à autorização do promotor.", roomLockedPublic: "Os nomes e documentos confidenciais permanecem ocultos até à aprovação do espaço e do acesso ao projeto.", roomBullets: ["Documentos de diligência aprovados pelo promotor", "Evidência financeira, jurídica, técnica e de impacto quando fornecida", "Acesso que o promotor pode conceder ou revogar"], demoDocument: "Documento de demonstração (sem ficheiro)", download: "Transferir", meetingLocked: "Os pedidos de reunião ficam disponíveis após a aprovação do espaço do investidor.", actions: "Ações", reviewEvidence: "Analisar a evidência do projeto", manageRoom: "Gerir a sala do projeto", reviewMeetings: "Analisar pedidos de reunião", requested: "Solicitado", requestInformation: "Solicitar informação", saved: "Guardado", applyAccess: "Solicitar acesso de investidor", workspaceAccess: "Um espaço aprovado acrescenta correspondência com o mandato, pedidos de acesso e reuniões com o promotor.", provenance: "Proveniência da evidência", classification: "Classificação", sourceDate: "Data da fonte", reviewStatus: "Estado da análise", noSponsorHistory: "Ainda não foram recolhidos dados de resposta ou transações deste promotor.", reviewEvidenceShort: "Analisar evidência", manageRoomShort: "Gerir sala", meetings: "Reuniões", requestInfo: "Solicitar informação" },
};

const zh: InvestmentUi = {
  ...en,
  opportunities: { ...en.opportunities, metadataTitle: "投资机会 — DESCO Compass", metadataDescription: "按行业、阶段、投资工具及披露状态审阅刚果民主共和国的精选投资机会。", screeningPrinciple: "筛选原则", screeningTitle: "先提供有用的公开信息，再进入受限尽调。", screeningBody: "未披露的信息保持可见，并应影响是否开展深入审查的判断。", browse: "浏览与比较", result: (n) => `${n} 个公开投资机会`, disclosureBody: "除非模块明确标注已审查或独立核验，所有数字和项目陈述均由项目发起方提供。", filterLabel: "筛选投资机会", sector: "行业", geography: "地区", stage: "项目阶段", instrument: "投资工具", sponsor: "项目发起方", capital: "融资需求", allSizes: "所有规模", under10: "低于 1,000 万美元", evidence: "证据审查", allStatuses: "所有状态", pending: "等待审查", reviewed: "已记录证据审查", roomReadiness: "数据室准备度", documentsRecorded: "已记录文件", notConfirmed: "尚未公开确认", updated: "最后更新", anyDate: "不限日期", past30: "过去 30 天", past90: "过去 90 天", older90: "90 天以前", sort: "排序", latest: "最新发布", recentlyUpdated: "最近更新", capitalSize: "融资规模", apply: "应用筛选", clear: "清除筛选", empty: "没有公开投资机会符合当前条件。请移除一个或多个筛选条件。", all: "全部" },
  compare: { ...en.compare, instruction: "最多选择四个投资机会，逐项比较。", count: (n) => `已选择 ${n}/4 个。`, limit: " 已达到上限。", button: "比较所选项目", checkbox: "比较", metadataTitle: "比较投资机会 — DESCO Compass", title: "比较投资机会", intro: (x) => `本页仅并列展示数据。Compass 不推荐或排序这些机会。决策前请审阅所有字段，包括标为“${x}”的字段。`, back: "返回已保存项目", none: "尚未选择投资机会。请返回已保存项目并至少选择一个。", notDisclosed: "未披露", field: "字段", missing: "缺失数据", noneMissing: "无，所有字段均已披露", exportCsv: "导出 CSV", truncated: "仅显示最先选择的四个投资机会。", rows: { "Capital required": "所需资本", Instrument: "投资工具", Geography: "地区", Stage: "阶段", "Revenue model": "收入模式", "Use of funds": "资金用途", "Sponsor contribution": "发起方出资", "Funding secured": "已落实融资", "Return information": "回报信息", Timetable: "时间表", "Evidence review": "证据审查", "Principal risks": "主要风险", "Evidence source date": "证据来源日期" } },
  card: { capitalSought: "融资需求", capitalNotDisclosed: "融资需求尚未公开披露", reviewed: "已记录 DESCO 证据审查", pending: "项目发起方提供 · 等待审查", sponsor: "项目发起方", updated: "更新于", source: "来源", ageMonths: (months) => `距今 ${months} 个月`, sourceUndated: "来源文件未注明日期", evidence: "公开披露", risks: "已说明风险", review: "审阅", relatedParty: "DESCO 关联机会" },
  images: { regional: "区域背景", example: "概念图", preview: "预览", previewDialog: "项目图片预览", closePreview: "关闭图片预览", replaceVisual: "替换图片", captionSource: "图片说明与来源", captionPlaceholder: "图片内容 · 来源或所有者 · 月/年", uploadHelp: "上传经批准的项目发起方图片后，将替换项目卡片和本页的区域背景图或概念图。", noApproved: "暂无经批准的公开项目图片。", sponsorImage: "项目发起方提供的图片" },
  contact: { ...en.contact, metadataTitle: "联系 DESCO Compass", metadataDescription: "就投资机会、合作或平台权限联系 DESCO Global。", title: "联系我们", intro: "请选择咨询目的，以便转交相应的投资者、项目发起方、合作或支持流程。", notice: "工作区批准与特定项目数据室权限是两项独立决定。提交表单不会授予权限，也不代表完成投资者资格审查。", fullName: "姓名", email: "电子邮箱", organization: "机构", optional: "选填", topic: "主题", message: "留言", sending: "发送中…", send: "发送留言", received: "留言已收到", receivedBody: "DESCO 团队成员将审阅咨询。私人测试期间不保证回复时限。", retry: "发送失败，请重试。", network: "网络错误，请重试。", acknowledgement: "我了解 DESCO Compass 处于私人测试阶段，完整隐私声明及使用条款仍待法律审核。请参阅", legalStatus: "当前法律与隐私状态", topics: { general: "一般咨询", "investor-access": "投资者工作区权限", "project-submission": "提交项目", "data-room": "数据室权限问题", "institutional-partnership": "机构合作", "commercial-model": "商业范围与工作区模式", "government-dfi": "政府或开发金融机构合作", "inaccurate-information": "报告不准确的项目信息", "technical-support": "技术支持" } },
  project: { ...en.project, sought: "融资", capitalNotDisclosed: "融资需求尚未公开披露", opportunityIn: "投资机会，地区：", publicBriefing: "公开投资机会简介", sponsorTarget: "项目发起方目标", sponsorFigures: "项目发起方提供的数字", lastUpdated: "最后更新", sponsor: "项目发起方", publicRestricted: "公开披露 · 保密文件受限", publicEvidence: "公开证据", fieldsDisclosed: "个字段已披露", principalRisks: "主要风险", categoriesDisclosed: "个类别已披露", evidenceDate: "证据日期", projectRoom: "项目资料室", restrictedDocs: "已记录文件 · 权限受限", readinessNotPublic: "准备度未公开", thesis: "投资逻辑", figuresNote: "数字由项目发起方提供，除非另有说明，未经独立核验。", publicInvestmentEvidence: "公开投资证据", missingVisible: "缺失字段保持可见，避免将未披露误解为负面结论。", source: "来源", riskDisclosure: "主要风险披露", riskNote: "以下为必填披露类别。“尚未公开披露”表示公开记录尚不足以作出评估。", financialStructure: "融资结构", useOfFunds: "资金用途", fundingSecured: "已落实融资", sponsorContribution: "项目发起方出资", roomEmpty: "权限已记录，但项目发起方尚未上传文件。", roomLocked: "在项目发起方批准数据室权限前，保密文件名和文件将保持隐藏。", roomLockedPublic: "在工作区和特定项目权限获批前，保密文件名和文件将保持隐藏。", roomBullets: ["项目发起方批准的尽调文件", "已提供的财务、法律、技术和影响证据", "项目发起方可授予或撤销的权限"], demoDocument: "演示文件（无文件）", download: "下载", meetingLocked: "投资者工作区权限获批后，可提交会议申请。", actions: "操作", reviewEvidence: "审阅项目证据", manageRoom: "管理项目资料室", reviewMeetings: "审阅会议申请", requested: "已申请", requestInformation: "索取信息", saved: "已保存", applyAccess: "申请投资者权限", workspaceAccess: "获批的投资者工作区提供投资授权匹配、项目权限申请和项目发起方会议功能。", provenance: "证据来源", classification: "分类", sourceDate: "来源日期", reviewStatus: "审查状态", noSponsorHistory: "Compass 尚未收集该项目发起方的响应时间或交易历史数据。", reviewEvidenceShort: "审阅证据", manageRoomShort: "管理资料室", meetings: "会议", requestInfo: "索取信息" },
};

const dictionaries = { en, fr, es, pt, zh } satisfies Record<Locale, InvestmentUi>;
const projectFinanceLabels: Record<Locale, Pick<InvestmentUi["project"], "capitalSought" | "programmeAllocation" | "returnInformation">> = {
  en: { capitalSought: "Project capital sought", programmeAllocation: "Programme allocation, not a project-specific ask", returnInformation: "Return information" },
  fr: { capitalSought: "Capital recherché pour le projet", programmeAllocation: "Allocation de programme, non spécifique au projet", returnInformation: "Informations de rendement" },
  es: { capitalSought: "Capital solicitado para el proyecto", programmeAllocation: "Asignación del programa, no específica del proyecto", returnInformation: "Información de rendimiento" },
  pt: { capitalSought: "Capital procurado para o projeto", programmeAllocation: "Alocação do programa, não específica do projeto", returnInformation: "Informação de retorno" },
  zh: { capitalSought: "项目融资需求", programmeAllocation: "项目群资金分配，并非单一项目融资需求", returnInformation: "回报信息" },
};

export function investmentUi(locale: Locale): InvestmentUi {
  const dictionary = dictionaries[locale];
  return { ...dictionary, project: { ...dictionary.project, ...projectFinanceLabels[locale] } };
}

const instrumentCategoryLabels: Record<Locale, Record<string, string>> = {
  en: { "Equipment finance": "Equipment finance", "DFI / impact capital": "DFI / impact capital", "Programme allocation": "Programme allocation", "Project SPV equity": "Project SPV equity", "Project development capital": "Project development capital", Equity: "Equity", Debt: "Debt", Other: "Other" },
  fr: { "Equipment finance": "Financement d’équipement", "DFI / impact capital": "IFD / capital d’impact", "Programme allocation": "Allocation de programme", "Project SPV equity": "Fonds propres de SPV projet", "Project development capital": "Capital de développement de projet", Equity: "Fonds propres", Debt: "Dette", Other: "Autre" },
  es: { "Equipment finance": "Financiación de equipos", "DFI / impact capital": "IFD / capital de impacto", "Programme allocation": "Asignación de programa", "Project SPV equity": "Capital de SPV del proyecto", "Project development capital": "Capital de desarrollo del proyecto", Equity: "Capital", Debt: "Deuda", Other: "Otro" },
  pt: { "Equipment finance": "Financiamento de equipamento", "DFI / impact capital": "IFD / capital de impacto", "Programme allocation": "Alocação de programa", "Project SPV equity": "Capital de SPV do projeto", "Project development capital": "Capital de desenvolvimento do projeto", Equity: "Capital próprio", Debt: "Dívida", Other: "Outro" },
  zh: { "Equipment finance": "设备融资", "DFI / impact capital": "开发金融机构 / 影响力资本", "Programme allocation": "项目群资金分配", "Project SPV equity": "项目 SPV 股权", "Project development capital": "项目开发资本", Equity: "股权", Debt: "债务", Other: "其他" },
};

export function instrumentCategoryCopy(locale: Locale, category: string): string {
  return instrumentCategoryLabels[locale][category] ?? category;
}

const imageManagementLabels: Record<Locale, {
  uploadFailed: string; removeFailed: string; updateFailed: string; network: string;
}> = {
  en: { uploadFailed: "Upload failed. Please retry.", removeFailed: "Could not remove the image. Please retry.", updateFailed: "Could not update the cover image. Please retry.", network: "Network error. Please retry." },
  fr: { uploadFailed: "Échec du téléversement. Réessayez.", removeFailed: "Impossible de supprimer l’image. Réessayez.", updateFailed: "Impossible de modifier l’image de couverture. Réessayez.", network: "Erreur réseau. Réessayez." },
  es: { uploadFailed: "Error al cargar la imagen. Inténtelo de nuevo.", removeFailed: "No se pudo eliminar la imagen. Inténtelo de nuevo.", updateFailed: "No se pudo actualizar la portada. Inténtelo de nuevo.", network: "Error de red. Inténtelo de nuevo." },
  pt: { uploadFailed: "Falha no carregamento. Tente novamente.", removeFailed: "Não foi possível remover a imagem. Tente novamente.", updateFailed: "Não foi possível atualizar a imagem de capa. Tente novamente.", network: "Erro de rede. Tente novamente." },
  zh: { uploadFailed: "图片上传失败，请重试。", removeFailed: "无法删除图片，请重试。", updateFailed: "无法更新封面图片，请重试。", network: "网络错误，请重试。" },
};

export function imageManagementCopy(locale: Locale) {
  return imageManagementLabels[locale];
}

const comparisonScrollHints: Record<Locale, string> = {
  en: "On smaller screens, scroll horizontally to review every opportunity.",
  fr: "Sur un petit écran, faites défiler horizontalement pour examiner chaque opportunité.",
  es: "En pantallas pequeñas, desplácese horizontalmente para revisar cada oportunidad.",
  pt: "Em ecrãs pequenos, desloque horizontalmente para analisar todas as oportunidades.",
  zh: "在较小屏幕上，请横向滚动以查看所有项目。",
};

export function comparisonScrollHint(locale: Locale): string {
  return comparisonScrollHints[locale];
}

const comparisonRegionLabels: Record<Locale, string> = {
  en: "Opportunity comparison table",
  fr: "Tableau de comparaison des opportunités",
  es: "Tabla comparativa de oportunidades",
  pt: "Tabela de comparação de oportunidades",
  zh: "项目比较表",
};

export function comparisonRegionLabel(locale: Locale): string {
  return comparisonRegionLabels[locale];
}

const capitalLabels: Record<Locale, Record<CapitalPresentation["kind"], string>> = {
  en: { current_ask: "Current capital sought", estimated_cost: "Preliminary project cost; current capital ask not publicly disclosed", not_disclosed: "Current capital ask not publicly disclosed" },
  fr: { current_ask: "Capital actuellement recherché", estimated_cost: "Coût préliminaire du projet; besoin actuel en capital non communiqué publiquement", not_disclosed: "Besoin actuel en capital non communiqué publiquement" },
  es: { current_ask: "Capital solicitado actualmente", estimated_cost: "Coste preliminar del proyecto; necesidad actual de capital no divulgada públicamente", not_disclosed: "Necesidad actual de capital no divulgada públicamente" },
  pt: { current_ask: "Capital atualmente procurado", estimated_cost: "Custo preliminar do projeto; necessidade atual de capital não divulgada publicamente", not_disclosed: "Necessidade atual de capital não divulgada publicamente" },
  zh: { current_ask: "当前融资需求", estimated_cost: "项目初步成本；当前融资需求尚未公开披露", not_disclosed: "当前融资需求尚未公开披露" },
};

const returnValues: Record<Locale, string> = {
  en: "No public return projection published",
  fr: "Aucune projection publique de rendement publiée",
  es: "No se ha publicado ninguna proyección pública de rentabilidad",
  pt: "Não foi publicada qualquer projeção pública de retorno",
  zh: "尚未公布公开回报预测",
};

export function localizedCapitalPresentation(locale: Locale, capital: CapitalPresentation) {
  return {
    ...capital,
    label: capitalLabels[locale][capital.kind],
    value: capital.kind === "not_disclosed" ? dictionaries[locale].compare.notDisclosed : capital.value,
  };
}

export function localizedReturnValue(locale: Locale): string {
  return returnValues[locale];
}

const materialFactLabels: Record<Locale, {
  currentAsk: string; projectCost: string; projectScale: string; capitalGap: string; source: string;
}> = {
  en: { currentAsk: "Current capital sought", projectCost: "Preliminary project cost", projectScale: "Project scale", capitalGap: "Current capital ask not publicly disclosed", source: "source" },
  fr: { currentAsk: "Capital actuellement recherché", projectCost: "Coût préliminaire du projet", projectScale: "Échelle du projet", capitalGap: "Besoin actuel en capital non communiqué publiquement", source: "source" },
  es: { currentAsk: "Capital solicitado actualmente", projectCost: "Coste preliminar del proyecto", projectScale: "Escala del proyecto", capitalGap: "Necesidad actual de capital no divulgada públicamente", source: "fuente" },
  pt: { currentAsk: "Capital atualmente procurado", projectCost: "Custo preliminar do projeto", projectScale: "Escala do projeto", capitalGap: "Necessidade atual de capital não divulgada publicamente", source: "fonte" },
  zh: { currentAsk: "当前融资需求", projectCost: "项目初步成本", projectScale: "项目规模", capitalGap: "当前融资需求尚未公开披露", source: "来源" },
};

export function materialFactCopy(
  locale: Locale,
  kind: "current_ask" | "estimated_cost" | "physical_scale" | "not_disclosed",
  sourceDate: string | null,
) {
  const copy = materialFactLabels[locale];
  const monthMatch = sourceDate?.match(/^([A-Za-z]+)\s+(\d{4})$/);
  const monthNames = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
  const monthIndex = monthMatch ? monthNames.findIndex((month) => monthMatch[1].toLowerCase().startsWith(month)) : -1;
  const localizedSourceDate = monthMatch && monthIndex >= 0
    ? new Intl.DateTimeFormat(locale, {
        month: monthMatch[1].length > 3 ? "long" : "short",
        year: "numeric",
        timeZone: "UTC",
      }).format(new Date(Date.UTC(Number(monthMatch[2]), monthIndex, 1)))
    : sourceDate;
  const label = kind === "current_ask"
    ? copy.currentAsk
    : kind === "estimated_cost"
      ? copy.projectCost
      : kind === "physical_scale"
        ? copy.projectScale
        : copy.capitalGap;
  return {
    label: localizedSourceDate && kind === "estimated_cost" ? `${label} · ${localizedSourceDate} ${copy.source}` : label,
    capitalGap: copy.capitalGap,
  };
}

const completenessLabels: Record<Locale, {
  count: (supported: number, total: number) => string; missing: string; noneMissing: string; review: string;
}> = {
  en: { count: (n, total) => `${n} of ${total} fields contain public information`, missing: "Missing", noneMissing: "No required fields missing", review: "Review disclosure" },
  fr: { count: (n, total) => `${n} champs sur ${total} contiennent une information publique`, missing: "Manquants", noneMissing: "Aucun champ requis manquant", review: "Examiner" },
  es: { count: (n, total) => `${n} de ${total} campos contienen información pública`, missing: "Faltan", noneMissing: "No faltan campos obligatorios", review: "Revisar" },
  pt: { count: (n, total) => `${n} de ${total} campos contêm informação pública`, missing: "Em falta", noneMissing: "Nenhum campo obrigatório em falta", review: "Analisar" },
  zh: { count: (n, total) => `${total} 个字段中 ${n} 个含公开信息`, missing: "缺失", noneMissing: "必填字段均已提供", review: "查看披露" },
};

export function disclosureCompletenessCopy(locale: Locale) {
  return completenessLabels[locale];
}

const catalogueReviewNotes: Record<Locale, { pending: string; reviewed: string }> = {
  en: { pending: "All published briefings contain sponsor-provided information. DESCO source review is recorded; independent verification is not recorded.", reviewed: "DESCO evidence review is recorded for all published briefings." },
  fr: { pending: "Toutes les présentations publiées contiennent des informations fournies par les porteurs. L’examen des sources par DESCO est enregistré ; aucune vérification indépendante n’est enregistrée.", reviewed: "L’examen des preuves par DESCO est enregistré pour toutes les présentations publiées." },
  es: { pending: "Todas las presentaciones publicadas contienen información facilitada por los promotores. La revisión de fuentes de DESCO está registrada; no consta verificación independiente.", reviewed: "La revisión de evidencia de DESCO está registrada para todas las presentaciones publicadas." },
  pt: { pending: "Todas as apresentações publicadas contêm informação fornecida pelos promotores. A análise das fontes pela DESCO está registada; não consta verificação independente.", reviewed: "A análise de evidência pela DESCO está registada para todas as apresentações publicadas." },
  zh: { pending: "所有已发布简介均包含项目发起方提供的信息。DESCO 已记录来源审查，但未记录独立核验。", reviewed: "所有已发布简介均已记录 DESCO 证据审查。" },
};

export function catalogueReviewNote(locale: Locale, verified: boolean) {
  return verified ? catalogueReviewNotes[locale].reviewed : catalogueReviewNotes[locale].pending;
}

const relatedPartyDisclosures: Record<Locale, string> = {
  en: "DESCO is connected to the project sponsor or development platform. DESCO review is an internal completeness review, not independent verification.",
  fr: "DESCO est lié au porteur ou à la plateforme de développement du projet. L’examen DESCO porte sur l’exhaustivité interne et ne constitue pas une vérification indépendante.",
  es: "DESCO está vinculado al promotor o a la plataforma de desarrollo del proyecto. La revisión DESCO es interna y no constituye una verificación independiente.",
  pt: "A DESCO está ligada ao promotor ou à plataforma de desenvolvimento do projeto. A análise DESCO é interna e não constitui verificação independente.",
  zh: "DESCO 与项目发起方或开发平台存在关联。DESCO 审查属于内部完整性审查，不构成独立核实。",
};

export function relatedPartyDisclosure(locale: Locale): string {
  return relatedPartyDisclosures[locale];
}

const inaccurateInformationLabels: Record<Locale, string> = {
  en: "Report inaccurate project information",
  fr: "Signaler une information de projet inexacte",
  es: "Comunicar información inexacta del proyecto",
  pt: "Comunicar informação incorreta do projeto",
  zh: "报告不准确的项目信息",
};

export function inaccurateInformationLabel(locale: Locale): string {
  return inaccurateInformationLabels[locale];
}

const evidenceCoverageLabels: Record<Locale, { fields: string; risks: string }> = {
  en: { fields: "fields with public support", risks: "risk categories addressed" },
  fr: { fields: "champs étayés publiquement", risks: "catégories de risque traitées" },
  es: { fields: "campos con respaldo público", risks: "categorías de riesgo tratadas" },
  pt: { fields: "campos com suporte público", risks: "categorias de risco abordadas" },
  zh: { fields: "个字段有公开依据", risks: "个风险类别已有说明" },
};

export function evidenceCoverageCopy(locale: Locale) {
  return evidenceCoverageLabels[locale];
}

const disclosureStatusLabels: Record<
  Locale,
  { insufficient: string; partial: string; minimum: string }
> = {
  en: {
    insufficient: "Insufficient public evidence",
    partial: "Partial public evidence",
    minimum: "Minimum public evidence available",
  },
  fr: {
    insufficient: "Preuves publiques insuffisantes",
    partial: "Preuves publiques partielles",
    minimum: "Socle minimum de preuves publiques disponible",
  },
  es: {
    insufficient: "Evidencia pública insuficiente",
    partial: "Evidencia pública parcial",
    minimum: "Evidencia pública mínima disponible",
  },
  pt: {
    insufficient: "Evidência pública insuficiente",
    partial: "Evidência pública parcial",
    minimum: "Evidência pública mínima disponível",
  },
  zh: {
    insufficient: "公开证据不足",
    partial: "公开证据不完整",
    minimum: "已提供最低限度公开证据",
  },
};

export function disclosureStatusCopy(
  locale: Locale,
  status: keyof (typeof disclosureStatusLabels)["en"],
): string {
  return disclosureStatusLabels[locale][status];
}

const contactLegalAcknowledgements: Record<Locale, { acknowledgement: string; legalStatus: string }> = {
  en: { acknowledgement: "I understand that DESCO will use the details I submit to review and respond to this enquiry. I will not submit confidential or sensitive information. See the", legalStatus: "current legal and privacy status" },
  fr: { acknowledgement: "Je comprends que DESCO utilisera les informations transmises pour examiner cette demande et y répondre. Je ne transmettrai aucune information confidentielle ou sensible. Consulter le", legalStatus: "statut juridique et de confidentialité actuel" },
  es: { acknowledgement: "Entiendo que DESCO utilizará los datos enviados para revisar y responder a esta consulta. No enviaré información confidencial ni sensible. Consulte el", legalStatus: "estado jurídico y de privacidad actual" },
  pt: { acknowledgement: "Compreendo que a DESCO utilizará os dados enviados para analisar e responder a este pedido. Não enviarei informação confidencial nem sensível. Consulte o", legalStatus: "estado jurídico e de privacidade atual" },
  zh: { acknowledgement: "我了解 DESCO 将使用我提交的资料审核并回复此项咨询。我不会提交机密或敏感信息。请参阅", legalStatus: "当前法律及隐私状态" },
};

export function contactLegalAcknowledgement(locale: Locale) {
  return contactLegalAcknowledgements[locale];
}

const contactCollectionPausedCopy: Record<Locale, string> = {
  en: "Public enquiries are temporarily paused while DESCO Global completes legal review of the privacy notice, data-retention terms and contact-form controls.",
  fr: "Les demandes publiques sont temporairement suspendues pendant que DESCO Global finalise l’examen juridique de la politique de confidentialité, des règles de conservation et des contrôles du formulaire.",
  es: "Las consultas públicas están temporalmente suspendidas mientras DESCO Global completa la revisión jurídica del aviso de privacidad, la conservación de datos y los controles del formulario.",
  pt: "Os pedidos públicos estão temporariamente suspensos enquanto a DESCO Global conclui a análise jurídica do aviso de privacidade, da retenção de dados e dos controlos do formulário.",
  zh: "在 DESCO Global 完成隐私声明、数据保留条款及联系表单控制的法律审查期间，公开咨询暂时关闭。",
};

export function contactCollectionPaused(locale: Locale): string {
  return contactCollectionPausedCopy[locale];
}

const contactEmailFallbackCopy: Record<Locale, string> = {
  en: "Email DESCO Global",
  fr: "Écrire à DESCO Global",
  es: "Escribir a DESCO Global",
  pt: "Contactar a DESCO Global",
  zh: "发送邮件至 DESCO Global",
};

export function contactEmailFallback(locale: Locale): string {
  return contactEmailFallbackCopy[locale];
}
