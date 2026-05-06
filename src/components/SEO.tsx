import { Helmet } from "react-helmet-async";

interface SEOProps {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
    type?: string;
}

const SITE_URL = "https://achyuthkp27.github.io/Portfolio/";

const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Achyuth KP",
    url: SITE_URL,
    jobTitle: "Software Developer",
    description:
        "Software Developer with 4+ years building enterprise microservices with Spring Boot, Kafka, and AWS.",
    sameAs: [
        "https://github.com/achyuthkp27",
        "https://linkedin.com/in/kpachyuth",
        "https://medium.com/@kpachyuthz",
    ],
    knowsAbout: [
        "React",
        "TypeScript",
        "Spring Boot",
        "Microservices",
        "AWS",
        "Kafka",
        "Three.js",
    ],
};

const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Achyuth KP | Creative Developer",
    url: SITE_URL,
    author: { "@type": "Person", name: "Achyuth KP" },
};

const SEO = ({
    title = "Achyuth KP | Creative Developer",
    description = "Portfolio of Achyuth KP - A Creative Developer specializing in scalable web/mobile applications, microservices, and immersive 3D experiences.",
    image = "/og-image.png",
    url = SITE_URL,
    type = "website"
}: SEOProps) => {
    const fullTitle = title === "Achyuth KP | Creative Developer" ? title : `${title} | Achyuth KP`;

    return (
        <Helmet>
            {/* Primary Meta Tags */}
            <title>{fullTitle}</title>
            <meta name="title" content={fullTitle} />
            <meta name="description" content={description} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={url} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={url} />
            <meta property="twitter:title" content={fullTitle} />
            <meta property="twitter:description" content={description} />
            <meta property="twitter:image" content={image} />

            {/* Structured Data — helps Google rich snippets */}
            <script type="application/ld+json">
                {JSON.stringify(personJsonLd)}
            </script>
            <script type="application/ld+json">
                {JSON.stringify(websiteJsonLd)}
            </script>
        </Helmet>
    );
};

export default SEO;

