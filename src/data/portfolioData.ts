export type ProjectCategory = 'all' | 'web-mobile' | 'ai-data' | 'web3-security';

export interface ProjectItem {
  id: string;
  title: string;
  category: Exclude<ProjectCategory, 'all'>;
  categoryLabel: string;
  year: string;
  featured?: boolean;
  summary: string;
  architecture: string;
  highlights: string[];
  outcome: string;
  accessLabel: string;
  liveUrl?: string;
  repoUrl?: string;
  stack: string[];
  labTab?: 'analytics' | 'defi' | 'responsive';
}

export const PROFILE = {
  name: 'Beinomugisha Innocent',
  shortName: 'Innocent B.',
  role: 'Web, Mobile, Web3 & AI Software Engineer',
  location: 'Kampala, Uganda',
  email: 'beinomugishainnocent2001@gmail.com',
  phone: '+256 786 834 364',
  github: 'https://github.com/BEINOMUGISHA',
  cvUrl: '/assets/aistudio/DEV_CV_90808b84.pdf',
  portraitUrl: '/assets/aistudio/Modern_Blue-Gray_Suit_Portrait_cee945c3.png',
  degree: 'BSc Information Technology (Networks & Systems Admin)',
  university: 'Uganda Christian University, Bishop Barham University College',
  honors: 'Second Class Upper Division · CGPA 3.70',
  graduated: '30 October 2026',
  languages: [
    'English (Very Fluent)',
    'Runyankore-Rukiga (Very Fluent)',
    'Kiswahili (Fairly Fluent)',
  ],
};

export const PROOF_METRICS = [
  {
    value: '7+',
    label: 'Production & Research Systems',
    detail: 'Across mobile, web, DeFi & security',
  },
  {
    value: '3.70',
    label: 'BSc IT Cumulative GPA',
    detail: 'Second Class Upper · Oct 2026',
  },
  {
    value: '7 Langs',
    label: 'Multilingual AI Interfaces',
    detail: 'ROCKHAI & localized SME SMS',
  },
  {
    value: '4 Roles',
    label: 'RBAC Enterprise Architecture',
    detail: 'Automated CI/CD & cloud pipelines',
  },
];

export const PROJECTS: ProjectItem[] = [
  {
    id: 'rockhai',
    title: 'ROCKHAI: AI Fitness Posture Coach',
    category: 'ai-data',
    categoryLabel: 'AI Vision & Cross-Platform Mobile',
    year: '2025 – 2026',
    featured: true,
    summary:
      'Cross-platform mobile application combining real-time computer vision pose estimation with cloud telemetry and subscription billing to deliver live biomechanical posture corrections in seven languages.',
    architecture:
      'Built a Flutter client running on-device MediaPipe landmark extraction at 30fps, streaming compact joint-angle telemetry to a Python FastAPI service backed by PostgreSQL for session analytics and recurring payment webhooks.',
    highlights: [
      'Real-time 17-point skeletal angle computation for squat, push-up, and shoulder alignment.',
      'Localized voice and UI feedback across 7 international languages.',
      'FastAPI backend managing user progression curves, workout logs, and subscription tiers.',
    ],
    outcome: 'Shipped full-stack mobile client, FastAPI telemetry API, and 7-language coaching UI.',
    accessLabel: 'Mobile Build · Architecture Available',
    stack: ['Flutter', 'Dart', 'MediaPipe', 'Python', 'FastAPI', 'PostgreSQL'],
    labTab: 'responsive',
  },
  {
    id: 'smartbuz',
    title: 'SMARTBUZ POS & Predictive Inventory',
    category: 'web-mobile',
    categoryLabel: 'Responsive Web & Predictive Analytics',
    year: '2025 – 2026',
    featured: true,
    summary:
      'End-to-end point-of-sale and business intelligence platform engineered for East African SMEs, integrating real-time stock/debt tracking, MTN MoMo and Airtel Money collections, and automated demand alerts.',
    architecture:
      'Reactive Next.js frontend synchronized over Convex real-time subscriptions, paired with mobile money collection APIs and multilingual SMS dispatchers supporting English, Luganda, and Runyankore.',
    highlights: [
      'Adaptive layout transitioning seamlessly from desktop register terminals to handheld mobile inventory scanners.',
      'Automated stock depletion tracking and customer credit-ledger reconciliation.',
      'Native MTN MoMo & Airtel Money payment workflows with localized SMS receipts.',
    ],
    outcome: 'Replaces paper sales & credit ledgers for small shops with automated MoMo & SMS workflows.',
    accessLabel: 'Live on Vercel · Public GitHub',
    liveUrl: 'https://smartbuz.vercel.app',
    repoUrl: 'https://github.com/BEINOMUGISHA/SMARTBUZ',
    stack: ['Next.js', 'TypeScript', 'Convex', 'MTN MoMo API', 'Airtel Money', 'SMS Automation'],
    labTab: 'analytics',
  },
  {
    id: 'ohims',
    title: 'OHIMS Health Insurance Platform',
    category: 'web-mobile',
    categoryLabel: 'Enterprise Web & Role-Based Systems',
    year: '2025 – 2026',
    featured: true,
    summary:
      'Full-stack health insurance operations platform orchestrating policy underwriting, claims adjudication, billing reconciliation, and provider verification across four distinct user roles.',
    architecture:
      'Modular React and TypeScript SPA backed by Supabase Postgres with Row-Level Security policies enforcing strict separation between policyholders, providers, claims officers, and administrators.',
    highlights: [
      'Four-tier RBAC permission model protecting sensitive medical and billing records.',
      'Interactive claims queue with audit trail logging and automated billing calculations.',
      'Automated testing and continuous deployment pipeline via GitHub Actions.',
    ],
    outcome: 'Deployed live demo with 4-role Postgres RLS enforcement and GitHub Actions CI/CD.',
    accessLabel: 'Live on Vercel · Public GitHub',
    liveUrl: 'https://ohims.vercel.app',
    repoUrl: 'https://github.com/BEINOMUGISHA/OHIMS',
    stack: ['React', 'TypeScript', 'Supabase', 'PostgreSQL RLS', 'GitHub Actions'],
    labTab: 'analytics',
  },
  {
    id: 'trade-tracker',
    title: 'Trade Tracker: Analytics & Journaling',
    category: 'ai-data',
    categoryLabel: 'Financial Data & Visualization',
    year: '2026',
    summary:
      'Interactive trade journaling and performance analytics web application for tracking execution setups, risk-reward ratios, and historical equity curves.',
    architecture:
      'Client-responsive JavaScript analytics interface deployed on Vercel for fast execution logging and session performance breakdown.',
    highlights: [
      'Structured trade entry logging with setup tagging and win-rate tracking.',
      'Interactive performance breakdown metrics for reviewing risk discipline.',
    ],
    outcome: 'Live production web app hosted on Vercel with open-source repository.',
    accessLabel: 'Live on Vercel · Public GitHub',
    liveUrl: 'https://trade-tracker-ohims.vercel.app',
    repoUrl: 'https://github.com/BEINOMUGISHA/TRADE-TRACKER',
    stack: ['JavaScript', 'Data Visualization', 'Vercel'],
    labTab: 'analytics',
  },
  {
    id: 'patient-mgmt',
    title: 'Kabale Patient Management System',
    category: 'web-mobile',
    categoryLabel: 'Health Informatics',
    year: '2026',
    summary:
      'Responsive clinical records web application streamlining patient intake, visit histories, and practitioner scheduling for Kabale District workflows.',
    architecture:
      'Responsive web interface engineered for low-latency clinic workflows and deployed via Vercel edge delivery.',
    highlights: [
      'Fast patient lookup and structured medical encounter histories.',
      'Responsive tablet and desktop layouts tailored for clinical environments.',
    ],
    outcome: 'Live clinical records deployment hosted on Vercel.',
    accessLabel: 'Live on Vercel · Public GitHub',
    liveUrl: 'https://patient-management-system-ohims.vercel.app',
    repoUrl: 'https://github.com/BEINOMUGISHA/PATIENT-MANAGEMENT-SYSTEM',
    stack: ['JavaScript', 'Health Informatics', 'Vercel'],
  },
  {
    id: 'defi-contracts',
    title: 'DeFi AMM & Smart Contract Suite',
    category: 'web3-security',
    categoryLabel: 'Blockchain & Web3 Protocols',
    year: '2025 – 2026',
    summary:
      'Modular Solidity smart contracts and local Hardhat test harnesses exploring constant-product automated market makers, deterministic escrow settlement, and reentrancy-hardened token vaults.',
    architecture:
      'Written in Solidity 0.8+ with custom error selectors for gas optimization, verified against invariant property tests and simulated EVM edge-case attacks in Hardhat.',
    highlights: [
      'Constant-product x * y = k liquidity pool math with configurable protocol fees and slippage guards.',
      'Comprehensive Hardhat unit and integration tests covering overflow, front-running bounds, and access control.',
      'Web3 client integration patterns for wallet signing and deterministic transaction state feedback.',
    ],
    outcome: 'Verified local Hardhat contract suite covering AMM swap invariants and slippage guards.',
    accessLabel: 'Local Hardhat Suite',
    repoUrl: 'https://github.com/BEINOMUGISHA',
    stack: ['Solidity', 'Hardhat', 'Ethers / Web3', 'TypeScript', 'DeFi Math'],
    labTab: 'defi',
  },
  {
    id: 'vulnscout',
    title: 'VulnScout Pro',
    category: 'web3-security',
    categoryLabel: 'Cybersecurity Research',
    year: '2026',
    summary:
      'Final-year BSc IT research project: a lightweight, high-speed web vulnerability scanner equipped with two-factor authentication and structured risk-remediation dashboards.',
    architecture:
      'Automated passive header analysis, misconfiguration probing, and authenticated session management secured by TOTP 2FA.',
    highlights: [
      'Identifies common OWASP misconfigurations, insecure headers, and exposed endpoints.',
      'Built-in two-factor authentication protecting scanner workspaces and audit reports.',
    ],
    outcome: 'Completed BSc IT final-year research defense with working 2FA-secured scanner prototype.',
    accessLabel: 'Public GitHub Repository',
    repoUrl: 'https://github.com/BEINOMUGISHA/Vulnscout_pro',
    stack: ['Python', 'Cybersecurity', '2FA / TOTP', 'Web Security'],
  },
  {
    id: 'client-web-deployments',
    title: 'Production Client Web Platforms (4 Live Sites)',
    category: 'web-mobile',
    categoryLabel: 'Commercial Web & Hospitality',
    year: '2026',
    summary:
      'Designed, built, and deployed responsive TypeScript web platforms for hospitality, tourism, and agency clients—including Habuharo Tourist Resort, MH Adventures, Kings Hotel Kabale, and Rhockai Studio.',
    architecture:
      'Responsive TypeScript and React/Next.js frontends optimized for mobile discovery, booking inquiries, and fast edge delivery on Vercel.',
    highlights: [
      'Habuharo Tourist Resort (habuharo-tourist-resort.vercel.app)',
      'MH Adventures Tour & Travel (mh-adventures.vercel.app)',
      'Kings Hotel Kabale (kings-hotel-kabale.vercel.app) & Rhockai Studio (rhockai.vercel.app)',
    ],
    outcome: '4 live commercial client sites verified online on Vercel.',
    accessLabel: 'Live on Vercel · Public GitHub',
    liveUrl: 'https://habuharo-tourist-resort.vercel.app',
    repoUrl: 'https://github.com/BEINOMUGISHA/habuharo-tourist-resort',
    stack: ['TypeScript', 'React', 'Next.js', 'Responsive UI', 'Vercel'],
  },
];

export const CAPABILITY_GROUPS = [
  {
    index: '01',
    title: 'Responsive Web & Cross-Platform Mobile',
    description:
      'Adaptive, high-frame-rate applications engineered from unified architectures for desktop, tablet, and mobile viewports.',
    items: [
      'Flutter & Dart cross-platform mobile apps',
      'React & Next.js responsive web architectures',
      'TypeScript strict domain modeling',
      'Mobile-first ergonomics & accessibility',
    ],
  },
  {
    index: '02',
    title: 'Blockchain, Web3 & DeFi Systems',
    description:
      'Deterministic smart contract engineering, decentralized liquidity mechanics, and audited local EVM verification.',
    items: [
      'Solidity smart contract development',
      'Hardhat local testing & security invariants',
      'Automated Market Maker (AMM) & escrow logic',
      'Wallet orchestration & gas-conscious patterns',
    ],
  },
  {
    index: '03',
    title: 'ML, Computer Vision & Predictive Dashboards',
    description:
      'Turning raw operational and biomechanical streams into real-time inference and interactive visual decision tools.',
    items: [
      'MediaPipe pose estimation & joint tracking',
      'Time-series forecasting & confidence modeling',
      'Interactive SVG/Canvas telemetry dashboards',
      'Anomaly flagging & KPI cohort breakdowns',
    ],
  },
  {
    index: '04',
    title: 'Backend, Cloud & African Fintech APIs',
    description:
      'Resilient APIs, relational databases, CI/CD automation, and real-world payment rails.',
    items: [
      'Python FastAPI, PostgreSQL & MySQL',
      'Supabase RLS & Convex real-time sync',
      'MTN MoMo, Airtel Money & SMS gateways',
      'GitHub Actions, Vercel & LAN infrastructure',
    ],
  },
];

export const TIMELINE_ENTRIES = [
  {
    period: 'Ongoing',
    title: 'Founder & Solutions Developer',
    organization: 'Self-Employed · Kampala, Uganda',
    points: [
      'Architected and delivered responsive web and business systems for multiple clients from discovery to production.',
      'Engineered SME automation covering lead generation, point-of-sale billing, inventory forecasting, and mobile money collections.',
    ],
  },
  {
    period: '30 October 2026',
    title: 'BSc Information Technology (Networks and Systems Administration)',
    organization: 'Uganda Christian University · Bishop Barham University College, Kabale',
    points: [
      'Graduated with Second Class Upper Division honors and a 3.70 CGPA.',
      'Relevant coursework: Database Design & Applications, Object-Oriented Programming, Web & Mobile Apps Development, Cloud Computing, Systems Analysis & Design, IT Research Projects I & II, Computer Networking & Network Security, Digital Marketing & E-Commerce.',
      'Completed final-year cybersecurity research (VulnScout Pro) focusing on automated web vulnerability detection and 2FA.',
    ],
  },
  {
    period: 'July – September 2025',
    title: 'IT Intern',
    organization: 'Codinex Computers Ltd · Mbarara, Uganda',
    points: [
      'Collaborated within an engineering team on live business technology deployments, including enterprise LAN setup and configuration.',
      'Built practical experience with applied AI models and computer vision pipelines.',
    ],
  },
];

export const COURSEWORK = [
  'Database Design & Applications',
  'Object-Oriented Programming',
  'Web & Mobile Apps Development',
  'Cloud Computing',
  'Systems Analysis & Design',
  'IT Research Projects I & II',
  'Computer Networking & Security',
  'Digital Marketing & E-Commerce',
];

export interface ForecastDataset {
  id: 'retail' | 'claims' | 'adherence';
  label: string;
  unit: string;
  prefix: string;
  modelName: string;
  rmse: string;
  mape: string;
  projectedLift: string;
  anomalyCount: number;
  points: {
    label: string;
    actual: number | null;
    predicted: number;
    band80: number;
    band95: number;
    note?: string;
  }[];
}

export const FORECAST_DATASETS: ForecastDataset[] = [
  {
    id: 'retail',
    label: 'SMARTBUZ Retail Demand',
    unit: 'UGX (M)',
    prefix: 'UGX ',
    modelName: 'Seasonal ARIMA + Gradient Boost',
    rmse: '1.84M',
    mape: '4.2%',
    projectedLift: '+18.4%',
    anomalyCount: 1,
    points: [
      { label: 'W1', actual: 24.2, predicted: 23.8, band80: 1.6, band95: 2.8 },
      { label: 'W2', actual: 26.8, predicted: 26.1, band80: 1.7, band95: 2.9 },
      { label: 'W3', actual: 25.4, predicted: 25.9, band80: 1.6, band95: 2.8 },
      { label: 'W4', actual: 29.1, predicted: 28.4, band80: 1.8, band95: 3.1 },
      { label: 'W5', actual: 31.5, predicted: 30.8, band80: 1.9, band95: 3.2 },
      { label: 'W6', actual: 30.2, predicted: 31.1, band80: 1.9, band95: 3.3, note: 'Restock cycle dip' },
      { label: 'W7', actual: 34.6, predicted: 33.9, band80: 2.0, band95: 3.5 },
      { label: 'W8 (Now)', actual: 36.2, predicted: 35.8, band80: 2.1, band95: 3.6 },
      { label: 'W9', actual: null, predicted: 37.9, band80: 2.5, band95: 4.2 },
      { label: 'W10', actual: null, predicted: 39.4, band80: 2.9, band95: 4.9 },
      { label: 'W11', actual: null, predicted: 41.2, band80: 3.3, band95: 5.5 },
      { label: 'W12', actual: null, predicted: 42.8, band80: 3.8, band95: 6.2 },
    ],
  },
  {
    id: 'claims',
    label: 'OHIMS Claims Volume',
    unit: 'Claims',
    prefix: '',
    modelName: 'Temporal Fusion Regressor',
    rmse: '14.2',
    mape: '3.6%',
    projectedLift: '+11.2%',
    anomalyCount: 2,
    points: [
      { label: 'W1', actual: 310, predicted: 305, band80: 16, band95: 28 },
      { label: 'W2', actual: 328, predicted: 322, band80: 17, band95: 29 },
      { label: 'W3', actual: 342, predicted: 336, band80: 18, band95: 31 },
      { label: 'W4', actual: 389, predicted: 351, band80: 19, band95: 33, note: 'Seasonal outpatient spike' },
      { label: 'W5', actual: 364, predicted: 360, band80: 19, band95: 33 },
      { label: 'W6', actual: 372, predicted: 374, band80: 20, band95: 35 },
      { label: 'W7', actual: 388, predicted: 385, band80: 21, band95: 36 },
      { label: 'W8 (Now)', actual: 401, predicted: 398, band80: 22, band95: 38 },
      { label: 'W9', actual: null, predicted: 412, band80: 26, band95: 44 },
      { label: 'W10', actual: null, predicted: 424, band80: 30, band95: 51 },
      { label: 'W11', actual: null, predicted: 435, band80: 34, band95: 58 },
      { label: 'W12', actual: null, predicted: 446, band80: 38, band95: 64 },
    ],
  },
  {
    id: 'adherence',
    label: 'ROCKHAI Pose Sessions',
    unit: 'Sessions',
    prefix: '',
    modelName: 'Cohort Retention Prophet',
    rmse: '48.0',
    mape: '3.1%',
    projectedLift: '+24.7%',
    anomalyCount: 0,
    points: [
      { label: 'W1', actual: 1120, predicted: 1105, band80: 55, band95: 94 },
      { label: 'W2', actual: 1210, predicted: 1190, band80: 58, band95: 99 },
      { label: 'W3', actual: 1295, predicted: 1280, band80: 62, band95: 105 },
      { label: 'W4', actual: 1380, predicted: 1365, band80: 66, band95: 112 },
      { label: 'W5', actual: 1460, predicted: 1455, band80: 70, band95: 118 },
      { label: 'W6', actual: 1590, predicted: 1560, band80: 74, band95: 126 },
      { label: 'W7', actual: 1685, predicted: 1670, band80: 79, band95: 134 },
      { label: 'W8 (Now)', actual: 1790, predicted: 1775, band80: 84, band95: 142 },
      { label: 'W9', actual: null, predicted: 1910, band80: 98, band95: 168 },
      { label: 'W10', actual: null, predicted: 2025, band80: 114, band95: 194 },
      { label: 'W11', actual: null, predicted: 2140, band80: 130, band95: 220 },
      { label: 'W12', actual: null, predicted: 2232, band80: 148, band95: 248 },
    ],
  },
];
