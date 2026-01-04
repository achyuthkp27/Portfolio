import { createClient } from "@sanity/client";
import createImageUrlBuilder from "@sanity/image-url";

export const client = createClient({
    projectId: import.meta.env.VITE_SANITY_PROJECT_ID || "your_project_id",
    dataset: "production",
    useCdn: true, // set to `false` to bypass the edge cache
    apiVersion: "2023-05-03",
});

const builder = createImageUrlBuilder(client);

export function urlFor(source: any) {
    return builder.image(source);
}

// Fallback data for when Sanity is not connected
export const dummyPosts = [
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
