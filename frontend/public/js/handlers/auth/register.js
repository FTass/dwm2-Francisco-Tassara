const API_BASE_URL = "http://localhost:3000";

$(function () {
  console.log("login.js cargado");

  $("#registerForm").on("submit", function (e) {
    e.preventDefault();
    e.stopPropagation();


    const firstName = $("#nombre-form").val().trim();
    const lastName = $("#apellido-form").val().trim();
    const phone = $("#phone-form").val().trim();
    const email = $("#email-form").val().trim();
    const password = $("#pwd").val().trim();

    

    $.ajax({
      url: API_BASE_URL + "/api/users/register",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify({ email, password, firstName, lastName, phone }),
    })
      .done(function (res) {
        console.log("Login OK:", res);

        alert(`Hola ${firstName}, inicia sesion`)

    
        window.location.href = "/frontend/public/pages/login.html";
      })
      .fail(function (err) {
        console.error("Error en register:", err);
        
      });
  });
});
