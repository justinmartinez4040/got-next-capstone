import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getEvent } from '../lib/events.js'
import { formatEventTime } from '../lib/format.js'
import NotFound from './NotFound.jsx'

export default function EventPage() {
  const { id } = useParams()
  // undefined = loading, null = not found, object = loaded
  const [event, setEvent] = useState(undefined)
  const [error, setError] = useState(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    let cancelled = false
    setEvent(undefined)
    setError(null)
    getEvent(id)
      .then((data) => { if (!cancelled) setEvent(data) })
      .catch((err) => { if (!cancelled) setError(err.message) })
    return () => { cancelled = true }
  }, [id])

  if (error) return <p className="error" role="alert">Couldn't load the event: {error}</p>
  if (event === undefined) return <p>Loading…</p>
  if (event === null) return <NotFound />

  const shareUrl = `${window.location.origin}/e/${event.id}`

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
    } catch {
      // Clipboard can be blocked; the link is still selectable in the box.
    }
  }

  return (
    <section>
      <h1 data-testid="event-name">{event.name}</h1>
      <p data-testid="event-place">{event.place}</p>
      <p data-testid="event-time">{formatEventTime(event.starts_at)}</p>
      <p>Crowd: <span className="count" data-testid="crowd-count">{event.crowd_count}</span></p>
      <div className="share">
        <input aria-label="Shareable link" data-testid="share-link" value={shareUrl} readOnly />
        <button type="button" onClick={copyLink}>{copied ? 'Copied' : 'Copy link'}</button>
      </div>
      <p><Link to={`/e/${event.id}/edit`} className="button">Edit</Link></p>
    </section>
  )
}
