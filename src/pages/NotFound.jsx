import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section>
      <h1>Event not found</h1>
      <p>This event doesn't exist or was deleted.</p>
      <p><Link to="/">Browse events</Link></p>
    </section>
  )
}
