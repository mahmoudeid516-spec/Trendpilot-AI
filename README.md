This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## AI Search Provider (DataForSEO)

AI product search uses DataForSEO as the only provider.

### Required environment variables

- `DATAFORSEO_LOGIN`:
	- required
	- DataForSEO API login
- `DATAFORSEO_PASSWORD`:
	- required
	- DataForSEO API password
- `DATAFORSEO_LOCATION_CODE`:
	- optional (default `2840`)
	- geographic location code for search
- `DATAFORSEO_LANGUAGE_CODE`:
	- optional (default `en`)
	- language code for search

### Provider behavior

- If credentials are missing, the API returns `503`.
- No fake/mock fallback products are returned.

## Shopify integration

Users connect their own Shopify store from `/dashboard/integrations`. Uses
the official `@shopify/shopify-api` package and Shopify's expiring
offline-token OAuth flow (access token + refresh token, both with their own
expiry) -- not the legacy non-expiring offline token.

### Required environment variables

- `SHOPIFY_API_KEY`:
	- required
	- Shopify app Client ID
- `SHOPIFY_API_SECRET`:
	- required
	- Shopify app Client Secret; also used to verify OAuth callback and
	  webhook HMAC signatures
- `SHOPIFY_TOKEN_ENCRYPTION_KEY`:
	- required
	- base64-encoded 32-byte key used to encrypt stored access/refresh
	  tokens (AES-256-GCM). Generate with `openssl rand -base64 32`.
	  Never reuse another secret for this.
- `NEXT_PUBLIC_SITE_URL`:
	- required (already used by the Stripe integration)
	- must exactly match the app's public URL; used to build the OAuth
	  redirect URI (`${NEXT_PUBLIC_SITE_URL}/api/shopify/callback`), which
	  must also be allow-listed in the Shopify Partner app configuration.

### Required Shopify app configuration (outside this codebase)

Configure these as **app-specific webhook subscriptions** in the Shopify
Partner Dashboard (or `shopify.app.toml`, if this app later adopts the
Shopify CLI), all pointing at
`${NEXT_PUBLIC_SITE_URL}/api/shopify/webhook`:

- `app/uninstalled`
- `customers/data_request` (mandatory GDPR/privacy webhook)
- `customers/redact` (mandatory GDPR/privacy webhook)
- `shop/redact` (mandatory GDPR/privacy webhook)

The app requests only the `read_products` scope.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
