export type AppLanguage = 'fr' | 'en' | 'ar';

export type SubscriptionTier = 'free' | 'pro' | 'vip_cabinet';

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  role: string;
  country: string;
  tier: SubscriptionTier;
  subscriptionEndDate?: string;
  remoteAvailable: boolean;
  avatarUrl?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  category: 'career' | 'cabinet' | 'account' | 'remote';
  read: boolean;
}

// ========================
// CV & COVER LETTER TYPES
// ========================

export type CVTemplateId = 'ai_data_engineer' | 'executive_remote' | 'minimal_tech' | 'academic_research';

export interface CVExperience {
  id: string;
  company: string;
  role: string;
  location: string;
  remoteType: 'full_remote' | 'hybrid' | 'onsite';
  startDate: string;
  endDate: string;
  current: boolean;
  highlights: string[];
}

export interface CVEducation {
  id: string;
  institution: string;
  degree: string;
  field: string;
  location: string;
  year: string;
  details?: string;
}

export interface CVProject {
  id: string;
  title: string;
  technologies: string[];
  description: string;
  link?: string;
  impactMetric?: string;
}

export interface CVCertification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  credentialUrl?: string;
}

export interface CVSkillCategory {
  category: string;
  skills: string[];
}

export interface CVData {
  // General Info
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  portfolioUrl: string;
  linkedinUrl: string;
  githubUrl: string;
  remoteStatus: 'Full Remote Ready' | 'Hybride' | 'Freelance International' | 'Disponible immédiatement';
  bioSummary: string;
  
  // Sections
  experiences: CVExperience[];
  projects: CVProject[];
  education: CVEducation[];
  skillCategories: CVSkillCategory[];
  certifications: CVCertification[];
  languages: { language: string; level: string }[];
  interests: string[];
  
  // Customization
  templateId: CVTemplateId;
  accentColor: string;
  fontScale: 'compact' | 'normal' | 'large';
}

export interface CoverLetterData {
  senderName: string;
  senderTitle: string;
  senderEmail: string;
  senderPhone: string;
  senderLocation: string;
  
  recipientName: string;
  recipientTitle: string;
  companyName: string;
  companyAddress: string;
  date: string;
  
  jobTarget: string;
  workArrangement: 'Télétravail Full Remote' | 'Mission Freelance Cabinet' | 'Poste Hybride / CDI';
  tone: 'impact_data' | 'expert_ai' | 'corporate_leadership';
  
  greeting: string;
  hookParagraph: string;
  skillsParagraph: string;
  valueParagraph: string;
  closingParagraph: string;
  signoff: string;
}

// ========================
// CABINET & PORTFOLIO TYPES
// ========================

export interface CabinetService {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  iconName: string;
  deliverables: string[];
  tools: string[];
  remoteTimeline: string;
  hourlyRate: string;
  featured: boolean;
}

export interface PortfolioProject {
  id: string;
  title: string;
  category: 'agents_ia' | 'data_science' | 'computer_vision' | 'mlops';
  summary: string;
  challenge: string;
  solution: string;
  metrics: { label: string; value: string }[];
  technologies: string[];
  demoUrl?: string;
  githubUrl?: string;
  isRemoteDelivery: boolean;
  completionYear: string;
}

export interface CabinetPillar {
  title: string;
  description: string;
  icon: string;
  stats: string;
}

export interface RemoteWorkEstimate {
  serviceType: string;
  durationWeeks: number;
  hoursPerWeek: number;
  complexity: 'standard' | 'advanced' | 'enterprise';
  estimatedCostXOF: number;
  estimatedCostEUR: number;
}

// ========================
// LIBRARY & KNOWLEDGE TYPES
// ========================

export interface BookResource {
  id: string;
  title: string;
  author: string;
  category: 'agents_ia' | 'data_science' | 'remote_work' | 'strategy_business';
  coverGradient: string;
  year: string;
  pages: number;
  readTime: string;
  rating: number;
  summary: string;
  keyTakeaways: string[];
  recommendedFor: string;
  fileSize: string;
  badge?: string;
  downloadFilename: string;
}

// ========================
// CURRENCY CONVERTER TYPES
// ========================

export interface CurrencyItem {
  code: string;
  name: string;
  symbol: string;
  flag: string;
  rateToUSD: number; // USD as base: 1 USD = rateToUSD unit
  popular?: boolean;
  region: 'Afrique' | 'Europe' | 'Amériques' | 'Asie / Moyen-Orient';
}
