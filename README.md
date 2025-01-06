# Cross-Post App

An app that connects your Mastodon account to your Twitter account and enables cross-posting. Any tweet or post on Twitter (X) is automatically posted to your Mastodon account. Users can also switch between different themes for a personalized experience.

## User Journeys

1. [Authenticate User](docs/journeys/authenticate-user.md) - Sign in with ZAPT to access the app.
2. [Connect Twitter Account](docs/journeys/connect-twitter-account.md) - Link your Twitter account to the app.
3. [Connect Mastodon Account](docs/journeys/connect-mastodon-account.md) - Link your Mastodon account to the app.
4. [Enable Cross-Posting](docs/journeys/enable-cross-posting.md) - Turn on cross-posting from Twitter to Mastodon.
5. [Disconnect Accounts](docs/journeys/disconnect-accounts.md) - Disconnect your Twitter or Mastodon accounts.
6. [Cross-Post Tweets to Mastodon](docs/journeys/cross-post-tweets.md) - Automatically post your new tweets to Mastodon.
7. [Theme Switcher](docs/journeys/theme-switcher.md) - Change the app's visual theme according to your preference.

## External API Services

- **Twitter API**: Used for accessing tweets and enabling cross-posting to Mastodon.
- **Mastodon API**: Used for posting updates to your Mastodon account.

## Environment Variables

Listed in the `.env` file:

```
TWITTER_API_KEY=
TWITTER_API_SECRET_KEY=
TWITTER_ACCESS_TOKEN=
TWITTER_ACCESS_TOKEN_SECRET=
MASTODON_ACCESS_TOKEN=
MASTODON_API_URL=
```

Please ensure to set these variables with your own credentials.