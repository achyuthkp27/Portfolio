import { projects } from "./projects";
/** The person, as the site introduces them. Facts only; nothing here is invented. */
export const PROFILE = {
  name: "Achyuth KP",
  first: "Achyuth",
  last: "KP",
  title: "Software Engineer",
  email: "kpachyuthz@gmail.com",
  /** Under public/, relative to BASE_URL */
  resume: "achyuth-kp-resume.pdf",
  resumeDownloadName: "achyuth-kp-resume.pdf",
  city: "Bengaluru, India",
  timeZone: "Asia/Kolkata",
  // Midnight in Bengaluru, not UTC: a bare date string would start the clock at 05:30 IST and on 25 July in the US
  careerStart: new Date("2021-07-26T00:00:00+05:30"),
  /** The hero statement, two lines in Antonio */
  headline: ["Reliable systems.", "Useful AI."],
  /** The hero line under the statement */
  tagline:
    "Five years of backend engineering on a regulated banking platform, now applied to AI products that ship, verify, and hold up in production.",
  intro:
    "Five years building the card, payment, and authentication systems behind retail, corporate, and mobile banking for First Citizens Bank in Trinidad and Tobago and Barbados taught me what production actually demands: correctness, security, and observability. I now bring that discipline to AI: a production banking assistant that verifies who it's talking to, and an on-device AI banking app where the model never leaves the phone.",
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
      title: "Build for the long run.",
      note: "Trends pass. Fundamentals, taste, and reliability compound. I choose the thing that will still make sense in five years.",
    },
  ],
  /** Closes the Experience list */
  education: {
    year: "2021",
    title: "B.E. Computer Science & Engineering",
    org: "Sri Siddhartha Institute of Technology",
  },
  /** Real counts, not claims */
  numbers: [
    { value: "30+", label: "Services in the estate" },
    { value: "3", label: "Banking channels" },
    { value: String(projects.length), label: "Case studies on this page" },
  ],
} as const;

/** The public profiles, in the order the site lists them */
export const SOCIALS = [
  { label: "LinkedIn", href: PROFILE.links.linkedin },
  { label: "GitHub", href: PROFILE.links.github },
  { label: "Medium", href: PROFILE.links.medium },
] as const;

/** What I do: five services with the real stack behind each */
export const SERVICES: { title: string; blurb: string; stack: string[]; proof: { label: string; href: string }[] }[] = [
  {
    title: "Backend systems",
    blurb:
      "Spring Boot services that move real money: APIs, domain rules, concurrency, and the failure handling around them.",
    stack: ["Java 21", "Spring Boot", "Spring Data JPA", "JUnit", "Mockito"],
    proof: [
      { label: "Five years on a banking platform", href: "#experience" },
      { label: "One API set for two countries", href: "#case-multi-region-apis" },
    ],
  },
  {
    title: "Event-driven platforms",
    blurb: "Kafka estates where one slow consumer never stalls a payment.",
    stack: ["Apache Kafka", "NATS JetStream", "Redis", "PostgreSQL", "Circuit breakers", "Idempotency"],
    proof: [
      { label: "30+ service estate on one bus", href: "#experience" },
      { label: "Duplicate alerts fixed at the root", href: "#case-duplicate-alerts-race-condition" },
      { label: "ELK and Kafka observability", href: "#case-elk-observability-rollout" },
    ],
  },
  {
    title: "Security and payments",
    blurb:
      "Issuer-side card tokenisation, virtual cards in Google Pay and Apple Pay, maker-checker approval, TOTP, and token security.",
    stack: ["Spring Security", "OAuth2", "JWT / JWE / JWS", "TOTP", "Visa · Mastercard", "Google Pay · Apple Pay"],
    proof: [
      { label: "Card on File network tokenisation", href: "#case-card-tokenization" },
      { label: "First Google Pay launch in Trinidad and Tobago", href: "#case-virtual-cards-google-pay" },
      { label: "TOTP with replay prevention", href: "#case-totp-authentication-system" },
    ],
  },
  {
    title: "Delivery and operations",
    blurb: "Containerised, shipped often, and observable: Jenkins, Kubernetes, and the ELK stack.",
    stack: ["AWS", "Docker", "Kubernetes", "Jenkins", "ELK · Prometheus · Grafana"],
    proof: [{ label: "Every log, one search bar", href: "#case-elk-observability-rollout" }],
  },
  {
    title: "AI, the next chapter",
    blurb:
      "The same production standards applied to models: assistants that check who is asking before they answer, and AI that runs on the device so the data stays there.",
    stack: ["Spring AI", "Azure OpenAI", "LangChain4j", "On-device LLMs", "RAG", "Qwen"],
    proof: [
      { label: "LLM banking assistant in production", href: "#case-llm-banking-chatbot" },
      { label: "AegisAI, GenAI platform for banking operations", href: "#case-aegis-ai" },
      { label: "Kairo, offline-first AI bank", href: "#case-kairo-offline-ai-bank" },
      { label: "VoxOs, voice agent for the Mac", href: "#case-voxos" },
    ],
  },
];
