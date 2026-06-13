// script.js

// Initialize cart and history from localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let orderHistory = JSON.parse(localStorage.getItem('orderHistory')) || [];
let isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

// Update UI based on login state
function updateAuthUI() {
    const loginLink = document.getElementById('loginLink');
    const logoutLink = document.getElementById('logoutLink');
    if (isLoggedIn) {
        if (loginLink) loginLink.style.display = 'none';
        if (logoutLink) logoutLink.style.display = 'inline-block';
    } else {
        if (loginLink) loginLink.style.display = 'inline-block';
        if (logoutLink) logoutLink.style.display = 'none';
    }
}

// Handle Login
function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (username && password) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', username);
        isLoggedIn = true;
        alert('Login successful! Welcome, ' + username + '.');
        window.location.href = 'index.html';
    } else {
        alert('Please enter both username and password.');
    }
}

// Handle Logout
function handleLogout(event) {
    if(event) event.preventDefault();
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    isLoggedIn = false;
    alert('Logged out successfully.');
    window.location.href = 'index.html';
}

// Add to Cart
function addToCart(itemName, price) {
    const existingItem = cart.find(item => item.name === itemName);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name: itemName, price: price, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(itemName + ' added to cart!');
    updateCartCount();
}

// Update Cart Count in Navbar
function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

// Render Cart on Menu/Checkout Page
function renderCart() {
    const cartItemsContainer = document.getElementById('cartItems');
    const totalAmountElement = document.getElementById('totalAmount');
    if (!cartItemsContainer) return;

    cartItemsContainer.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-state">Your cart is empty. Go to Menu to add items!</p>';
    } else {
        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            cartItemsContainer.innerHTML += `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 15px;">
                    <div>
                        <strong>${item.name}</strong><br>
                        <small>₹${item.price} x ${item.quantity}</small>
                    </div>
                    <div style="display: flex; align-items: center; gap: 15px;">
                        <span style="font-weight: bold; color: #ff6b35;">₹${itemTotal}</span>
                        <button onclick="removeFromCart(${index})" style="background: #ff4444; color: white; border: none; padding: 5px 12px; border-radius: 4px; cursor: pointer; font-size: 0.9rem;">Remove</button>
                    </div>
                </div>
            `;
        });
    }

    if (totalAmountElement) {
        totalAmountElement.textContent = '₹' + total;
    }
}

// Remove from Cart
function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
    updateCartCount();
}

// Handle Checkout
function handleCheckout(event) {
    event.preventDefault();
    if (!isLoggedIn) {
        alert('Please login first to place an order!');
        window.location.href = 'login.html';
        return;
    }
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const order = {
        id: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
        date: new Date().toLocaleString(),
        items: [...cart],
        total: total
    };

    orderHistory.push(order);
    localStorage.setItem('orderHistory', JSON.stringify(orderHistory));
    
    // Clear cart
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    
    alert('Payment successful! Order placed successfully.');
    window.location.href = 'history.html';
}

// Render History
function renderHistory() {
    const historyContainer = document.getElementById('historyContainer');
    if (!historyContainer) return;

    historyContainer.innerHTML = '';
    if (orderHistory.length === 0) {
        historyContainer.innerHTML = '<p class="empty-state">No order history found. Start ordering!</p>';
    } else {
        // Show latest first
        [...orderHistory].reverse().forEach(order => {
            const itemsList = order.items.map(item => `${item.name} x${item.quantity}`).join(', ');
            historyContainer.innerHTML += `
                <div class="history-item">
                    <div class="order-details">
                        <strong style="font-size: 1.1rem; color: #333;">${order.id}</strong><br>
                        <small style="color: #777;">${order.date}</small><br>
                        <span style="display: block; margin-top: 8px; color: #555;">${itemsList}</span>
                    </div>
                    <div class="order-total">
                        <strong style="color: #ff6b35; font-size: 1.3rem;">₹${order.total}</strong><br>
                        <span style="color: #28a745; font-weight: bold; font-size: 0.9rem;">✓ Paid</span>
                    </div>
                </div>
            `;
        });
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    updateAuthUI();
    updateCartCount();
    
    // Check specific pages
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
        renderCart();
        checkoutForm.addEventListener('submit', handleCheckout);
    }
    
    if (document.getElementById('cartItems')) {
        renderCart();
    }
    
    if (document.getElementById('historyContainer')) {
        renderHistory();
    }
});