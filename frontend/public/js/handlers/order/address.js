const API_BASE_URL = "http://localhost:3000";
document.addEventListener("DOMContentLoaded", () => {
  const savedAddress = JSON.parse(localStorage.getItem("qs_address"));

  if (savedAddress) {
    const { street, number, apt, commune, city } = savedAddress;

    // Si existe el elemento
    const addressEl = document.getElementById("address");
    if (addressEl) {
      addressEl.textContent =
        `${street}, ${number}, ${apt || ""}, ${commune}, ${city}`;
    }
  }
});
$(function () {
  console.log("login.js cargado");

    const savedUser = JSON.parse(localStorage.getItem("qs_user"));

    

    const userId = savedUser?._id;

   

    if (!userId) {
    console.error("No se encontró userId en localStorage");
    }

    $(document).on("submit", "#addressForm", function (e) {
      e.preventDefault();
      e.stopPropagation();

      // const nombre = $("#nombre").val().trim();
      const street = $("#calle").val().trim();
      const number = $("#numero").val().trim();
      const apt = $("#depto").val().trim();
      const commune = $("#comuna").val().trim();
      const city = $("#ciudad").val().trim();
      
      payload = {
          // nombre,
          street,
          number,
          apt,
          commune,
          city
      }
      localStorage.setItem("qs_address", JSON.stringify(payload));
      for( const campo in payload) {
          if ( !campo) {
            alert("Faltan campos necesarios");
            return;
          }
      }
      $("#address").text(`${street}, ${number}, ${apt || ""}, ${commune}, ${city}`);
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
          

          alert("Direccion guardada")

          
        })
        .fail(function (err) {
          alert("Error al guardar direccion:", err.responseJSON?.msg);
        
        });
    });
});
