import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { usePostHog } from 'posthog-js/react';

const Analytics = () => {
    const location = useLocation();
    const posthog = usePostHog();

    useEffect(() => {
        if (typeof window !== 'undefined' && posthog) {
            posthog.capture('$pageview', {
                $current_url: window.location.href,
                $pathname: location.pathname,
            });
        }
    }, [location, posthog]);

    return null; // This component doesn't render anything
};

export default Analytics;
