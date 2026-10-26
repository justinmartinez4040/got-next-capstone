// Confirms the app can reach Supabase and the migration ran.
// Prints only "connected" or an error message. Never prints the URL or key.
import { createClient } from '@supabase/supabase-js'

const url = process.env.VITE_SUPABASE_URL
const key = process.env.VITE_SUPABASE_ANON_KEY

if (!url || !key) {
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env')
  process.exit(1)
}

const supabase = createClient(url, key)
const { error } = await supabase.from('events_with_counts').select('id').limit(1)

if (error) {
  console.error(`Not connected: ${error.message}`)
  process.exit(1)
}
console.log('connected')
