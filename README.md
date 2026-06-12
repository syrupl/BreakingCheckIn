# Breaking Training Cards

Mobile-first Breaking training tracker with swipe cards, timers, check-ins, and local history.

## Run locally

```powershell
npm run serve
```

Open the local address printed by the server.

## Data

Training data is stored in browser `localStorage`.

- Daily records: `breaking-full-card-YYYY-MM-DD`
- App settings: `breaking-app-settings`

Use the settings button on the homepage to switch between formal mode and test mode, or to inspect/edit today's saved data.

## Privacy

This app does not require API keys, accounts, or a backend service. Training records stay in the current browser unless manually exported or edited.
