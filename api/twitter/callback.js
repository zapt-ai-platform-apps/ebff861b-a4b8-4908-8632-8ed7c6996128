import { TwitterApi } from 'twitter-api-v2';
import { authenticateUser, db } from '../_apiUtils.js';
import { users } from '../../drizzle/schema.js';
import * as Sentry from '@sentry/node';
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
    const { oauth_token, oauth_verifier } = req.query;

    // Retrieve oauth_token_secret from your storage (e.g., session, database)
    const oauth_token_secret = ''; // Implement token secret retrieval

    const twitterClient = new TwitterApi({
      appKey: process.env.TWITTER_API_KEY,
      appSecret: process.env.TWITTER_API_SECRET_KEY,
      accessToken: oauth_token,
      accessSecret: oauth_token_secret,
    });

    const {
      accessToken,
      accessSecret,
      screenName,
      userId: twitterUserId,
    } = await twitterClient.login(oauth_verifier);

    // Save accessToken and accessSecret to user database
    await db
      .insert(users)
      .values({
        userId: user.id,
        twitterAccessToken: accessToken,
        twitterAccessSecret: accessSecret,
      })
      .onConflictDoUpdate({
        target: users.userId,
        set: {
          twitterAccessToken: accessToken,
          twitterAccessSecret: accessSecret,
        },
      });

    res.redirect('/');
  } catch (error) {
    Sentry.captureException(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}