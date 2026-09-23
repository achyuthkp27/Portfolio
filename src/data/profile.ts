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
  tagline: "Software engineer building reliable backend systems and the AI that runs on top of them.",
  intro:
    "Five years building the microservices behind retail, mobile, and corporate banking taught me what production actually demands: correctness, security, and observability. I now bring that discipline to AI: LLM-powered assistants that verify who they're talking to, and an on-device AI banking app where the model never leaves the phone.",
  links: {
    github: "https://github.com/achyuthkp27",
    linkedin: "https://www.linkedin.com/in/kpachyuth",
    medium: "https://medium.com/@kpachyuthz",
  },
  /** How I think: who I am and how I work, in five lines */
  principles: [
    {
      title: "Curious first, certain later.",
      note: "I'd rather ask the obvious question than defend a wrong assumption. Most hard problems are misunderstandings in disguise.",
    },
    {
      title: "Simple beats clever.",
      note: "Clever code impresses for a day and costs for years. The best solution is the one the next person understands without me.",
    },
    {
      title: "Own the outcome, not the ticket.",
      note: "Done means it works for the person using it, not that the task moved to a column. I stay with a problem until it's actually solved.",
    },
    {
      title: "Learn in public.",
      note: "I write, share, and ship half-finished ideas because feedback beats perfection. Every tool I build starts as a question I couldn't answer.",
    },
    {
      title: "Build for the long run.",
      note: "Trends pass. Fundamentals, taste, and reliability compound. I choose the thing that will still make sense in five years.",
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
    title: "AI-powered products",
    blurb: "LLM assistants that verify identity before they answer, and on-device models that keep data on the phone.",
    stack: ["Spring AI", "LangChain4j", "On-device LLMs", "RAG", "WebRTC"],
  },
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
    title: "Security & payments",
    blurb: "Maker-checker controls, card tokenization, TOTP, and token security under PCI-DSS and SOX.",
    stack: ["Spring Security", "OAuth2", "JWT / JWE / JWS", "TOTP", "Mastercard · Visa"],
  },
  {
    title: "Cloud & delivery",
    blurb: "Containerised, released repeatedly, and watched: from Jenkins to Kubernetes to Kibana.",
    stack: ["AWS", "Docker", "Kubernetes", "Jenkins", "ELK · Prometheus · Grafana"],
  },
];
