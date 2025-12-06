export async function updOrder( orderId, payload, token ) {
    return $.ajax({
        url: `http://localhost:3000/api/orders/${orderId}`,
        type: "PUT",
        contentType: "application/json",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        data: JSON.stringify(payload),
    });
}