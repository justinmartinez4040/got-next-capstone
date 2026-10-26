import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getEvent } from '../lib/events.js'

export default function EventPage() {
  const { id } = useParams()
  const [event, setEvent] = useState(null)
  const [error, setError] = useState(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    let cancelled = false
    setEvent(null)
    setError(null)
    getEvent(id)
      .then((data) => { if (!cancelled) setEvent(data) })
      .catch((err) => { if (!cancelled) setError(err.message) })
    return () => { cancelled = true }
  }, [id])

  if (error) return <p className="error" role="alert">Could not load the event: {error}</p>
  if (!event) return <p>Loading…</p>

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
      <p>Crowd: <span className="count" data-testid="crowd-count">{event.crowd_count}</span></p>
      <div className="share">
        <input aria-label="Shareable link" data-testid="share-link" value={shareUrl} readOnly />
        <button type="button" onClick={copyLink}>{copied ? 'Copied' : 'Copy link'}</button>
      </div>
    </section>
  )
}
