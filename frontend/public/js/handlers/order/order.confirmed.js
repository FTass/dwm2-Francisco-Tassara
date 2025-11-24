
const API_BASE_URL = "http://localhost:3000";


async function createPayment(orderId, total, paymentMethod, token) {
  try {
    const paymentPayload = {
      amount: total,
      method: paymentMethod || "pending",
      status: "pending",
    };

    const paymentRes = await $.ajax({
      url: API_BASE_URL + `/api/orders/${orderId}/payments`,
      method: "POST",
      headers: { Authorization: "Bearer " + token },
      contentType: "application/json",
      data: JSON.stringify(paymentPayload),
    });

    console.log("Payment created:", paymentRes);
    return paymentRes;
  } catch (err) {
    console.error("Error creating payment:", err);
    
  }
}


async function createShipping(orderId, token) {
  try {
    const shippingPayload = {
      status: "pending",
      
    };

    const shippingRes = await $.ajax({
      url: API_BASE_URL + `/api/orders/${orderId}/shipping`,
      method: "POST",
      headers: { Authorization: "Bearer " + token },
      contentType: "application/json",
      data: JSON.stringify(shippingPayload),
    });

    console.log("Shipping created:", shippingRes);
    return shippingRes;
  } catch (err) {
    console.error("Error creating shipping:", err);
    
  }
}


function cleanupOrderStorage() {
  const keysToRemove = [
    "qs_cartId",
    "qs_cart",
    "qs_address",
    "qs_addressId",
    "qs_paymentMethod",
    "qs_subtotal",
    "qs_tax",
    "qs_total",
  ];

  keysToRemove.forEach((key) => {
    localStorage.removeItem(key);
  });

}


export async function handleOrderConfirmed(orderData, token) {
  try {
    const orderId = orderData?._id || orderData?.data?._id;
    const total = orderData?.total || orderData?.data?.total;
    const paymentMethod = localStorage.getItem("qs_paymentMethod");

    if (!orderId) {
      console.warn("No orderId found in orderData, skipping post-confirmation tasks");
      return;
    }

    console.log("Order confirmed, handling post-confirmation tasks...");

   
    cleanupOrderStorage();

    console.log("Order confirmed workflow completed successfully");
  } catch (err) {
    console.error("Error in handleOrderConfirmed:", err);
    // Igualmente limpiar localStorage aunque haya errores menore
    cleanupOrderStorage();
  }
}
