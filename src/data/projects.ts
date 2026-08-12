import { Server, Database, MessageSquare, HardDrive, ShieldCheck, Bot, type LucideIcon } from "lucide-react";

export type ProjectCategory = 'Backend' | 'Infrastructure' | 'Full-stack' | 'DevOps';

export interface Project {
    slug: string; // URL friendly identifier
    title: string;
    description: string;
    category?: ProjectCategory;
    problem: string;
    solution: string;
    outcome: string;
    tags: string[];
    featured?: boolean;
    icon: LucideIcon;
}

// Professional case studies from banking platform work (client details generalized).
export const projects: Project[] = [
    {
        slug: "corporate-banking-microservices",
        title: "Corporate Banking Microservices",
        description: "Spring Boot services within a 30+ microservice estate powering retail, mobile, and corporate online banking.",
        category: "Backend",
        problem: "Corporate clients needed new banking modules on a platform serving hundreds of organizations, under strict compliance requirements",
        solution: "Designed and delivered three corporate banking modules end to end — REST APIs, Kafka event flows, and PostgreSQL persistence",
        outcome: "Modules shipped to production and in daily use by corporate banking customers",
        tags: ["Spring Boot", "Kafka", "PostgreSQL", "Redis", "Microservices"],
        icon: Server,
        featured: true,
    },
    {
        slug: "maker-checker-authorization",
        title: "Maker-Checker Authorization Framework",
        description: "Dual-approval controls on financial transactions for compliance and audit requirements.",
        category: "Backend",
        problem: "Financial transactions required enforced four-eyes approval to satisfy PCI-DSS and SOX audit controls",
        solution: "Built a reusable maker-checker framework applied across corporate banking transaction flows",
        outcome: "Compliance controls enforced platform-wide; passed client audit cycles",
        tags: ["Spring Boot", "Spring Security", "PCI-DSS", "SOX"],
        icon: ShieldCheck,
        featured: true,
    },
    {
        slug: "totp-authentication-system",
        title: "TOTP Authentication & Push Approval",
        description: "RFC 6238-compliant TOTP with AES-256-GCM secret storage, QR enrollment, and Redis-backed replay prevention.",
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
        title: "Card on File Tokenization",
        description: "Credit card tokenization for Mastercard and Visa, plus virtual card services and JWT/JWE/JWS API security.",
        category: "Backend",
        problem: "Storing raw card data carries PCI-DSS scope and breach risk",
        solution: "Integrated network tokenization so merchants hold tokens, never PANs; secured APIs with JWT/JWE/JWS",
        outcome: "Card data taken out of scope; tokenized payments live for both networks",
        tags: ["Java", "Spring Boot", "JWE/JWS", "Mastercard", "Visa"],
        icon: HardDrive,
        featured: true,
    },
    {
        slug: "video-kyc-onboarding",
        title: "Video KYC Onboarding",
        description: "Real-time remote customer verification over WebRTC and WebSockets.",
        category: "Full-stack",
        problem: "Branch-only KYC slowed customer onboarding",
        solution: "Engineered real-time video verification with WebRTC signaling over WebSockets",
        outcome: "Remote onboarding shipped; also delivered WhatsApp banking on the same channel stack",
        tags: ["WebRTC", "WebSockets", "Spring Boot", "ReactJS"],
        icon: MessageSquare,
    },
    {
        slug: "llm-banking-chatbot",
        title: "LLM Banking Chatbot APIs",
        description: "Conversational AI integration for automated query handling and identity validation.",
        category: "Backend",
        problem: "Routine account queries and password-change flows consumed support capacity",
        solution: "Built LLM-powered chatbot APIs covering account detail retrieval and identity validation",
        outcome: "Automated handling of routine banking queries in production",
        tags: ["Spring AI", "LangChain4j", "Java", "LLM"],
        icon: Bot,
    },
    {
        slug: "elk-observability-rollout",
        title: "ELK + Kafka Observability Rollout",
        description: "Centralized logging and cross-service tracing for a 30+ service estate.",
        category: "Infrastructure",
        problem: "Production triage meant grepping scattered logs across on-prem services",
        solution: "Led end-to-end ELK Stack rollout with Kafka transport and searchable cross-service traces",
        outcome: "Team-wide searchable logs; measurably faster production triage",
        tags: ["Elasticsearch", "Logstash", "Kibana", "Kafka"],
        icon: Database,
    },
];
