/* global WebImporter */
export default function parse(element, { document }) {
  // Find the columns wrapper
  const wrap = element.querySelector('.wrap.with-divider.c-75-25');
  if (!wrap) return;
  // Select all direct column containers
  const columns = wrap.querySelectorAll(':scope > .container.responsivegrid');
  if (columns.length < 2) return;

  // Table structure: header row is one cell, content row has two cells
  const headerRow = ['Columns (columns31)'];

  // Extract content for each column
  const colCells = Array.from(columns).map(col => {
    // Use the deepest .cmp-container_container if present, otherwise col
    const inner = col.querySelector(':scope > .cmp-container > .cmp-container_container');
    return inner || col;
  });

  // Build cells structure
  // First row: 1 cell (header), Second row: 2 cells (columns)
  const cells = [
    headerRow,
    colCells,
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
