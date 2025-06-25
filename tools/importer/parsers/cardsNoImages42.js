/* global WebImporter */
export default function parse(element, { document }) {
  // Build header row for the table as in the spec
  const rows = [['Cards (cardsNoImages42)']];

  // Find the main card list container
  const listContainer = element.querySelector('.dynamic-list-container');

  // Find the h2 block title (optional)
  let blockTitle = null;
  if (listContainer) {
    blockTitle = listContainer.querySelector('.card-list-title');
  }

  // Find the desktop card list row (where cards or empty message live)
  const cardsRow = element.querySelector('.card-list__row.dynamic-list-item-container');
  if (cardsRow) {
    const emptyMsg = cardsRow.querySelector('.rsm-empty-message');
    if (emptyMsg) {
      // If there's a block title, include as a table row
      if (blockTitle) rows.push([blockTitle]);
      // Add the 'No items found.' message as a table row (text only)
      const p = emptyMsg.querySelector('p');
      if (p && p.textContent.trim()) {
        rows.push([document.createTextNode(p.textContent.trim())]);
      } else if (emptyMsg.textContent.trim()) {
        rows.push([document.createTextNode(emptyMsg.textContent.trim())]);
      }
    } else {
      // Check if there are cards (they might be divs, articles, lis, etc)
      // For robustness, get all direct children that could represent cards
      const cardCandidates = Array.from(cardsRow.children).filter(child => {
        // Accept likely card containers, ignore any empty (eg. script, style, etc)
        return child.childElementCount > 0 || child.textContent.trim().length > 0;
      });
      cardCandidates.forEach(cardEl => {
        rows.push([cardEl]);
      });
    }
  }

  // Only create the table if we have at least the header and one more row
  if (rows.length > 1) {
    const table = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(table);
  }
}
