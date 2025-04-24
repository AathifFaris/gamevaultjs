const formatter = new Intl.NumberFormat('en-LK', {
  style: 'currency',
  currency: 'LKR',
});

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('order-form');
  const orderTableBody = document.querySelector('#order-table tbody');
  const grandTotalEl = document.getElementById('grand-total');

  const buyNowBtn = document.getElementById('buy-now');
  const addFavBtn = document.getElementById('add-fav');
  const applyFavBtn = document.getElementById('apply-fav');

  const inputs = form.querySelectorAll('input[type="number"]');

  // Update the order table when quantity changes
  inputs.forEach(input => {
    input.addEventListener('input', updateOrderTable);
  });

  function updateOrderTable() {
    orderTableBody.innerHTML = '';
    let grandTotal = 0;

    inputs.forEach(input => {
      const quantity = parseInt(input.value);
      const name = input.name;
      const unitPrice = parseFloat(input.dataset.price);

      if (quantity > 0) {
        const total = unitPrice * quantity;
        grandTotal += total;

        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${name}</td>
          <td>${quantity}</td>
          <td>${formatter.format(unitPrice)}</td>
          <td>${formatter.format(total)}</td>
        `;
        orderTableBody.appendChild(row);
      }
    });

    grandTotalEl.textContent = formatter.format(grandTotal);
  }

  function getCurrentOrder() {
    const items = [];

    inputs.forEach(input => {
      const quantity = parseInt(input.value);
      const name = input.name;
      const price = parseFloat(input.dataset.price);

      if (quantity > 0) {
        items.push({ name, quantity, price });
      }
    });

    const grandTotal = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
    return { items, total: grandTotal };
  }

  // Save order to localStorage and go to checkout
  buyNowBtn.addEventListener('click', () => {
    const currentOrder = getCurrentOrder();
    if (currentOrder.items.length === 0) {
      alert('Please select at least one item to continue.');
      return;
    }

    localStorage.setItem('cartItems', JSON.stringify(currentOrder.items));
    window.location.href = 'checkout.html';
  });

  // Save as favourite
  addFavBtn.addEventListener('click', () => {
    const favOrder = getCurrentOrder();
    localStorage.setItem('favouriteOrder', JSON.stringify(favOrder));
    alert('Favourite order saved!');
  });

  // Load from favourite
  applyFavBtn.addEventListener('click', () => {
    const saved = localStorage.getItem('favouriteOrder');
    if (!saved) {
      alert('No favourite order found.');
      return;
    }

    const fav = JSON.parse(saved);
    inputs.forEach(input => {
      const match = fav.items.find(item => item.name === input.name);
      input.value = match ? match.quantity : 0;
    });

    updateOrderTable();
  });

  updateOrderTable(); // Initial call on load
});
