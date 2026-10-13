# CrowdCall Architecture Map (MVP)

Example story traced: An attendee checks in to an event.

## Pieces and what each one serves

1. Web app in the browser (screens)
   Serves: create event, share link, check in, live crowd count, browse events.
   Attendees use it with no login.

2. Host login (Supabase Auth)
   Serves: "Hosts need a lightweight account to create and manage events."

3. Database (Supabase Postgres)
   Serves: storing events (name, time, description, end time, open/closed)
   and check-ins. Also serves "one check-in per device per event."

4. Live updates (Supabase Realtime)
   Serves: the live crowd count rising as people check in.

5. Device ID saved in the browser
   Serves: fraud handling for v1 (one check-in per device per event).

6. Web hosting (to be decided)
   Serves: giving attendees a link they can open on their phone.

7. Optional queue table in the database
   Serves: the host-toggleable queue feature.

## Trace: attendee checks in

1. Attendee opens the event link on their phone (browser loads the web app).
2. Web app reads the event from the database and shows the current count.
3. Attendee taps "Check in."
4. Web app sends the check-in with the device ID to the database.
5. Database checks: is the event open, and has this device already checked in?
6. If OK, the check-in is saved and the count goes up by one.
7. Realtime sends the new count to everyone viewing the event.
8. The attendee's screen updates, and so does everyone else's.

## Not in the map (out of scope for v1)
- Location lock and host codes (full fraud prevention)
- Everything listed in PRD section 6 (out of scope for v1)