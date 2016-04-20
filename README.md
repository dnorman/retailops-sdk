[![RetailOps SDK](http://cdn2.hubspot.net/hubfs/530512/Image/logo.png)](http://retailops.com)

### RetailOps SDK

Using the RetailOps SDK, you can create, test, and certify custom integrations for use with RetailOps.

- [Channel Integrations](#channel-integrations)
- [Shipper Integrations (coming soon)](#shipper-integrations)

## Channel Integrations

A channel is a source of orders.
RetailOps, serves as the system-of-record for catalog/product data.
It pushes this catalog data out to "Channels" (Storefronts, marketplaces, etc) which in turn take customer orders for said products.
RetailOps then pulls this order information, fulfills said orders, and pushes status / edit information back to the channel in question.

### Channel Interactions:

- Catalog Get Config - Configuration information about Catalog Push
- Catalog Push - New product information and product updates
- Inventory Push - Inventory updates
- Order Pull - Fetch new orders from the channel which are ready
- Order Acknowledge - Mark specific fetched orders has having been picked up
- Order Update - Update channel order information to reflect order items which have been updated, added, or removed in RetailOps
- Order Cancel - Mark an order as canceled in the channel
- Order Shipment Submit - Convey shipping status and tracking information to the channel
- Order Complete - Mark an order as fully completed in the channel
- Order Settle Payment - Cause the channel to collect/capture payment, or otherwise verify payment has been collected
- Items Returned - Notify the channel that a return has been processed against the order

## Shipper Integrations

*Coming soon*



