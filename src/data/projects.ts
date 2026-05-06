import { Server, Database, MessageSquare, HardDrive, LayoutDashboard, type LucideIcon } from "lucide-react";
const bankingImg = "https://images.unsplash.com/photo-1601597111158-2fcee29a4a0e?q=80&w=800&auto=format&fit=crop";
const loggingImg = "https://images.unsplash.com/photo-1551288049-bbbda540d3b9?q=80&w=800&auto=format&fit=crop";
const notificationImg = "https://images.unsplash.com/photo-1557200134-90327ee9fafa?q=80&w=800&auto=format&fit=crop";
const storageImg = "https://images.unsplash.com/photo-1603398938378-e54eab446ddd?q=80&w=800&auto=format&fit=crop";
const dashboardImg = "https://images.unsplash.com/photo-1551288049-bbbda540d3b9?q=80&w=800&auto=format&fit=crop";

export type ProjectCategory = 'Backend' | 'Infrastructure' | 'Full-stack' | 'DevOps';

export interface ProjectArchitecture {
    title: string;
    description: string;
    imageUrl?: string;
}

export interface Project {
    slug: string; // URL friendly identifier
    title: string;
    description: string;
    category?: ProjectCategory;
    problem: string;
    solution: string;
    outcome: string;
    tags: string[];
    featured?: boolean;
    icon: LucideIcon;
    color?: string;
    gradient?: string;
    image?: string; // New field for cover image
    // Extended fields for Case Study
    fullDescription?: string;
    challenges?: string[];
    architecture?: ProjectArchitecture[];
    gallery?: string[];
}

export const projects: Project[] = [
    {
        slug: "banking-api-platform",
        title: "Banking API Platform",
        description: "High-volume microservices powering corporate, retail, and mobile banking transactions with 99.9% uptime.",
        category: "Backend",
        problem: "Legacy monolithic banking system couldn't scale with growing user base",
        solution: "Decomposed into 25+ microservices with event-driven architecture",
        outcome: "3x improvement in transaction throughput, 40% reduction in latency",
        tags: ["Spring Boot", "PostgreSQL", "Kafka", "Redis", "AWS"],
        icon: Server,
        featured: true,
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
        image: dashboardImg,
        fullDescription: "A custom ops dashboard that aggregates metrics from Prometheus and health checks from Spring Boot Actuator, visualizing them in real-time using WebSockets.",
        challenges: [
            "Reducing visualization latency",
            "Designing an intuitive UI for complex metric data"
        ]
    },
];
