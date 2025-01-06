import { authenticateUser, db } from '../_apiUtils.js';
import { users } from '../../drizzle/schema.js';
import * as Sentry from '@sentry/node';
import axios from 'axios';
import { eq } from 'drizzle-orm';

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
    const { code, instance_url } = req.query;

    // Retrieve client_id and client_secret from your storage
    const client_id = ''; // Implement retrieval
    const client_secret = ''; // Implement retrieval

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

    // Save access_token and instance_url to user database
    await db
      .insert(users)
      .values({
        userId: user.id,
        mastodonAccessToken: access_token,
        mastodonInstanceUrl: instance_url,
      })
      .onConflictDoUpdate({
        target: users.userId,
        set: {
          mastodonAccessToken: access_token,
          mastodonInstanceUrl: instance_url,
        },
      });

    res.redirect('/');
  } catch (error) {
    Sentry.captureException(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}