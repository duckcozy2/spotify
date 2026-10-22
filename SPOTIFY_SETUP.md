# Spotify profile lookup

## Public metadata lookup (used by the plan form)

`GET /api/spotify/lookup?input=UID` accepts a UID, user URI, or HTTPS profile link (`open.spotify.com` / `play.spotify.com`, including internationalized paths). `url` and `uid` query parameters are also accepted. No Spotify API credentials or customer sign-in are needed for this endpoint.

The response contains `{success, uid, display_name, avatar, profile_url, lookup_status, source}`. `found` requires a non-generic name, an HTTPS Spotify CDN avatar, and matching canonical/OG profile identity. Missing data, upstream errors, redirects, and timeouts return `unavailable` with null name/avatar. Invalid input returns HTTP 400. The form uses this endpoint after a 700 ms delay and cancels stale requests.

This is unofficial public metadata, not proof of account ownership. Spotify may block server fetches or omit metadata, so lookup is not guaranteed for every account. The form displays an error for unavailable metadata and does not treat the UID as a verified profile. Deploy with a Next.js server or Cloudflare OpenNext, not the old static `out/` directory.

## Legacy Web API endpoint

The `/api/spotify/profile` endpoint below is retained for compatibility. The plan form now uses `/api/spotify/lookup` instead.

After selecting a plan, entering a UID automatically starts a lookup after 700 ms and displays the name, avatar, and profile link. Changing the input cancels the previous lookup. If Spotify has no display name, the UI explicitly shows the UID instead.

API usage:

```http
POST /api/spotify/profile
Content-Type: application/json

{"uid":"your_spotify_uid"}
```

For a manual check, open `/api/spotify/profile?uid=your_spotify_uid` (GET). POST also accepts the previous `username` field. Both methods accept profile links and Spotify user URIs, and return `{id, name, hasDisplayName, image, url}`. Errors return `{error}` with an appropriate HTTP status. An expired access token is refreshed and retried once.

Run this site with a Next.js server (`npm run build`, then `npm start`) or a host supporting Next.js route handlers. Static `out/` hosting cannot run `/api/spotify/profile`; that directory may contain output from earlier builds and is no longer the deployment target.

Set `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET` in `.env.local` for local development, or in the hosting environment. Restart after changing them. Never prefix the secret with `NEXT_PUBLIC_` or commit it.

The lookup uses client credentials and `GET /v1/users/{id}`. The Spotify app must be allowed to access this endpoint. Spotify's 2026 Development Mode restrictions remove lookup of other users for affected apps; credentials alone do not grant this permission. A 403 is shown as unavailable, not as an invalid customer account. See:

- https://developer.spotify.com/documentation/web-api/reference/get-users-profile
- https://developer.spotify.com/documentation/web-api/tutorials/february-2026-migration-guide

If your app does not have access, the supported alternative is a separate Spotify authorization flow using `/v1/me`; this requires the customer to sign in with Spotify and is not implemented here.

The form accepts a Spotify user ID, profile URL, or Spotify user URI. Display names and email addresses are not lookup keys. Confirmation now creates an order with the current server price and a bank-transfer QR. SePay verifies the transfer before a NoDNS grant can be sent. See PAYMENT_SETUP.md for grant/cancel endpoints, key configuration, admin controls and uncertain-result handling.
