const API_BASE_URL = "http://localhost:3000";
import { showToast } from '../util/toast-util.js'


$(function () {
  console.log("login.js cargado");

  $("#login").on("submit", function (e) {
    e.preventDefault();
    e.stopPropagation();

    const email = $("#email-form").val().trim();
    const password = $("#pwd").val().trim();

    if (!email || !password) {
      showToast('Debe ingresar correo y contraseña', 'danger')
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
        let userName = res.data.user.firstName || "";
        // Limpiar datos antiguos del carrito y órdenes
        $("#toastMsg").html(`
          <strong>Bienvenido, ${userName}!</strong><br>
          Estamos preparando todo para ti...
        `);

        const toastEl = document.getElementById("loginToast");
        const toast = new bootstrap.Toast(toastEl);
        toast.show();
                            
        setTimeout(() => {
          window.location.href = "/frontend/public/index.html";
        }, 5000)

      
      })
      .fail(function (err) {
        const code = err.responseJSON?.code;
        const msg = err.responseJSON?.msg;
        console.log(msg);
        
  
        if (code === 'INCORRECT_PASSWORD') {
          showToast(msg, 'danger');
        } else if (code === 'TOO_MANY_FAILED_ATTEMPTS') {
          showToast(msg, 'warning');
        } else if (code === 'USER_TEMPORARILY_BLOCKED') {
          showToast(msg, 'danger');
        } else if ( code === 'NOT_FOUND') {
          showToast(msg, 'danger');
        }
      });
  });
});
