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
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function getEvent(id) {
  const { data, error } = await supabase
    .from('events_with_counts')
    .select('*')
    .eq('id', id)
    .maybeSingle()
  if (error) throw error
  return data
}
