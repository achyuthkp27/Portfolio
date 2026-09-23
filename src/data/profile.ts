/** The person, as the site introduces them. Facts only; nothing here is invented. */
export const PROFILE = {
  name: "Achyuth KP",
  first: "Achyuth",
  last: "KP",
  title: "Software Engineer",
  email: "kpachyuthz@gmail.com",
  city: "Bengaluru, India",
  timeZone: "Asia/Kolkata",
  careerStart: new Date("2021-07-26"),
  /** The hero line, uppercase under the name */
  tagline: "Software engineer building the backend systems banks trust with money.",
  intro:
    "Five years inside the microservices behind retail, mobile, and corporate banking: dual-approval controls, card tokenization, MFA, and the observability that keeps a 30+ service estate debuggable at 2 AM.",
  links: {
    github: "https://github.com/achyuthkp27",
    linkedin: "https://www.linkedin.com/in/kpachyuth",
    medium: "https://medium.com/@kpachyuthz",
  },
  /** How I think: principles from the work, as stacked cards */
  principles: [
    {
      title: "Correctness isn't negotiable.",
      note: "When the software moves money, a bug is not a defect. It is someone's balance.",
    },
    {
      title: "Money never moves twice.",
      note: "Idempotent APIs, one ledger transaction for both legs, and replay checks on every code. A retry can never become a second payment.",
    },
    {
      title: "Two signatures on every transfer.",
      note: "The maker never approves their own request. Controls are built into the flow, not bolted on.",
    },
    {
      title: "Prove it before release.",
      note: "Unit tests, RFC test vectors, and CI gates. If it isn't verified, it isn't done.",
    },
    {
      title: "Trusted with other people's money.",
      note: "Five years on a PCI-DSS and SOX audited platform. The bar is set by auditors, not by me.",
    },
  ],
  /** On the record: dated facts, one row each */
  record: [
    { year: "2026", title: "Associate Software Engineer, First Citizens Bank platform", org: "Cognizant" },
    { year: "2024", title: "Above & Beyond Individual Award", org: "FIS Global" },
    { year: "2023", title: "Promoted to Senior Software Engineer", org: "FIS Global" },
    { year: "2021", title: "B.E. Computer Science & Engineering", org: "Sri Siddhartha Institute of Technology" },
  ],
  /** Real counts, not claims */
  numbers: [
    { value: "30+", label: "Services in the estate" },
    { value: "3", label: "Banking channels" },
    { value: "7", label: "Case studies on this page" },
  ],
  /** The stack, for the marquee */
  stack: [
    "Java 21",
    "Spring Boot",
    "Spring Security",
    "Apache Kafka",
    "PostgreSQL",
    "Redis",
    "Docker",
    "Kubernetes",
    "AWS",
    "Jenkins",
    "ELK Stack",
    "Prometheus",
    "Grafana",
    "JUnit",
    "Mockito",
    "NATS JetStream",
    "Spring AI",
    "LangChain4j",
    "WebRTC",
    "OAuth2",
    "JWT / JWE / JWS",
    "TOTP",
    "gRPC",
    "React",
  ],
} as const;

/** What I do: five services with the real stack behind each */
export const SERVICES: { title: string; blurb: string; stack: string[] }[] = [
  {
    title: "Backend engineering",
    blurb: "Spring Boot services that carry real money: REST APIs, domain rules, concurrency, resilience patterns.",
    stack: ["Java 21", "Spring Boot", "Spring Data JPA", "JUnit", "Mockito"],
  },
  {
    title: "Distributed systems",
    blurb: "Event-driven estates where a slow consumer never takes a payment path down with it.",
    stack: ["Apache Kafka", "NATS JetStream", "Redis", "PostgreSQL", "Circuit breakers"],
  },
  {
    title: "Payments & security",
    blurb: "Maker-checker controls, card tokenization, TOTP, and token security under PCI-DSS and SOX.",
    stack: ["Spring Security", "OAuth2", "JWT / JWE / JWS", "TOTP", "Mastercard · Visa"],
  },
  {
    title: "Cloud & delivery",
    blurb: "Containerised, released repeatedly, and watched: from Jenkins to Kubernetes to Kibana.",
    stack: ["AWS", "Docker", "Kubernetes", "Jenkins", "ELK · Prometheus · Grafana"],
  },
  {
    title: "AI integration",
    blurb: "LLM endpoints behind the same identity checks as everything else in the bank.",
    stack: ["Spring AI", "LangChain4j", "WebRTC", "WebSockets"],
  },
];
