'use server';

import { createSupabaseServerClient } from './supabase/server';

// allows us to secure pages and routes based on the presence of a user session
export default async function getUserSession() {
  const supabase = await createSupabaseServerClient();

  return supabase.auth.getSession();
}
