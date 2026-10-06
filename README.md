# CrowdCall

Create an event, watch the crowd build, decide to go. CrowdCall is a live crowd meter for campus events, club meetups, pickup sports, gym classes, and anything else where "will people actually show up?" is the real question.

## The problem

This started as a tool for a specific problem: pickup basketball players at the school gym couldn't tell if a game was happening before showing up, or who'd actually called next. Real interviews backed that up.

The same problem shows up anywhere a host wants people to come but nobody can tell if it's worth going yet, like a club meetup, a study group, or a community event promoted to people you don't know. You either show up and hope, or skip it and miss out.

**Note:** The wider use case beyond basketball is the direction this product is heading, not something tested with real users yet. The original concept brief (`docs/01-concept-brief.md`) was written for the basketball-only version. The PRD (`docs/02-prd.md`) reflects where the product stands now.

## What it does (v1)

- **Create an event** for anything: a club meetup, a campus event, a pickup run, whatever
- **Invite and share** with a link, including people you don't personally know, for wider promotion
- **Check in** so the live crowd count rises as people arrive, giving the next person a reason to come
- **Browse and discover** events and see how busy they're getting before deciding to go
- **Optional queue** that hosts can turn on for events that need turn-taking, like pickup game rotations or sign-up lines (carried over from the pickup basketball "who's next" problem)

## Out of scope for v1

- Photos and comments feed during an event
- "Vibe" tags on check-in
- Milestone alerts
- Fake check-in prevention
- Invite-source tracking

Good ideas, deliberately cut so the MVP stays buildable on the class timeline.

## Roadmap / status

- [x] Concept brief (`docs/01-concept-brief.md`)
- [x] PRD (`docs/02-prd.md`)
- [ ] Pick a tech stack
- [ ] Test the biggest unknown: will people actually check in instead of just showing up (or not) unannounced?
- [ ] Build check-in + live crowd meter
- [ ] Build browse/discover
- [ ] Build the optional queue toggle

## Development

The tech stack isn't decided yet. Setup and run instructions will go here once there's code.

## Author

Justin Martinez, Syracuse University
