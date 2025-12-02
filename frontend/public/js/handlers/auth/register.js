const API_BASE_URL = "http://localhost:3000";
import { showToast } from '../util/toast-util.js'

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

        showToast(`Hola ${firstName + ' ' + lastName}, inicia sesion`, 'warning')
        

        setTimeout(() => {
          window.location.href = "/frontend/public/pages/login.html";

        }, 1500);
      })
      .fail(function (err) {
        
       
      

        const code = err.responseJSON?.code;
        const msg = err.responseJSON?.msg;
  
        if (code === 'EMAIL_EXISTS') {
          showToast(`El correo '${email}' ya esta registrado`, 'danger');
        } else if (code === 'INVALID_PASSWORD_LENGTH') {
          showToast('la contraseña es demasiado larga', 'warning');
        } else if (code === 'REQUIRED_CHAR') {
          showToast(msg, 'danger');
        }

    
    // Eliminar el elemento después de que se oculte
        
      });
  });
});
