/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main list of card items
  const cardsList = element.querySelector('ul.cmp-bio-card-list__items');
  if (!cardsList) return;
  const cards = Array.from(cardsList.children).filter(li => li.classList.contains('cmp-bio-card-list__item'));

  const rows = [['Cards (cards81)']];

  cards.forEach(card => {
    // First cell: Use the <img> element directly if present
    let img = card.querySelector('.cmp-bio-card__image img');
    let imgCell = img || '';

    // Second cell: Reference the entire content block
    // This ensures all text, styling, and links are preserved
    let content = card.querySelector('.cmp-bio-card__content');
    let contentCell = content || '';

    rows.push([imgCell, contentCell]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
