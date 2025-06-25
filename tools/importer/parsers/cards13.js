/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as per the example
  const headerRow = ['Cards (cards13)'];
  // Get all immediate card <li> elements
  const cards = Array.from(element.querySelectorAll(':scope > li.cmp-bio-card-list__item'));
  const rows = cards.map(card => {
    // Get image element for first cell
    const img = card.querySelector('.cmp-bio-card__avatar img');
    // Second cell: name (bold), job title, link (CTA)
    const content = card.querySelector('.cmp-bio-card__content');
    const name = content && content.querySelector('.cmp-bio-card__name');
    const jobTitle = content && content.querySelector('.cmp-bio-card__job-title');
    const link = content && content.querySelector('.cmp-bio-card__link a');
    // Build the text content array for the second cell
    const cellContent = [];
    if (name) {
      const strong = document.createElement('strong');
      strong.textContent = name.textContent.trim();
      cellContent.push(strong);
      cellContent.push(document.createElement('br'));
    }
    if (jobTitle && jobTitle.textContent.trim()) {
      cellContent.push(document.createTextNode(jobTitle.textContent.trim()));
      cellContent.push(document.createElement('br'));
    }
    if (link) {
      // Insert a <br> before link if above exists and is not already a <br>
      if (cellContent.length && cellContent[cellContent.length-1].tagName !== 'BR') {
        cellContent.push(document.createElement('br'));
      }
      cellContent.push(link);
    }
    // Remove trailing <br> if present
    while (cellContent.length && cellContent[cellContent.length-1].tagName === 'BR') {
      cellContent.pop();
    }
    return [img, cellContent];
  });
  // Build the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);
  element.replaceWith(table);
}
