import { authenticateUser } from '../_apiUtils';
import * as Sentry from '@sentry/node';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { cross_post_settings } from '../drizzle/schema.js';
import { eq } from 'drizzle-orm';

const sql = postgres(process.env.COCKROACH_DB_URL);
const db = drizzle(sql);

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
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  try {
    const user = await authenticateUser(req);
    const { enabled } = req.body;

    if (enabled) {
      // Enable cross-posting
      await db.insert(cross_post_settings).values({
        userId: user.id,
        enabled: true,
      }).onConflictDoUpdate({
        target: cross_post_settings.userId,
        set: { enabled: true },
      });
    } else {
      // Disable cross-posting
      await db.update(cross_post_settings).set({ enabled: false }).where(eq(cross_post_settings.userId, user.id));
    }

    res.status(200).json({ success: true });
  } catch (error) {
    Sentry.captureException(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}