/* global WebImporter */
export default function parse(element, { document }) {
  // The header row must be a single cell
  const headerRow = ['Columns (columns99)'];

  // Get all columns as before
  let columnEls = Array.from(
    element.querySelectorAll(':scope > .column-container > .wrap.with-divider > .container.responsivegrid.cmp-section__item')
  );
  if (columnEls.length === 0) {
    columnEls = Array.from(element.querySelectorAll('.container.responsivegrid.cmp-section__item'));
  }

  // For each column, extract its main content
  const columns = columnEls.map((col) => {
    const container = col.querySelector('.cmp-container_container > div');
    return container || col;
  });

  // The second row should have as many columns as needed (corresponds to number of columns)
  const contentRow = columns;

  // Assemble the table: header row (single cell), then a row with cells for each column
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  element.replaceWith(table);
}
