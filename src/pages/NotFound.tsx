import { useLocation, useNavigate } from "react-router-dom";
import { PillButton } from "@/components/ui/Pill";
import SEO from "@/components/SEO";

/** A page that isn't here. Says which, with a way back home, in the homepage's language. */
const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="theme-dark min-h-screen flex flex-col justify-center max-w-[1400px] mx-auto px-6 md:px-10 lg:px-12 pt-28 pb-16 outline-none"
    >
      <SEO title="Page not found" />
      <p className="t-label mb-8">Not found</p>
      <h1 className="t-wordmark leading-[0.85] text-[34vw] md:text-[18rem] lg:text-[22rem] text-snow">
        404<span className="text-emerald-400">.</span>
      </h1>
      <div className="mt-10 lg:mt-12 pt-8 border-t border-line grid md:grid-cols-[minmax(0,1fr)_auto] gap-8 items-end">
        <p className="t-body text-snow/70 text-[17px] md:text-[19px] max-w-xl">
          There is no page at{" "}
          <code className="t-figure text-[15px] text-snow rounded-pill border border-line px-2.5 py-0.5 break-all">
            {location.pathname}
          </code>
          . Everything else is on the homepage.
        </p>
        <div>
          <PillButton onClick={() => navigate("/")}>Back to the site</PillButton>
        </div>
      </div>
    </main>
  );
};

export default NotFound;
