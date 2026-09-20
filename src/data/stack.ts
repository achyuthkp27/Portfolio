/**
 * The banking backend I work in, as layers rather than a flat skill list.
 * Every skill from the old inventory lives in exactly one layer, so the section
 * stays a complete, crawlable list while reading as a system.
 */
export interface StackLayer {
  id: string;
  /** Node label in the map */
  label: string;
  /** Second line inside the node */
  sub: string;
  /** What this layer does, in one plain sentence */
  blurb: string;
  skills: string[];
  /** Case-study slugs that lean on this layer */
  projects: string[];
}

export const stackLayers: StackLayer[] = [
  {
    id: "channels",
    label: "Channels",
    sub: "web · mobile · corporate",
    blurb: "Where customers and corporates actually hit the platform — three front ends over one set of APIs.",
    skills: ["ReactJS", "JavaScript"],
    projects: ["corporate-banking-microservices", "video-kyc-onboarding"],
  },
  {
    id: "edge",
    label: "API gateway",
    sub: "authn · authz · audit",
    blurb: "Every request is authenticated, authorized and recorded here before a service ever sees it.",
    skills: [
      "Spring Boot",
      "Spring Security",
      "OAuth2",
      "JWT / JWE / JWS",
      "TOTP / MFA",
      "PCI-DSS / SOX",
      "Swagger / OpenAPI",
      "gRPC",
    ],
    projects: ["maker-checker-authorization", "totp-authentication-system", "card-tokenization"],
  },
  {
    id: "services",
    label: "Domain services",
    sub: "30+ service estate",
    blurb: "The business rules: transfers, approvals, cards, accounts. This is where most of my code lives.",
    skills: [
      "Java",
      "Concurrency & multithreading",
      "Design patterns",
      "Spring Data JPA",
      "Circuit breakers & retries",
      "Python",
    ],
    projects: ["corporate-banking-microservices", "maker-checker-authorization", "card-tokenization"],
  },
  {
    id: "ai",
    label: "AI services",
    sub: "chat · assist",
    blurb: "LLM-backed endpoints that answer routine queries, gated behind the same identity checks as everything else.",
    skills: ["Spring AI", "LangChain4j"],
    projects: ["llm-banking-chatbot"],
  },
  {
    id: "bus",
    label: "Event bus",
    sub: "Kafka · NATS",
    blurb: "Services talk in events, not calls, so a slow consumer never takes a payment path down with it.",
    skills: ["Apache Kafka", "NATS JetStream"],
    projects: ["corporate-banking-microservices", "elk-observability-rollout"],
  },
  {
    id: "data",
    label: "Stores",
    sub: "state · cache · objects",
    blurb: "Durable records, hot state and documents — the part auditors care about most.",
    skills: ["PostgreSQL", "Redis", "MinIO"],
    projects: ["corporate-banking-microservices", "totp-authentication-system"],
  },
  {
    id: "platform",
    label: "Build & run",
    sub: "ship it repeatedly",
    blurb: "How the estate gets built, containerized and released without a manual step in the middle.",
    skills: ["AWS", "Docker", "Kubernetes", "Jenkins", "Git"],
    projects: ["corporate-banking-microservices", "elk-observability-rollout"],
  },
  {
    id: "observability",
    label: "Watch & verify",
    sub: "logs · metrics · tests",
    blurb: "Proving it works before release, and finding out why it didn't at 2 AM.",
    skills: ["ELK Stack", "Prometheus", "Grafana", "JUnit", "Mockito"],
    projects: ["elk-observability-rollout"],
  },
];
