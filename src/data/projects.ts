import { Server, Database, MessageSquare, HardDrive, LayoutDashboard } from "lucide-react";
import bankingImg from "@/assets/images/projects/banking-platform.jpg";
import loggingImg from "@/assets/images/projects/logging-system.jpg";
import notificationImg from "@/assets/images/projects/notification-engine.jpg";
import storageImg from "@/assets/images/projects/secure-storage.jpg";
import dashboardImg from "@/assets/images/projects/monitoring-dashboard.jpg";

export interface Project {
    slug: string; // URL friendly identifier
    title: string;
    description: string;
    problem: string;
    solution: string;
    outcome: string;
    tags: string[];
    icon: any;
    color: string;
    gradient: string;
    image?: string; // New field for cover image
    // Extended fields for Case Study
    fullDescription?: string;
    challenges?: string[];
    architecture?: {
        title: string;
        description: string;
        imageUrl?: string;
    }[];
    gallery?: string[];
}

export const projects: Project[] = [
    {
        slug: "banking-api-platform",
        title: "Banking API Platform",
        description: "High-volume microservices powering corporate, retail, and mobile banking transactions with 99.9% uptime.",
        problem: "Legacy monolithic banking system couldn't scale with growing user base",
        solution: "Decomposed into 25+ microservices with event-driven architecture",
        outcome: "3x improvement in transaction throughput, 40% reduction in latency",
        tags: ["Spring Boot", "PostgreSQL", "Kafka", "Redis", "AWS"],
        icon: Server,
        color: "white",
        gradient: "from-white/10 to-white/5",
        image: bankingImg,
        fullDescription: "A mission-critical digital transformation project for a Tier-1 bank, migrating a 15-year-old monolith to a modern cloud-native microservices architecture. The system handles millions of daily transactions across retail and corporate channels, ensuring strict consistency and regulatory compliance.",
        challenges: [
            "Zero-downtime migration requirement",
            "Handling distributed transactions across microservices (Saga Pattern)",
            "Strict security compliance (PCI-DSS standards)"
        ],
        architecture: [
            {
                title: "Event-Driven Core",
                description: "Used Apache Kafka for asynchronous communication between services to decouple critical paths and improve resilience."
            }
        ]
    },
    {
        slug: "centralized-logging-system",
        title: "Centralized Logging System",
        description: "Real-time monitoring toolkit with ELK Stack and Kafka for enterprise-wide observability.",
        problem: "Debugging production issues took hours due to scattered logs",
        solution: "Implemented centralized logging with Elasticsearch, Logstash, and Kibana",
        outcome: "25% faster issue resolution, improved system reliability",
        tags: ["ELK Stack", "Kafka", "Spring Boot", "Docker"],
        icon: Database,
        color: "white",
        gradient: "from-white/10 to-white/5",
        image: loggingImg,
        fullDescription: "An observability platform built to ingest, index, and visualize logs from over 50+ distributed services. It processes terabytes of log data daily, providing developers and SREs with real-time insights into system health.",
        challenges: [
            "Handling log spikes during peak traffic",
            "Cost-effective retention strategies"
        ]
    },
    {
        slug: "distributed-notification-engine",
        title: "Distributed Notification Engine",
        description: "Scalable event-driven notification system handling millions of messages daily.",
        problem: "Synchronous notifications causing bottlenecks and poor UX",
        solution: "Built async notification engine with Kafka consumers and retry mechanisms",
        outcome: "10x throughput improvement, zero message loss guarantee",
        tags: ["Kafka", "Spring Boot", "Redis", "PostgreSQL"],
        icon: MessageSquare,
        color: "white",
        gradient: "from-white/10 to-white/5",
        image: notificationImg,
        fullDescription: "A centralized notification hub that abstracts SMS, Email, and Push Notification providers. It features intelligent routing, rate limiting, and a robust retry mechanism to guarantee delivery.",
        challenges: [
            "Preventing spam/duplicate notifications",
            "Integrating with multiple 3rd party providers (Twilio, SendGrid, Firebase)"
        ]
    },
    {
        slug: "secure-file-storage",
        title: "Secure File Storage (MinIO)",
        description: "Enterprise file storage solution with granular access policies and AWS S3 compatibility.",
        problem: "Document management scattered across multiple systems",
        solution: "Unified storage layer with MinIO, access policies, and CDN integration",
        outcome: "Centralized document management, 50% cost reduction vs S3",
        tags: ["MinIO", "AWS S3", "Spring Boot", "IAM"],
        icon: HardDrive,
        color: "white",
        gradient: "from-white/10 to-white/5",
        image: storageImg,
        fullDescription: "A self-hosted, S3-compatible object storage service designed for banking documents. It enforces strict access control lists (ACLs) and encryption at rest.",
        challenges: [
            "Migrating petabytes of existing data",
            "Implementing fine-grained IAM policies"
        ]
    },
    {
        slug: "microservice-monitoring-dashboard",
        title: "Microservice Monitoring Dashboard",
        description: "ReactJS dashboard for real-time monitoring of distributed microservices health and metrics.",
        problem: "No visibility into microservice health and performance",
        solution: "Built React dashboard with real-time metrics, alerts, and health checks",
        outcome: "Proactive issue detection, reduced MTTR by 60%",
        tags: ["ReactJS", "Spring Boot", "WebSocket", "Chart.js"],
        icon: LayoutDashboard,
        color: "white",
        gradient: "from-white/10 to-white/5",
        image: dashboardImg,
        fullDescription: "A custom ops dashboard that aggregates metrics from Prometheus and health checks from Spring Boot Actuator, visualizing them in real-time using WebSockets.",
        challenges: [
            "Reducing visualization latency",
            "Designing an intuitive UI for complex metric data"
        ]
    },
];
