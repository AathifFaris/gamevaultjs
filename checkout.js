const formatter = new Intl.NumberFormat('en-LK', {
  style: 'currency',
  currency: 'LKR',
});

document.addEventListener('DOMContentLoaded', () => {
  const orderTableBody = document.querySelector('#orderTable tbody');
  const totalPriceEl = document.getElementById('totalPrice');

  const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  let total = 0;

  orderTableBody.innerHTML = ''; // Clear old rows

  cartItems.forEach(item => {
    const { name, quantity, price } = item;
    const itemTotal = quantity * price;
    total += itemTotal;

    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${name}</td>
      <td>${quantity}</td>
      <td>${formatter.format(price)}</td>
      <td>${formatter.format(itemTotal)}</td>
    `;
    orderTableBody.appendChild(row);
  });

  totalPriceEl.textContent = formatter.format(total);

  const form = document.getElementById('checkoutForm');
  const thankYouMessage = document.getElementById('thankYouMessage');
  const deliveryDateElement = document.getElementById('deliveryDate');

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    const card = document.getElementById('cardNumber').value;

    if (name && email && phone && address && card) {
      const deliveryDate = new Date();
      deliveryDate.setDate(deliveryDate.getDate() + 3);
      deliveryDateElement.textContent = deliveryDate.toLocaleDateString();

      thankYouMessage.style.display = 'block';
    } else {
      alert('Please fill out all fields.');
    }
  });
});
