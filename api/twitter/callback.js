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
    const { oauth_token, oauth_verifier } = req.query;

    // Retrieve oauth_token_secret from user session or database

    const twitterClient = new TwitterApi({
      appKey: process.env.TWITTER_API_KEY,
      appSecret: process.env.TWITTER_API_SECRET_KEY,
      accessToken: oauth_token,
      accessSecret: 'USER_OAUTH_TOKEN_SECRET',
    });

    const { userId, screenName, accessToken, accessSecret } =
      await twitterClient.login(oauth_verifier);

    // Save accessToken and accessSecret to user database

    res.status(200).json({ success: true });
  } catch (error) {
    Sentry.captureException(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}