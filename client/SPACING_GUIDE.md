/**
 * Spacing System Documentation
 * ============================
 * 
 * This document explains how to use the unified spacing system in EstateOS.
 * All spacing follows an 8px rhythm to maintain consistency.
 */

/* CONTAINER EXAMPLES */

/*
Example 1: Full-width page container
<div class="layout-container">
  <h1>Page Title</h1>
</div>

Example 2: Compact container (narrower max-width)
<div class="layout-container-compact">
  <form>...</form>
</div>
*/

/* SECTION SPACING EXAMPLES */

/*
Example 1: Hero section (large spacing)
<section class="section-hero">
  <div class="layout-container">
    <h1>Welcome to EstateOS</h1>
  </div>
</section>

Example 2: Standard section (medium spacing)
<section class="section-standard">
  <div class="layout-container">
    <h2>Our Properties</h2>
  </div>
</section>

Example 3: Compact section (minimal spacing)
<section class="section-compact">
  <div class="layout-container">
    <h3>Quick Links</h3>
  </div>
</section>
*/

/* CARD PADDING EXAMPLES */

/*
Example 1: Standard card padding
<div class="card-padding glass-premium">
  <h3>Property Details</h3>
  <p>Information here...</p>
</div>

Example 2: Large card padding (more spacious)
<div class="card-padding-lg glass-premium">
  <h3>Premium Property</h3>
  <p>Information here...</p>
</div>

Example 3: Small card padding (compact)
<div class="card-padding-sm">
  <p>Brief info</p>
</div>
*/

/* FLEX LAYOUT EXAMPLES */

/*
Example 1: Row with centered items
<div class="flex-row-center">
  <span>Label</span>
  <input type="text" />
</div>

Example 2: Row with space between
<div class="flex-row-between">
  <h2>Title</h2>
  <button>Action</button>
</div>

Example 3: Column layout
<div class="flex-col">
  <input placeholder="Name" />
  <input placeholder="Email" />
  <button>Submit</button>
</div>

Example 4: Column with compact spacing
<div class="flex-col-compact">
  <label>Option 1</label>
  <label>Option 2</label>
</div>

Example 5: Column with spacious spacing
<div class="flex-col-spacious">
  <h3>Section 1</h3>
  <p>Content...</p>
  <h3>Section 2</h3>
  <p>Content...</p>
</div>
*/

/* GRID LAYOUT EXAMPLES */

/*
Example 1: 2-column grid (auto-responsive)
<div class="grid-2-col">
  <div class="card-padding glass-premium">Property 1</div>
  <div class="card-padding glass-premium">Property 2</div>
</div>

Example 2: 3-column grid
<div class="grid-3-col">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>

Example 3: 4-column grid
<div class="grid-4-col">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
  <div>Item 4</div>
</div>
*/

/* MARGIN UTILITIES EXAMPLES */

/*
Example 1: Top margin - hero size
<h2 class="mt-hero">Major Section</h2>

Example 2: Top margin - large
<div class="mt-lg">Content</div>

Example 3: Bottom margin
<p class="mb-md">Paragraph with bottom spacing</p>

Example 4: Center with margin
<div class="mx-auto" style="width: max-content;">
  Centered content
</div>
*/

/* STACK SPACING EXAMPLES */

/*
Example 1: Large vertical stack (6 units = 48px between items)
<div class="stack-lg">
  <h3>Item 1</h3>
  <h3>Item 2</h3>
  <h3>Item 3</h3>
</div>

Example 2: Medium vertical stack
<div class="stack-md">
  <p>Paragraph 1</p>
  <p>Paragraph 2</p>
</div>

Example 3: Small vertical stack
<div class="stack-sm">
  <li>List item 1</li>
  <li>List item 2</li>
</div>
*/

/* COMPLETE PAGE EXAMPLE */

/*
<main>
  <!-- Hero Section -->
  <section class="section-hero">
    <div class="layout-container">
      <h1 class="heading-cinematic">Welcome</h1>
      <p class="text-body-elegant">Subtitle text</p>
    </div>
  </section>

  <!-- Properties Grid Section -->
  <section class="section-standard">
    <div class="layout-container">
      <h2 class="heading-section mb-md">Featured Properties</h2>
      <div class="grid-3-col">
        <div class="card-padding-lg glass-premium">
          <h3>Property 1</h3>
          <p>Details...</p>
        </div>
        <div class="card-padding-lg glass-premium">
          <h3>Property 2</h3>
          <p>Details...</p>
        </div>
        <div class="card-padding-lg glass-premium">
          <h3>Property 3</h3>
          <p>Details...</p>
        </div>
      </div>
    </div>
  </section>

  <!-- CTA Section -->
  <section class="section-compact">
    <div class="layout-container">
      <div class="flex-row-center">
        <p>Ready to get started?</p>
        <button class="btn-cinematic">Get Started</button>
      </div>
    </div>
  </section>
</main>
*/

/* KEY SPACING VALUES */

/*
--spacing-1: 8px   (very small gaps)
--spacing-2: 16px  (small gaps, button padding)
--spacing-3: 24px  (standard gaps, grid gaps)
--spacing-4: 32px  (medium gaps, card padding small)
--spacing-5: 40px  (large gaps)
--spacing-6: 48px  (card padding standard)
--spacing-8: 64px  (card padding large)
--spacing-10: 80px (container padding desktop)
--spacing-12: 96px (section padding mobile)
--spacing-16: 128px (dense section padding)
--spacing-20: 160px (hero section padding)
*/

/* BREAKPOINTS */

/*
Desktop (default):   > 1024px
Tablet:   768px - 1024px
Mobile:   < 768px

All classes have media queries to adjust spacing at these breakpoints.
*/

/* BEST PRACTICES */

/*
1. Always use spacing classes, never hardcode pixel values
2. Use section-* classes for vertical sections
3. Use layout-container or layout-container-compact for width control
4. Use grid-* classes for responsive multi-column layouts
5. Use flex-* classes for flexible layouts
6. Stack utility classes (e.g., mt-lg, mb-md) for precise control
7. Use stack-* classes for lists and repeated elements
8. Keep card-padding-* consistent within similar components
9. Test spacing on mobile/tablet/desktop
10. Refer to this file when unsure about spacing decisions
*/
