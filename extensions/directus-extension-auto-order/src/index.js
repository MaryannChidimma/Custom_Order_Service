/*
  Update the hook to perform 

  - Whenever a product is updated, check if product's quantity is updated to zero
  - Check if product's suppliers have auto_order set to true
  - If yes, create order for this supplier and add the product to the order.
  - Set the order status as "created"

*/
export default ({action}, context) => {

  action('product.items.update', async (input) => {
    console.log(`products were updated`);
    
  });
};
