import { fetchCartItems } from "../cart/cart-util.js";
import { handleOrderConfirmed } from "./order.confirmed.js";

const API_BASE_URL = "http://localhost:3000";


$(document).on("click", '[data-bs-target="#confirm"]', async () => {
  try {
    const token = localStorage.getItem("qs_token");

    if (!token) {
      alert("Debes iniciar sesión para seguir con tu orden");
      setTimeout(() => {
        window.location.href = "/frontend/public/pages/login.html";
      }, 3000);
      return;
    }

    const items = await fetchCartItems();
    console.log("Items del carrito al confirmar:", items);

    await createOrder(items);
  } catch (err) {

    console.error("Error al confirmar orden:", err);
    $("#icon").attr("class", "fa-solid fa-x")
    $("#confirmLabel").text("ERROR");
    $("#modalBodyText").text("Ingresa todos los datos necesarios");
    $("#received").remove();
    $("#orderNumber").remove();
    $("#goBack").text("volver a intentar");
    $("#goBack").removeAttr("href");
    $("#goBack").attr("data-bs-dismiss", "modal");


  }
});

async function createOrder(items) {
  const token = localStorage.getItem("qs_token");

  if (!token) {
    alert("Debes iniciar sesión para seguir con tu orden");
    setTimeout(() => {
      window.location.href = "/pages/login.html";
    }, 3000);
    return null;
  }

  // Si no pasaron items, los pedimos de nuevo
  if (!items) {
    items = await fetchCartItems();
  }

  // Leer montos calculados por fillResume (valores numéricos crudos)
  let subTotal = Number(localStorage.getItem("qs_subtotal"));
  let tax      = Number(localStorage.getItem("qs_tax"));
  let total    = Number(localStorage.getItem("qs_total"));

  const hasValidTotals =
    Number.isFinite(subTotal) &&
    Number.isFinite(tax) &&
    Number.isFinite(total) &&
    subTotal >= 0 &&
    total >= 0;

  // Fallback: si por alguna razón los totales no son válidos, recalcular desde items
  if (!hasValidTotals && Array.isArray(items) && items.length) {
    subTotal = 0;

    for (const it of items) {
      const price = Number(it.productId?.price ?? it.price ?? 0);
      const qty   = Number(it.quantity ?? 1);
      subTotal += price * qty;
    }

    tax   = Math.round(subTotal * 0.19 * 100) / 100;
    total = Math.round((subTotal + tax) * 100) / 100;
  }

  // userId (por si tu backend lo espera en el body)
  let userId = localStorage.getItem("qs_userId");
  if (!userId) {
    const savedUser = JSON.parse(localStorage.getItem("qs_user") || "null");
    userId = savedUser?._id || null;
  }

  const status = "pending_payment";

  // Normalizar items al formato mínimo esperado por el backend
  const mappedItems = Array.isArray(items)
    ? items.map((it) => ({
        productId: it.productId?._id || it.productId,
        quantity: Number(it.quantity ?? 1),
        price: Number(it.productId?.price ?? it.price ?? 0),
      }))
    : [];

  const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 9000 + 1000)}`;

  const addressId     = localStorage.getItem("qs_addressId") || null;
  const paymentMethod = localStorage.getItem("qs_paymentMethod") || null;

  const payload = {
    orderNumber,
    userId,
    addressId,
    status,
    subTotal,
    tax,
    total,
    items: mappedItems,
    paymentMethod,
  };

  console.log("Order payload a enviar:", payload);

  try {
    const res = await $.ajax({
      url: API_BASE_URL + "/api/orders",
      method: "POST",
      headers: { Authorization: "Bearer " + token },
      contentType: "application/json",
      data: JSON.stringify(payload),
    });

    console.log("Order created:", res);

    if (res?.data?._id) {
      localStorage.setItem("qs_orderId", res.data._id);
    }

    if (res?.data?.orderNumber) {
      $("#order-code").text(`#${res.data.orderNumber}`);
    }

    // Resetear el modal a estado de éxito
    const confirmModal = document.getElementById("confirm");
    if (confirmModal) {
      // Limpiar contenido de error si existe
      const modalContent = confirmModal.querySelector(".modal-content");
      if (modalContent) {
        modalContent.innerHTML = `
          <div class="modal-header">
            <h5 class="modal-title" id="confirmLabel">Pedido Confirmado</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body text-center p-4">
            <i class="fa-solid fa-check fa-3x mb-3 text-success"></i>
            <h5 class="card-title mb-3">¡Gracias por tu compra!</h5>
            <p class="card-text mb-4">Tu pedido ha sido recibido y está siendo procesado.</p>
            <p id="orderNumber">Tu numero de pedido <span id="order-code">${res.data.orderNumber}</span> </p>
            <a href="/frontend/public/index.html" class="btn btn-primary">Volver al inicio</a>
          </div>
        `;
      }
    }

    await handleOrderConfirmed(res.data, token);

    return res;
  } catch (err) {
    console.error("Order create error status:", err.status);
    console.error("Order create error responseText:", err.responseText);
    console.error("Order create error responseJSON:", err.responseJSON);
    
    // Mostrar modal de error
    $("#icon").attr("class", "fa-solid fa-x");
    $("#confirmLabel").text("ERROR");
    $("#modalBodyText").text("Ingresa todos los datos necesarios");
    
    // Limpiar elementos de éxito si existen
    $("#received").remove();
    $("#orderNumber").remove();
    
    // Cambiar texto del botón
    $("#goBack").text("Volver a intentar");
    $("#goBack").attr("href", "/frontend/public/pages/checkout.html");
    
    throw err;
  }
}
