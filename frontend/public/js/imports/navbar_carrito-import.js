import { showToast } from "../handlers/util/toast-util.js";
 // ==========================
      // NAVBAR + CARRITO
      // ==========================
      fetch("/frontend/public/partials/navbar.html")
        .then((r) => r.text())
        .then((html) => {
          document.getElementById("navbar-root").innerHTML = html;
          
          // Verificar autenticación y cambiar botón
          const token = localStorage.getItem('qs_token');
          const loginBtn = document.querySelector('a[href="./pages/login.html"]');

          if (token && loginBtn) {
            const user = JSON.parse(localStorage.getItem("qs_user"));
            
            const userDropdown = document.createElement('div');
            userDropdown.className = 'dropdown';
            
            const userName = user.firstName
            
            const logoutBtn = document.createElement('button');
            logoutBtn.className = 'btn btn-header btn-sm d-inline-flex align-items-center';
            logoutBtn.type = 'button';
            
            userDropdown.innerHTML = `
            <button class="btn btn-header btn-sm d-inline-flex align-items-center dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
              <i class="bi bi-person-circle mx-1" style="font-size: 1rem;"></i>${userName}
            </button>
            <ul class="dropdown-menu" id="userActions">
              
              <li><hr class="dropdown-divider"></li>
              <li><button class="dropdown-item" id="logoutBtn">Cerrar Sesion</button></li>
              
            </ul>
            `;

            loginBtn.replaceWith(userDropdown);
            if ( user && user.profile && user.profile.name === 'admin') {
              $("#userActions").prepend(`<li><a class="dropdown-item" href="/frontend/public/pages/stockManagement.html">Gestionar Stock</a></li>`)
              $("#userActions").prepend(`<li><a class="dropdown-item" href="/frontend/public/pages/orderManagement.html">Gestionar Ordenes</a></li>`)
            } else {
              $('#userActions').prepend(`<li><a class="dropdown-item" href="/frontend/public/pages/user-orders.html">Mis Ordenes<a></li>`)
            }
            
            document.getElementById('logoutBtn').addEventListener('click', (e) => {
              e.preventDefault();
              const user = JSON.parse(localStorage.getItem("qs_user") || "{}");
              const userName = user.firstName || "Usuario";
              
              localStorage.clear();
              showToast('Cerrando sesion..')
              setTimeout(() => {
                window.location.href = '/frontend/public/index.html';
              }, 3000);
            });
          }
        })
        .then(() => {
          return Promise.all([
            fetch("/frontend/public/partials/carrito-btn.html")
              .then((r) => r.text())
              .then((html) => {
                const btnSlot = document.getElementById("cart-btn");
                if (btnSlot) btnSlot.innerHTML = html;
              }),
            fetch("/frontend/public/partials/carrito-content.html")
              .then((r) => r.text())
              .then((html) => {
                let contentSlot = document.getElementById("cart-content");
                if (!contentSlot) {
                  contentSlot = document.createElement("div");
                  contentSlot.id = "cart-content";
                  document.body.appendChild(contentSlot);
                }
                contentSlot.innerHTML = html;
              }),
          ]);
        })
        .catch(console.error);