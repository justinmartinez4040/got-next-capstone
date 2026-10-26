import { supabase } from './supabase.js'

// Every read goes through events_with_counts, so crowd_count is always
// counted from check_ins rows and never stored on the event.

export async function createEvent({ name, place, startsAt }) {
  const { data, error } = await supabase
    .from('events')
    .insert({ name: name.trim(), place: place.trim(), starts_at: startsAt })
    .select('id')
    .single()
  if (error) throw error
  return data.id
}

export async function listEvents() {
  const { data, error } = await supabase
    .from('events_with_counts')
    .select('*')
    .order('crowd_count', { ascending: false })
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

// Saves only the given fields (name, place, starts_at) on the event row.
// check_ins is never touched, so the crowd count and check-ins carry over.
// Returns false if no event has this id (e.g. deleted while editing).
export async function updateEvent(id, changes) {
  const allowed = {}
  if ('name' in changes) allowed.name = changes.name.trim()
  if ('place' in changes) allowed.place = changes.place.trim()
  if ('startsAt' in changes) allowed.starts_at = changes.startsAt
  if (Object.keys(allowed).length === 0) return true

  const { data, error } = await supabase.from('events').update(allowed).eq('id', id).select('id')
  if (error) throw error
  return data.length > 0
}

// Returns the event, or null if it doesn't exist (or the id can't be one).
export async function getEvent(id) {
  // Postgres rejects non-uuid ids with an error, so treat them as not found.
  if (!UUID_PATTERN.test(id)) return null
  const { data, error } = await supabase
    .from('events_with_counts')
    .select('*')
    .eq('id', id)
    .maybeSingle()
  if (error) throw error
  return data
}
