import {
  Server,
  CreditCard,
  BellOff,
  Globe,
  Database,
  HardDrive,
  ShieldCheck,
  Bot,
  Mic,
  Smartphone,
  type LucideIcon,
} from "lucide-react";

export type ProjectCategory = "Backend" | "Infrastructure" | "Full-stack" | "DevOps" | "AI";

export interface Project {
  slug: string; // URL friendly identifier
  title: string;
  cardTitle?: string; // The shorter title the Work card shows; falls back to title
  description: string;
  category?: ProjectCategory;
  /** Problem, approach and outcome: left out where there is nothing specific and true to say */
  problem?: string;
  solution?: string;
  outcome?: string;
  tags: string[];
  featured?: boolean;
  icon: LucideIcon;
  /** Own-time, open-source work: its repository */
  repo?: string;
  /** A line under the headline for own-time work */
  origin?: string;
}

// Professional case studies from banking platform work (client details generalized).
export const projects: Project[] = [
  {
    slug: "corporate-banking-microservices",
    title: "Retail, Mobile & Corporate Banking",
    description:
      "Spring Boot services in a 30+ microservice estate powering Retail Internet Banking, Corporate Internet Banking, and Mobile Banking for retail customers and hundreds of corporate clients.",
    category: "Backend",
    problem:
      "Corporate clients needed new banking modules on a platform serving hundreds of organizations, under strict compliance requirements",
    solution:
      "Designed and delivered three major corporate banking modules: REST APIs, Kafka event flows, and PostgreSQL persistence",
    outcome: "Modules shipped to production and in daily use by corporate banking customers",
    tags: ["Spring Boot", "Kafka", "PostgreSQL", "Redis", "Microservices"],
    icon: Server,
    featured: true,
  },
  {
    slug: "maker-checker-authorization",
    title: "Maker-Checker Authorization Framework",
    description: "Dual-approval controls on financial transactions in Corporate Internet Banking.",
    category: "Backend",
    problem: "Financial transactions needed a second person to approve them before they went through",
    solution: "Built a reusable maker-checker framework applied across corporate banking transaction flows",
    outcome: "No financial transaction in Corporate Internet Banking goes through on one person's approval",
    tags: ["Spring Boot", "Spring Security", "Maker-checker", "Audit"],
    icon: ShieldCheck,
    featured: true,
  },
  {
    slug: "totp-authentication-system",
    title: "TOTP Authentication & Push Approval",
    description:
      "RFC 6238-compliant TOTP with AES-256-GCM secret storage, QR enrollment, and Redis-backed replay prevention.",
    category: "Backend",
    problem: "Customers needed strong multi-factor authentication for logins and high-value transactions",
    solution: "Implemented TOTP end to end plus push-notification approval from registered devices",
    outcome: "MFA live across banking channels; replay attacks structurally prevented",
    tags: ["Java", "Redis", "AES-256-GCM", "TOTP", "Security"],
    icon: ShieldCheck,
    featured: true,
  },
  {
    slug: "card-tokenization",
    title: "Card on File Network Tokenization",
    description:
      "Issuer-side Visa and Mastercard network tokenization, built as primary owner and taken to production in 3 months.",
    category: "Backend",
    problem:
      "Merchants and wallets need network tokens in place of real card numbers, and the issuing bank has to answer the networks' provisioning and lifecycle calls",
    solution:
      "Designed and built the issuer-side services that handle Visa and Mastercard provisioning and token lifecycle calls, secured with JWT, JWE, and JWS",
    outcome: "Live in production for both networks, 3 months from start",
    tags: ["Java", "Spring Boot", "Network tokenization", "Visa", "Mastercard", "JWE/JWS"],
    icon: HardDrive,
    featured: true,
  },
  {
    slug: "virtual-cards-google-pay",
    title: "Virtual Cards and Google Pay, the first launch in Trinidad and Tobago",
    cardTitle: "Virtual Cards and Google Pay",
    description:
      "In-app virtual cards with secure card number and CVV reveal and wallet provisioning, which powered the first Google Pay launch in Trinidad and Tobago.",
    category: "Backend",
    problem: "Customers wanted a card they could use the moment they asked for it, on the phone and in Google Pay",
    solution:
      "As primary backend owner, built virtual card issuance, secure card number and CVV reveal, and wallet provisioning in 3 months, inside a 6-month program with the UI and vendor teams",
    outcome:
      "Powered the bank's Google Pay launch, the first in Trinidad and Tobago. Apple Pay provisioning is now in rollout",
    tags: ["Java", "Spring Boot", "Kafka", "PostgreSQL", "Google Pay", "Apple Pay"],
    icon: CreditCard,
    featured: true,
  },
  {
    slug: "duplicate-alerts-race-condition",
    title: "Duplicate Alerts, Fixed at the Root",
    description:
      "A race condition sent customers the same SMS, email, and push alert more than once. Fixed with locking, claim-and-deliver, and idempotent sends.",
    category: "Backend",
    problem:
      "Several scheduler instances picked up the same pending alerts, so Infobip delivered duplicates. The bank paid for every extra message, and customers reported double debits that never happened",
    solution:
      "Added scheduler locking, row-level locks when fetching alerts, claim-and-deliver status updates, and idempotent sends, so each alert is claimed by one worker and sent once",
    outcome: "Duplicate vendor charges and false double-debit reports stopped",
    tags: ["Java", "Spring Boot", "PostgreSQL", "Distributed locking", "Idempotency", "Infobip"],
    icon: BellOff,
    featured: true,
  },
  {
    slug: "multi-region-apis",
    title: "One API, Two Countries",
    description: "A single set of APIs serving Trinidad and Tobago and Barbados, each region on its own database.",
    category: "Backend",
    problem:
      "The bank runs in two countries with separate data, and duplicating every API per region doubles the work and the drift",
    solution: "Resolved the region from the access token and routed each request to that region's database",
    outcome: "One codebase and one set of contracts for both countries",
    tags: ["Spring Boot", "Spring Security", "OAuth2", "PostgreSQL", "Multi-region"],
    icon: Globe,
  },
  {
    slug: "llm-banking-chatbot",
    title: "LLM Banking Assistant",
    description:
      "A production banking assistant on Spring AI and Azure OpenAI that answers customer FAQs and checks who it is talking to before it touches an account.",
    category: "AI",
    problem: "Routine questions, account lookups, and password resets took up support agents' time",
    solution:
      "Designed and launched an assistant that answers FAQs and handles account lookup and identity validation before password resets",
    outcome: "In production, resolving routine requests without a support agent",
    tags: ["Spring AI", "Azure OpenAI", "LangChain4j", "Java", "LLM"],
    icon: Bot,
  },
  {
    slug: "elk-observability-rollout",
    title: "ELK + Kafka Observability",
    description: "Centralized logging and cross-service search for a 30+ service estate.",
    category: "Infrastructure",
    problem: "Production triage meant grepping scattered logs across on-prem services",
    solution:
      "Set up the ELK Stack with Kafka as the log transport, so every service's logs land in one searchable place",
    outcome: "Production issues are traced from one search across all services",
    tags: ["Elasticsearch", "Logstash", "Kibana", "Kafka"],
    icon: Database,
  },
  {
    slug: "aegis-ai",
    title: "AegisAI, a GenAI platform for banking operations",
    cardTitle: "AegisAI",
    description:
      "A multi-tenant GenAI platform on Spring AI: a compliance copilot that answers only from internal documents with citations, dispute agents with human approval, an OAuth2-secured MCP server, and guardrails on every model call.",
    category: "AI",
    problem: "Bank staff can't paste policies and statements into a model that may invent answers or leak them",
    solution:
      "Built a copilot that cites its sources, Kafka-triggered agents that draft dispute resolutions for a human to approve, and a guardrail pipeline for PII, prompt injection, and output validation",
    outcome: "Open source; a sovereign mode runs fully local with zero data egress",
    tags: ["Spring AI", "MCP", "Agents", "RAG", "pgvector", "Guardrails"],
    icon: ShieldCheck,
    featured: true,
    repo: "https://github.com/achyuthkp27/spring-ai-langchain4j",
    origin: "Own time · open source",
  },
  {
    slug: "voxos",
    title: "VoxOs, a voice agent for the Mac",
    cardTitle: "VoxOs",
    description:
      "A macOS menu-bar app in Swift that turns speech into text and actions: dictation into any field, shell commands, and app control, all transcribed on the Mac. macOS 14.4 and up, GPL-3.0.",
    category: "AI",
    problem: "Dictation on the Mac stops at text; turning speech into actions meant leaving the keyboard for the mouse",
    solution:
      "Built a menu-bar agent in Swift that transcribes on-device and maps phrases to shell commands, app focus, and dictation into the active cursor",
    outcome: "Open source under GPL-3.0 and in daily use; audio never leaves the machine",
    tags: ["Swift", "macOS", "On-device speech", "Agents"],
    icon: Mic,
    featured: true,
    repo: "https://github.com/achyuthkp27/VoxOs",
    origin: "Own time · open source · GPL-3.0",
  },
  {
    slug: "kairo-offline-ai-bank",
    title: "Kairo, an offline-first AI bank",
    cardTitle: "Kairo",
    description:
      "A mobile banking app whose assistant runs on the phone. Qwen answers questions about your accounts, finds transactions by meaning, flags odd charges, and plans bills, with nothing sent to a server.",
    category: "AI",
    problem: "Banking assistants send transaction history to a cloud model; the privacy cost is the whole ledger",
    solution:
      "Ran a small LLM on the phone with local vector search over transactions, so coaching, anomaly detection, and planning work with no network at all",
    outcome: "Open source; every feature works in airplane mode",
    tags: ["React Native", "Qwen", "On-device LLM", "Vector search", "SQLite"],
    icon: Smartphone,
    featured: true,
    repo: "https://github.com/achyuthkp27/kairo-offline-ai-bank",
    origin: "Own time · open source",
  },
];

/** What the Work section shows, by slug: the banking systems first, then applied AI as one card, then VoxOs */
export const WORK = {
  banking: [
    "card-tokenization",
    "virtual-cards-google-pay",
    "duplicate-alerts-race-condition",
    "multi-region-apis",
    "corporate-banking-microservices",
    "totp-authentication-system",
    "elk-observability-rollout",
  ],
  ai: ["llm-banking-chatbot", "aegis-ai", "kairo-offline-ai-bank"],
  spotlight: "voxos",
} as const;

export const projectBySlug = (slug: string) => {
  const found = projects.find((p) => p.slug === slug);
  if (!found) throw new Error(`Unknown project: ${slug}`);
  return found;
};
