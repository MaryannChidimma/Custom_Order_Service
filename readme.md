# Instructions

## Prerequisites

* Node.js and npm (tested using Node.js v18.16.0 and Debian WSL)

## Configure database

Add .env file to project root folder. (This is provided separately).

The .env file includes settings for preconfigured Postgres instance in Google Cloud Platform.

## Start and log in to Directus admin interface

Clone the repo and run `npm install`.

Run `npx directus start` to start the service and log in via `http://localhost:8055`.

* username: admin@example.com
* password: T8il5E2-e8yy

## Take a look around

In Navigation > Settings > Data model you can view available collections. 

The collections correspond to tables in Postgres database. New collections can be create or existing collections can be updated through Directus interface.

You can view Directus documentation from Navigation > Documentation.

## Data model

There are 3 collections:

### 1. Product 

These are the the inventory items. They have many-to-many relationship with Supplier (A single product can be sourced from many suppliers and a single supplier can offer multiple products)

### 2. Supplier

These are suppliers for the products. There is auto_order field which controls if an order should be made to supplier if product quantity reaches zero.

### 3. Order

Supplier orders are made to re-fill the quantity of products. 

Order has many-to-many relationship with product (an order can have multiple products and product can be part of multiple orders).

Order has many-to-one relationship with supplier (an order can have only one supplier, but there can be many orders for a supplier).

## Task

The task is write custom Directus extension that performs order creation.

Complete the extension "directus-extension-auto-order" by updating the code in `extensions/directus-extension-auto-order/src/index.js`.

* Whenever a product is updated, check if product's quantity is updated to zero
* Check if product's suppliers have auto_order set to true
* If yes, create order for this supplier and add the product to the order.
* Set the order status as "created"

In other words, when the extension is functional, an order should be automatically created in order collection if product's quantity is updated to zero and if product's supplier has auto_order set to true.

When ready, provide the contents of file `extensions/directus-extension-auto-order/src/index.js` via email.

## Helpful notes

* You only need to modify `extensions/directus-extension-auto-order/src/index.js` 

* Run `npm run dev` in the extension folder (`extensions/directus-extension-auto-order`), so the extension is automatically built for Directus whenever there are file changes.

* Whenever you update the extension source code, you need to restart Directus (run `npx directus start` in project root folder). Otherwise Directus won't pick up the updates.

* There are multiple ways to achieve the goal. Use Directus documentation to find the best approach.












