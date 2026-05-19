# GitHub Organization Security Monitor

A command line application that monitors GitHub organization for suspicious activity using webhooks and an extensible anomaly detection engine.

## What it does
Listens for GitHub organization events and flags the following suspicious behaviors:
- Code pushed between 14:00–16:00
- A team created with the prefix "hacker"
- A repository created and deleted within 10 minutes

When suspicious activity is detected, the event details are printed to the console.

## Design 
The application is built around three core abstractions designed to scale with a large team:

- **`Detector`** — abstract base class. Add a new detection rule by extending this class and implementing `canHandle()` and `detect()`
- **`Notifier`** — interface for alert delivery. Add Slack, email, or PagerDuty by implementing this interface
- **`DetectionEngine`** — orchestrates detectors and notifiers. Never needs to change when new rules or notification methods are added

## Project Structure 
src/
├── server.ts                          # Express webhook server
├── DetectionEngine.ts                 # Orchestrates detectors and notifiers
├── types.ts                           # Shared interfaces (GitHubEvent, Alert)
├── detectors/
│   ├── Detector.ts                    # Abstract base class
│   ├── SuspiciousHoursDetector.ts     # Flags pushes between 14:00–16:00
│   ├── HackerTeamDetector.ts          # Flags teams with "hacker" prefix
│   └── RepoLifecycleDetector.ts       # Flags repos deleted within 10 min of creation
└── notifiers/
├── Notifier.ts                    # Interface
└── ConsoleNotifier.ts             # Prints alerts to console

## Setup

**Prerequisites:** Node.js, npm

```bash
npm install
```

## Running the application

You will need two terminal windows.

**Terminal 1 — start the webhook server:**
```bash
npm run dev
```

**Terminal 2 — start the smee tunnel:**
```bash
npm run smee
```

The server listens on port 3000. Smee forwards GitHub webhook events to your local machine.

## Webhook configuration

1. Go to your GitHub org → Settings → Webhooks → Add webhook
2. Set Payload URL to your smee channel URL
3. Set Content type to `application/json`
4. Select **Send me everything**
5. Click Add webhook

## Adding a new detector

Create a new file in `src/detectors/` that extends `Detector`:

```typescript
export class MyNewDetector extends Detector {
  canHandle(eventType: string): boolean {
    return eventType === "your_event_type";
  }

  detect(event: GitHubEvent): Alert | null {
    // your detection logic
    return null;
  }
}
```

Then add it to the detectors array in `server.ts` — no other changes needed.