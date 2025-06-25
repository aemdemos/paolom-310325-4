/* global WebImporter */
export default function parse(element, { document }) {
  // Header row, matches example exactly
  const cells = [['Hero']];

  // Row 2: Background Image (optional)
  // Find the first <img> in the element (logo image)
  const bgImg = element.querySelector('img');
  cells.push([bgImg || '']);

  // Row 3: Title, Subheading, etc (all visible text content not part of social links)
  // We'll gather all visible headings and paragraphs
  const content = [];

  // Title (most likely in h3.cmp-title__text)
  const title = element.querySelector('.cmp-title__text');
  if (title) {
    // Use the existing element, but convert to h1 to match Hero semantics
    if (title.tagName.toLowerCase() !== 'h1') {
      const h1 = document.createElement('h1');
      h1.textContent = title.textContent.trim();
      content.push(h1);
    } else {
      content.push(title);
    }
  }

  // Subheading or tag line (look for .cmp-text p or similar)
  const subheading = element.querySelector('.cmp-text p');
  if (subheading) {
    content.push(subheading);
  }

  // If no title/subheading found, try to extract any headings or paragraphs that are not part of social
  if (content.length === 0) {
    element.querySelectorAll('h1, h2, h3, h4, h5, h6, p').forEach(node => {
      if (!node.closest('ul')) {
        content.push(node);
      }
    });
  }

  // Add the content row (always a single cell, may be empty string)
  cells.push([content.length ? content : '']);

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original element with the new block
  element.replaceWith(table);
}
