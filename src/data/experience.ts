import { Building2, Briefcase, GraduationCap, type LucideIcon } from "lucide-react";

export interface Experience {
  company: string;
  role: string;
  period: string;
  type: 'full-time' | 'internship' | 'contract';
  icon: LucideIcon;
  color: string;
  achievements: string[];
  technologies: string[];
}

export const experiences: Experience[] = [
  {
    company: "Cognizant Technology Solutions",
    role: "Associate Software Engineer · Client: First Citizens Bank",
    period: "Apr 2026 – Present",
    type: "full-time",
    icon: Briefcase,
    color: "primary",
    achievements: [
      "Leading backend API architecture for a next-generation banking platform using Java 21, Spring Boot 3.5, and Apache Kafka within a 25+ engineer delivery team.",
      "Mentoring 4 junior engineers on clean code, unit testing discipline (JUnit, Mockito), and CI/CD standards.",
      "Owning API design and delivery for corporate banking services on the same platform and team carried over from FIS Global after a client-driven rebadge.",
    ],
    technologies: ["Java 21", "Spring Boot 3.5", "Apache Kafka", "PostgreSQL", "Microservices", "JUnit", "Jenkins"],
  },
  {
    company: "FIS Global",
    role: "Software Engineer → Senior Software Engineer · Client: First Citizens Bank",
    period: "Jul 2021 – Apr 2026",
    type: "full-time",
    icon: Building2,
    color: "primary",
    achievements: [
      "Designed, built, and maintained Spring Boot microservices across a 30+ service estate powering Retail, Mobile, and Corporate Online Banking for hundreds of corporate clients — delivering three major corporate banking modules end to end.",
      "Implemented a maker-checker authorization framework enforcing dual-approval controls on financial transactions to meet PCI-DSS and SOX compliance and audit requirements.",
      "Delivered Card on File — credit card tokenization for Mastercard and Visa — plus virtual card services, and implemented JWT/JWE/JWS token security across banking APIs.",
      "Built an RFC 6238-compliant TOTP authentication system (AES-256-GCM secret storage, QR-code enrollment, Redis-backed replay prevention) with push-notification-based transaction approval.",
      "Engineered Video KYC onboarding using WebRTC and WebSockets; shipped WhatsApp banking and contributed to Montran-based payment processing workflows.",
      "Built LLM-powered banking chatbots and conversational AI integration APIs for automated query handling and identity validation.",
      "Applied Java concurrency and multithreading primitives with resilience patterns — timeouts, retries, and circuit breakers — to keep inter-service calls stable under high-load banking traffic.",
      "Optimized API response times through Redis caching and PostgreSQL query tuning with Spring Data JPA.",
      "Led end-to-end ELK Stack + Kafka rollout for centralized logging and cross-service tracing, shortening production triage; wrote JUnit/Mockito test suites as part of Jenkins CI/CD quality gates.",
      "Promoted to Senior Software Engineer; earned the Above and Beyond Individual Award (Q1 2024) for critical project delivery.",
    ],
    technologies: ["Java", "Spring Boot", "Spring Security", "Kafka", "Redis", "PostgreSQL", "ELK Stack", "JUnit", "Mockito", "Docker", "AWS"],
  },
  {
    company: "Aniworks",
    role: "Software Development Intern",
    period: "Jul 2020 – Aug 2020",
    type: "internship",
    icon: GraduationCap,
    color: "accent",
    achievements: [
      "Built hands-on experience across web development, artificial intelligence, and machine learning through team projects and technical presentations.",
    ],
    technologies: ["Web Development", "AI/ML", "Python"],
  },
];
