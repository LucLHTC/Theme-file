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
    this.initScrollAnimations();
    this.initLoadingStates();
    this.initPerformance();
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

  // Scroll Animations with Intersection Observer
  initScrollAnimations() {
    if (!('IntersectionObserver' in window)) return;

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -100px 0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          // Stagger animation for grid items
          if (entry.target.classList.contains('benefit-card') ||
              entry.target.classList.contains('cart-suggestion')) {
            const delay = parseInt(entry.target.dataset.index || 0) * 100;
            setTimeout(() => {
              entry.target.classList.add('animated');
            }, delay);
          } else {
            entry.target.classList.add('animated');
          }
        }
      });
    }, observerOptions);

    // Observe sections and cards
    document.querySelectorAll('.hero, .benefits, .reviews, .guarantee, .final-cta').forEach(el => {
      observer.observe(el);
    });

    // Observe benefit cards with stagger
    document.querySelectorAll('.benefit-card').forEach((card, index) => {
      card.dataset.index = index;
      card.classList.add('animate-on-scroll');
      observer.observe(card);
    });
  }

  // Loading States and Micro-interactions
  initLoadingStates() {
    // Add to cart button loading state
    document.addEventListener('submit', (e) => {
      if (e.target.id === 'product-form') {
        const submitBtn = e.target.querySelector('[data-add-to-cart]');
        if (submitBtn && !submitBtn.disabled) {
          const originalText = submitBtn.textContent;
          submitBtn.textContent = 'Adding...';
          submitBtn.classList.add('btn--loading');

          // Add spinner
          const spinner = document.createElement('span');
          spinner.className = 'btn-spinner';
          submitBtn.prepend(spinner);
        }
      }
    });

    // Cart count badge animation
    document.addEventListener('cart:updated', (e) => {
      const cartCount = document.querySelector('[data-cart-count]');
      if (cartCount) {
        cartCount.classList.add('bounce');
        setTimeout(() => cartCount.classList.remove('bounce'), 600);
      }
    });

    // Quantity selector hover effects (already in CSS but adding focus states)
    document.querySelectorAll('.quantity-btn').forEach(btn => {
      btn.addEventListener('mousedown', function() {
        this.style.transform = 'scale(0.95)';
      });
      btn.addEventListener('mouseup', function() {
        this.style.transform = '';
      });
    });
  }

  // Performance Optimizations
  initPerformance() {
    // Lazy load images below the fold
    if ('loading' in HTMLImageElement.prototype) {
      // Browser supports native lazy loading
      document.querySelectorAll('img[loading="lazy"]').forEach(img => {
        img.loading = 'lazy';
      });
    } else {
      // Fallback for browsers that don't support lazy loading
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
            }
            observer.unobserve(img);
          }
        });
      });

      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    }

    // Defer non-critical JavaScript
    this.deferNonCriticalScripts();

    // Preload critical assets
    this.preloadCriticalAssets();
  }

  deferNonCriticalScripts() {
    // This would be called for any analytics or non-critical scripts
    // Example: Load external scripts after page load
    window.addEventListener('load', () => {
      // Add any deferred scripts here
      console.log('Non-critical scripts loaded');
    });
  }

  preloadCriticalAssets() {
    // Preload hero image if it exists
    const heroImage = document.querySelector('.hero__image img');
    if (heroImage && heroImage.src) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = heroImage.src;
      document.head.appendChild(link);
    }
  }

  // Utility: Format money
  formatMoney(cents) {
    const amount = (cents / 100).toFixed(2);
    return window.ShedAway.settings.moneyFormat.replace('{{amount}}', amount);
  }
}

// Global cart helper functions for inline onclick handlers
window.updateCartQuantity = async function(lineKey, quantity) {
  if (quantity < 0) return;

  const cartItem = document.querySelector(`[data-line-key="${lineKey}"]`).closest('[data-cart-item]');
  if (cartItem) {
    cartItem.classList.add('updating');
  }

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

    if (!response.ok) throw new Error('Failed to update cart');

    const cart = await response.json();

    // Update cart display
    if (window.shedAwayTheme) {
      window.shedAwayTheme.updateCart(cart);
    }

    // Remove updating class after animation
    setTimeout(() => {
      if (cartItem) {
        cartItem.classList.remove('updating');
      }
    }, 400);
  } catch (error) {
    console.error('Error updating quantity:', error);
    alert('Sorry, there was an error updating your cart.');
    if (cartItem) {
      cartItem.classList.remove('updating');
    }
  }
};

window.removeCartItem = async function(lineKey) {
  const cartItem = document.querySelector(`[data-line-key="${lineKey}"]`).closest('[data-cart-item]');

  if (cartItem) {
    cartItem.classList.add('removing');
  }

  try {
    const response = await fetch(window.ShedAway.routes.cart_change_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        line: lineKey,
        quantity: 0
      })
    });

    if (!response.ok) throw new Error('Failed to remove item');

    const cart = await response.json();

    // Wait for animation to complete
    setTimeout(() => {
      if (window.shedAwayTheme) {
        window.shedAwayTheme.updateCart(cart);
      }
    }, 300);
  } catch (error) {
    console.error('Error removing item:', error);
    alert('Sorry, there was an error removing the item.');
    if (cartItem) {
      cartItem.classList.remove('removing');
    }
  }
};

window.closeCartDrawer = function() {
  if (window.shedAwayTheme) {
    window.shedAwayTheme.closeCartDrawer();
  }
};

// Initialize theme
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.shedAwayTheme = new ShedAwayTheme();
  });
} else {
  window.shedAwayTheme = new ShedAwayTheme();
}
