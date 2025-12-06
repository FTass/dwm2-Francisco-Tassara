export async function getShipping( orderId, token ) {
    return $.ajax({
        url: `http://localhost:3000/api/orders/${orderId}/shipping`,
        type: "GET",
        headers: {
        Authorization: `Bearer ${token}`,
        },
        
    });
}

export async function updShipping( orderId, shippingId, token, payload ) {
    return $.ajax({
        url: `http://localhost:3000/api/orders/${orderId}/shipping/${shippingId}`,
        type: "PUT",
        contentType: "application/json",
        headers: {
        Authorization: `Bearer ${token}`,
        },
        data: JSON.stringify( payload ),
        
    });
}