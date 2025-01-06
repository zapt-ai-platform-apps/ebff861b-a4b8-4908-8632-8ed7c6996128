import { initializeZapt } from '@zapt/zapt-js';
import { TwitterApi } from 'twitter-api-v2';
import { authenticateUser } from '../_apiUtils';
import * as Sentry from '@sentry/node';

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

    const twitterClient = new TwitterApi({
      appKey: process.env.TWITTER_API_KEY,
      appSecret: process.env.TWITTER_API_SECRET_KEY,
    });

    const { url, oauth_token, oauth_token_secret } =
      await twitterClient.generateAuthLink(
        `${req.headers.origin}/auth/callback?service=twitter`
      );

    // Save oauth_token and oauth_token_secret to user session or database

    res.redirect(url);
  } catch (error) {
    Sentry.captureException(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}