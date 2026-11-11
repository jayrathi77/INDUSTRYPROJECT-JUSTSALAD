# Swiggy integration

Only use a restaurant listing URL verified by the business. Put it in `client/.env` as `VITE_SWIGGY_LISTING_URL`; the link is omitted when this value is absent or is not HTTPS. No Swiggy URL was present in the supplied materials.

This project does not scrape Swiggy or call private endpoints. Order ingestion, order-status updates, and availability synchronization remain future work. They need an authorized Swiggy/OMS integration, merchant approval, API documentation, credentials, webhook verification method, event deduplication strategy, and operational agreement for menu/order ownership. Until that is provided, ordering is an outbound listing link only.
