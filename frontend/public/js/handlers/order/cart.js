
console.log("handler  carrito cargado");

let currentCartId = null;
async function getOrCreateCartForCurrentUser(  ) {

    if( currentCartId ) {
        return currentCartId;
    }


    const stored = localStorage.getItem("qs_cartId");
    if (stored) {
        currentCartId = stored;
        return stored;
    }


    const token = localStorage.getItem("qs_token")

    if( !token ) {
        alert("Debes iniciar sesion para usar el carrito");
        window.location.href = "/pages/login.html";
        return null;
    }
    
    try {
        const res = await $.ajax({
            url: API_BASE_URL + "/api/carts",
            method: "GET",
            headers: {
                Authorization: "Bearer" + token,
            },
        });

        const carts = res.data || [];
        if ( carts.length > 0 ) {
            const cartId = carts[0]._id;
            currentCartId = cartId;
            localStorage.setItem("qs_cartId", currentCartId);
            return cartId;
        }

        const createRes = $.ajax({

            url: API_BASE_URL + "/api/carts",
            method: "POST",
            headers: {
                Authorization: "Bearer " + token,
            },
            contentType: "aplication/json",
            data: JSON.stringify({}),
        })

        const newCartId = createRes.data._id;
        currentCartId = newCartId;
        localStorage.setItem( "qs_cartId", currentCartId );
        return newCartId
    } catch ( err ) {
        console.error("Error al obtener/crear carrito:", err);
        alert("Ocurrió un problema con tu carrito. Intenta nuevamente.");
        return null;
    }

}


async function addProductToCart( productId, quantity = 1, productName ) {
   
    if ( !productId) {
        console.warn(" se requiere id de producto")
        return;
    }

    if( typeof quantity !== "number" || quantity <= 0) {
        console.warn("Cantidad invalida");
        return;
    }
    
    const token = localStorage.getItem("qs_token")

    if( !token ) {
        alert("Debes iniciar sesion para usar el carrito");
        window.location.href = "/pages/login.html";
        return null;
    }

    const cartId = await getOrCreateCartForCurrentUser();

    if ( !cartId ) {
        console.warn("No se pudo obtener id del carrito")
        return;
    }

   
    $.ajax({
        url: API_BASE_URL + `/api/carts/${cartId}/items`,
        method: "POST",
        headers: {
            Authorization: "Bearer " + token,
        },
        contentType: "application/json",
        data: JSON.stringify({
            productId,
            quantity
        })
    })
        .done( function( res ) {
            console.log("CartItem OK:", res);
            const nameToShow = productName || res?.data?.productId?.name || "producto";
            alert(`${nameToShow} añadido al carrito`);
        })
        .fail(function (err){
            console.log("Error:",err);
            const nameToShow = productName || res?.data?.productId?.name || "producto";
            alert(`Error al agregar ${nameToShow}`);
            
        }) 

}