import { Building2, GraduationCap, type LucideIcon } from "lucide-react";

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
    company: "FIS Global",
    role: "Software Engineer",
    period: "2021 – Present",
    type: "full-time",
    icon: Building2,
    color: "primary",
    achievements: [
      "Developed and maintained 25+ high-performance RESTful APIs using Spring Boot microservices for corporate, retail, and mobile banking platforms.",
      "Led end-to-end implementation of ELK stack with Apache Kafka, achieving a 25% reduction in issue resolution time.",
      "Enhanced API documentation using Swagger to improve developer collaboration and efficiency.",
      "Contributed to code reviews and technical documentation, promoting best practices and knowledge-sharing.",
      "Diagnosed and resolved complex technical issues through detailed debugging and analysis.",
      "Optimized deployment processes for SIT, UAT, and Production, ensuring maximum system reliability.",
      "Integrated frontend UI with ReactJS for seamless user experience across banking applications."
    ],
    technologies: ["Spring Boot", "Microservices", "Kafka", "ELK Stack", "ReactJS", "Docker", "AWS"],
  },
  {
    company: "Aniworks",
    role: "Intern",
    period: "2020",
    type: "internship",
    icon: GraduationCap,
    color: "accent",
    achievements: [
      "Worked across Web Development, AI, ML concepts",
      "Collaborated on intern-level projects",
      "Hands-on experience with real-world systems",
    ],
    technologies: ["Web Development", "AI/ML", "Python"],
  },
];