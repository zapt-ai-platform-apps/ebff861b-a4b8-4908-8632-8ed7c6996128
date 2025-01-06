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
  try {
    const user = await authenticateUser(req);

    const setting = await db.select().from(cross_post_settings).where(eq(cross_post_settings.userId, user.id)).single();

    const enabled = setting ? setting.enabled : false;

    res.status(200).json({ enabled });
  } catch (error) {
    Sentry.captureException(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}