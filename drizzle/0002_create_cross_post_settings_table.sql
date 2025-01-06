CREATE TABLE "cross_post_settings" (
  "user_id" UUID PRIMARY KEY,
  "enabled" BOOLEAN NOT NULL DEFAULT FALSE,
  "last_tweet_id" BIGINT
);