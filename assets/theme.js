/**
 * ShedAway Theme JavaScript
 * Main functionality for cart, navigation, and interactions
 */

class ShedAwayTheme {
  constructor() {
    this.init();
  }

  init() {
    this.initCart();
    this.initHeader();
    this.initMobileMenu();
  }

  // Cart functionality
  initCart() {
    // Add to cart buttons
    document.querySelectorAll('[data-add-to-cart]').forEach(btn => {
      btn.addEventListener('click', (e) => this.handleAddToCart(e));
    });

    // Cart drawer toggle
    const cartToggle = document.querySelector('[data-cart-toggle]');
    if (cartToggle) {
      cartToggle.addEventListener('click', () => this.toggleCartDrawer());
    }

    // Cart drawer close
    const cartClose = document.querySelector('[data-cart-close]');
    if (cartClose) {
      cartClose.addEventListener('click', () => this.closeCartDrawer());
    }

    // Cart drawer overlay
    const cartOverlay = document.querySelector('[data-cart-overlay]');
    if (cartOverlay) {
      cartOverlay.addEventListener('click', () => this.closeCartDrawer());
    }

    // Update cart on quantity change
    document.addEventListener('change', (e) => {
      if (e.target.matches('[data-cart-quantity]')) {
        this.updateCartQuantity(e.target);
      }
    });
  }

  async handleAddToCart(e) {
    e.preventDefault();

    const button = e.currentTarget;
    const form = button.closest('form');

    if (!form) return;

    // Disable button
    button.disabled = true;
    button.classList.add('loading');

    const formData = new FormData(form);

    try {
      const response = await fetch(window.ShedAway.routes.cart_add_url, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const cart = await response.json();

      // Update cart UI
      this.updateCart(cart);

      // Open cart drawer if AJAX enabled
      if (window.ShedAway.settings.cartAjaxEnabled) {
        this.openCartDrawer();
      } else {
        window.location.href = window.ShedAway.routes.cart_url;
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Sorry, there was an error adding the product to your cart.');
    } finally {
      button.disabled = false;
      button.classList.remove('loading');
    }
  }

  async updateCartQuantity(input) {
    const lineKey = input.dataset.lineKey;
    const quantity = parseInt(input.value);

    if (isNaN(quantity) || quantity < 0) return;

    try {
      const response = await fetch(window.ShedAway.routes.cart_change_url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          line: lineKey,
          quantity: quantity
        })
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const cart = await response.json();
      this.updateCart(cart);
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  }

  updateCart(cart) {
    // Update global cart object
    window.ShedAway.cart = cart;

    // Update cart count
    const cartCount = document.querySelector('[data-cart-count]');
    if (cartCount) {
      cartCount.textContent = cart.item_count;
      cartCount.classList.add('updated');
      setTimeout(() => cartCount.classList.remove('updated'), 300);
    }

    // Update cart drawer content
    this.renderCartDrawer(cart);

    // Dispatch custom event
    document.dispatchEvent(new CustomEvent('cart:updated', { detail: cart }));
  }

  renderCartDrawer(cart) {
    const cartDrawer = document.querySelector('[data-cart-drawer]');
    if (!cartDrawer) return;

    const cartItems = cartDrawer.querySelector('[data-cart-items]');
    const cartSubtotal = cartDrawer.querySelector('[data-cart-subtotal]');

    if (!cartItems) return;

    // Render cart items
    if (cart.items.length === 0) {
      cartItems.innerHTML = '<p class="cart-empty">Your cart is empty</p>';
      if (cartSubtotal) cartSubtotal.textContent = this.formatMoney(0);
      return;
    }

    cartItems.innerHTML = cart.items.map((item, index) => `
      <div class="cart-item">
        <div class="cart-item__image">
          ${item.image ? `<img src="${item.image}" alt="${item.title}">` : ''}
        </div>
        <div class="cart-item__details">
          <h4 class="cart-item__title">${item.product_title}</h4>
          ${item.variant_title ? `<p class="cart-item__variant">${item.variant_title}</p>` : ''}
          <p class="cart-item__price">${this.formatMoney(item.final_line_price)}</p>
        </div>
        <div class="cart-item__quantity">
          <input
            type="number"
            value="${item.quantity}"
            min="0"
            data-cart-quantity
            data-line-key="${index + 1}"
            class="quantity-input"
          >
        </div>
      </div>
    `).join('');

    // Update subtotal
    if (cartSubtotal) {
      cartSubtotal.textContent = this.formatMoney(cart.total_price);
    }

    // Update free shipping progress if exists
    this.updateFreeShippingBar(cart.total_price);
  }

  updateFreeShippingBar(totalPrice) {
    const progressBar = document.querySelector('[data-shipping-progress]');
    if (!progressBar) return;

    const threshold = window.ShedAway.settings.freeShippingThreshold * 100; // Convert to cents

    if (threshold === 0) {
      progressBar.style.width = '100%';
      return;
    }

    const percentage = Math.min((totalPrice / threshold) * 100, 100);
    progressBar.style.width = `${percentage}%`;

    const remaining = threshold - totalPrice;
    const progressText = document.querySelector('[data-shipping-text]');

    if (progressText) {
      if (remaining > 0) {
        progressText.textContent = `Add ${this.formatMoney(remaining)} for free shipping`;
      } else {
        progressText.textContent = 'You qualify for free shipping!';
      }
    }
  }

  openCartDrawer() {
    const drawer = document.querySelector('[data-cart-drawer]');
    const overlay = document.querySelector('[data-cart-overlay]');

    if (drawer) {
      drawer.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
    if (overlay) {
      overlay.classList.add('active');
    }
  }

  closeCartDrawer() {
    const drawer = document.querySelector('[data-cart-drawer]');
    const overlay = document.querySelector('[data-cart-overlay]');

    if (drawer) {
      drawer.classList.remove('active');
      document.body.style.overflow = '';
    }
    if (overlay) {
      overlay.classList.remove('active');
    }
  }

  toggleCartDrawer() {
    const drawer = document.querySelector('[data-cart-drawer]');
    if (drawer && drawer.classList.contains('active')) {
      this.closeCartDrawer();
    } else {
      this.openCartDrawer();
    }
  }

  // Header functionality
  initHeader() {
    const header = document.querySelector('[data-header]');
    if (!header) return;

    let lastScroll = 0;

    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;

      // Add sticky class
      if (currentScroll > 100) {
        header.classList.add('sticky');
      } else {
        header.classList.remove('sticky');
      }

      // Hide header on scroll down, show on scroll up
      if (currentScroll > lastScroll && currentScroll > 200) {
        header.classList.add('hidden');
      } else {
        header.classList.remove('hidden');
      }

      lastScroll = currentScroll;
    });
  }

  // Mobile menu
  initMobileMenu() {
    const menuToggle = document.querySelector('[data-mobile-menu-toggle]');
    const mobileMenu = document.querySelector('[data-mobile-menu]');
    const menuClose = document.querySelector('[data-mobile-menu-close]');

    if (menuToggle && mobileMenu) {
      menuToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
      });
    }

    if (menuClose) {
      menuClose.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    }
  }

  // Utility: Format money
  formatMoney(cents) {
    const amount = (cents / 100).toFixed(2);
    return window.ShedAway.settings.moneyFormat.replace('{{amount}}', amount);
  }
}

// Initialize theme
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new ShedAwayTheme();
  });
} else {
  new ShedAwayTheme();
}
