# CrowdCall: Technical Architecture (MVP)

## Overview
CrowdCall is a web app where hosts create events and guests check in without an account, so everyone can see how busy an event is. This document covers the first version only. Anything listed as out of scope in the PRD (section 6) is left out.

Architecture map: see docs/design/architecture-map.md
Stack decision: see docs/decisions/001-stack.md

## Questions the PRD left for this document
- Web app or mobile app: a web app, so guests only need a link and no install.
- Polling or push: push, using Supabase Realtime.
- Hosting and database: Supabase (see docs/decisions/001-stack.md). The website host is still to be chosen.
- Simultaneous check-ins: the database saves each check-in, so two people tapping at the same time are both counted. The one-check-in-per-device rule is checked in the database, not only in the browser.

## Stack
- Browser web app: the screens guests and hosts use on their phones
- Supabase Postgres: database for events and check-ins
- Supabase Auth: host login
- Supabase Realtime: live crowd count
- Website host: not yet chosen (Supabase is a back end only)

## Components and the requirements they serve
| Component | What it does | Serves |
|---|---|---|
| Browser web app | Screens to create events, share a link, check in, see the count, browse | US-1 to US-5 |
| Supabase Auth | Host sign-up and login, so only the host can edit or close an event | US-3 |
| Supabase Postgres (events) | Saves name, time, optional end time, description, public or private setting | US-3, US-4, US-5 |
| Supabase Postgres (check-ins) | Saves each check-in tied to an event; closed events refuse new ones | US-1, US-3 |
| Supabase Postgres (queue list) | Optional, host-toggled ordered check-in list with timestamps. Off by default. | US-6 (stretch) |
| Supabase Realtime | Pushes the new count to everyone viewing the event | US-2 |
| Device ID in the browser | Weak guard for one check-in per device per event | US-1 |
| Website host (TBD) | Gives a public web address that opens on a phone with no install | All |

Rules I write in my own code on any platform:
- Counting check-ins and showing an approximate level (US-1, US-2)
- Ending events when the host closes them or the end time passes (US-3, US-5)
- Sorting the browse list by crowd size, with a "nothing happening right now" message when it is empty (US-5)
- Events with no end time stay open until the host closes them

## Trace: a guest checks in
1. Guest opens the event link on their phone.
2. The web app reads the event and current count from the database.
3. Guest taps "Check in."
4. The web app sends the check-in and device ID to the database.
5. The database checks that the event is open and this device has not already checked in.
6. If it passes, the check-in is saved and the count goes up by one.
7. Realtime sends the new count to everyone viewing the event.
8. Every screen updates without a refresh.

## What this choice costs
- I need a separate place to host the website, which adds a setup step.
- Supabase Realtime is newer than Firebase's live updates, and its free plan limits how many people can watch at once.
- "One check-in per device" is a weak guard. Clearing the browser or using another browser gets around it. I am accepting this for v1 (see PRD section 7, fake or inflated counts).

## Out of scope for v1
- Location lock and host codes (full fraud prevention)
- Everything else listed in PRD section 6

## Open questions
- Where to host the website