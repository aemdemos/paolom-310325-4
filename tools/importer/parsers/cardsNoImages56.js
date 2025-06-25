/* global WebImporter */
export default function parse(element, { document }) {
  // Get all card groups (columns)
  const columnContainers = element.querySelectorAll('.columncontainer');
  const rows = [
    ['Cards (cardsNoImages56)'],
  ];

  columnContainers.forEach((columnContainer) => {
    // Each column has two 'cmp-section__item': first is icon, second is the content
    const items = columnContainer.querySelectorAll(':scope > .column-container > .wrap > .container.responsivegrid.cmp-section__item');
    if (items.length === 2) {
      const contentSection = items[1];
      const cmpText = contentSection.querySelector('.cmp-text');
      if (cmpText) {
        rows.push([cmpText]);
      }
    } else {
      // fallback: look for .cmp-text anywhere under the column
      const fallbackText = columnContainer.querySelector('.cmp-text');
      if (fallbackText) {
        rows.push([fallbackText]);
      }
    }
  });

  // Only create a table if we have at least one card
  if (rows.length > 1) {
    const table = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(table);
  }
}
