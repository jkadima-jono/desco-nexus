import type { Locale } from "@/lib/i18n";

type AccountCopy = {
  signIn: string;
  createAccount: string;
  openWorkspace: string;
  email: string;
  fullName: string;
  loginTitle: string;
  loginIntro: string;
  signupTitle: string;
  signupIntro: string;
  basicAccountNotice: string;
  termsAcceptance: string;
  termsLink: string;
  sendLink: string;
  sending: string;
  checkEmailTitle: string;
  checkEmailBody: string;
  unavailableTitle: string;
  unavailableBody: string;
  contact: string;
  switchToSignup: string;
  switchToLogin: string;
  verifyTitle: string;
  verifyIntro: string;
  verifyButton: string;
  verifying: string;
  verifyError: string;
  verifiedTitle: string;
  verifiedBody: string;
  continue: string;
  onboardingTitle: string;
  onboardingBody: string;
  onboardingBoundary: string;
  reviewOpportunities: string;
  createMandate: string;
  settingsTitle: string;
  settingsIntro: string;
  accountEmail: string;
  signOut: string;
  signOutAll: string;
  exportData: string;
  deleteAccount: string;
  unavailableAction: string;
};

const en: AccountCopy = {
  signIn: "Sign in", createAccount: "Create account", openWorkspace: "Open workspace",
  email: "Work email", fullName: "Full name", loginTitle: "Sign in to DESCO Compass",
  loginIntro: "We will email you a secure, single-use sign-in link.",
  signupTitle: "Create a DESCO Compass account",
  signupIntro: "Create a basic investor account using a verified email address.",
  basicAccountNotice: "A basic account lets you save opportunities and prepare an investor mandate. It does not grant institutional qualification, project data-room access or investment approval.",
  termsAcceptance: "I accept the approved account terms and acknowledge the privacy notice.",
  termsLink: "Review legal terms and privacy status",
  sendLink: "Email me a secure link", sending: "Sending…",
  checkEmailTitle: "Check your email", checkEmailBody: "If the address can receive DESCO Compass email, a secure link will arrive shortly. The link expires after 15 minutes and can be used once.",
  unavailableTitle: "Online account access is not available", unavailableBody: "DESCO Compass will enable sign-in and new account creation only after the email service, account terms and privacy notice are approved and configured.", contact: "Contact DESCO",
  switchToSignup: "New to Compass? Create an account", switchToLogin: "Already have an account? Sign in",
  verifyTitle: "Confirm this sign-in", verifyIntro: "Continue only if you requested this secure DESCO Compass link.", verifyButton: "Confirm and continue", verifying: "Confirming…", verifyError: "This link is invalid, expired or has already been used. Request a new secure link.",
  verifiedTitle: "Email confirmed", verifiedBody: "Your secure session is ready.", continue: "Continue to Compass",
  onboardingTitle: "Your basic investor account is ready", onboardingBody: "Start with the public opportunity record, then save relevant projects or create a screening mandate.", onboardingBoundary: "Account creation does not verify an organisation or grant access to confidential project material. Those decisions remain separate and controlled.", reviewOpportunities: "Review opportunities", createMandate: "Create a mandate",
  settingsTitle: "Account settings", settingsIntro: "Review your current account and session options.", accountEmail: "Verified email", signOut: "Sign out", signOutAll: "Sign out all sessions", exportData: "Request a data export", deleteAccount: "Request account deletion", unavailableAction: "The request could not be recorded. Try again or contact DESCO support.",
};

const copies: Record<Locale, AccountCopy> = {
  en,
  fr: { ...en, signIn: "Se connecter", createAccount: "Créer un compte", openWorkspace: "Ouvrir l’espace", email: "E-mail professionnel", fullName: "Nom complet", loginTitle: "Se connecter à DESCO Compass", loginIntro: "Nous vous enverrons un lien de connexion sécurisé et à usage unique.", signupTitle: "Créer un compte DESCO Compass", signupIntro: "Créez un compte investisseur de base avec une adresse e-mail vérifiée.", basicAccountNotice: "Un compte de base permet d’enregistrer des opportunités et de préparer un mandat investisseur. Il ne confère ni qualification institutionnelle, ni accès à une data room, ni approbation d’investissement.", termsAcceptance: "J’accepte les conditions de compte approuvées et reconnais avoir pris connaissance de l’avis de confidentialité.", termsLink: "Consulter le statut juridique et de confidentialité", sendLink: "M’envoyer un lien sécurisé", sending: "Envoi…", checkEmailTitle: "Consultez votre messagerie", checkEmailBody: "Si l’adresse peut recevoir les e-mails de DESCO Compass, un lien sécurisé arrivera sous peu. Il expire après 15 minutes et ne peut être utilisé qu’une fois.", unavailableTitle: "La création de compte en ligne n’est pas disponible", unavailableBody: "DESCO Compass activera les comptes en ligne après approbation et configuration du service e-mail, des conditions de compte et de l’avis de confidentialité.", contact: "Contacter DESCO", switchToSignup: "Nouveau sur Compass ? Créer un compte", switchToLogin: "Vous avez déjà un compte ? Se connecter", verifyTitle: "Confirmer cette connexion", verifyIntro: "Continuez uniquement si vous avez demandé ce lien sécurisé DESCO Compass.", verifyButton: "Confirmer et continuer", verifying: "Confirmation…", verifyError: "Ce lien est invalide, expiré ou déjà utilisé. Demandez un nouveau lien sécurisé.", verifiedTitle: "E-mail confirmé", verifiedBody: "Votre session sécurisée est prête.", continue: "Continuer vers Compass", onboardingTitle: "Votre compte investisseur de base est prêt", onboardingBody: "Commencez par le dossier public, puis enregistrez des projets pertinents ou créez un mandat de sélection.", onboardingBoundary: "La création du compte ne vérifie pas une organisation et ne donne pas accès aux documents confidentiels. Ces décisions restent distinctes et contrôlées.", reviewOpportunities: "Examiner les opportunités", createMandate: "Créer un mandat", settingsTitle: "Paramètres du compte", settingsIntro: "Consultez votre compte et les options de session actuelles.", accountEmail: "E-mail vérifié", signOut: "Se déconnecter", signOutAll: "Fermer toutes les sessions", exportData: "Demander un export de données", deleteAccount: "Demander la suppression du compte", unavailableAction: "Cette demande contrôlée n’est pas disponible dans la version actuelle. Contactez l’assistance DESCO." },
  es: { ...en, signIn: "Iniciar sesión", createAccount: "Crear cuenta", openWorkspace: "Abrir espacio", email: "Correo de trabajo", fullName: "Nombre completo", loginTitle: "Iniciar sesión en DESCO Compass", loginIntro: "Le enviaremos un enlace seguro y de un solo uso.", signupTitle: "Crear una cuenta DESCO Compass", signupIntro: "Cree una cuenta básica de inversor con un correo verificado.", basicAccountNotice: "Una cuenta básica permite guardar oportunidades y preparar un mandato. No concede calificación institucional, acceso a salas de datos ni aprobación de inversión.", termsAcceptance: "Acepto las condiciones de cuenta aprobadas y reconozco el aviso de privacidad.", termsLink: "Revisar estado legal y de privacidad", sendLink: "Enviarme un enlace seguro", sending: "Enviando…", checkEmailTitle: "Revise su correo", checkEmailBody: "Si la dirección puede recibir correo de DESCO Compass, llegará un enlace seguro. Caduca en 15 minutos y solo puede usarse una vez.", unavailableTitle: "La creación de cuentas en línea no está disponible", unavailableBody: "DESCO Compass habilitará las cuentas cuando estén aprobados y configurados el servicio de correo, las condiciones y el aviso de privacidad.", contact: "Contactar con DESCO", switchToSignup: "¿Nuevo en Compass? Crear una cuenta", switchToLogin: "¿Ya tiene cuenta? Iniciar sesión", verifyTitle: "Confirmar este inicio de sesión", verifyIntro: "Continúe solo si solicitó este enlace seguro de DESCO Compass.", verifyButton: "Confirmar y continuar", verifying: "Confirmando…", verifyError: "El enlace no es válido, ha caducado o ya se usó. Solicite uno nuevo.", verifiedTitle: "Correo confirmado", verifiedBody: "Su sesión segura está lista.", continue: "Continuar a Compass", onboardingTitle: "Su cuenta básica de inversor está lista", onboardingBody: "Revise las oportunidades públicas, guarde proyectos o cree un mandato de selección.", onboardingBoundary: "Crear una cuenta no verifica una organización ni da acceso a material confidencial. Son decisiones separadas y controladas.", reviewOpportunities: "Revisar oportunidades", createMandate: "Crear un mandato", settingsTitle: "Configuración de la cuenta", settingsIntro: "Revise su cuenta y las opciones de sesión.", accountEmail: "Correo verificado", signOut: "Cerrar sesión", signOutAll: "Cerrar todas las sesiones", exportData: "Solicitar exportación de datos", deleteAccount: "Solicitar eliminación de la cuenta", unavailableAction: "Esta solicitud no está disponible en la versión actual. Contacte con soporte de DESCO." },
  pt: { ...en, signIn: "Entrar", createAccount: "Criar conta", openWorkspace: "Abrir espaço", email: "E-mail profissional", fullName: "Nome completo", loginTitle: "Entrar na DESCO Compass", loginIntro: "Enviaremos um link seguro e de utilização única.", signupTitle: "Criar uma conta DESCO Compass", signupIntro: "Crie uma conta básica de investidor com um e-mail verificado.", basicAccountNotice: "Uma conta básica permite guardar oportunidades e preparar um mandato. Não concede qualificação institucional, acesso a salas de dados ou aprovação de investimento.", termsAcceptance: "Aceito os termos de conta aprovados e reconheço o aviso de privacidade.", termsLink: "Consultar estado legal e de privacidade", sendLink: "Enviar-me um link seguro", sending: "A enviar…", checkEmailTitle: "Consulte o seu e-mail", checkEmailBody: "Se o endereço puder receber e-mail da DESCO Compass, chegará um link seguro. Expira em 15 minutos e só pode ser usado uma vez.", unavailableTitle: "A criação de contas online não está disponível", unavailableBody: "A DESCO Compass ativará contas após aprovação e configuração do serviço de e-mail, dos termos e do aviso de privacidade.", contact: "Contactar a DESCO", switchToSignup: "Novo na Compass? Criar conta", switchToLogin: "Já tem conta? Entrar", verifyTitle: "Confirmar este início de sessão", verifyIntro: "Continue apenas se solicitou este link seguro da DESCO Compass.", verifyButton: "Confirmar e continuar", verifying: "A confirmar…", verifyError: "O link é inválido, expirou ou já foi utilizado. Solicite um novo link.", verifiedTitle: "E-mail confirmado", verifiedBody: "A sua sessão segura está pronta.", continue: "Continuar para a Compass", onboardingTitle: "A sua conta básica de investidor está pronta", onboardingBody: "Analise oportunidades públicas, guarde projetos ou crie um mandato de seleção.", onboardingBoundary: "Criar uma conta não verifica uma organização nem dá acesso a material confidencial. São decisões separadas e controladas.", reviewOpportunities: "Analisar oportunidades", createMandate: "Criar um mandato", settingsTitle: "Definições da conta", settingsIntro: "Consulte a sua conta e as opções de sessão.", accountEmail: "E-mail verificado", signOut: "Sair", signOutAll: "Terminar todas as sessões", exportData: "Solicitar exportação de dados", deleteAccount: "Solicitar eliminação da conta", unavailableAction: "Este pedido não está disponível na versão atual. Contacte o suporte DESCO." },
  zh: { ...en, signIn: "登录", createAccount: "创建账户", openWorkspace: "打开工作区", email: "工作邮箱", fullName: "姓名", loginTitle: "登录 DESCO Compass", loginIntro: "我们将发送安全的一次性登录链接。", signupTitle: "创建 DESCO Compass 账户", signupIntro: "使用已验证邮箱创建基础投资者账户。", basicAccountNotice: "基础账户可保存机会并准备投资授权，但不授予机构资格、项目资料室访问权或投资批准。", termsAcceptance: "我接受已批准的账户条款，并确认知悉隐私声明。", termsLink: "查看法律条款和隐私状态", sendLink: "发送安全链接", sending: "正在发送…", checkEmailTitle: "请查收邮件", checkEmailBody: "如果该地址可以接收 DESCO Compass 邮件，安全链接将很快送达。链接在 15 分钟后过期且只能使用一次。", unavailableTitle: "暂未开放在线创建账户", unavailableBody: "DESCO Compass 仅在邮件服务、账户条款和隐私声明获批并配置后开放在线账户。", contact: "联系 DESCO", switchToSignup: "首次使用 Compass？创建账户", switchToLogin: "已有账户？登录", verifyTitle: "确认本次登录", verifyIntro: "仅在您申请了此 DESCO Compass 安全链接时继续。", verifyButton: "确认并继续", verifying: "正在确认…", verifyError: "链接无效、已过期或已使用。请申请新的安全链接。", verifiedTitle: "邮箱已确认", verifiedBody: "安全会话已准备就绪。", continue: "继续进入 Compass", onboardingTitle: "基础投资者账户已准备就绪", onboardingBody: "先查看公开机会，再保存相关项目或创建筛选授权。", onboardingBoundary: "创建账户不会验证机构，也不会授予机密项目材料访问权。这些决定独立且受控。", reviewOpportunities: "查看机会", createMandate: "创建授权", settingsTitle: "账户设置", settingsIntro: "查看当前账户和会话选项。", accountEmail: "已验证邮箱", signOut: "退出登录", signOutAll: "退出所有会话", exportData: "申请导出数据", deleteAccount: "申请删除账户", unavailableAction: "当前版本暂不支持此受控请求。请联系 DESCO 支持。" },
};

const unavailableAccessCopy: Record<Locale, Pick<AccountCopy, "unavailableTitle" | "unavailableBody">> = {
  en: { unavailableTitle: "Online account access is not available", unavailableBody: "DESCO Compass will enable sign-in and new account creation only after the email service, account terms and privacy notice are approved and configured." },
  fr: { unavailableTitle: "L’accès aux comptes en ligne n’est pas disponible", unavailableBody: "DESCO Compass activera la connexion et la création de comptes après approbation et configuration du service e-mail, des conditions de compte et de l’avis de confidentialité." },
  es: { unavailableTitle: "El acceso a cuentas en línea no está disponible", unavailableBody: "DESCO Compass habilitará el inicio de sesión y la creación de cuentas cuando estén aprobados y configurados el servicio de correo, las condiciones de cuenta y el aviso de privacidad." },
  pt: { unavailableTitle: "O acesso a contas online não está disponível", unavailableBody: "A DESCO Compass ativará o início de sessão e a criação de contas após aprovação e configuração do serviço de e-mail, dos termos de conta e do aviso de privacidade." },
  zh: { unavailableTitle: "暂未开放在线账户访问", unavailableBody: "DESCO Compass 仅在邮件服务、账户条款和隐私声明获批并配置后开放登录及新账户创建。" },
};

export function accountCopy(locale: Locale): AccountCopy {
  return { ...copies[locale], ...unavailableAccessCopy[locale] };
}

export function accountRequestReceived(locale: Locale): string {
  return {
    en: "Your request has been recorded for controlled review.",
    fr: "Votre demande a été enregistrée pour un examen contrôlé.",
    es: "Su solicitud se ha registrado para una revisión controlada.",
    pt: "O seu pedido foi registado para análise controlada.",
    zh: "您的申请已记录并将进入受控审核。",
  }[locale];
}
