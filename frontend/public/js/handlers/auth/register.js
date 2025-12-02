const API_BASE_URL = "http://localhost:3000";

function showToast(message, type = 'danger') {
  const toastHTML = `
    <div class="toast border-0" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="d-flex align-items-center text-bg-${type} p-3 rounded">
        <div class="toast-body flex-grow-1">${message}</div>
        <button type="button" class="btn-close btn-close-white ms-3" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
    </div>
  `;
  
  let toastContainer = document.getElementById("toastContainer");
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.id = "toastContainer";
    toastContainer.className = "toast-container position-fixed top-0 end-0 p-3";
    toastContainer.style.zIndex = "11000";
    document.body.appendChild(toastContainer);
  }

  toastContainer.insertAdjacentHTML("beforeend", toastHTML);
  
  const toastElement = toastContainer.lastElementChild;
  const toast = new bootstrap.Toast(toastElement);
  toast.show();
  
  toastElement.addEventListener('hidden.bs.toast', () => {
    toastElement.remove();
  });
}
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
          showToast(msg, 'danger');
        } else if (code === 'INVALID_PASSWORD_LENGTH') {
          showToast(msg, 'warning');
        } else if (code === 'REQUIRED_CHAR') {
          showToast(msg, 'danger');
        }

    
    // Eliminar el elemento después de que se oculte
        
      });
  });
});
