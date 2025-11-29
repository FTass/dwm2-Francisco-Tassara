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
        $("#toastMsg").html(`
    <strong>Bienvenido, ${res?.data?.firstName}!</strong><br>
    Estamos preparando todo para ti...
  `);

  const toastEl = document.getElementById("loginToast");
  const toast = new bootstrap.Toast(toastEl);
  toast.show();
                      
  setTimeout(() => {
    window.location.href = "/frontend/public/index.html";
  }, 5000)

        console.log("✓ localStorage cleaned on login");
        
        // Redirige al home
        // setTimeout( () => {
        //   window.location.href = "../index.html";
          
        // },3000);
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
