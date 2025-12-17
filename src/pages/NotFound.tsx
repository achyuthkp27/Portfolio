import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">Oops! Page not found</p>
        <div className="mb-4 p-4 bg-black/50 rounded-lg text-left font-mono text-sm overflow-auto max-w-md mx-auto">
          <p className="text-yellow-500">Debug Info:</p>
          <p>Pathname: {location.pathname}</p>
          <p>Hash: {location.hash}</p>
          <p>Search: {location.search}</p>
          <p>Full URL: {window.location.href}</p>
        </div>
        <a href="/" className="text-primary underline hover:text-primary/90">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
