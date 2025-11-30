# ShedAway - Premium Shopify Theme

A custom, conversion-optimized Shopify theme built specifically for ShedAway, a single-product store selling premium pet hair removal gloves.

## 🎯 Features

### Unique Hero Animation
- Canvas-based particle system showing pet hairs being removed
- Smooth 60fps animation with magnetic attraction effect
- Session storage to show only once per visit
- Mobile-optimized with reduced particles
- Skip button after 1 second

### Conversion-Optimized Design
- Problem-agitation-solution flow
- Multiple trust badge placements
- Social proof with review sections
- 30-day guarantee messaging
- Urgency elements and bundle pricing

### E-commerce Features
- AJAX cart drawer with slide-in animation
- Variant selector with savings badges
- Sticky add-to-cart bar (mobile)
- Free shipping progress bar
- Quantity upsells
- Interactive before/after comparisons

### 🎯 Conversion Optimization Features (Session 3)

#### Stock Urgency Indicator
- **Real-time inventory alerts**: Shows when stock is below threshold (default: 10 units)
- **Two-tier messaging**:
  - "Almost gone!" for <5 items (🔥 icon)
  - "Only X left in stock!" for 5-10 items (⚠️ icon)
- **Pulsing animation**: Subtle 1.02x scale animation to draw attention
- **Gradient styling**: Eye-catching red gradient background
- **Configurable threshold**: Adjust in theme settings (5-20 units)

#### Variant Image Switching
- **Automatic image updates**: Product image changes when variant is selected
- **Smooth fade transition**: 150ms opacity transition for professional feel
- **Works with Shopify variants**: Uses variant featured_image association
- **No page reload**: Instant visual feedback

#### Recently Viewed Products
- **Persistent tracking**: Stores last 4 viewed products in localStorage
- **Smart display**: Only shows on product pages when >1 product in history
- **Auto-excludes current page**: Never shows the product you're viewing
- **Responsive grid**: Adapts from 4 columns to mobile stack
- **Hover animations**: Cards lift on hover for interactivity
- **Performance optimized**: Lazy loading images

#### Purchase Notifications (Social Proof)
- **Realistic notifications**: 20 pre-configured Dutch customer purchases
- **Timed display**: First shows after 10s, then every 15-25s
- **Slide-in animation**: Smooth entry from bottom-left
- **Auto-dismiss**: Fades out after 5 seconds
- **No duplicates**: Prevents showing same notification twice in a row
- **Mobile optimized**: Full-width on mobile devices
- **Configurable**: Toggle on/off in theme settings

#### People Viewing Counter
- **Live viewer count**: Shows 3-8 people viewing the product
- **Natural variation**: Updates every 20-30s with ±1-2 change
- **Subtle display**: Eye icon with viewer count
- **Fade transitions**: Smooth number updates with opacity animation
- **Realistic behavior**: Viewer count stays between 2-12
- **Configurable**: Toggle on/off in theme settings

#### Trust Badge Enhancements
- **Pulsing guarantee badge**: 30-Day Money Back badge pulses to draw attention
- **2-second animation cycle**: Subtle 1.1x scale at peak
- **Accessibility-first**: Respects prefers-reduced-motion
- **Hover states**: All badges scale 1.05x on hover
- **Maintains brand**: Uses existing color scheme

### Technical Excellence
- **Shopify 2.0 Architecture**: Full JSON templates and sections
- **Performance**: Lazy loading, critical CSS, optimized animations
- **Mobile-First**: Fully responsive design
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support
- **SEO**: Structured data, meta tags, semantic HTML

## 📁 File Structure

```
/
├── assets/
│   ├── theme.css           # Main stylesheet
│   ├── theme.js            # Core JavaScript
│   └── hero-animation.js   # Hero particle animation
├── config/
│   ├── settings_schema.json
│   └── settings_data.json
├── layout/
│   └── theme.liquid        # Main layout
├── locales/
│   └── en.default.json     # English translations
├── sections/
│   ├── header.liquid
│   ├── footer.liquid
│   ├── hero.liquid
│   ├── problem-agitation.liquid
│   ├── product-showcase.liquid
│   ├── benefits.liquid
│   ├── reviews.liquid
│   ├── guarantee.liquid
│   └── final-cta.liquid
├── snippets/
│   ├── meta-tags.liquid
│   ├── structured-data.liquid
│   ├── trust-badges.liquid
│   ├── review-stars.liquid
│   ├── cart-drawer.liquid
│   ├── recently-viewed.liquid        # Session 3: Recently viewed products
│   └── purchase-notifications.liquid # Session 3: Social proof notifications
├── templates/
│   ├── index.json          # Homepage
│   ├── product.liquid      # Product page
│   ├── cart.liquid         # Cart page
│   └── page.liquid         # General pages
└── README.md
```

## ⚠️ Important: Product Setup First

**Before uploading the theme**, you should create your product in Shopify:

1. Go to **Products > Add product**
2. Create a product with the handle: `shedaway-glove`
   - Product title: "ShedAway Pet Hair Removal Glove"
   - Add product description
   - Upload high-quality images (recommended: 2000x2000px)
   - Add variants (see Product Page Setup section below)

**Why?** The homepage buttons link to `/products/shedaway-glove`. If this product doesn't exist yet, the buttons will redirect to the "All Products" collection page as a fallback.

**Alternative:** Upload the theme first, then update the button links in the theme customizer after creating your product.

---

## 🚀 Installation

### Method 1: Upload as ZIP

1. Create a ZIP file of the entire theme directory
2. In Shopify Admin, go to **Online Store > Themes**
3. Click **Add theme** > **Upload ZIP file**
4. Select your ZIP file and upload
5. Once uploaded, click **Publish** to make it live

### Method 2: Theme Kit (Recommended for Development)

```bash
# Install Theme Kit
brew tap shopify/shopify
brew install themekit

# Configure your store
theme configure --password=[your-api-password] --store=[your-store.myshopify.com] --themeid=[theme-id]

# Upload theme
theme deploy

# Watch for changes
theme watch
```

### Method 3: Shopify CLI

```bash
# Install Shopify CLI
npm install -g @shopify/cli @shopify/theme

# Login to your store
shopify login --store your-store.myshopify.com

# Push theme
shopify theme push

# Or start development server
shopify theme dev
```

## ⚙️ Configuration

### Theme Settings

Access theme settings in **Shopify Admin > Online Store > Themes > Customize**

#### Colors
- **Primary Color**: Warm beige (#F5F1EA)
- **Secondary Color**: Forest green (#2D5016)
- **Accent Color**: Terracotta (#C9764C)
- **Dark Color**: Dark gray (#2B2B2B)

#### Typography
- **Heading Font**: Choose from Shopify font library
- **Body Font**: Choose from Shopify font library
- **Base Font Size**: 14-20px

#### Hero Animation
- **Enable Animation**: Toggle on/off
- **Duration**: 2-5 seconds
- **Particle Count**: 20-60 (desktop)
- **Show Skip Button**: Toggle on/off

#### Product Settings
- **Shipping Text**: Default "Free Shipping"
- **Guarantee Text**: Default "30-Day Money Back Guarantee"
- **Free Shipping Threshold**: € amount

#### Cart Settings
- **Enable AJAX Cart**: Toggle drawer vs. cart page
- **Show Quantity Upsell**: Toggle upsell messaging

#### Conversion Features (Session 3)
- **Enable Purchase Notifications**: Toggle social proof notifications on/off
- **Enable Viewing Counter**: Show/hide live viewer count on product pages
- **Stock Urgency Threshold**: Set inventory level (5-20) that triggers urgency message
- **Enable Recently Viewed**: Toggle recently viewed products section

**Note**: All conversion features are enabled by default for maximum conversion optimization.

### Homepage Setup

The homepage uses JSON templates with customizable sections:

1. **Hero Section**
   - Upload hero image (recommended: 1600x1000px)
   - Set heading, subheading, and CTA button
   - Link CTA to product page

2. **Problem Agitation**
   - Customize problem points (what customers struggle with)
   - Customize solution points (how ShedAway helps)

3. **Product Showcase (How It Works)**
   - Add 3 step blocks
   - Upload icon images for each step (80x80px recommended)
   - Set titles and descriptions

4. **Benefits Grid**
   - Add up to 4 benefit blocks
   - Choose from preset icons or upload custom
   - Set titles and descriptions

5. **Reviews**
   - Add review blocks with 1-5 star ratings
   - Include customer names and locations
   - Add review text

6. **Guarantee Section**
   - Customize heading and description
   - Trust badges are automatic

7. **Final CTA**
   - Set urgency text
   - Configure pricing for 1pc, 2pcs, 3pcs bundles
   - Show savings amounts
   - Set CTA button text and link

### Product Page Setup

1. Create your product in **Products > Add product**
2. Set product title: "ShedAway Pet Hair Removal Glove"
3. Add product description (HTML supported)
4. Upload high-quality images (recommended: 2000x2000px)
5. Add variants:
   - **1 Piece** - €14.95
   - **2 Pieces** - €24.95 (compare at €29.90)
   - **3 Pieces** - €34.95 (compare at €44.85)

### Menu Configuration

Create the following menus in **Navigation**:

#### Main Menu
- Home
- Shop (link to product)
- About Us
- Contact

#### Footer Menu
- Shipping Policy
- Return Policy
- Privacy Policy
- Terms of Service

## 🎨 Customization

### Adding Custom CSS

Add custom styles in **Theme Settings > Custom CSS** or edit `assets/theme.css`:

```css
/* Example: Change primary color */
:root {
  --color-primary: #YourColor;
}
```

### Modifying the Hero Animation

Edit `assets/hero-animation.js`:

```javascript
// Change particle count
this.particleCount = this.isMobile ? 20 : 40;

// Change animation duration
this.animationDuration = 2500; // milliseconds

// Modify particle colors
const colors = [
  '#8B7355', // Brown
  '#D4A574', // Light brown
  // Add your colors...
];
```

### Adding New Sections

Create a new file in `sections/` folder:

```liquid
{% comment %}
  Your Section Name
{% endcomment %}

<section class="your-section">
  {{ section.settings.your_setting }}
</section>

<style>
  .your-section {
    /* Your styles */
  }
</style>

{% schema %}
{
  "name": "Your Section",
  "settings": [
    {
      "type": "text",
      "id": "your_setting",
      "label": "Your Setting"
    }
  ]
}
{% endschema %}
```

## 📱 Mobile Optimization

The theme is mobile-first and fully responsive:

- Hero animation uses fewer particles on mobile (20 vs 40)
- Touch-optimized buttons and interactions
- Hamburger menu for mobile navigation
- Sticky add-to-cart bar on product pages
- Optimized image loading with lazy loading

## 🔧 Troubleshooting

### Hero Animation Not Showing
- Check that animation is enabled in theme settings
- Clear browser cache and session storage
- Verify you're on the homepage (index template)

### Cart Drawer Not Working
- Ensure AJAX cart is enabled in theme settings
- Check browser console for JavaScript errors
- Verify cart routes are correct in theme.liquid

### Images Not Loading
- Ensure images are properly uploaded to Shopify
- Check image URLs in section settings
- Verify file sizes (keep under 2MB for best performance)

### Layout Issues
- Clear theme cache: **Online Store > Themes > Actions > Edit code** > Save a file
- Check browser console for CSS errors
- Verify container classes are applied correctly

### Conversion Features Not Showing (Session 3)
- **Stock Urgency**: Check product has inventory_quantity set and is below threshold (default: 10)
- **Recently Viewed**: Clear localStorage to reset, requires viewing 2+ products
- **Purchase Notifications**: Check feature is enabled in theme settings (Conversion Features section)
- **Viewing Counter**: Verify feature is enabled in theme settings
- **Variant Images**: Ensure variants have featured_image set in Shopify admin

## 🚦 Performance Tips

1. **Optimize Images**
   - Use WebP format when possible
   - Compress before uploading (use TinyPNG)
   - Recommended sizes:
     - Hero images: 1600x1000px
     - Product images: 2000x2000px
     - Icons: 80x80px

2. **Lazy Loading**
   - Images below the fold load automatically with `loading="lazy"`
   - Hero image uses `loading="eager"` for instant display

3. **Minimize Apps**
   - Too many Shopify apps can slow down your store
   - Only install essential apps

4. **Enable Compression**
   - Shopify automatically serves compressed files
   - Ensure theme files are minified

## 📊 Analytics & Tracking

Add your tracking codes in **Shopify Settings > Checkout > Additional scripts**:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>

<!-- Facebook Pixel -->
<script>
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', 'YOUR_PIXEL_ID');
  fbq('track', 'PageView');
</script>
```

## 🎯 Conversion Optimization Checklist

### Core Features
- [ ] High-quality product images uploaded
- [ ] Clear, benefit-focused product descriptions
- [ ] Trust badges visible throughout
- [ ] Social proof (reviews) added
- [ ] Urgency elements configured
- [ ] Free shipping threshold set
- [ ] Bundle pricing displayed
- [ ] 30-day guarantee highlighted
- [ ] Mobile experience tested
- [ ] Checkout process tested
- [ ] Analytics tracking installed

### Session 3 Conversion Features
- [ ] **Stock urgency**: Inventory levels set for all variants
- [ ] **Stock threshold**: Configured in theme settings (5-20 units)
- [ ] **Variant images**: Each variant has featured_image assigned
- [ ] **Purchase notifications**: Enabled in theme settings
- [ ] **Viewing counter**: Enabled and displaying on product pages
- [ ] **Recently viewed**: Tested by viewing multiple products
- [ ] **Trust badges**: Guarantee badge pulsing animation visible
- [ ] **localStorage**: Tested in private/incognito mode
- [ ] **Mobile animations**: All conversion features responsive
- [ ] **Accessibility**: Tested with screen reader and keyboard navigation

## 🆘 Support

For theme support and customization:

1. Check this README for common issues
2. Review Shopify's theme documentation: [shopify.dev/themes](https://shopify.dev/themes)
3. Contact your developer for custom modifications

## 📝 Version History

**v1.2.0** - Session 3: Conversion Optimization Features
- **Stock urgency indicator** with configurable threshold and pulsing animation
- **Variant image switching** with smooth fade transitions
- **Recently viewed products** with localStorage tracking (last 4 products)
- **Purchase notifications** with 20 realistic Dutch customer examples
- **People viewing counter** with natural variation (3-8 viewers)
- **Trust badge enhancements** with pulsing guarantee badge animation
- New "Conversion Features" settings section with 4 toggles
- Performance optimized: <5KB additional JavaScript
- Full accessibility support with prefers-reduced-motion

**v1.1.0** - Session 2: Polish & Advanced Features
- Interactive before/after slider with keyboard navigation
- Advanced animations and scroll effects
- Performance optimizations
- Enhanced mobile responsiveness

**v1.0.0** - Session 1: Initial Release
- Complete Shopify 2.0 theme structure
- Hero animation with particle system
- All homepage sections
- Product page with variants
- AJAX cart drawer
- Mobile responsive design

## 📄 License

This theme is proprietary software developed for ShedAway. All rights reserved.

## 🎨 Credits

- **Design & Development**: Custom built for ShedAway
- **Icons**: Custom SVG icons
- **Fonts**: Shopify font library

---

**Built with ❤️ for ShedAway**
