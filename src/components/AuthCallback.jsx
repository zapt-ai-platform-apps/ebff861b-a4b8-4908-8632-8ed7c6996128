import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function AuthCallback() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Handle OAuth callback here
    const params = new URLSearchParams(location.search);
    const service = params.get('service');

    if (service === 'twitter') {
      // Handle Twitter OAuth callback
      fetch(`/api/twitter/callback${location.search}`)
        .then((res) => res.json())
        .then(() => {
          navigate('/');
        })
        .catch((error) => {
          console.error('Twitter callback error:', error);
          navigate('/');
        });
    } else if (service === 'mastodon') {
      // Handle Mastodon OAuth callback
      fetch(`/api/mastodon/callback${location.search}`)
        .then((res) => res.json())
        .then(() => {
          navigate('/');
        })
        .catch((error) => {
          console.error('Mastodon callback error:', error);
          navigate('/');
        });
    }
  }, [location, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Processing authentication...</p>
    </div>
  );
}