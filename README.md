# Tlapalli website

This is a Nuxt 4 website that serves as the landing page for the VSCode theme.

## Running locally

After installing the dependencies (`pnpm install`)

```bash
npm run dev
```

To be able to see the changes on a mobile device while developing, run:

```bash
npm run dev:network
```

## Deployment

Currently being deployed to cloudflare, the only way I was able to make it work was via `wrangler`. The following command is all that should be required:

```bash
npm run deploy
```

I started modifying the `version` field in the [`package.json`](package.json) file just to make sure I would get the newest files deployed.
