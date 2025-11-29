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
            const logoutBtn = document.createElement('button');
            logoutBtn.className = 'btn btn-header btn-sm d-inline-flex align-items-center';
            logoutBtn.type = 'button';
            logoutBtn.innerHTML = `
              <i class="bi bi-box-arrow-right"></i>
              <span class="ms-2 d-none d-lg-inline">Cerrar sesión</span>
            `;

            loginBtn.replaceWith(logoutBtn);
            const user = localStorage.getItem("qs_user")
            const userName = user.firstName
            logoutBtn.addEventListener('click', () => {
              const user = JSON.parse(localStorage.getItem("qs_user") || "{}");
              const userName = user.firstName || "Usuario";
              
              localStorage.clear();
              $("#toastMsg").html(`
                <strong>Cerrando sesión!</strong><br>
                
              `);   

              const toastEl = document.getElementById("logoutToast");
              const toast = new bootstrap.Toast(toastEl);
              toast.show();
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