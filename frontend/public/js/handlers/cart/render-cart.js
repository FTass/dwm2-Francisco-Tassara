import { fetchCartItems } from "./cart-util.js";
$(document).on("click", '[data-bs-target="#cartDrawer"]', function () {
  loadCart();
});
$(async function () {
    
    await updateCartQuantity();
});

async function updateCartQuantity() {
    try {
        const cartId = await getOrCreateCartForCurrentUser();
        const token = localStorage.getItem("qs_token");
        const items = await fetchCartItems( cartId, token);
        
        let cont = 0;
    for(const item of items) {
        cont += item?.quantity ?? 1;
    }

    $("#productQuantity").text(cont)
  } catch (error) {
    console.error('Error actualizando cantidad del carrito:', error);
  }
}




async function loadCart() {
  const cartId = await getOrCreateCartForCurrentUser();
  const token = localStorage.getItem("qs_token");
  const items = await fetchCartItems( cartId, token )
  renderCartTable( items )
  if (!cartId) return;

}
  

async function renderCartTable(items) {
  if (!items.length) {
    $("#cartContent").html(`
      <div class="text-center text-muted py-4">
        <i class="fa-solid fa-cart-shopping fa-2x"></i>
        <p class="mt-2">Tu carrito está vacío</p>
      </div>
    `);
    return;
  }

  let rows = "";

  for (const item of items) {
    let imageUrl = "https://via.placeholder.com/300x200?text=No+Disponible";

    if (item.productId) {
      const productId =
        typeof item.productId === "string"
          ? item.productId
          : item.productId._id;

      try {
        const imgRes = await $.get(
          `${API_BASE_URL}/api/products/${productId}/images`,
          { productId }
        );

        const imgs = imgRes?.data ?? [];
        const primary = imgs.find((i) => i.isPrimary) || imgs[0];

        if (primary?.url) {
          imageUrl = primary.url;
        }
      } catch (err) {
        console.error("Error cargando imagen del producto:", err);
      }
    }

    const name = item.productId?.name ?? "Producto sin nombre";
    const price = Number(item.productId?.price ?? 0);
    const qty = Number(item.quantity ?? 1);
    const subtotal = price * qty;
    rows += `
      <tr>
        <td style="width: 70px;">
          <img src="${imageUrl}"
              class="img-fluid rounded" style="height:60px;object-fit:cover;">
        </td>

        <td>
          <strong>${name}</strong><br>
          <small>$${price.toLocaleString("es-CL")}</small>
        </td>

        <td style="width: 80px;">
          <input 
            type="number" 
            min="1" 
            class="form-control form-control-sm text-center updateQty" 
            data-item-id="${item._id}"
            value="${qty}">
        </td>

        <td class="text-end">
          <strong>$${subtotal.toLocaleString("es-CL")}</strong>
        </td>

        <td class="text-end" style="width:50px;">
          <button id = "deleteItem" class="btn btn-sm btn-outline-danger deleteItemBtn"
                  data-item-id="${item._id}">
            <i class="fa-solid fa-trash"></i>
          </button>
        </td>
      </tr>
    `;
  }

  const tableHTML = `
    <table class="table-responsive table-sm align-middle">
      <tbody>
        ${rows}
      </tbody>
    </table>
  `;

  $("#cartContent").html(tableHTML);
}

$(document).on("click", ".deleteItemBtn", function () {
  const itemId = $(this).data("item-id");
  if (!itemId) return;

  deleteItem(itemId);
  updateCartQuantity();
});

async function deleteItem(itemId) {
  const token = localStorage.getItem("qs_token");
  if (!token) {
    alert("Debes iniciar sesión nuevamente");
    window.location.href = "/pages/login.html";
    return;
  }

  const cartId = await getOrCreateCartForCurrentUser();
  if (!cartId) return;

  $.ajax({
    url: `${API_BASE_URL}/api/carts/${cartId}/items/${itemId}`,
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + token,
    },
  })
    .done(function (response) {
      console.log("Borrado correctamente", response);
      loadCart();
    })
    .fail(function (err) {
      console.error("Error al borrar", err);
      alert("No se pudo eliminar el producto del carrito.");
    });
}

