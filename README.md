# Just Salad

A responsive React/Vite restaurant website and Express/MongoDB API based on the supplied six-page menu PDF. The public menu is for browsing and enquiries only; online ordering and checkout are not exposed.

## Menu extraction

See [the extraction summary](docs/menu-extraction-summary.md) before using the menu commercially. It records all 41 items and pricing ambiguities. Source data: `server/src/data/menu.json`. Items with unresolved prices have `price: null` and are shown as pending. Product imagery remains replaceable artwork.

## Requirements and setup

- Node.js 20+
- MongoDB Atlas or a local MongoDB instance for admin data and corporate enquiries

```sh
cp server/.env.example server/.env
cp client/.env.example client/.env
npm install
npm run dev
```

The client starts at `http://localhost:5173`; the API starts at `http://localhost:4000`. The menu can be browsed without MongoDB. Corporate enquiry storage and database-backed admin features require a reachable `MONGODB_URI`.

The site includes admin-configurable subscription plans and saved subscription enquiries, a validated corporate enquiry form, and the official Instagram profile link. Subscription prices stay unpublished until configured by an administrator. Menu card photos are illustrative category photography, not exact product photos. `client/.env.example` includes the restaurant-provided WhatsApp number in international digits-only format (`919607599959`). Copy it to `client/.env` to enable ordering; if the number changes, update `VITE_WHATSAPP_NUMBER` there using country code and subscriber digits only, with no `+`, spaces, or punctuation. The cart refreshes menu prices and availability from the API before opening a prefilled click-to-chat message. Customers must press Send in WhatsApp; this does not save orders to the website or confirm acceptance. WhatsApp Cloud API credentials belong only in `server/.env`. The inbox/webhook connection is not active until those credentials and webhook setup are implemented and verified; the site does not claim a live synchronized inbox.

Set `JWT_SECRET` to a unique random secret of at least 32 characters. Public registration only creates customer accounts. To provision the first administrator, configure a one-time `ADMIN_EMAIL` and `ADMIN_PASSWORD` of at least 12 characters in the server environment and run `npm --workspace server run seed:admin` before exposing the app; it refuses to promote or reset an existing account. Remove the bootstrap password from the environment afterward. Keep secrets in `server/.env` and out of the client. Auth uses short-lived HttpOnly SameSite cookies.

## Menu seeding

```sh
npm run seed
```

The idempotent upsert seeds PDF-derived products with `source: "pdf-menu"`. Unpriced entries seed unavailable. The script requires `MONGODB_URI`.

## Scripts

```sh
npm run dev
npm run dev:client
npm run dev:server
npm run build
npm test
```

## Configuration and external services

- **Swiggy:** The button is hidden until `VITE_SWIGGY_LISTING_URL` is set to the verified restaurant listing URL in `client/.env`. No URL was supplied or inferred. Future order synchronization requires an authorized Swiggy or order-management API agreement, credentials, webhook signing details, and documented status/menu capabilities. This code does not scrape Swiggy.
- **Fees/tax:** No delivery fee or tax was supplied. These remain zero/unconfigured; the UI states they are excluded. Configure real business rules before enabling checkout.
- **Payments:** No provider or credentials were supplied. Payment initiation is disabled, and created orders are explicitly unpaid. A production integration must create provider orders server-side, verify signatures/webhooks, deduplicate webhook event IDs, reconcile amounts, and only mark an order paid after provider verification. Never put provider secrets in the client.
- **Images/reviews:** Artwork is a decorative placeholder. No customer reviews were supplied, so none are fabricated.

## API overview

All endpoints return JSON except logout (204). Validation errors use 4xx responses; unexpected errors are sanitized.

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/api/health` | Liveness check |
| GET | `/api/config` | Public enabled integrations |
| GET | `/api/menu` | Full menu; optional `category` and `q` filters |
| GET | `/api/menu/categories` | Source category labels |
| GET | `/api/menu/:id` | Menu item |
| POST | `/api/auth/register` | Register (name, email, password, optional phone) |
| POST | `/api/auth/login` | Login; sets HttpOnly session cookie |
| POST | `/api/auth/logout` | Clear session cookie |
| GET/PATCH | `/api/auth/me` | Read/update own profile |
| POST | `/api/orders` | Authenticated order request; prices read server-side; unpaid |
| GET | `/api/orders/mine` | Own order history |
| GET | `/api/admin/overview` | Admin counts and verified-paid revenue |
| GET | `/api/admin/analytics/sales` | Daily and category aggregates from verified paid orders |
| GET | `/api/admin/orders` | Recent orders for admins |
| PATCH | `/api/admin/orders/:id/status` | Admin status update |
| GET | `/api/admin/products` | Admin product list |
| POST/PATCH | `/api/admin/products` | Create or edit a product (admin only) |
| PATCH | `/api/admin/products/:id/availability` | Admin availability control |

Auth cookies use `HttpOnly`, `SameSite=Lax`, and `Secure` in production. Helmet, CORS allowlisting, JSON body limits, rate limits, Zod input checks, password hashing, order ownership scoping, and role checks are in place. Deployment should use HTTPS and an explicit trusted frontend origin.

## Production deployment

1. Provision MongoDB Atlas, a Node host, and a static frontend host.
2. Set server environment variables from `server/.env.example`, restrict Atlas network access to the API host, and use a strong `JWT_SECRET`.
3. Build with `npm run build`; run `npm run seed` once against the intended database; start the API with `npm --workspace server start`.
4. Set `CLIENT_ORIGIN` to the deployed frontend origin. Configure the frontend API base and verified Swiggy URL only if provided.
5. Deploy the Vite `client/dist` output. Configure SPA fallback to `index.html` and API CORS to the exact production origin.
6. Payment, fees/taxes, full admin product editing, and external order synchronization need business/provider credentials and implementation before accepting live orders

## Tests

Menu tests assert item count, source-priced filtering, and explicit unresolved prices; API tests verify the menu routes and authentication gates. Run `npm test`. Authentication, payment, and database integration tests should be extended with a disposable MongoDB test database before production release. The current dependency lockfile was audited with zero known vulnerabilities.
