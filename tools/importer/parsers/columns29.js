/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the bio card list container
  const bioCardList = element.querySelector('.cmp-bio-card-list__expanded > .cmp-bio-card-list__items');
  if (!bioCardList) return;

  // Get all the bio card <li> elements
  const cards = Array.from(bioCardList.children).filter(child => child.matches('li.cmp-bio-card-list__item'));

  const columnsCount = 4; // As in the screenshot and the HTML
  const cells = [];

  // Header row as required
  cells.push(['Columns (columns29)']);

  // Create row arrays, each with up to 4 cards
  for (let i = 0; i < cards.length; i += columnsCount) {
    const row = cards.slice(i, i + columnsCount);
    // Pad the last row with empty strings if necessary
    while (row.length < columnsCount) {
      row.push('');
    }
    cells.push(row);
  }

  // Create and replace with the table block
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the highest-level parent section containing the bio card list
  const section = element.querySelector('section.cmp-bio-card-list');
  if (section) {
    section.replaceWith(table);
  } else {
    element.replaceWith(table);
  }
}
