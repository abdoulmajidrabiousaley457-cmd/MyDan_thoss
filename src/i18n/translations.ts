import { AppLanguage } from '../types';

export const translations: Record<AppLanguage, Record<string, string>> = {
  fr: {
    // Brand & Header
    cabinetName: "Cabinet d'Expertise Rabiou Saley",
    cabinetBadge: "Cabinet IA",
    cabinetAuthor: "Rabiou Saley • Data Science & Télétravail",
    remoteAvailable: "Disponible Télétravail International (Full Remote)",
    installPhone: "Installer l'App",
    myProfile: "Mon Profil",
    vipPlan: "VIP Cabinet 👑",
    proPlan: "Plan Pro ⭐",
    freePlan: "Découverte",
    downloadZip: "Télécharger l'App (ZIP)",
    downloadZipDesc: "Téléchargez l'archive complète ZIP de l'application",

    // Navigation & Tabs
    navCabinet: "Cabinet & IA",
    navPortfolios: "Portfolios & Projets",
    navCurrencies: "Devises",
    navLibrary: "Bibliothèque",
    navDevis: "Devis en Ligne",
    navSubscriptions: "Abonnements",
    navProfile: "Mon Espace",
    navSecurity: "Sécurité & Confidentialité",
    navNotifications: "Notifications",
    navOfficialPortfolio: "Portfolio Officiel en Direct",
    navOmniAgent: "Agent IA Omni Studio",

    // Portfolios & Projects Screen
    portfoliosTitle: "Portfolios & Projets Professionnels",
    portfoliosSubtitle: "Accédez directement au portfolio officiel en ligne de Rabiou Saley, ou explorez des exemples complets de portfolios prêts à utiliser.",
    officialPortfolioTitle: "Portfolio Officiel en Direct de Rabiou Saley",
    officialPortfolioDesc: "Découvrez nos démonstrations interactives, architectures multi-agents RAG et réalisations concrètes hébergées sur Vercel.",
    visitLivePortfolio: "Ouvrir le Portfolio en Direct (Vercel) ↗",
    hostedOmniAgentBtn: "Ouvrir l'Agent IA Hébergé (Omni Studio) ↗",
    portfolioTemplatesTab: "Exemples de Portfolios à Utiliser",
    cvBuilderTab: "Éditeur de CV Pro",
    coverLetterTab: "Lettre de Motivation",
    atsAnalyzerTab: "Audit ATS & Score",
    useThisTemplate: "Utiliser ce Modèle",
    copyCodeSnippet: "Copier le Code / Structure",
    codeCopied: "Copié dans le presse-papiers !",
    liveDemo: "Démonstration en Ligne",
    viewProjects: "Projets Inclus",
    technologies: "Technologies & Outils",
    impactMetric: "Impact Mesuré",
    servicesAndTarifs: "Prestations & Tarifs Estimés",

    // Cabinet Hero & Info
    heroTitle: "Consultant Senior Data Science & Ingénieur Agents IA",
    heroDesc: "Spécialisé dans l'architecture de systèmes multi-agents autonomes, l'industrialisation de modèles prédictifs et les pipelines MLOps robustes livrés à 100% en télétravail international.",
    requestRemoteQuote: "Demander un Devis Télétravail",
    contactWhatsApp: "WhatsApp Direct",
    yearsExp: "Années d'Expérience",
    projectsDelivered: "Projets IA & Data Livrés",
    remoteClients: "Clients en Télétravail",
    satisfactionRate: "Satisfaction Client",

    // AI Assistant (Majid IA)
    majidAiTitle: "Majid IA",
    majidAiBadge: "Assistant Cabinet & IA",
    majidAiDesc: "Posez toutes vos questions sur l'Intelligence Artificielle, le code, nos prestations ou le télétravail international.",
    majidAiPlaceholder: "Posez votre question (IA, Python, télétravail, devis, code, etc.)...",
    majidAiThinking: "Majid IA réfléchit...",
    majidAiOmniBadge: "Agent Omni Studio Connecté",
    majidAiClear: "Effacer l'historique",

    // CV & Presets
    loadAndEdit: "Charger & Modifier ce CV",
    exportPdf: "Imprimer / Télécharger en PDF",
    saveCloud: "Sauvegarder dans Firebase Cloud",
    resetDefault: "Réinitialiser",
    chooseTemplate: "Choisir un Modèle Graphique",
    accentColor: "Couleur d'Accent",

    // Currency Screen
    currencyTitle: "Convertisseur de Devises Internationales & Simulateur d'Honoraires",
    currencySubtitle: "Calculez vos tarifs de mission et convertissez instantanément en Franc CFA (XOF), Euro (EUR), Dollar (USD), Naira (NGN) et plus de 15 devises.",
    amountToConvert: "Montant à convertir",
    convertedResult: "Résultat converti",
    hourlyRate: "Tarif Horaire",
    dailyRate: "Taux Journalier Moyen (TJM)",
    monthlyRemoteSalary: "Forfait Mensuel Télétravail",

    // Library Screen
    libraryTitle: "Bibliothèque Numérique Pro du Cabinet",
    librarySubtitle: "Ouvrages et synthèses de référence sélectionnés en Data Science, Agents IA, Ingénierie logicielle et Télétravail.",
    readSummary: "Lire la Synthèse",
    downloadEbook: "Télécharger l'Ouvrage",

    // Common
    close: "Fermer",
    back: "Retour",
    apply: "Appliquer",
    save: "Enregistrer",
    cancel: "Annuler",
    loading: "Chargement...",
    language: "Langue"
  },
  en: {
    // Brand & Header
    cabinetName: "Rabiou Saley Expertise Firm",
    cabinetBadge: "AI Cabinet",
    cabinetAuthor: "Rabiou Saley • Data Science & Remote Work",
    remoteAvailable: "Available for International Remote Work (Full Remote)",
    installPhone: "Install App",
    myProfile: "My Profile",
    vipPlan: "VIP Cabinet 👑",
    proPlan: "Pro Plan ⭐",
    freePlan: "Discovery",
    downloadZip: "Download App (ZIP)",
    downloadZipDesc: "Download complete ZIP source code of the application",

    // Navigation & Tabs
    navCabinet: "Firm & AI",
    navPortfolios: "Portfolios & Projects",
    navCurrencies: "Currencies",
    navLibrary: "Library",
    navDevis: "Online Quote",
    navSubscriptions: "Subscriptions",
    navProfile: "My Space",
    navSecurity: "Security & Privacy",
    navNotifications: "Notifications",
    navOfficialPortfolio: "Official Live Portfolio",
    navOmniAgent: "Omni Studio AI Agent",

    // Portfolios & Projects Screen
    portfoliosTitle: "Professional Portfolios & Projects",
    portfoliosSubtitle: "Access Rabiou Saley's official live online portfolio, or explore ready-to-use portfolio templates.",
    officialPortfolioTitle: "Rabiou Saley's Official Live Portfolio",
    officialPortfolioDesc: "Discover interactive demos, multi-agent RAG architectures, and deployed projects hosted on Vercel.",
    visitLivePortfolio: "Open Live Portfolio (Vercel) ↗",
    hostedOmniAgentBtn: "Open Hosted AI Agent (Omni Studio) ↗",
    portfolioTemplatesTab: "Portfolio Templates to Use",
    cvBuilderTab: "Pro CV Builder",
    coverLetterTab: "Cover Letter",
    atsAnalyzerTab: "ATS Audit & Score",
    useThisTemplate: "Use This Template",
    copyCodeSnippet: "Copy Code / Structure",
    codeCopied: "Copied to clipboard!",
    liveDemo: "Live Demonstration",
    viewProjects: "Included Projects",
    technologies: "Technologies & Stack",
    impactMetric: "Measured Impact",
    servicesAndTarifs: "Services & Estimated Rates",

    // Cabinet Hero & Info
    heroTitle: "Senior Data Science Consultant & Autonomous AI Agents Engineer",
    heroDesc: "Specialized in autonomous multi-agent systems, predictive machine learning pipelines, and robust MLOps deployed 100% in international remote mode.",
    requestRemoteQuote: "Request Remote Quote",
    contactWhatsApp: "Direct WhatsApp",
    yearsExp: "Years Experience",
    projectsDelivered: "AI & Data Projects Delivered",
    remoteClients: "Remote Clients",
    satisfactionRate: "Client Satisfaction",

    // AI Assistant (Majid IA)
    majidAiTitle: "Majid AI",
    majidAiBadge: "Firm Assistant & AI",
    majidAiDesc: "Ask any question about Artificial Intelligence, programming, consulting services, or international remote missions.",
    majidAiPlaceholder: "Ask anything (AI, Python, remote work, quotes, code, etc.)...",
    majidAiThinking: "Majid AI is thinking...",
    majidAiOmniBadge: "Connected to Omni Studio Agent",
    majidAiClear: "Clear history",

    // CV & Presets
    loadAndEdit: "Load & Edit This CV",
    exportPdf: "Print / Download as PDF",
    saveCloud: "Save to Firebase Cloud",
    resetDefault: "Reset to Default",
    chooseTemplate: "Choose Template Style",
    accentColor: "Accent Color",

    // Currency Screen
    currencyTitle: "Global Currency Converter & Fee Calculator",
    currencySubtitle: "Calculate consulting fees and convert between CFA Franc (XOF), Euro (EUR), US Dollar (USD), Naira (NGN), and 15+ currencies.",
    amountToConvert: "Amount to convert",
    convertedResult: "Converted result",
    hourlyRate: "Hourly Rate",
    dailyRate: "Average Daily Rate (TJM)",
    monthlyRemoteSalary: "Monthly Remote Package",

    // Library Screen
    libraryTitle: "Professional Digital Library",
    librarySubtitle: "Curated reference books and executive summaries in Data Science, AI Agents, Software Engineering, and Remote Work.",
    readSummary: "Read Summary",
    downloadEbook: "Download eBook",

    // Common
    close: "Close",
    back: "Back",
    apply: "Apply",
    save: "Save",
    cancel: "Cancel",
    loading: "Loading...",
    language: "Language"
  },
  ar: {
    // Brand & Header
    cabinetName: "مكتب الخبير رابيو صالح",
    cabinetBadge: "مكتب الذكاء الاصطناعي",
    cabinetAuthor: "رابيو صالح • علم البيانات والعمل عن بعد",
    remoteAvailable: "متاح للمهام الدولية عن بعد (Full Remote)",
    installPhone: "تثبيت التطبيق",
    myProfile: "ملفي الشخصي",
    vipPlan: "كبار الشخصيات 👑",
    proPlan: "الخطة الاحترافية ⭐",
    freePlan: "الاستكشافية",
    downloadZip: "تحميل التطبيق (ZIP)",
    downloadZipDesc: "تحميل الأرشيف الكامل لتطبيق بصيغة ZIP",

    // Navigation & Tabs
    navCabinet: "المكتب والذكاء الاصطناعي",
    navPortfolios: "معارض الأعمال والمشاريع",
    navCurrencies: "العملات",
    navLibrary: "المكتبة",
    navDevis: "عرض سعر عن بعد",
    navSubscriptions: "الاشتراكات",
    navProfile: "حسابي",
    navSecurity: "الأمان والخصوصية",
    navNotifications: "الإشعارات",
    navOfficialPortfolio: "معرض الأعمال الرسمي المباشر",
    navOmniAgent: "وكيل Omni Studio الذكي",

    // Portfolios & Projects Screen
    portfoliosTitle: "معارض الأعمال والمشاريع الاحترافية",
    portfoliosSubtitle: "تفضل بزيارة معرض الأعمال الرسمي المباشر على Vercel أو استكشف نماذج معارض أعمال جاهزة للاستخدام.",
    officialPortfolioTitle: "معرض الأعمال الرسمي المباشر لرابيو صالح",
    officialPortfolioDesc: "اكتشف العروض التفاعلية وهياكل الوكلاء الأذكياء المتعددين ومشاريعنا المنشورة على Vercel.",
    visitLivePortfolio: "فتح معرض الأعمال المباشر (Vercel) ↗",
    hostedOmniAgentBtn: "فتح الوكيل الذكي المستضاف (Omni Studio) ↗",
    portfolioTemplatesTab: "نماذج معارض أعمال للاستخدام",
    cvBuilderTab: "محرر السيرة الذاتية",
    coverLetterTab: "خطاب التقديم",
    atsAnalyzerTab: "تدقيق معايير ATS",
    useThisTemplate: "استخدام هذا النموذج",
    copyCodeSnippet: "نسخ الكود والهيكل",
    codeCopied: "تم النسخ إلى الحافظة!",
    liveDemo: "عرض مباشر",
    viewProjects: "المشاريع المتضمنة",
    technologies: "التقنيات والأدوات",
    impactMetric: "الأثر والنتائج",
    servicesAndTarifs: "الخدمات والأسعار التقديرية",

    // Cabinet Hero & Info
    heroTitle: "استشاري أول علم البيانات ومهندس وكلاء الذكاء الاصطناعي",
    heroDesc: "متخصص في هندسة أنظمة الوكلاء المستقلين ونماذج تعلم الآلة التنبؤية المنفذة بالكامل عن بعد وبمعايير عالمية.",
    requestRemoteQuote: "طلب عرض سعر عن بعد",
    contactWhatsApp: "واتساب مباشر",
    yearsExp: "سنوات خبرة",
    projectsDelivered: "مشاريع ذكاء وبيانات منجزة",
    remoteClients: "عملاء عن بعد",
    satisfactionRate: "نسبة رضا العملاء",

    // AI Assistant (Majid IA)
    majidAiTitle: "ماجد الذكي",
    majidAiBadge: "مساعد المكتب والذكاء الاصطناعي",
    majidAiDesc: "اطرح أي سؤال حول الذكاء الاصطناعي والبرمجة وخدمات الاستشارة والعمل الدولي عن بعد.",
    majidAiPlaceholder: "اطرح سؤالك (ذكاء اصطناعي، بايثون، عمل عن بعد، عروض، كود...)...",
    majidAiThinking: "ماجد الذكي يقوم بالتحليل والإجابة...",
    majidAiOmniBadge: "متصل بوكيل Omni Studio",
    majidAiClear: "مسح السجل",

    // CV & Presets
    loadAndEdit: "تحميل وتعديل السيرة الذاتية",
    exportPdf: "طباعة / تحميل بصيغة PDF",
    saveCloud: "حفظ في سحابة Firebase",
    resetDefault: "إعادة ضبط",
    chooseTemplate: "اختيار تصميم القالب",
    accentColor: "لون التمييز",

    // Currency Screen
    currencyTitle: "محول العملات الدولية وحاسبة أجور العمل عن بعد",
    currencySubtitle: "حساب تكاليف المهام والتحويل الفوري بين فرنك سيفا واليورو والدولار والنايرا وأكثر من 15 عملة.",
    amountToConvert: "المبلغ المراد تحويله",
    convertedResult: "النتيجة المحولة",
    hourlyRate: "السعر بالساعة",
    dailyRate: "المعدل اليومي المتوسط (TJM)",
    monthlyRemoteSalary: "الراتب الشهري للعمل عن بعد",

    // Library Screen
    libraryTitle: "المكتبة الرقمية المهنية للمكتب",
    librarySubtitle: "كتب وملخصات مرجعية مختارة في علم البيانات ووكلاء الذكاء الاصطناعي وهندسة البرمجيات.",
    readSummary: "قراءة الملخص",
    downloadEbook: "تحميل الكتاب",

    // Common
    close: "إغلاق",
    back: "رجوع",
    apply: "تطبيق",
    save: "حفظ",
    cancel: "إلغاء",
    loading: "جارٍ التحميل...",
    language: "اللغة"
  }
};
