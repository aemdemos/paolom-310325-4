/* global WebImporter */
export default function parse(element, { document }) {
  // Get the two columns from the layout
  const columns = element.querySelectorAll(':scope > .column-container > .wrap > .container');

  // First column: image (blue number)
  let imageEl = null;
  if (columns.length > 0) {
    imageEl = columns[0].querySelector('img');
  }

  // Second column: heading and paragraph text
  let contentEls = [];
  if (columns.length > 1) {
    // Get all heading(s) in second column
    const headings = columns[1].querySelectorAll('h1, h2, h3, h4, h5, h6');
    headings.forEach(h => contentEls.push(h));
    // Get all text paragraphs in second column
    const paragraphs = columns[1].querySelectorAll('p');
    paragraphs.forEach(p => contentEls.push(p));
  }

  // Build the hero block table as per example: header, image, then content
  const cells = [
    ['Hero'],
    [imageEl || ''],
    [contentEls]
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
