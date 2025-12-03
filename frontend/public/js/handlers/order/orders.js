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
    if ( paymentMethod === 'transfer') {

    }
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
      $("#order-code").text(`#${res.data._id}`);
    }
    const orderId = localStorage.getItem("qs_orderId")
    // Crear OrderItems llamando al endpoint
    if (orderId && Array.isArray(mappedItems) && mappedItems.length > 0) {
      try {
        for (const item of mappedItems) {
          await $.ajax({
            url: API_BASE_URL + `/api/orders/${orderId}/items`,
            method: "POST",
            headers: { Authorization: "Bearer " + token },
            contentType: "application/json",
            data: JSON.stringify({
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.price,
              subTotal: item.price * item.quantity
            }),
          });
        }
        console.log("OrderItems created successfully");
      } catch (err) {
        console.error("Error creating OrderItems:", err);
        // No lanzar error; la orden se creó, los items son secundarios
      }
    }

    // Mostrar modal según método de pago
    const confirmModal = document.getElementById("confirm");
    if (confirmModal) {
      const modalContent = confirmModal.querySelector(".modal-content");
      if (modalContent) {
        if (paymentMethod === 'transfer') {
          // Modal de transferencia
          modalContent.innerHTML = `
            <div class="modal-header">
              <h5 class="modal-title" id="confirmLabel">Instrucciones de Transferencia Bancaria</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body text-center p-4">
              <ul class="list-group mb-4">
                <li class="list-group-item"><strong>Nombre del Banco:</strong> Banco Ejemplo</li>
                <li class="list-group-item"><strong>Número de Cuenta:</strong> 1234567890</li>
                <li class="list-group-item"><strong>Tipo de Cuenta:</strong> Cuenta Corriente</li>
                <li class="list-group-item"><strong>Nombre del Titular:</strong> Queso & Sabor S.A.</li>
                <li class="list-group-item"><strong>RUT:</strong> 30-12345678-9</li>
                <li class="list-group-item"><strong>Monto:</strong> $${res.data.total.toLocaleString()}</li>
              </ul>    
              <h5>Adjunte su comprobante de transferencia</h5>
              <form id="comprobanteForm" class="py-4">
                <div class="mb-3">
                  <label for="comprobante" class="form-label">Subir Comprobante</label>
                  <input class="form-control" type="file" id="comprobante" accept="image/*,application/pdf" required>
                </div>
                <button type="submit" class="btn btn-primary">Enviar Comprobante</button>
              </form>
            </div>
          `;
        } else {
          // Modal de éxito (para otros métodos de pago)
          modalContent.innerHTML = `
            <div class="modal-header">
              <h5 class="modal-title" id="confirmLabel">Pedido Confirmado</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body text-center p-4">
              <i class="fa-solid fa-check fa-3x mb-3 text-success"></i>
              <h5 class="card-title mb-3">¡Gracias por tu compra!</h5>
              <p class="card-text mb-4">Tu pedido ha sido recibido y está siendo procesado.</p>
              <p id="orderNumber">Tu número de pedido: <strong id="order-code">${res.data.orderNumber}</strong></p>
              <a href="/frontend/public/index.html" class="btn btn-primary">Volver al inicio</a>
            </div>
          `;
        }
      }
    }

    await handleOrderConfirmed(res.data, token);

    return res;
  } catch (err) {
    console.error("Order create error status:", err.status);
    console.error("Order create error responseText:", err.responseText);
    console.error("Order create error responseJSON:", err.responseJSON);
    
    // Mostrar modal de error
    const confirmModal = document.getElementById("confirm");
    if (confirmModal) {
      const modalContent = confirmModal.querySelector(".modal-content");
      if (modalContent) {
        modalContent.innerHTML = `
          <div class="modal-header">
            <h5 class="modal-title" id="confirmLabel">Error en la Orden</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body text-center p-4">
            <i class="fa-solid fa-x fa-3x mb-3 text-danger"></i>
            <h5 class="card-title mb-3">Hubo un problema</h5>
            <p class="card-text mb-4">Por favor, ingresa todos los datos necesarios e intenta de nuevo.</p>
            <a href="/frontend/public/pages/checkout.html" class="btn btn-primary">Volver a intentar</a>
          </div>
        `;
      }
    }
    
    throw err;
  }
}

