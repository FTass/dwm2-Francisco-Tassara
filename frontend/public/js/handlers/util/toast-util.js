export function showToast(message, type = 'danger') {
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