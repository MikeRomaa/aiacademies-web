import { useEffect, useState } from 'react';

export interface Session {
    firstName: string;
    lastName: string;
    fullName: string;
}

export function useSession(): Session | undefined {
    const [session, setSession] = useState<Session | undefined>();

    const refreshSession = () => {
        const accessToken = localStorage.getItem('access');
        if (accessToken) {
            const payload = JSON.parse(atob(accessToken.split('.')[1]));
            setSession({
                firstName: payload.first_name,
                lastName: payload.last_name,
                fullName: `${payload.first_name} ${payload.last_name}`,
            });
        } else {
            setSession(undefined);
        }
    };

    useEffect(() => {
        refreshSession();
        window.addEventListener('auth', refreshSession);
        return () => window.removeEventListener('auth', refreshSession);
    }, []);

    return session;
}
