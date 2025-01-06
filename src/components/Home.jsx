import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import TwitterConnectButton from './TwitterConnectButton';
import MastodonConnectButton from './MastodonConnectButton';
import CrossPostToggle from './CrossPostToggle';
import ThemeSwitcher from './ThemeSwitcher';

export default function Home() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-semibold mb-4">Sign in with ZAPT</h1>
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={['google', 'facebook', 'apple']}
        />
        <a
          href="https://www.zapt.ai"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 text-blue-600 underline"
        >
          Visit ZAPT
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-2xl font-semibold mb-4">Cross-Post Dashboard</h1>
      <TwitterConnectButton />
      <MastodonConnectButton />
      <CrossPostToggle />
      <ThemeSwitcher />
      <button
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded cursor-pointer"
        onClick={() => supabase.auth.signOut()}
      >
        Sign Out
      </button>
      <a
        href="https://www.zapt.ai"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 text-blue-600 underline"
      >
        Made on ZAPT
      </a>
    </div>
  );
}