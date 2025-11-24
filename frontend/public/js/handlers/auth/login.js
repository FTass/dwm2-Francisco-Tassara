const API_BASE_URL = "http://localhost:3000";

$(function () {
  console.log("login.js cargado");

  $("#login").on("submit", function (e) {
    e.preventDefault();
    e.stopPropagation();

    const email = $("#email-form").val().trim();
    const password = $("#pwd").val().trim();

    if (!email || !password) {
      alert("Debes ingresar email y contraseña");
      return;
    }

    $.ajax({
      url: API_BASE_URL + "/api/users/login",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify({ email, password }),
    })
      .done(function (res) {
        console.log("Login OK:", res);

        const { token, user } = res.data;
        localStorage.clear();

        localStorage.setItem("qs_token", token);
        localStorage.setItem("qs_user", JSON.stringify(user));

        // Limpiar datos antiguos del carrito y órdenes
        

        console.log("✓ localStorage cleaned on login");

        // Redirige al home
        window.location.href = "../index.html";
      })
      .fail(function (err) {
        console.error("Error en login:", err);
        const msg =
          err.responseJSON?.msg ||
          "Error al iniciar sesión. Revisa tus datos.";
        alert(msg);
      });
  });
});
