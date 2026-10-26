import { Link, Route, Routes } from 'react-router-dom'
import BrowsePage from './pages/BrowsePage.jsx'
import NewEventPage from './pages/NewEventPage.jsx'
import EventPage from './pages/EventPage.jsx'
import EditEventPage from './pages/EditEventPage.jsx'

export default function App() {
  return (
    <div className="app">
      <header>
        <Link to="/" className="brand">CrowdCall</Link>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<BrowsePage />} />
          <Route path="/new" element={<NewEventPage />} />
          <Route path="/e/:id" element={<EventPage />} />
          <Route path="/e/:id/edit" element={<EditEventPage />} />
        </Routes>
      </main>
    </div>
  )
}
