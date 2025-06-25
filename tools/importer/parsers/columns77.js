/* global WebImporter */
export default function parse(element, { document }) {
  // Build proper header row: only one column, even for multi-column blocks
  const headerRow = ['Columns (columns77)'];

  // Find the image (profile)
  let img = null;
  const imgDiv = element.querySelector('.cmp-quote-img');
  if (imgDiv) {
    img = imgDiv.querySelector('img');
  }

  // Right column: quote and attribution
  let quoteContent = [];
  const desDiv = element.querySelector('.cmp-quote-des');
  if (desDiv) {
    const quoteText = desDiv.querySelector('.cmp-quote-text');
    if (quoteText) quoteContent.push(quoteText);
    const quoteTitle = desDiv.querySelector('.cmp-quote-title');
    if (quoteTitle) quoteContent.push(quoteTitle);
  }

  // Table body row: as many cells as columns (2 in this case)
  const contentRow = [img, quoteContent];

  // Compose block table: header is one column only, next row is two columns
  const rows = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
