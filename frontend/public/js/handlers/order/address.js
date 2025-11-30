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
    const savedAddress = JSON.parse(localStorage.getItem("qs_address"));
    if (savedAddress) {
      const { street, number, apt, commune, city } = savedAddress;
      const text = `${street}, ${number}, ${apt || ""}, ${commune}, ${city}`;
      
      try {
        const addressEl = await waitForElement('#address', 3000);
        addressEl.textContent = text;
      } catch (e) {
        
      }
    }
  } catch (err) {
    console.error('Error parseando qs_address', err);
  }
});

$(function () {
  console.log("address.js cargado");

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

    const payload = {
      street,
      number,
      apt,
      commune,
      city,
    };

    // validar valores (no las claves) - apt es opcional
    const requiredFields = ['street', 'number', 'commune', 'city'];
    for (const field of requiredFields) {
      if (!payload[field]) {
        alert("Faltan campos necesarios");
        return;
      }
    }

    localStorage.setItem("qs_address", JSON.stringify(payload));

    const addressText = `${street}, ${number}, ${apt || ""}, ${commune}, ${city}`;
    const addressElNow = document.getElementById("address");
    if (addressElNow) {
      addressElNow.textContent = addressText;
    } else {
      waitForElement('#address', 3000).then(el => el.textContent = addressText).catch(()=>{});
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
            }
          } catch (e) {
            console.warn('No se pudo extraer el id de la respuesta', e);
          }

          alert("Direccion guardada");
        })
      .fail(function (err) {
        alert("Error al guardar direccion: " + (err.responseJSON?.msg || err.statusText));
      });
  });
});
