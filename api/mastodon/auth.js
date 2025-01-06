import { authenticateUser } from '../_apiUtils';
import * as Sentry from '@sentry/node';
import axios from 'axios';

Sentry.init({
  dsn: process.env.VITE_PUBLIC_SENTRY_DSN,
  environment: process.env.VITE_PUBLIC_APP_ENV,
  initialScope: {
    tags: {
      type: 'backend',
      projectId: process.env.VITE_PUBLIC_APP_ID,
    },
  },
});

export default async function handler(req, res) {
  try {
    const user = await authenticateUser(req);
    const { instance_url } = req.query;

    // Register application with Mastodon instance
    const response = await axios.post(`${instance_url}/api/v1/apps`, {
      client_name: 'Cross-Post App',
      redirect_uris: `${req.headers.origin}/auth/callback?service=mastodon`,
      scopes: 'read write',
      website: 'https://www.zapt.ai',
    });

    const { client_id, client_secret } = response.data;

    // Save client_id and client_secret to user database

    const oauthUrl = `${instance_url}/oauth/authorize?client_id=${client_id}&redirect_uri=${encodeURIComponent(
      `${req.headers.origin}/auth/callback?service=mastodon`
    )}&response_type=code&scope=read%20write`;

    res.redirect(oauthUrl);
  } catch (error) {
    Sentry.captureException(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}