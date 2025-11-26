const destacadosPromise = fetch(
        "/frontend/public/partials/destacados.html"
      )
        .then((r) => r.text())
        .then((html) => {
          document.getElementById("destacados-root").innerHTML = html;
        })
        .then(() => {
          if (typeof initHighlight === "function") {
            
            initHighlight();
          } else {
            console.error("initOffers no está definida");
          }
        });
fetch("/frontend/public/partials/vista-detallada.html")
        .then((r) => r.text())
        .then((html) => {
          document.body.insertAdjacentHTML("beforeend", html);

          const modalEl = document.getElementById("exampleModal");

          modalEl.addEventListener("show.bs.modal", (event) => {
            const trigger = event.relatedTarget;
            if (!trigger) return;

            const card = trigger.closest(".card") || trigger;

            const productId = card.getAttribute("data-product-id");
            const name = card.getAttribute("data-product-name") || "Producto";
            const price = card.getAttribute("data-product-price") || "";
            const desc = card.getAttribute("data-product-desc") || "";

            const img =
              card.getAttribute("data-product-img") ||
              card.querySelector(".product-img")?.src ||
              "https://via.placeholder.com/500x500?text=Sin+imagen";

            const $ = (id) => document.getElementById(id);
            $("exampleModalLabel").textContent = name;
            $("modalProductImg").src = img;
            $("modalProductImg").alt = name;
            $("modalProductPrice").textContent = price;
            $("modalProductDesc").textContent = desc;

            const qtyInput = $("modalQty");
            if (qtyInput) qtyInput.value = 1;

            const addBtn = $("addToCartBtn");
            if (addBtn) {
              // CAMBIO: ahora es async y espera la función
              addBtn.onclick = async () => {
                const qty = Number(qtyInput?.value || 1);
                await addProductToCart(productId, qty, name);
              };
            }
          });

          // fallback por si hay cards ya renderizadas en el HTML estático
          document.querySelectorAll(".card.prod").forEach((card) => {
            card.setAttribute("data-bs-toggle", "modal");
            card.setAttribute("data-bs-target", "#exampleModal");

            const h5 =
              card.querySelector("h5")?.textContent.trim() || "Producto";
            const em = card.querySelector("em")?.textContent.trim() || "";
            const img =
              card.querySelector("img")?.src || "https://picsum.photos/500/500";

            card.setAttribute("data-product-name", h5);
            card.setAttribute("data-product-price", em);
            card.setAttribute("data-product-img", img);
            card.setAttribute("data-product-desc", "");
          });
        })
        .catch(console.error);
