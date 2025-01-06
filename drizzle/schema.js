import { pgTable, serial, text, timestamp, uuid, boolean, bigint } from 'drizzle-orm/pg-core';

export const jokes = pgTable('jokes', {
  id: serial('id').primaryKey(),
  setup: text('setup').notNull(),
  punchline: text('punchline').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  userId: uuid('user_id').notNull(),
});

export const cross_post_settings = pgTable('cross_post_settings', {
  userId: uuid('user_id').primaryKey(),
  enabled: boolean('enabled').notNull().default(false),
  lastTweetId: bigint('last_tweet_id'),
});