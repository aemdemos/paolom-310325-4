/* global WebImporter */
export default function parse(element, { document }) {
  // The header row must have only one cell, with the exact text
  const headerRow = ['Columns (columns64)'];

  // Find the column containers
  let columnRoots = [];

  const wrap = element.querySelector('.column-container > .wrap');
  if (wrap) {
    columnRoots = Array.from(wrap.querySelectorAll(':scope > .container.responsivegrid.cmp-section__item'));
  }
  // fallback if structure is different
  if (columnRoots.length === 0) {
    columnRoots = Array.from(element.querySelectorAll(':scope > .container.responsivegrid.cmp-section__item'));
  }

  // Each column is the inner content of .cmp-container_container
  const columns = columnRoots.map((container) => {
    const contentWrap = container.querySelector('.cmp-container_container');
    if (contentWrap) {
      const frag = document.createDocumentFragment();
      Array.from(contentWrap.children).forEach(child => {
        frag.appendChild(child);
      });
      return frag;
    }
    return document.createTextNode('');
  });

  // Only continue if we have columns
  if (columns.length === 0) return;

  // The block table: first row = single cell header, second row = columns
  const table = WebImporter.DOMUtils.createTable([
    headerRow, // one cell
    columns    // n cells; each column is a cell
  ], document);
  element.replaceWith(table);
}
