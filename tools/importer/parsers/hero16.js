/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract a background image URL from style attributes
  function extractBgUrl(style) {
    if (!style) return null;
    const match = style.match(/background-image:\s*url\(['"]?([^'")]+)['"]?\)/i);
    return match ? match[1] : null;
  }

  // Find the hero block
  const hero = element.querySelector('[data-cmp-is="cmp-hero"]');
  if (!hero) return;

  // Locate background image: prefer desktop, fallback to mobile
  let bgUrl = null, alt = '';
  const bg = hero.querySelector('.cmp-hero__background');
  if (bg) {
    const desktopBg = bg.querySelector('.desktop-background');
    const mobileBg = bg.querySelector('.mobile-background');
    let bgEl = desktopBg || mobileBg;
    if (bgEl) {
      bgUrl = extractBgUrl(bgEl.getAttribute('style'));
      alt = bgEl.getAttribute('aria-label') || bgEl.getAttribute('alt') || '';
    }
  }

  // Create an <img> only if a background image exists
  let imgEl = null;
  if (bgUrl) {
    imgEl = document.createElement('img');
    imgEl.src = bgUrl;
    imgEl.setAttribute('alt', alt);
  }

  // Extract all hero content as a single cell (headings, subheadings, etc.)
  // The .cmp-hero__content node contains everything visually rendered on the hero overlay
  let contentCell = '';
  const content = hero.querySelector('.cmp-hero__content');
  if (content) {
    // Gather all direct children and preserve their block-level structure
    // Get all elements and text nodes
    const fragment = document.createDocumentFragment();
    Array.from(content.childNodes).forEach((node) => {
      if (node.nodeType === 1) {
        fragment.appendChild(node);
      } else if (node.nodeType === 3 && node.textContent.trim()) {
        const span = document.createElement('span');
        span.textContent = node.textContent.trim();
        fragment.appendChild(span);
      }
    });
    // Fallback: if fragment is empty, get all descendant elements with text
    if (!fragment.childNodes.length) {
      const blocks = content.querySelectorAll('h1, h2, h3, h4, h5, h6, p, a, span, div');
      blocks.forEach(b => {
        if (b.textContent.trim()) fragment.appendChild(b);
      });
    }
    contentCell = fragment.childNodes.length ? Array.from(fragment.childNodes) : '';
  }

  // Compose block table to match the example: 1 column, 3 rows
  const cells = [
    ['Hero'],
    [imgEl ? imgEl : ''],
    [contentCell],
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
