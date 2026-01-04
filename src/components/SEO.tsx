import { Helmet } from "react-helmet-async";

interface SEOProps {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
}

const SEO = ({
    title = "Achyuth KP | Creative Developer",
    description = "Portfolio of Achyuth KP - A Creative Developer specializing in scalable web/mobile applications, microservices, and immersive 3D experiences.",
    image = "/og-image.png",
    url = "https://achyuthkp27.github.io/Portfolio/"
}: SEOProps) => {
    const fullTitle = title === "Achyuth KP | Creative Developer" ? title : `${title} | Achyuth KP`;

    return (
        <Helmet>
            {/* Primary Meta Tags */}
            <title>{fullTitle}</title>
            <meta name="title" content={fullTitle} />
            <meta name="description" content={description} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
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
        </Helmet>
    );
};

export default SEO;
