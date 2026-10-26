import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listEvents } from '../lib/events.js'

export default function BrowsePage() {
  const [events, setEvents] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    listEvents().then(setEvents).catch((err) => setError(err.message))
  }, [])

  return (
    <section>
      <h1>Events</h1>
      <p><Link to="/new" className="button">New event</Link></p>
      {error && <p className="error" role="alert">Could not load events: {error}</p>}
      {!events && !error && <p>Loading…</p>}
      {events && events.length === 0 && <p>No events yet.</p>}
      {events && events.length > 0 && (
        <ul className="event-list" data-testid="event-list">
          {events.map((event) => (
            <li key={event.id} data-testid="event-row" data-event-id={event.id}>
              <Link to={`/e/${event.id}`}>
                <span data-testid="row-name">{event.name}</span>
                <span className="count" data-testid="row-count">{event.crowd_count}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
