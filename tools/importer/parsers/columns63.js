/* global WebImporter */
export default function parse(element, { document }) {
  // The header must be a single column (matches example)
  const headerRow = ['Columns (columns63)'];

  // Extract columns (each .container.responsivegrid.cmp-section__item)
  let columns = Array.from(element.querySelectorAll(':scope > div.column-container > div.wrap > div.container.responsivegrid.cmp-section__item'));
  if (columns.length === 0) {
    columns = Array.from(element.querySelectorAll(':scope > div.container.responsivegrid.cmp-section__item'));
  }
  if (columns.length === 0) {
    columns = Array.from(element.children);
  }

  // Table cells: header as a single column, then one row with all columns
  const cells = [
    headerRow,
    columns
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
