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
	- **required** — there is no default. Amazon Merchant Products search will fail immediately with a configuration error if this is not set.
	- must be obtained from your own DataForSEO account by calling `GET https://api.dataforseo.com/v3/merchant/amazon/locations` (with your `DATAFORSEO_LOGIN`/`DATAFORSEO_PASSWORD`) and using the `location_code` from the entry whose `country_iso_code` matches your target market (e.g. `US`).
	- `2840` is **not** a confirmed valid value for this endpoint. It's DataForSEO's documented "United States" example for their general SERP/Keywords Data/Ads product lines, but Merchant Amazon Products location codes appear to use a different, 7-digit numbering space (documented examples in DataForSEO's own spec: `9045969`, `9041134`) — do not assume `2840` will work here, and do not guess a replacement value without confirming it against a real `/locations` response.
	- example: `DATAFORSEO_LOCATION_CODE=<value you obtained from the /locations endpoint for your market>`
- `DATAFORSEO_LANGUAGE_CODE`:
	- optional (default `en`)
	- language code for search

### Provider behavior

- If credentials are missing, the API returns `503`.
- No fake/mock fallback products are returned.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
