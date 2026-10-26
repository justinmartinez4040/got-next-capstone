import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { deleteEvent, getEvent, updateEvent } from '../lib/events.js'
import { toLocalInputValue } from '../lib/format.js'
import NotFound from './NotFound.jsx'

export default function EditEventPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  // undefined = loading, null = not found, object = original values
  const [original, setOriginal] = useState(undefined)
  const [name, setName] = useState('')
  const [place, setPlace] = useState('')
  const [startsAt, setStartsAt] = useState('')
  const [loadError, setLoadError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setOriginal(undefined)
    setLoadError(null)
    getEvent(id)
      .then((event) => {
        if (cancelled) return
        if (!event) return setOriginal(null)
        const values = { name: event.name, place: event.place, startsAt: toLocalInputValue(event.starts_at) }
        setOriginal({ ...values, crowdCount: event.crowd_count })
        setName(values.name)
        setPlace(values.place)
        setStartsAt(values.startsAt)
      })
      .catch((err) => { if (!cancelled) setLoadError(err.message) })
    return () => { cancelled = true }
  }, [id])

  if (loadError) return <p className="error" role="alert">Couldn't load the event: {loadError}</p>
  if (original === undefined) return <p>Loading…</p>
  if (original === null) return <NotFound />

  async function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim() || !place.trim() || !startsAt) {
      setError('Name, place, and time are all required.')
      return
    }
    // Only send what changed, so untouched fields are never rewritten.
    const changes = {}
    if (name.trim() !== original.name) changes.name = name
    if (place.trim() !== original.place) changes.place = place
    if (startsAt !== original.startsAt) changes.startsAt = new Date(startsAt).toISOString()

    setSaving(true)
    setError(null)
    try {
      const found = await updateEvent(id, changes)
      if (!found) return setOriginal(null)
      navigate(`/e/${id}`)
    } catch (err) {
      setError(`Could not save changes: ${err.message}`)
      setSaving(false)
    }
  }

  async function handleDelete() {
    const n = original.crowdCount
    const message = `Delete "${original.name}"? This also removes its ${n} check-in${n === 1 ? '' : 's'}. This can't be undone.`
    if (!window.confirm(message)) return

    setSaving(true)
    setError(null)
    try {
      const found = await deleteEvent(id)
      if (!found) return setOriginal(null)
      navigate('/')
    } catch (err) {
      setError(`Could not delete the event: ${err.message}`)
      setSaving(false)
    }
  }

  return (
    <section>
      <h1>Edit event</h1>
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
        <p>
          <button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save changes'}</button>
          {' '}
          <Link to={`/e/${id}`}>Cancel</Link>
        </p>
      </form>
      <hr />
      <button type="button" className="danger" onClick={handleDelete} disabled={saving}>
        Delete event
      </button>
    </section>
  )
}
