export const proceedToCheckout = async function (id) {
    const getCheckoutPage = await fetch(`${window.location.origin}/api/v1/bookings/checkout-session/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const responseObject = await getCheckoutPage.json();
    window.location.href = responseObject.session.url;
};
