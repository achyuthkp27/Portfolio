import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { PillButton } from "@/components/ui/Pill";

const REDIRECT_SECONDS = 15;

/** A page that isn't here. Says which, then returns home on its own. */
const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(REDIRECT_SECONDS);

  useEffect(() => {
    if (countdown <= 0) {
      navigate("/");
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, navigate]);

  return (
    <div className="theme-dark min-h-screen flex flex-col items-center justify-center text-center px-6 pt-24 pb-16">
      <p className="t-label text-muted mb-6">Not found</p>
      <p className="t-wordmark text-[28vw] md:text-[14rem] text-snow">404</p>
      <p className="t-body text-muted mt-6">
        There is no page at <code className="t-figure text-sm text-snow">{location.pathname}</code>. Home in {countdown}
        s.
      </p>
      <div className="mt-8">
        <PillButton onClick={() => navigate("/")}>Back to the site</PillButton>
      </div>
    </div>
  );
};

export default NotFound;
