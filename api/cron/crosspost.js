import { db } from '../_apiUtils.js';
import { users } from '../../drizzle/schema.js';
import { eq, and } from 'drizzle-orm';
import { TwitterApi } from 'twitter-api-v2';
import megalodon from 'megalodon';
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
    // Get all users who have connected both Twitter and Mastodon and enabled cross-posting
    const results = await db
      .select()
      .from(users)
      .where(
        and(
          users.twitterAccessToken.isNotNull(),
          users.twitterAccessSecret.isNotNull(),
          users.mastodonAccessToken.isNotNull(),
          users.mastodonInstanceUrl.isNotNull(),
          users.crosspostEnabled.eq(true)
        )
      );

    for (const user of results) {
      try {
        const twitterClient = new TwitterApi({
          appKey: process.env.TWITTER_API_KEY,
          appSecret: process.env.TWITTER_API_SECRET_KEY,
          accessToken: user.twitterAccessToken,
          accessSecret: user.twitterAccessSecret,
        });

        const mastodonClient = megalodon.default(
          'mastodon',
          user.mastodonInstanceUrl,
          user.mastodonAccessToken
        );

        // Fetch recent tweets
        const lastTweetId = user.lastTweetId;
        const params = {
          exclude_replies: true,
          include_rts: false,
          trim_user: true,
          since_id: lastTweetId,
        };
        const tweetsResponse = await twitterClient.v1.get('statuses/user_timeline.json', params);

        for (const tweet of tweetsResponse.reverse()) {
          // Post to Mastodon
          await mastodonClient.postStatus(tweet.text);

          // Update lastTweetId
          await db
            .update(users)
            .set({ lastTweetId: tweet.id_str })
            .where(eq(users.userId, user.userId));
        }
      } catch (error) {
        Sentry.captureException(error);
        console.error(`Error processing user ${user.userId}:`, error);
      }
    }

    res.status(200).json({ success: true });
  } catch (error) {
    Sentry.captureException(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}