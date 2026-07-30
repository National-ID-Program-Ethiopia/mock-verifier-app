# Mock Verifier App

Partner demo app for FaydaPass identity verification using the React verify SDK. Built with React and Vite.

This is a **reference demo**, not a production service. It shows how a partner website can ask a user to verify their identity with FaydaPass (show QR → user scans with wallet → credential is shared back).

## What it does

1. User opens the demo page and clicks **Show verification QR**
2. User scans the QR with their FaydaPass wallet
3. User approves sharing their Fayda digital credential
4. The app displays the verification result

## Prerequisites

- [Node.js](https://nodejs.org/) 18+
- A FaydaPass **partner API key** (`ivp_…`) from FaydaPass onboarding
- Your dev URLs registered on the FaydaPass Verify partner client:
  - `http://localhost:5180`
  - `http://127.0.0.1:5180`

## Setup

```bash
git clone https://github.com/National-ID-Program-Ethiopia/mock-verifier-app.git
cd mock-verifier-app
npm install
```

Copy the example env file and add your partner API key:

```bash
cp .env.partner.local.example .env.partner.local
```

Edit `.env.partner.local`:

```bash
PARTNER_VERIFY_API_KEY=ivp_your_key_here
```

**Do not commit** `.env.partner.local` — the API key must stay on the server side only. The dev server injects it into proxied requests; it is never bundled into the browser app.

## Run

```bash
npm run dev
```

Open http://localhost:5180

## Build

```bash
npm run build
npm run preview
```

For production, serve the `dist/` folder behind a reverse proxy that forwards `/v2/verify` to FaydaPass verify-service and adds `Authorization: Bearer <partner-api-key>`.

## Tech stack

| | |
|---|---|
| Language | TypeScript |
| UI | React 18 |
| Build | Vite |
| SDK | `@faydapass/react-verify-sdk` |

## Project layout

```
src/
  App.tsx      # Main demo UI
  pd.ts        # Presentation definition (FaydaDigitalCredential)
  sdk.ts       # Re-exports from @faydapass/react-verify-sdk
vite.config.ts # Dev server + /v2/verify proxy
```

## Troubleshooting

| Issue | What to check |
|-------|----------------|
| QR fails to load | Partner API key is set in `.env.partner.local` and dev server was restarted |
| `PARTNER_AUTH_INVALID` | Key is wrong or revoked — request a new one from FaydaPass |
| `PARTNER_ORIGIN_NOT_ALLOWED` | `http://localhost:5180` / `http://127.0.0.1:5180` are on your partner allowlist |
| Wallet does not trust verifier | `clientId` in `src/App.tsx` matches your FaydaPass onboarding pack |

## License

See repository license. For partner integration documentation, contact the FaydaPass / VeriFayda team.
