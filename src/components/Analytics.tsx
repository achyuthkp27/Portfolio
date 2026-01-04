import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const GA_TRACKING_ID = import.meta.env.VITE_GA_TRACKING_ID;

const Analytics = () => {
    const location = useLocation();

    useEffect(() => {
        // Basic pageview tracking logic
        // If GA_TRACKING_ID is present, we would initialize window.gtag here
        if (GA_TRACKING_ID && typeof window !== 'undefined') {
            console.log(`[Analytics] Page View: ${location.pathname}`);
            // window.gtag('config', GA_TRACKING_ID, { page_path: location.pathname });
        }
    }, [location]);

    return null; // This component doesn't render anything
};

export default Analytics;
