/* global WebImporter */
export default function parse(element, { document }) {
  // Table header exactly as in the example
  const header = ['Hero'];

  // Get the testimonial image (may be absent)
  const imgEl = element.querySelector('.cmp-quote-img img');

  // Compose the text block for the 3rd row
  // - The quote text (q)
  // - The attribution (name/title)
  const quoteText = element.querySelector('.cmp-quote-text q');
  const attribution = element.querySelector('.cmp-quote-title');

  // Compose content for text cell (quote + attribution)
  const contentCell = document.createElement('div');
  if (quoteText) {
    contentCell.appendChild(quoteText);
  }
  if (attribution) {
    if (quoteText) contentCell.appendChild(document.createElement('br'));
    contentCell.appendChild(attribution);
  }

  // Build table rows as in the markdown example
  const cells = [
    header,
    [imgEl ? imgEl : ''],
    [contentCell]
  ];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  
  // Replace with the new structured block
  element.replaceWith(table);
}
