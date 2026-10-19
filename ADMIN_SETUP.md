# Admin

Open `/admin`. The local login password is `ADMIN_PASSWORD` in `.env.local`. This file is ignored by Git. Restart the development server after changing environment variables. No password is embedded in the frontend.

Production needs `ADMIN_PASSWORD` and a random `ADMIN_SESSION_SECRET` of at least 32 characters. Serve over HTTPS so the secure session cookie works. Login sessions expire after eight hours. Logging out clears the cookie. Every order mutation checks authentication on the server.

## Included

- Overview showing real manually entered orders. Revenue includes paid orders except canceled orders.
- Order search, status filtering, creation, processing status, and paid flag.
- Package price editing, reflected on public pricing cards and new manual orders. Existing orders keep their original amounts. Editorial article prices need a separate review after price changes.
- Article search and links to published pages. Editing article and package content still takes place in source files.
- Configuration health checks without exposing secrets.
- Percentage coupon creation, expiry date, enable/disable, and application to manual orders.
- Public contact link editing and a dismissible website announcement.
- Revenue by day/month/all time using Vietnam time and the recorded payment timestamp; canceled orders are excluded.

The sidebar follows the provided reference, excluding collaborators. SePay and NoDNS screens explicitly remain disconnected until their service credentials, endpoint documentation, and payment reconciliation requirements are supplied. No fabricated transactions or success states are displayed. Article editing is still source-based, not a CMS.

The customer signup form is not connected to order creation or payments. Creating an order here does not activate Spotify or charge a customer.

## Storage

Orders are stored in `.data/orders.json` by default, outside public assets and ignored by Git. Set `ADMIN_DATA_DIR` to a private persistent volume for deployment. Writes are serialized within one Node.js process and replace the file atomically. This setup supports a single application process with durable local storage. Serverless deployments, multiple replicas, or high traffic need a database instead. Back up the data directory and restrict access to it.

The UI is an independent admin dashboard for this project. The private admin interface of locketgold.info was not available for inspection, so this is not an exact reproduction.
