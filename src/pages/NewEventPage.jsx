import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createEvent } from '../lib/events.js'

export default function NewEventPage() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [place, setPlace] = useState('')
  const [startsAt, setStartsAt] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim() || !place.trim() || !startsAt) {
      setError('Name, place, and time are all required.')
      return
    }
    setSaving(true)
    setError(null)
    try {
      // datetime-local gives local time with no zone; convert to a real timestamp.
      const id = await createEvent({ name, place, startsAt: new Date(startsAt).toISOString() })
      navigate(`/e/${id}`)
    } catch (err) {
      setError(`Could not create the event: ${err.message}`)
      setSaving(false)
    }
  }

  return (
    <section>
      <h1>New event</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Name
          <input name="name" value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <label>
          Place
          <input name="place" value={place} onChange={(e) => setPlace(e.target.value)} required />
        </label>
        <label>
          Date & time
          <input
            name="starts_at"
            type="datetime-local"
            value={startsAt}
            onChange={(e) => setStartsAt(e.target.value)}
            required
          />
        </label>
        {error && <p className="error" role="alert">{error}</p>}
        <button type="submit" disabled={saving}>{saving ? 'Creating…' : 'Create event'}</button>
      </form>
    </section>
  )
}
