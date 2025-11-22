const API_BASE_URL = "http://localhost:3000";

document.addEventListener("DOMContentLoaded", async () => {
  const items = await fetchCartItems();
  renderCartPage(items);
});

async function fetchCartItems() {
  const cartId = await getOrCreateCartForCurrentUser();
  const token = localStorage.getItem("qs_token");

  if (!cartId || !token) return [];

  return new Promise((resolve, reject) => {
    $.ajax({
      url: `${API_BASE_URL}/api/carts/${cartId}/items`,
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .done((res) => resolve(res.data ?? []))
      .fail((err) => {
        console.error("Error cargando carrito:", err);
        resolve([]); 
      });
  });
}

async function renderCartPage(items) {
  const $tbody = $("#cartTableBody");

  if (!items.length) {
    $tbody.html(`
      <tr>
        <td colspan="4" class="text-center text-muted">
          Tu carrito está vacío
        </td>
      </tr>
    `);

    $("#cartSubtotal").text("$0");
    $("#cartShipping").text("$0");
    $("#cartTotal").text("$0");
    return;
  }

  let rows = "";
  let subtotal = 0;

  for (const item of items) {
    let imageUrl =
      "https://via.placeholder.com/300x200?text=No+Disponible";

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
    const rowSubtotal = price * qty;

    subtotal += rowSubtotal;

    rows += `
      <tr>
        <td>
          <div class="d-flex align-items-center gap-3">
            <img
              src="${imageUrl}"
              class="rounded"
              style="width: 64px; height: 64px; object-fit: cover"
              alt="Queso"
            />
            <div>
              <div class="fw-semibold">${name}</div>
              <small class="text-muted">
                ID: ${item.productId?._id ?? ""}
              </small>
            </div>
          </div>
        </td>
        <td class="text-center">$${price.toLocaleString("es-CL")}</td>
        <td class="text-center">${qty}</td>
        <td class="text-end fw-semibold">
          $${rowSubtotal.toLocaleString("es-CL")}
        </td>
      </tr>
    `;
  }

  $tbody.html(rows);

  const shipping = 0;
  const total = subtotal + shipping;

  $("#cartSubTotal").text(`$${subtotal.toLocaleString("es-CL")}`);
  $("#cartShipping").text(`$${shipping.toLocaleString("es-CL")}`);
  $("#cartTotal").text(`$${total.toLocaleString("es-CL")}`);
}
