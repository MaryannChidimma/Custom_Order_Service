import axios from "axios";
import env from "dotenv";
env.config();
/*
  Update the hook to perform 

  - Whenever a product is updated, check if product's quantity is updated to zero
  - Check if product's suppliers have auto_order set to true
  - If yes, create order for this supplier and add the product to the order.
  - Set the order status as "created"

*/

export default ({ action }, context) => {
  action("product.items.update", async (input) => {
    console.log(`products were updated`);
    if (input.payload.quantity === 0) {
      const apiUrl = "http://localhost:8055";
      const email = process.env.CONNECTION_EMAIL || "admin@example.com";
      const password = process.env.CONNECTION_PASSWORD || "T8il5E2-e8yy";

      (async () => {
        try {
          // Login to Directus
          const loginResponse = await axios.post(`${apiUrl}/auth/login`, {
            email,
            password,
          });
          const { access_token: token } = loginResponse.data.data;

          // Fetch products
          const productsResponse = await axios.get(
            `${apiUrl}/items/product/${input.keys[0]}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const [supplier] = productsResponse.data.data.supplier;

          // Fetch product_supplier
          const productSupplierResponse = await axios.get(
            `${apiUrl}/items/product_supplier/${supplier}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const psRes = productSupplierResponse.data.data;

          // Fetch supplier
          const supplierResponse = await axios.get(
            `${apiUrl}/items/supplier/${psRes.supplier_id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const supplierData = supplierResponse.data.data;
          if (supplierData.auto_order) {
            //create an order
            const orderData = {
              status: "created",
              supplier: supplierData.id,
              products: {
                create: [
                  {
                    order_id: "+",
                    product_id: {
                      id: input.keys[0]
                    }
                  }
                ],
                update: [],
                delete: []
              }
            };
            const createOrderResponse = await axios.post(
              `${apiUrl}/items/order`,
              orderData,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            const createdOrder = createOrderResponse.data.data;
            console.log("Created order:", createdOrder);
          }
        } catch (error) {
          console.error("Error fetching and creating product:", error);
        }
      })();
    }
  });
};
