# CrowdCall — Product Requirements Document

## 1. Problem

People want to promote an event to more people than they personally know — a pregame, a party, a bar night, a pickup game — but nobody who sees the invite can tell if it's actually worth going. You either show up and hope, or skip it and miss out. There's no live signal of "is this actually happening, and is it worth my time."

This problem was first identified specifically in pickup basketball at the school gym: players couldn't tell if a game was on, or whose turn was next. Interview evidence supports that version directly. Extending it to general events (pregames, parties, bars) is this PRD's own extrapolation — not yet tested with anyone outside the basketball context.

## 2. Users & job to be done

**Primary user: the host.** Wants to create an event and get strangers/loose acquaintances to actually show up, using a rising headcount as proof it's worth attending.

**Secondary user: the attendee.** Wants to decide, from their phone, whether an event is worth going to right now — without needing to know the host or anyone already there.

Job to be done: *"When I'm deciding whether to go somewhere, help me see how many people are actually there right now, so I don't show up to something empty or skip something good."*

## 3. Evidence

- One structured interview (D03, partner interview) grounds the basketball-specific version: not knowing if a game is on, and disputes over who's next.
- No interviews have been run against the general-event version (pregames, parties, bars), and none are currently planned. The check-in-drives-attendance mechanic and the browse/discover feature are untested assumptions, not validated findings.
- **This is a real gap, not a hidden one.** The single highest-leverage open question for this product is whether strangers will actually check in on an app instead of just showing up unannounced or not at all.

## 4. Scope decision — what CrowdCall is (v1)

CrowdCall is an event check-in and live crowd count tool. A host creates an event; anyone with the link (including strangers) can see it; people check in when they arrive; the crowd count rises in real time; other users can browse and discover events by how busy they're getting.

**Accounts & identity**
- Hosts need a lightweight account to create and manage events.
- Attendees check in with no login — tap and done.
- Fraud handling for v1: one check-in per device per event. Not bulletproof, but stops accidental double-taps and casual abuse. Full prevention (location lock, host code) is out of scope — see §6.

**Event lifecycle**
- A host can edit an event after creating it (name, time, description).
- A host can manually close/end an event at any time.
- If a host sets an end time, the event auto-closes when it passes.

**MVP feature set:**

- **Create an event** — name, time, optional description, optional end time. No approval flow — anyone with a link can view it.
- **Invite / share** — a shareable link, no login required to view.
- **Check in** — one tap, adds the person to the live count. Limited to one check-in per device per event.
- **Live crowd meter** — a number (or simple bar) that updates as people check in.
- **Browse / discover** — a list of open events, sorted by crowd size (highest first). No location/distance sorting in v1 — that was a wording slip in an earlier draft, not a committed feature.
- **Optional queue toggle** — a host can turn on a static, timestamped ordered check-in list for events where turn-taking matters (e.g., a pickup game folded into a larger event). Off by default. No "mark as up now" state in v1 — just the ordered log.

**Deferred to CP-M3 (Technical Architecture, Week 7) — not decided here on purpose:**
- Web app vs. mobile app vs. both
- Hosting and backend/database choice
- Whether live updates use polling or push, and how often
- How simultaneous check-ins are handled at the data layer

## 5. User stories & acceptance criteria

**US-1 — Check in to an event**
As an attendee, I want to check in when I arrive, so that the crowd count reflects that I'm there.
- Given an event page, when I tap "Check in," then my check-in is recorded and the crowd count increases by 1.
- Given I've already checked in from this device, when I try again, then I'm blocked from checking in a second time and the count doesn't increase.

**US-2 — See the live crowd count**
As an attendee deciding whether to go, I want to see how many people are checked in right now, so that I can judge if it's worth going.
- Given an event with any number of check-ins, when I open the event page, then I see the current count, updating without a manual refresh.
- Given an event with zero check-ins, when I open the event page, then I see a count of 0, not a blank or broken state.

**US-3 — Create and manage an event**
As a host, I want to create an event and edit or close it later, so that I can keep the event page accurate.
- Given I fill in a name and a start time, when I submit, then the event is created and I receive a shareable link.
- Given I leave the name blank, when I try to submit, then I'm blocked with a clear message — no event is created with an empty name.
- Given an event I created, when I edit its name, time, or description, then the change is reflected immediately on the shared link.
- Given an event I created, when I manually close it, then it no longer accepts new check-ins and shows as ended.

**US-4 — Share an event with people I don't know**
As a host, I want to share my event via a link that works for anyone, so that I'm not limited to people already in the app or in my contacts.
- Given a valid event link, when anyone opens it (no account required), then they see the event name, time, and current crowd count.

**US-5 — Browse events**
As a user without a specific invite, I want to see a list of open events sorted by crowd size, so that I can find something happening right now.
- Given at least one public, open event exists, when I open the browse view, then I see events listed with name, time, and current count, ordered highest count first.
- Given no public events exist, when I open the browse view, then I see a clear "nothing happening right now" state, not an empty broken screen.
- Given an event has been manually closed or has passed its end time, when I open the browse view, then it no longer appears in the list.

**US-6 — Optional ordered check-in (queue) — stretch goal**
As a host running an event where turn order matters, I want to turn on an ordered, timestamped check-in list, so that disputes over "who's next" are settled by the record, not memory or arguing.
- Given queue mode is off (default), when someone checks in, then they're only added to the crowd count, not to any ordered list.
- Given queue mode is on, when someone checks in, then they're added to a static ordered list with a timestamp, visible to anyone viewing the event.

## 6. Out of scope for v1

- Photos or comments posted during an event
- "Vibe" tags on check-in
- Milestone notifications ("50 people checked in")
- Location-based or code-based fraud prevention beyond one-check-in-per-device
- Invite-source tracking (which link brought which people)
- "Mark as up now" / advancing state within queue mode

These are deliberately cut. They're good ideas, but committing to them now would mean not deciding on the core loop before the semester's build weeks start.

## 7. Risks / open questions

- **Biggest unknown:** will people who don't know the host actually check in, or will they just show up (or not) without touching the app? Planned first move: a scrappy fake-door test — a static page with no backend — to see if people even tap "check in," before building the full thing.
- **Fake/inflated counts:** one-check-in-per-device is easy to get around (clear cookies, different device). Acceptable risk for v1; worth revisiting once there's real usage data.
- **Queue mode's fit:** it was built for basketball's specific "who's next" dispute. It may not generalize well to a bar or party, which is exactly why it's host-toggled and off by default rather than a core, always-on feature.
- **Scope risk:** this PRD commits to a broader product (general events) than what's actually been validated (basketball only) — with no interviews currently planned to close that gap. If early usage or feedback shows the general-event version doesn't hold up, the honest move is to revise this document, not quietly keep building past it.

## 8. What tells us this worked

A host can create an event, share it with people outside their own contacts, and watch the crowd count rise from real check-ins — without the host having to manually track who showed up.
