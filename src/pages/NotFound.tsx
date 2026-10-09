import { useLocation, useNavigate } from "react-router-dom";
import { PillButton } from "@/components/ui/Pill";
import SEO from "@/components/SEO";

/** A page that isn't here. Says which, with a way back home. */
const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="theme-dark min-h-screen flex flex-col items-center justify-center text-center px-6 pt-24 pb-16 outline-none"
    >
      <SEO title="Page not found" />
      <p className="t-label text-muted mb-6">Not found</p>
      <h1 className="t-wordmark text-[28vw] md:text-[14rem] text-snow">404</h1>
      <p className="t-body text-muted mt-6">
        There is no page at <code className="t-figure text-sm text-snow">{location.pathname}</code>.
      </p>
      <div className="mt-8">
        <PillButton onClick={() => navigate("/")}>Back to the site</PillButton>
      </div>
    </main>
  );
};

export default NotFound;
