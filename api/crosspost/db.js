import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { cross_post_settings } from '../drizzle/schema.js';
import { eq } from 'drizzle-orm';
import { initializeZapt } from '@zapt/zapt-js';
import 'dotenv/config';

const { supabase } = initializeZapt(process.env.VITE_PUBLIC_APP_ID);

const sql = postgres(process.env.COCKROACH_DB_URL);
const db = drizzle(sql);

export { db, supabase, cross_post_settings, eq };