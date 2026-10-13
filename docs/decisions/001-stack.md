# Decision: Backend stack for CrowdCall

## Context
CrowdCall is a web app where hosts create events and guests check in without an account, so everyone can see how busy an event is. Behind the screens, it needs four things from a backend: a database to save events and check-ins, host login so only the host can edit or close an event, live updates so the crowd level changes without a refresh, and a public web address that opens on a phone with no install. Rules like counting check-ins and ending events are code I write on any platform, so the choice comes down to guest access, live updates, and hosting. I also have about five weeks to build the working app, so setup time matters.

## Decision
I chose Supabase for CrowdCall's backend. I will use Supabase Postgres to store events and check-ins, Supabase Auth for host login, and Supabase Realtime for the live crowd count. Supabase is a back end only, so I will publish the website on a separate host.

## Why not the alternative
I considered Firebase. It covers my database, host login, and live updates, and its free plan may include hosting, which would save me a setup step. I did not choose it for two reasons from my D06 research. First, Firebase bills live updates by reads: every update sent to every watcher costs a read, and the free plan allows 50,000 reads a day, so a busy event could use that up quickly. Supabase's free limit is 200 people watching at once, which I estimate is enough for campus events. Second, I would rather be able to leave later, and Supabase is built on standard Postgres. The cost of my choice is that I need a separate host for the website, and I expect setup to take longer than Firebase.

## What would change my mind
I would switch to Firebase if more than 200 people need to watch one event at the same time, if Supabase live updates prove unreliable when I test them, or if setting up a separate host takes more time than I have. I would also reconsider if the Supabase free plan limits get in the way of running the app for my demo.