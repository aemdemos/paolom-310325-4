/* global WebImporter */
export default function parse(element, { document }) {
  // First row: exact header as in the example
  const headerRow = ['Hero'];

  // Second row: background image (optional, blank if not present)
  let imageCell = [''];
  // Try to find a background image set by style attribute or image element (futureproof)
  const bgElm = element.querySelector('.cmp-hero__background');
  if (bgElm) {
    // Look for any element with a background image style
    const spans = bgElm.querySelectorAll('span, div');
    for (const span of spans) {
      const style = span.getAttribute('style');
      if (style && /background-image\s*:/i.test(style)) {
        const urlMatch = style.match(/background-image\s*:\s*url\(['"]?([^'"]+)['"]?\)/i);
        if (urlMatch && urlMatch[1]) {
          const img = document.createElement('img');
          img.src = urlMatch[1];
          img.alt = '';
          imageCell = [img];
          break;
        }
      }
    }
    // If no background-image, look for <img> (in case future HTML provides one)
    if (imageCell[0] === '' || imageCell.length === 0) {
      const img = bgElm.querySelector('img');
      if (img) imageCell = [img];
    }
  }

  // Third row: all hero content (headings, subheadings, CTAs, etc.)
  // - Keep all original elements and preserve their semantics and structure.
  // - Content is inside .cmp-hero__content
  let contentCell = [''];
  const contentDiv = element.querySelector('.cmp-hero__content');
  if (contentDiv) {
    // Collect all children except for breadcrumbs/navs, preserving structure
    const contentNodes = [];
    Array.from(contentDiv.childNodes).forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        // Exclude breadcrumb or nav
        if (node.matches('.breadcrumb, nav, .cmp-breadcrumb')) return;
        contentNodes.push(node);
      } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
        contentNodes.push(node);
      }
    });
    // If nothing found, fallback to the full contentDiv
    if (contentNodes.length === 0) {
      if (contentDiv.textContent.trim()) {
        contentCell = [contentDiv.textContent.trim()];
      }
    } else {
      contentCell = contentNodes;
    }
  }

  // Compose the block table (1 col, 3 rows, header is always exactly 'Hero')
  const cells = [
    headerRow,
    imageCell,
    contentCell
  ];

  // Build and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
