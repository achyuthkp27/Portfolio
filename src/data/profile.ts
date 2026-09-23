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
      title: "Build for the long run.",
      note: "Trends pass. Fundamentals, taste, and reliability compound. I choose the thing that will still make sense in five years.",
    },
  ],
  /** On the record: dated facts, one row each */
  record: [
    { year: "Apr 2026", title: "Software Engineer, First Citizens Bank platform", org: "Cognizant" },
    { year: "2024", title: "Above & Beyond Individual Award", org: "FIS Global" },
    { year: "2026", title: "Promoted to Senior Software Engineer", org: "FIS Global" },
    { year: "2021", title: "B.E. Computer Science & Engineering", org: "Sri Siddhartha Institute of Technology" },
  ],
  /** Real counts, not claims */
  numbers: [
    { value: "30+", label: "Services in the estate" },
    { value: "3", label: "Banking channels" },
    { value: String(projects.length), label: "Case studies on this page" },
  ],
  /** How work moves, as four phases; the hero rail ticks through them on scroll */
  phases: ["Learn", "Build", "Ship", "Verify"],
  /** The stack, for the marquee */
  stack: ["Java", "Python", "React", "Spring Boot", "LLMs", "AI"],
} as const;

/** What I do: five services with the real stack behind each */
export const SERVICES: { title: string; blurb: string; stack: string[]; proof: { label: string; href: string }[] }[] = [
  {
    title: "Backend systems",
    blurb:
      "Spring Boot services that move real money: APIs, domain rules, concurrency, and the failure handling around them.",
    stack: ["Java 21", "Spring Boot", "Spring Data JPA", "JUnit", "Mockito"],
    proof: [
      { label: "Corporate banking microservices", href: "#case-corporate-banking-microservices" },
      { label: "Maker-checker framework", href: "#case-maker-checker-authorization" },
    ],
  },
  {
    title: "Event-driven platforms",
    blurb: "Kafka estates where one slow consumer never stalls a payment.",
    stack: ["Apache Kafka", "NATS JetStream", "Redis", "PostgreSQL", "Circuit breakers"],
    proof: [
      { label: "30+ service estate on one bus", href: "#case-corporate-banking-microservices" },
      { label: "ELK and Kafka observability", href: "#case-elk-observability-rollout" },
    ],
  },
  {
    title: "Security and payments",
    blurb: "Maker-checker approval, card tokenisation, TOTP, and token security under PCI-DSS and SOX.",
    stack: ["Spring Security", "OAuth2", "JWT / JWE / JWS", "TOTP", "Mastercard · Visa"],
    proof: [
      { label: "TOTP with replay prevention, live demo", href: "#case-totp-authentication-system" },
      { label: "Card on file tokenisation", href: "#case-card-tokenization" },
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
    stack: ["Spring AI", "LangChain4j", "On-device LLMs", "RAG", "Qwen"],
    proof: [
      { label: "Kairo, offline-first AI bank", href: "#case-kairo-offline-ai-bank" },
      { label: "VoxOs, voice agent for the Mac", href: "#case-voxos" },
      { label: "LLM banking assistant APIs", href: "#case-llm-banking-chatbot" },
    ],
  },
];
