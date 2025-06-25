/* global WebImporter */
export default function parse(element, { document }) {
  // The header row must have exactly one cell
  const headerRow = ['Columns (columns100)'];

  // Find the two main column blocks inside the .wrap
  let wrap = element.querySelector('.column-container > .wrap');
  if (!wrap) {
    wrap = element.querySelector('.wrap');
  }
  let columns = [];
  if (wrap) {
    columns = Array.from(wrap.querySelectorAll(':scope > .container.responsivegrid.cmp-section__item'));
  }
  // Fallback: try to find immediate children if not found via wrap
  if (columns.length === 0) {
    columns = Array.from(element.querySelectorAll(':scope > .container.responsivegrid.cmp-section__item'));
  }
  // Fallback: any found in the DOM, but should not be needed
  if (columns.length === 0) {
    columns = Array.from(element.querySelectorAll('.container.responsivegrid.cmp-section__item'));
  }

  // For each column, extract its main content (see earlier logic)
  const columnCells = columns.map((col) => {
    const container = col.querySelector('.cmp-container_container');
    if (container) {
      const children = Array.from(container.children);
      if (children.length === 1) {
        return children[0];
      } else if (children.length > 1) {
        const div = document.createElement('div');
        children.forEach(child => div.appendChild(child));
        return div;
      }
      return container;
    } else {
      return col;
    }
  });

  // Only create table if there are columns
  if (columnCells.length > 0) {
    // Header row: single cell
    // Content row: N cells (one per column)
    const cells = [
      headerRow,
      columnCells,
    ];
    const table = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(table);
  }
}
