import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
}

const SITE_URL = "https://achyuthkp27.github.io/Portfolio/";

const DEFAULT_TITLE = "Achyuth KP | Software Engineer | Backend systems & AI products";
const DEFAULT_DESCRIPTION =
  "Achyuth KP, Software Engineer building card, payment, and authentication systems for a bank, plus AI-powered products: Java, Spring Boot, Kafka, Python, Spring AI, LangChain4j, and Azure OpenAI.";

/**
 * Per-route meta. index.html carries the same tags marked data-rh, so Helmet replaces them
 * instead of adding a second set, and the structured data lives only in index.html.
 * Mount it on every route so leaving a project page restores the home title.
 */
const SEO = ({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  image = `${SITE_URL}og-image.jpg`,
  url = SITE_URL,
  type = "website",
}: SEOProps) => {
  const fullTitle = title === DEFAULT_TITLE ? title : `${title} | Achyuth KP`;

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
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
};

export default SEO;
