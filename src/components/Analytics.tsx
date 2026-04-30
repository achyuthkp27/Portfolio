import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAnalytics } from '@/lib/analytics';
import { Analytics as VercelAnalytics } from '@vercel/analytics/react';

const Analytics = () => {
    const location = useLocation();
    const posthog = useAnalytics();

    useEffect(() => {
        if (typeof window !== 'undefined' && posthog) {
            posthog.capture('$pageview', {
                $current_url: window.location.href,
                $pathname: location.pathname,
            });
        }
    }, [location, posthog]);

    return <VercelAnalytics />;
};

export default Analytics;

