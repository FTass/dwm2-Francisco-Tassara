import { fetchCartItems } from "../cart/cart-util.js";


const token = localStorage.getItem("qs_token");
$(document).on("click", '[data-bs-target="#confirm"]', async () => {
    const items = await fetchCartItems();
    createOrder ( items );
});


async function createOrder( data ) {

    if( !token ) {
        alert("Debes iniciar sesion para seguir con tu orden");

        setTimeout(() => {
            window.location.href = "/pages/login.html";

        },3000)
        return null;
    }
    try {
        const res = await $.ajax({
            url: API_BASE_URL + "/api/orders",
            method: "GET",
            headers: {
                Authorization: "Bearer " + token,
            },
        });

        const orders = res.data || [];
        if ( orders.length > 0) {
            const orderId = orders[0]._id;
            currentOrderId = orderId;
            localStorage.setItem("qs_orderId", currentOrderId);
            return orderId
        }

        const createRes =  await $.ajax({
            url: API_BASE_URL + "/api/orders",
            method: "POST",
            headers: {
                Authorization: "Bearer" + token,
            },
            contentType:"aplication/json",
            data: JSON.stringify(data)
        });
  
    } catch ( err ) {

     }

    
}