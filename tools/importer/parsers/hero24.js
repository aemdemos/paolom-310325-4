/* global WebImporter */
export default function parse(element, { document }) {
  // The example table structure is:
  // [ ['Hero'], [image], [text block] ]

  // Find the innermost cmp-container_container with both .cmp-image and .cmp-text
  let imageBlock = null;
  let textBlock = null;
  const containers = element.querySelectorAll('.cmp-container_container');
  for (const container of containers) {
    const img = container.querySelector('.cmp-image img');
    const txt = container.querySelector('.cmp-text');
    if (img && txt) {
      imageBlock = container.querySelector('.cmp-image');
      textBlock = txt;
      break;
    }
  }

  // Fallbacks if not found (should rarely happen)
  if (!imageBlock) {
    const img = element.querySelector('.cmp-image');
    if (img) imageBlock = img;
  }
  if (!textBlock) {
    const txt = element.querySelector('.cmp-text');
    if (txt) textBlock = txt;
  }

  // Defensive fallback: if neither, create placeholders
  if (!imageBlock) imageBlock = document.createElement('div');
  if (!textBlock) textBlock = document.createElement('div');

  // Build Hero block table as per requirements
  const cells = [
    ['Hero'],
    [imageBlock],
    [textBlock],
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
