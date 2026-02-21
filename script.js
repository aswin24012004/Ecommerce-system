
        const products = [
            { id: 1, name: 'Classic Marble Candle Stand', price: 45, originalPrice: 60, rating: 4.8, reviews: 124, discount: '25% OFF', icon: '🕯️' },
            { id: 2, name: 'Elegant White Marble Holder', price: 38, originalPrice: null, rating: 4.9, reviews: 89, discount: null, icon: '🪔' },
            { id: 3, name: 'Geometric Marble Tray', price: 52, originalPrice: 70, rating: 4.7, reviews: 156, discount: '25% OFF', icon: '📐' },
            { id: 4, name: 'Marble Coaster Set (4pc)', price: 29, originalPrice: null, rating: 4.6, reviews: 203, discount: null, icon: '⭕' },
            { id: 5, name: 'Luxury Marble Vase', price: 68, originalPrice: 85, rating: 4.9, reviews: 78, discount: '20% OFF', icon: '🏺' },
            { id: 6, name: 'Marble Tea Light Holder', price: 25, originalPrice: null, rating: 4.5, reviews: 167, discount: null, icon: '💡' }
        ];

        let cart = [];
        let discountApplied = false;
        let discountAmount = 0;

        function renderProducts() {
            const grid = document.getElementById('productsGrid');
            grid.innerHTML = products.map(p => `
                <div class="product-card">
                    <div class="product-image">
                        ${p.icon}
                        ${p.discount ? `<div class="discount-badge">${p.discount}</div>` : ''}
                    </div>
                    <div class="product-info">
                        <div class="product-name">${p.name}</div>
                        <div class="product-rating">
                            ⭐ ${p.rating} (${p.reviews} reviews)
                        </div>
                        <div class="product-price">
                            $${p.price}
                            ${p.originalPrice ? `<span class="original-price">$${p.originalPrice}</span>` : ''}
                        </div>
                        <button class="add-to-cart" onclick="addToCart(${p.id})">Add to Cart</button>
                    </div>
                </div>
            `).join('');
        }

        function addToCart(productId) {
            const product = products.find(p => p.id === productId);
            const existingItem = cart.find(item => item.id === productId);
            
            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({ ...product, quantity: 1 });
            }
            
            updateCart();
            showNotification('Added to cart!');
        }

        function updateCart() {
            document.getElementById('cartCount').textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
            
            const cartItems = document.getElementById('cartItems');
            if (cart.length === 0) {
                cartItems.innerHTML = '<p style="text-align: center; padding: 40px;">Your cart is empty</p>';
            } else {
                cartItems.innerHTML = cart.map(item => `
                    <div class="cart-item">
                        <div class="cart-item-image">${item.icon}</div>
                        <div class="cart-item-info">
                            <div>${item.name}</div>
                            <div>$${item.price} × ${item.quantity}</div>
                        </div>
                        <button onclick="removeFromCart(${item.id})" style="background: #e74c3c; color: white; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer;">Remove</button>
                    </div>
                `).join('');
            }
            
            updateTotal();
        }

        function updateTotal() {
            const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const total = discountApplied ? subtotal * (1 - discountAmount) : subtotal;
            document.getElementById('cartTotal').textContent = total.toFixed(2);
        }

        function removeFromCart(productId) {
            cart = cart.filter(item => item.id !== productId);
            updateCart();
        }

        function toggleCart() {
            document.getElementById('cartModal').classList.toggle('active');
        }

        function applyDiscount() {
            const code = document.getElementById('discountCode').value.toUpperCase();
            const message = document.getElementById('discountMessage');
            
            const discountCodes = {
                'MARBLE15': 0.15,
                'SAVE20': 0.20,
                'WELCOME10': 0.10
            };
            
            if (discountCodes[code]) {
                discountApplied = true;
                discountAmount = discountCodes[code];
                message.textContent = `✓ Discount code applied! ${(discountAmount * 100).toFixed(0)}% off`;
                message.style.color = 'green';
                updateTotal();
            } else {
                message.textContent = '✗ Invalid discount code';
                message.style.color = 'red';
            }
        }

        function checkout() {
            if (cart.length === 0) {
                alert('Your cart is empty!');
                return;
            }
            
            // Simulate abandoned cart recovery by storing cart
            localStorage.setItem('abandonedCart', JSON.stringify(cart));
            
            alert('Proceeding to checkout... (Demo mode)\n\nYour cart has been saved. If you leave now, we\'ll send you a reminder email!');
        }

        function subscribeNewsletter(e) {
            e.preventDefault();
            alert('Thank you for subscribing! Check your email for a 10% discount code.');
            e.target.reset();
        }

        function showNotification(message) {
            const notification = document.createElement('div');
            notification.textContent = message;
            notification.style.cssText = 'position: fixed; top: 100px; right: 20px; background: #27ae60; color: white; padding: 15px 25px; border-radius: 5px; z-index: 3000;';
            document.body.appendChild(notification);
            setTimeout(() => notification.remove(), 2000);
        }

        // Check for abandoned cart on load
        window.onload = () => {
            renderProducts();
            const abandonedCart = localStorage.getItem('abandonedCart');
            if (abandonedCart) {
                setTimeout(() => {
                    if (confirm('Welcome back! You have items in your cart. Would you like to continue shopping?')) {
                        cart = JSON.parse(abandonedCart);
                        updateCart();
                        toggleCart();
                    }
                    localStorage.removeItem('abandonedCart');
                }, 1000);
            }
        };