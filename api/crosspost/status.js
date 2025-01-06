import { authenticateUser, db } from '../_apiUtils.js';
import { users } from '../../drizzle/schema.js';
import { eq } from 'drizzle-orm';
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

    // Retrieve the cross-posting status from user database
    const [userData] = await db
      .select()
      .from(users)
      .where(eq(users.userId, user.id));

    const enabled = userData?.crosspostEnabled ?? false;

    res.status(200).json({ enabled });
  } catch (error) {
    Sentry.captureException(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}