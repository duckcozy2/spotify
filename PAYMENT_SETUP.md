# MB Bank / SePay

Bank: MB Bank (970422), account 5565662518, holder HO DANG ANH DUC.

Checkout creates an order using the current admin price on the server, then displays a VietQR image with its exact amount and unique `SP` transfer code. The QR expires after 30 minutes. Polling only reads status; it cannot mark an order paid. Closing the dialog does not cancel an existing bank transfer or order. Keep the transfer code for support.

## Cloudflare

1. Run `npx wrangler login` with the account that owns the Spotify Worker.
2. Run `npx wrangler d1 create spotify-db`. Replace the zero placeholder `database_id` in `wrangler.jsonc` with the returned ID. Use a separate database from Locket Gold.
3. Run `npx wrangler d1 migrations apply spotify-db --remote`.
4. Set `SEPAY_WEBHOOK_API_KEY` with `npx wrangler secret put SEPAY_WEBHOOK_API_KEY`. Use a random secret; do not put it in source or frontend variables. The local development key is in the ignored `.env.local` if generated during setup. Set other existing admin/Spotify secrets separately.
5. Build and deploy using the project's usual `npm run deploy` workflow.

Local development uses `.data/` files unless a D1 binding is available. With a local D1 binding, run `npx wrangler d1 migrations apply spotify-db --local` first. File-based data is not automatically migrated to D1: transfer existing orders/settings before switching a live installation. Admin prices and orders now share the same storage as checkout.

## SePay dashboard

Add a **new webhook** for Spotify on the existing linked MB account. Keep the Locket Gold webhook unchanged.

- URL: `https://<your-Spotify-domain>/api/sepay/webhook`
- Event: incoming money / Có tiền vào
- Bank account: MB Bank 5565662518
- Payment code prefix: `SP` (Locket Gold continues to use `LG`)
- Authentication: API Key; enter the same `SEPAY_WEBHOOK_API_KEY` as the Spotify Worker. SePay sends `Authorization: Apikey <key>`.

Enable the webhook and verify a real test transfer. A successful test delivery alone does not prove reconciliation: the account, bank, positive transaction ID, exact amount, order code, order status and deadline must match a real order. Repeated transaction IDs cannot pay another order. Underpayments, overpayments, expired/canceled orders and unrelated bank transfers require manual review and do not automatically mark paid.

## Premium activation

Confirmed transfers mark the order paid and processing, then call `POST https://ctv.nodns.vn/api/v1/spotify` with server-only `x-api-key` and `{uid, packageId}`. Package codes are `1month`, `3month`, `6month`, `12month`. Configure `NODNS_API_KEY` in the Worker or save it in **Admin → API NoDNS**. Saving keys there uses private storage and overrides the environment value; blank inputs preserve existing keys.

The order becomes completed only after an explicit `success: true` or `status: "success"` response without contradictory UID/package/activity fields. Other response shapes are left for review, not assumed successful. No live grant/cancel request is needed to open or configure the admin pages.

**Admin → Quản trị NoDNS** shows paid orders needing activation and the operation history. An atomic per-account lock prevents concurrent mutations. Timeouts, 5xx responses and unrecognized results are recorded as uncertain and are not automatically retried. After checking the real result with NoDNS, an admin can record that review; only a confirmed non-execution allows a new attempt. A pending operation older than a minute can also be reviewed after checking the provider. A crash after claiming work is visible as pending and requires this review.

**Admin → Hủy Premium** sends `POST https://ctv.nodns.vn/api/v1/spotify/cancel` with `{uid}` from a paid, completed order. The operator must type the exact UID. This revokes the account's Premium, not just an isolated order, and does not issue a refund. Confirmed results are persisted before updating internal order state. Repeating a confirmed operation repairs local order state without sending the API again.

**Admin → Giao dịch SePay** includes up to 500 authenticated transaction notifications with match/rejection reasons, duplicate delivery counts and order links. This is webhook history, not an API pull of the entire bank statement. Configure the same webhook key in SePay after changing it in the admin. Keep the existing `LG` webhook for Locket Gold and use `SP` for Spotify.

Reference: https://developer.sepay.vn/vi/sepay-webhooks/bao-mat and https://docs.sepay.vn/tao-qr-code-vietqr-dong.html
