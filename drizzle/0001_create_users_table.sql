CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY,
  "user_id" UUID NOT NULL UNIQUE,
  "twitter_access_token" TEXT,
  "twitter_access_secret" TEXT,
  "mastodon_access_token" TEXT,
  "mastodon_instance_url" TEXT,
  "last_tweet_id" TEXT,
  "created_at" TIMESTAMP DEFAULT NOW()
);