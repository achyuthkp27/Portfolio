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
  /** The hero statement, two lines in Antonio */
  headline: ["Reliable systems.", "Useful AI."],
  /** The hero line under the statement */
  tagline:
    "Five years of backend engineering on a regulated banking platform, now applied to AI products that ship, verify, and hold up in production.",
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
      title: "Correctness isn't negotiable.",
      note: "Fast is good. Right is required. I don't ship what I can't stand behind.",
    },
    {
      title: "Depth over noise.",
      note: "I'd rather understand one system to the bottom than skim ten. Real leverage comes from knowing how things actually work.",
    },
    {
      title: "Say less, prove more.",
      note: "Claims are cheap. I let working software, tests, and results speak, and I keep my word.",
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
  /** How work moves, as four phases; the hero rail ticks through them on scroll */
  phases: ["Learn", "Build", "Ship", "Verify"],
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
