

const API_BASE_URL = "http://localhost:3000";

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
    // "qs_orderId",
  ];

  keysToRemove.forEach((key) => {
    localStorage.removeItem(key);
  });
}

export async function handleOrderConfirmed(orderData, token) {
  try {
    const orderId = orderData?._id || orderData?.data?._id;

    if (!orderId) {
      console.warn("No orderId found in orderData, skipping cleanup");
      return;
    }

    console.log("✓ Order confirmed successfully:", orderId);
    console.log("✓ Payment y Shipping creados automáticamente");

    // Limpiar localStorage después de confirmar
    cleanupOrderStorage();

    console.log("✓ Order workflow completed successfully");
  } catch (err) {
    console.error("Error in handleOrderConfirmed:", err);
    cleanupOrderStorage();
  }
}

export async function getOrder( orderId) {
  const token = localStorage.getItem("qs_token");
  try {
    const res =  await $.ajax({
    url: API_BASE_URL + `/api/orders/${orderId}`,
    method: "GET",
    headers: { Authorization: "Bearer " + token },
    contentType: "application/json",
    });
    return res.data;
  } catch ( err ){
    console.error("Error al obtener items:", err);
    return;
  }
}

export async function getOrderItems( orderId ) {
  const token = localStorage.getItem("qs_token");
  try {
    const res = await $.ajax({
    url: API_BASE_URL + `/api/orders/${orderId}/items`,
    method: "GET",
    headers: { Authorization: "Bearer " + token },
    contentType: "application/json",
    });
    return res.data || [];
  } catch ( err ){
    console.error("Error al obtener items:", err);
    return [];
  }
}
