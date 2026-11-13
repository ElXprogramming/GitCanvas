# Contributing to GitCanvas

Thank you for your interest in contributing to **GitCanvas**!

## Development Setup

```bash
git clone https://github.com/<your-username>/GitCanvas.git
cd GitCanvas
npm install
cp .env.example .env.local
npm run dev
```

## Verification Checks

Before opening a pull request, run:

```bash
npm run lint
npx tsc --noEmit
```

## Code of Conduct

Please adhere to our [Code of Conduct](CODE_OF_CONDUCT.md) in all interactions.
