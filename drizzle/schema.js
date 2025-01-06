import { pgTable, serial, uuid, text, timestamp, boolean } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  userId: uuid('user_id').notNull().unique(),
  twitterAccessToken: text('twitter_access_token'),
  twitterAccessSecret: text('twitter_access_secret'),
  mastodonAccessToken: text('mastodon_access_token'),
  mastodonInstanceUrl: text('mastodon_instance_url'),
  lastTweetId: text('last_tweet_id'),
  crosspostEnabled: boolean('crosspost_enabled').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});