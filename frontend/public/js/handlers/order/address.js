import { showToast } from "../util/toast-util.js" 
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
        reject(new Error("timeout")); // Lanzo error de timeout
      }, timeout);
    }
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const savedUser = JSON.parse(localStorage.getItem("qs_user"));
    const userId = savedUser?._id;
    getAddresses(userId);
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
          const text = `${street}, ${number}, ${
            apt || ""
          }, ${commune}, ${city}`;

          const payload = {
            street,
            number,
            apt,
            commune,
            city,
          };
          try {
            const addressEl = await waitForElement("#address", 3000);
            addressEl.textContent = text;
            localStorage.setItem("qs_address", JSON.stringify(payload));
            localStorage.setItem("qs_addressId", defaultAddress._id);
          } catch (e) {
            console.warn("No se encontró elemento #address");
          }
        }
      } catch (err) {
        console.error("Error obteniendo dirección predeterminada:", err);
      }
    }

    // Fallback: si no hay dirección predeterminada, cargar del localStorage
    const savedAddress = JSON.parse(localStorage.getItem("qs_address"));
    if (savedAddress && !document.getElementById("address")?.textContent) {
      const { street, number, apt, commune, city } = savedAddress;
      const text = `${street}, ${number}, ${apt || ""}, ${commune}, ${city}`;

      try {
        const addressEl = await waitForElement("#address", 3000);
        addressEl.textContent = text;
      } catch (e) {
        console.warn("No se encontró elemento #address");
      }
    }
  } catch (err) {
    console.error("Error parseando qs_address", err);
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
    getAddresses();

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
      isDefault,
    };

    const requiredFields = ["street", "number", "commune", "city"];
    for (const field of requiredFields) {
      if (!payload[field]) {
        showToast('Faltan campos obligatorios', 'danger')
        return;
      }
    }

    localStorage.setItem("qs_address", JSON.stringify(payload));

    const addressText = `${street}, ${number}, ${
      apt || ""
    }, ${commune}, ${city}`;
    const addressElNow = document.getElementById("address");
    if (addressElNow) {
      addressElNow.textContent = addressText;
    } else {
      waitForElement("#address", 3000)
        .then((el) => (el.textContent = addressText))
        .catch(() => {});
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
            if (typeof window.checkIfCanOrder === "function") {
              window.checkIfCanOrder();
            }
          }
        } catch (e) {
          console.warn("No se pudo extraer el id de la respuesta", e);
        }

        // Crear y mostrar toast
        
        showToast('Direccion guardada','success')
      })
      .fail(function (err) {
        alert(
          "Error al guardar direccion: " +
            (err.responseJSON?.msg || err.statusText)
        );
      });
  });
});

function getAddresses() {
  const savedUser = JSON.parse(localStorage.getItem("qs_user"));
  const userId = savedUser?._id;

  $.ajax({
    url: `${API_BASE_URL}/api/users/${userId}/addresses`,
    method: "GET",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("qs_token"),
    },
  })
    .done(function (response) {
      console.log(response);
      renderAddressesSelect(response, "addressSelect");
    })
    .fail(function (err) {
      console.error("Error cargando direcciones:", err);
    });
}

function renderAddressesSelect(response, containerId) {
  const addresses = response?.data ?? [];
  const $container = $("#" + containerId);
  if ($container.length === 0) {
    console.warn("No se encontró el contenedor", containerId);
    return;
  }

  $container.empty();

  if (!Array.isArray(addresses) || addresses.length === 0) {
    $container.html(`
      <option selected> No se encontraron direcciones</option>
    `);
    return;
  }

  addresses.forEach((a) => {
    const { street, number, apt, commune, city } = a;
    const opt = document.createElement("option");
    opt.value = a._id;
    opt.textContent = `${street}, ${number}, ${apt || ""}, ${commune}, ${city}`;
    $container.append(opt);
  });
}


$(document).on('change', '#addressSelect', function() {
  const selectedAddressId = $(this).val();
  localStorage.setItem('qs_addressId', selectedAddressId);
  
  
  const selectedText = $(this).find('option:selected').text();
  $('#address').text(selectedText);
  
  
  const parts = selectedText.split(', ');
  if (parts.length >= 4) {
    const payload = {
      street: parts[0],
      number: parts[1],
      apt: parts[2] || '',
      commune: parts[3],
      city: parts[4] || parts[3],
    };
    localStorage.setItem('qs_address', JSON.stringify(payload));
  }
  
  // Trigger para habilitar botón de confirmar orden
  if (typeof window.checkIfCanOrder === 'function') {
    window.checkIfCanOrder();
  }
});

$(document).on('click', '#deleteAddressBtn', function() {
  const savedUser = JSON.parse(localStorage.getItem("qs_user"));
  const userId = savedUser?._id;
  const selectedId = $('#addressSelect').val();
  const currentId = localStorage.getItem('qs_addressId');
  
  if (!selectedId) {
    showToast('Selecciona una direccion', 'warning')
    return;
  }
  
  if (confirm('¿Eliminar esta dirección?')) {
    $.ajax({
      url: `${API_BASE_URL}/api/users/${userId}/addresses/${selectedId}`,
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("qs_token"),
      },
    })
    .done(function (res) {
      showToast('Dirección eliminada', 'success');
      
      
      if (selectedId === currentId) {
        localStorage.removeItem('qs_addressId');
        localStorage.removeItem('qs_address');
        $('#address').text('');
      }
      
      getAddresses();
    })
    .fail(function(err) {
      showToast('Error al eliminar dirección', 'danger');
    });
  }
});