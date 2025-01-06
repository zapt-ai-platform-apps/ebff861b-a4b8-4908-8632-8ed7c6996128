import { db, supabase, cross_post_settings, eq } from './db.js';
import Sentry from './sentry.js';
import { TwitterApi } from 'twitter-api-v2';
import axios from 'axios';
import 'dotenv/config';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  try {
    // Retrieve all users with cross-posting enabled
    const settings = await db.select().from(cross_post_settings).where(eq(cross_post_settings.enabled, true));

    for (const setting of settings) {
      const userId = setting.userId;
      const lastTweetId = setting.lastTweetId;

      // Retrieve user's Twitter access tokens from database
      // Assume there is a table 'users' with twitter tokens
      const { data: user, error } = await supabase
        .from('users')
        .select('twitter_access_token, twitter_access_token_secret, twitter_user_id')
        .eq('id', userId)
        .single();

      if (error || !user) {
        Sentry.captureException(new Error(`User not found or error fetching tokens for user_id: ${userId}`));
        continue;
      }

      const twitterClient = new TwitterApi({
        appKey: process.env.TWITTER_API_KEY,
        appSecret: process.env.TWITTER_API_SECRET_KEY,
        accessToken: user.twitter_access_token,
        accessSecret: user.twitter_access_token_secret,
      });

      const rwClient = twitterClient.readWrite;

      // Fetch latest tweets since lastTweetId
      const params = {
        exclude: ['retweets', 'replies'],
        since_id: lastTweetId || undefined,
        tweet_mode: 'extended',
        count: 5, // adjust as needed
      };

      const tweets = await rwClient.v2.userTimeline(user.twitter_user_id, params);

      if (tweets && tweets.data && tweets.data.length > 0) {
        for (const tweet of tweets.data) {
          // Post to Mastodon
          const mastodonResponse = await axios.post(
            `${process.env.MASTODON_API_URL}/statuses`,
            {
              status: tweet.text,
              visibility: 'public',
            },
            {
              headers: {
                Authorization: `Bearer ${process.env.MASTODON_ACCESS_TOKEN}`,
                'Content-Type': 'application/json',
              },
            }
          );

          if (mastodonResponse.status !== 200 && mastodonResponse.status !== 201) {
            Sentry.captureException(new Error(`Failed to post to Mastodon for user_id: ${userId}`));
          }

          // Update lastTweetId
          await db.update(cross_post_settings)
            .set({ lastTweetId: tweet.id })
            .where(eq(cross_post_settings.userId, userId));
        }
      }
    }

    res.status(200).json({ success: true });
  } catch (error) {
    Sentry.captureException(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}