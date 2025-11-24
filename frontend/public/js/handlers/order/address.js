const API_BASE_URL = "http://localhost:3000";

function waitForElement(selector, timeout = 5000) {
  return new Promise((resolve, reject) => {
    const el = document.querySelector(selector);
    if (el) return resolve(el);

    const observer = new MutationObserver(() => {
      const found = document.querySelector(selector);
      if (found) {
        observer.disconnect();
        resolve(found);
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    if (timeout) {
      setTimeout(() => {
        observer.disconnect();
        reject(new Error('timeout'));
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
      // si el elemento aún no está en DOM, esperar a que aparezca
      try {
        const addressEl = await waitForElement('#address', 3000);
        addressEl.textContent = text;
      } catch (e) {
        // elemento no encontrado dentro del timeout — no es crítico
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

    // validar valores (no las claves)
    for (const [k, v] of Object.entries(payload)) {
      if (!v) {
        alert("Faltan campos necesarios");
        return;
      }
    }

    localStorage.setItem("qs_address", JSON.stringify(payload));

    const addressText = `${street}, ${number}, ${apt || ""}, ${commune}, ${city}`;
    // actualizar si existe el elemento de resumen
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
        alert("Direccion guardada");
      })
      .fail(function (err) {
        alert("Error al guardar direccion: " + (err.responseJSON?.msg || err.statusText));
      });
  });
});
