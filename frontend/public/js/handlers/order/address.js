const API_BASE_URL = "http://localhost:3000";

// Función que espera a que un elemento aparezca en el DOM
// selector = qué elemento buscar (ej: '#address')
// timeout = cuánto tiempo esperar antes de abandonar (default 5000ms = 5 segundos)
function waitForElement(selector, timeout = 5000) {
  return new Promise((resolve, reject) => {
    // Primero, busco si el elemento ya existe ahora
    const el = document.querySelector(selector);
    if (el) return resolve(el); // Si existe, lo devuelvo inmediatamente

    // Si no existe, creo un observador para vigilar cambios en el DOM
    const observer = new MutationObserver(() => {
      const found = document.querySelector(selector);
      // Si el elemento aparece en el DOM, lo encuentro
      if (found) {
        observer.disconnect(); // Dejo de vigilar
        resolve(found); // Lo devuelvo
      }
    });

    // Vigilo cambios en todo el body y sus hijos
    observer.observe(document.body, { childList: true, subtree: true });

    // Si pasan X milisegundos sin encontrar el elemento, cancelo
    if (timeout) {
      setTimeout(() => {
        observer.disconnect(); // Dejo de vigilar
        reject(new Error('timeout')); // Lanzo error de timeout
      }, timeout);
    }
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const savedUser = JSON.parse(localStorage.getItem("qs_user"));
    const userId = savedUser?._id;

if (userId) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/users/${userId}/addresses?isDefault=true`,
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("qs_token"),
        },
      }
    );
    const result = await response.json();
    
    const addresses = result.data || [];
    const defaultAddress = addresses[0]; 
    if (defaultAddress && defaultAddress._id) {
      const { street, number, apt, commune, city } = defaultAddress;
      const text = `${street}, ${number}, ${apt || ""}, ${commune}, ${city}`;

    const payload = {
      street,
      number,
      apt,
      commune,
      city,
    };
      try {
        const addressEl = await waitForElement('#address', 3000);
        addressEl.textContent = text;
        localStorage.setItem("qs_address", JSON.stringify(payload));
        localStorage.setItem("qs_addressId", defaultAddress._id);
      } catch (e) {
        console.warn('No se encontró elemento #address');
      }
    }
  } catch (err) {
    console.error('Error obteniendo dirección predeterminada:', err);
  }
}

    // Fallback: si no hay dirección predeterminada, cargar del localStorage
    const savedAddress = JSON.parse(localStorage.getItem("qs_address"));
    if (savedAddress && !document.getElementById("address")?.textContent) {
      const { street, number, apt, commune, city } = savedAddress;
      const text = `${street}, ${number}, ${apt || ""}, ${commune}, ${city}`;

      try {
        const addressEl = await waitForElement('#address', 3000);
        addressEl.textContent = text;
      } catch (e) {
        console.warn('No se encontró elemento #address');
      }
    }
  } catch (err) {
    console.error('Error parseando qs_address', err);
  }
});

$(function () {
  

  const savedUser = JSON.parse(localStorage.getItem("qs_user"));
  const userId = savedUser?._id;

  if (!userId) {
    console.error("No se encontró userId en localStorage");
  }

  $(document).on("submit", "#addressForm", function (e) {
    e.preventDefault();
    e.stopPropagation();

    const street = $("#calle").val().trim();
    const number = $("#numero").val().trim();
    const apt = $("#depto").val().trim();
    const commune = $("#comuna").val().trim();
    const city = $("#ciudad").val().trim();
    const isDefault = $("#useProfileAddressBtn").is(":checked");

    const payload = {
      street,
      number,
      apt,
      commune,
      city,
      isDefault
    };

    
    const requiredFields = ['street', 'number', 'commune', 'city'];
    for (const field of requiredFields) {
      if (!payload[field]) {
        const toastHTML = `
          <div id="logoutToast" class="toast border-0" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="d-flex align-items-center text-bg-danger p-3 rounded">
              <div class="toast-body flex-grow-1">Falta campos obligatorios</div>
              <button type="button" class="btn-close btn-close-white ms-3" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
          </div>
        `;

    // Crear contenedor si no existe
    let toastContainer = document.getElementById("toastContainer");
    if (!toastContainer) {
      toastContainer = document.createElement("div");
      toastContainer.id = "toastContainer";
      toastContainer.className = "toast-container position-fixed top-0 end-0 p-3";
      toastContainer.style.zIndex = "11000";
      document.body.appendChild(toastContainer);
    }

    // Agregar el toast
    toastContainer.insertAdjacentHTML("beforeend", toastHTML);

    // Mostrar el toast con Bootstrap
    const toastElement = toastContainer.lastElementChild;
    const toast = new bootstrap.Toast(toastElement);
    toast.show();
    
    // Eliminar el elemento después de que se oculte
    toastElement.addEventListener('hidden.bs.toast', () => {
      toastElement.remove();
    });
        return;
      }
    }

    localStorage.setItem("qs_address", JSON.stringify(payload));

    const addressText = `${street}, ${number}, ${apt || ""}, ${commune}, ${city}`;
    const addressElNow = document.getElementById("address");
    if (addressElNow) {
      addressElNow.textContent = addressText;
    } else {
      waitForElement('#address', 3000).then(el => el.textContent = addressText).catch(() => { });
    }

    $.ajax({
      url: API_BASE_URL + `/api/users/${userId}/addresses`,
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify(payload),
      headers: {
        Authorization: "Bearer " + localStorage.getItem("qs_token"),
      },
    })
      .done(function (res) {
        // La API devuelve el documento creado: guardar su id para usarla en el pedido
        try {
          const returnedId = res?._id || (res.data && res.data._id) || null;
          if (returnedId) {
            localStorage.setItem("qs_addressId", returnedId);
            // Llamar a checkIfCanOrder después de guardar
            if (typeof window.checkIfCanOrder === 'function') {
              window.checkIfCanOrder();
            }
          }
        } catch (e) {
          console.warn('No se pudo extraer el id de la respuesta', e);
        }


        // Crear y mostrar toast
        const toastHTML = `
          <div role="alert" aria-live="assertive" aria-atomic="true" class="toast" data-bs-autohide="true" data-bs-delay="3000">
            <div class="toast-header">
              <strong class="me-auto">Direccion</strong>
              <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">
              Dirección guardada ✓
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
      })
      .fail(function (err) {
        alert("Error al guardar direccion: " + (err.responseJSON?.msg || err.statusText));
      });
  });
});
