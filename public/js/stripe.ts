export const proceedToCheckout = async function (id: string) {
  const getCheckoutPage = await fetch(
    `http://localhost:3000/api/v1/bookings/checkout-session/${id}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  const responseObject = await getCheckoutPage.json();

  window.location.href = responseObject.session.url;
};
