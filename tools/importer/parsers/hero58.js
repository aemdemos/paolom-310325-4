/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract the background image URL from background-image style
  function getBackgroundImageUrl(el) {
    const bgSpan = el.querySelector('.desktop-background[style*="background-image"]');
    if (bgSpan) {
      const style = bgSpan.getAttribute('style');
      const match = /background-image\s*:\s*url\(['"]?([^'")]+)['"]?\)/i.exec(style);
      if (match) return match[1];
    }
    return null;
  }

  // Get background image if present
  const bgUrl = getBackgroundImageUrl(element);
  let bgImgEl = null;
  if (bgUrl) {
    bgImgEl = document.createElement('img');
    bgImgEl.src = bgUrl;
    bgImgEl.alt = '';
    bgImgEl.loading = 'lazy';
  }

  // Gather main content (heading, subheading/description, cta)
  // Try to capture all cmp-title__text, cmp-text, and cta buttons in source order
  let contentElements = [];
  // Get all .cmp-title__text (usually h2 or h1)
  const titles = element.querySelectorAll('.cmp-title__text');
  titles.forEach(t => contentElements.push(t));
  // Get all paragraph elements inside .cmp-text
  const texts = element.querySelectorAll('.cmp-text p');
  texts.forEach(p => contentElements.push(p));
  // Get all CTAs (a.cmp-button inside .button, or .cmp-button)
  const ctas = element.querySelectorAll('.cmp-button, a.cmp-button');
  // Only add unique ones (avoid duplicates)
  const added = new Set();
  ctas.forEach(cta => {
    if (!added.has(cta)) {
      contentElements.push(cta);
      added.add(cta);
    }
  });

  // Remove any empty text nodes or spaces
  contentElements = contentElements.filter(el => {
    if (!el) return false;
    if (el.nodeType === Node.ELEMENT_NODE) {
      if (el.textContent && el.textContent.trim() === '') return false;
      return true;
    }
    return false;
  });

  // Compose table rows: header, background-image, content
  // 1st row: block header, exactly as in the markdown example
  // 2nd row: image element or empty string
  // 3rd row: all content (heading, text, button) in a single cell (as array)
  const rows = [
    ['Hero'],
    [bgImgEl ? bgImgEl : ''],
    [contentElements.length ? contentElements : ''],
  ];

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
