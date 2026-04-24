import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

const isConfigured = import.meta.env.VITE_SANITY_PROJECT_ID !== undefined;

export const client = createClient({
    projectId: import.meta.env.VITE_SANITY_PROJECT_ID || "demo-project-id",
    dataset: "production",
    useCdn: true, // set to `false` to bypass the edge cache
    apiVersion: "2023-05-03",
});

// Intercept fetch if not configured to prevent 403 console network logs
const originalFetch = client.fetch.bind(client);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
client.fetch = async (query: string, params?: any, options?: any) => {
    if (!isConfigured) {
        return Promise.reject(new Error("Sanity not configured. Gracefully falling back to local files."));
    }
    return originalFetch(query, params, options);
};

const builder = imageUrlBuilder(client);

export interface SanityPost {
    title: string;
    publishedAt: string;
    slug: { current: string };
    mainImage?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
    body?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
    excerpt?: string;
    name?: string;
    authorImage?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

// Fallback data for when Sanity is not connected
export const dummyPosts: SanityPost[] = [
    {
        slug: { current: "future-of-microservices" },
        title: "The Future of Microservices",
        publishedAt: "2024-01-15T12:00:00Z",
        mainImage: null,
        excerpt: "Exploring event-driven architectures and how they shape modern banking systems.",
        body: []
    },
    {
        slug: { current: "optimizing-react-performance" },
        title: "Optimizing React Performance",
        publishedAt: "2023-12-10T09:00:00Z",
        mainImage: null,
        excerpt: "Tips and tricks for 60fps animations and reducing bundle sizes.",
        body: []
    }
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function urlFor(source: any) {
    return builder.image(source);
}
