import { Building2, Briefcase, type LucideIcon } from "lucide-react";

export interface Experience {
  company: string;
  role: string;
  period: string;
  type: "full-time" | "internship" | "contract";
  icon: LucideIcon;
  color: string;
  /** The employer's mark, under public/images, for the ID badge */
  logo?: { src: string; dark?: string; width: number; height: number };
  /** Roles sharing a platform form one unbroken lane on the rail, across employers */
  platform?: string;
  /** How this role began, when it continued something rather than started it */
  handoff?: string;
  /** Shows the award card in this role */
  award?: boolean;
  achievements: string[];
  technologies: string[];
}

export const experiences: Experience[] = [
  {
    company: "Cognizant Technology Solutions",
    role: "Software Engineer · Client: First Citizens Bank",
    period: "Apr 2026 – Present",
    type: "full-time",
    logo: { src: "images/cognizant-logo.png", dark: "images/cognizant-logo-white.png", width: 416, height: 84 },
    icon: Briefcase,
    color: "primary",
    platform: "First Citizens Bank platform",
    handoff: "Client-driven rebadge: same platform, same team, same client",
    achievements: [
      "Own Card on File, virtual cards, and the LLM banking assistant on the bank's next-generation Java 21, Spring Boot 3.5, and Kafka platform, shipping enhancements across Retail Internet Banking, Corporate Internet Banking, and Mobile Banking.",
      "Extend virtual card wallet provisioning from Google Pay to Apple Pay, now in rollout.",
      "Lead features from requirements and technical design to production rollout, defining solutions and estimating scope with product owners, project managers, and partner teams.",
      "Mentor 4 junior engineers and review their code for quality and security within a 25+ engineer delivery team.",
    ],
    technologies: [
      "Java 21",
      "Spring Boot 3.5",
      "Apache Kafka",
      "Spring AI",
      "Azure OpenAI",
      "PostgreSQL",
      "Apple Pay",
    ],
  },
  {
    company: "FIS Global",
    role: "Software Engineer → Senior Software Engineer · Client: First Citizens Bank",
    period: "Jul 2021 – Apr 2026",
    type: "full-time",
    logo: { src: "images/fis-logo.png", width: 422, height: 178 },
    icon: Building2,
    color: "primary",
    platform: "First Citizens Bank platform",
    award: true,
    achievements: [
      "Designed, developed, and maintained 30+ Spring Boot microservices powering Retail Internet Banking, Corporate Internet Banking, and Mobile Banking for retail customers and hundreds of corporate clients, and delivered three major corporate banking modules.",
      "Primary owner of Card on File network tokenization for Visa and Mastercard, designing and building the issuer-side services that handle network provisioning and lifecycle calls, and taking them to production in 3 months.",
      "Primary backend owner of in-app virtual cards with secure card number and CVV reveal and wallet provisioning, built in 3 months of a 6-month program with UI and vendor teams, powering the first Google Pay launch in Trinidad and Tobago.",
      "Designed and launched a production LLM banking assistant on Spring AI and Azure OpenAI that answers customer FAQs and handles account lookup and identity validation before password resets, resolving routine requests without a support agent.",
      "Owned the P2P and merchant payment integration with the Montran payments platform, live in production in 1 month.",
      "Fixed a race condition that sent duplicate SMS, email, and push alerts via Infobip when scheduler instances picked up the same records, adding scheduler locking, row-level fetch locks, claim-and-deliver status updates, and idempotent sends, which ended duplicate vendor charges and customer reports of double debits.",
      "Designed a single set of APIs serving both Trinidad and Tobago and Barbados, resolving the region from the access token and routing each request to that region's database.",
      "Joined as a React engineer on the bank's back-office portal and Internet Banking app, then moved to backend to build gRPC services on NATS JetStream, MinIO (customer media and downloadable back-office and customer reports), and Redis.",
      "Built RFC 6238 TOTP MFA with AES-256-GCM secret storage and Redis replay protection, maker-checker dual approval on financial transactions, and JWT, JWE, and JWS security across banking APIs.",
      "Built Kafka integrations with retry and circuit breaker patterns, tuned Redis caching and PostgreSQL queries, set up ELK logging, and covered services with JUnit and Mockito tests.",
      "Became the go-to engineer for Retail Internet Banking, shaping its API contracts and technical designs with the client architects.",
      "Promoted to Senior Software Engineer, and earned the Above and Beyond Individual Award (Q1 2024) for critical project delivery.",
    ],
    technologies: [
      "Java",
      "Spring Boot",
      "Spring Security",
      "Spring AI",
      "Azure OpenAI",
      "Kafka",
      "NATS JetStream",
      "gRPC",
      "Redis",
      "PostgreSQL",
      "MinIO",
      "Visa · Mastercard tokenization",
      "Google Pay",
      "Montran",
      "ELK Stack",
      "JUnit",
      "Mockito",
      "AWS",
    ],
  },
];
