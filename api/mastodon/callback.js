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
    const { code } = req.query;

    // Retrieve client_id and client_secret from user database
    const client_id = 'USER_CLIENT_ID';
    const client_secret = 'USER_CLIENT_SECRET';
    const instance_url = 'USER_INSTANCE_URL';

    const tokenResponse = await axios.post(
      `${instance_url}/oauth/token`,
      {
        grant_type: 'authorization_code',
        redirect_uri: `${req.headers.origin}/auth/callback?service=mastodon`,
        client_id,
        client_secret,
        code,
      }
    );

    const { access_token } = tokenResponse.data;

    // Save access_token to user database

    res.status(200).json({ success: true });
  } catch (error) {
    Sentry.captureException(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}