console.log("handler  carrito cargado");

let currentCartId = null;

async function getOrCreateCartForCurrentUser() {
  if (currentCartId) {
    console.log("[getOrCreateCart] Using cached cartId:", currentCartId);
    return currentCartId;
  }

  // 2. Revisar localStorage
  const stored = localStorage.getItem("qs_cartId");
  const token = localStorage.getItem("qs_token");

  if (!token) {
    console.warn("[getOrCreateCart] No token found");
    return null;
  }

  if (stored) {
    console.log("[getOrCreateCart] Validating stored cartId:", stored);
    try {
      const res = await $.ajax({
        url: API_BASE_URL + `/api/carts/${stored}`,
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      if (res.data && res.data._id) {
        console.log("[getOrCreateCart] ✓ Cart exists in DB");
        currentCartId = stored;
        return stored;
      }
    } catch (err) {
      console.warn("[getOrCreateCart] Stored cartId not found in DB, creating new one");
      localStorage.removeItem("qs_cartId");
    }
  }

  try {
    console.log("[getOrCreateCart] Fetching user carts...");
    const res = await $.ajax({
      url: API_BASE_URL + "/api/carts",
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    const carts = res.data || [];
    if (carts.length > 0) {
      const cartId = carts[0]._id;
      console.log("[getOrCreateCart] ✓ Found existing cart:", cartId);
      currentCartId = cartId;
      localStorage.setItem("qs_cartId", cartId);
      return cartId;
    }

    console.log("[getOrCreateCart] Creating new cart...");
    const createRes = await $.ajax({
      url: API_BASE_URL + "/api/carts",
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
      },
      contentType: "application/json",
      data: JSON.stringify({}),
    });

    if (createRes.data && createRes.data._id) {
      const newCartId = createRes.data._id;
      console.log("[getOrCreateCart] ✓ New cart created:", newCartId);
      currentCartId = newCartId;
      localStorage.setItem("qs_cartId", newCartId);
      return newCartId;
    }

    throw new Error("Invalid response structure");
  } catch (err) {
    console.error("[getOrCreateCart] Error:", err);
    alert("Ocurrió un problema con tu carrito. Intenta nuevamente.");
    return null;
  }
}

async function addProductToCart(productId, quantity = 1, productName) {
  if (!productId) {
    console.warn("Se requiere id de producto");
    return;
  }

  if (typeof quantity !== "number" || quantity <= 0) {
    console.warn("Cantidad invalida");
    return;
  }

  const token = localStorage.getItem("qs_token");

  if (!token) {
    alert("Debes iniciar sesión para agregar productos al carrito");
    window.location.href = "/frontend/public/pages/login.html";
    return null;
  }

  const cartId = await getOrCreateCartForCurrentUser();
  console.log("[addProductToCart] cartId:", cartId);

  if (!cartId) {
    console.warn("No se pudo obtener id del carrito");
    return;
  }

  // CAMBIO: devuelve una Promise y espera la respuesta
  return new Promise((resolve, reject) => {
    $.ajax({
      url: API_BASE_URL + `/api/carts/${cartId}/items`,
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
      },
      contentType: "application/json",
      data: JSON.stringify({
        productId,
        quantity,
      }),
    })
      .done(function (res) {
        console.log("✓ CartItem OK:", res);
        const nameToShow = productName || res?.data?.productId?.name || "producto";
        
        // Crear y mostrar toast
        const toastHTML = `
          <div role="alert" aria-live="assertive" aria-atomic="true" class="toast" data-bs-autohide="true" data-bs-delay="3000">
            <div class="toast-header">
              <i class="fa-solid fa-cart-shopping fa-2x"></i>
              <strong class="me-auto">Carrito</strong>
              <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">
              ${nameToShow} añadido al carrito ✓
            </div>
          </div>
        `;
        
        // Crear contenedor si no existe
        let toastContainer = document.getElementById("toastContainer");
        if (!toastContainer) {
          toastContainer = document.createElement("div");
          toastContainer.id = "toastContainer";
          toastContainer.className = "toast-container position-fixed bottom-0 end-0 p-3";
          document.body.appendChild(toastContainer);
        }
        
        // Agregar el toast
        toastContainer.insertAdjacentHTML("beforeend", toastHTML);
        
        // Mostrar el toast con Bootstrap
        const toastElement = toastContainer.lastElementChild;
        const toast = new bootstrap.Toast(toastElement);
        toast.show();
        
        if (window.updateCartQuantity) {
          window.updateCartQuantity();
        }
        resolve(res);
      })
      .fail(function (err) {
        console.error("✗ Error al agregar:", err);
        const nameToShow = productName || "producto";
        alert(`Error al agregar ${nameToShow}. Status: ${err.status}`);
        reject(err);
      });
  });
}