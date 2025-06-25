/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: find the direct child .columncontainer/.column-container/.wrap.c-thirds as the block-outer
  let columnsRoot = null;

  // Try to find the main columns wrapper (should contain 3 column containers)
  // Most deeply nested .wrap.c-thirds or .columncontainer or .column-container
  const possibleWrappers = [
    '.wrap.c-thirds',
    '.column-container',
    '.columncontainer',
  ];
  for (const selector of possibleWrappers) {
    const found = element.querySelector(selector);
    if (found && found.querySelectorAll('.cmp-section__item').length >= 2) {
      columnsRoot = found;
      break;
    }
  }
  // Fallback: find the parent of all .cmp-section__item
  if (!columnsRoot) {
    const allColumns = element.querySelectorAll('.cmp-section__item');
    if (allColumns.length >= 2) {
      columnsRoot = allColumns[0].parentElement;
    }
  }

  // Get all immediate .cmp-section__item children (the columns)
  let columnEls = [];
  if (columnsRoot) {
    columnEls = Array.from(columnsRoot.querySelectorAll(':scope > .container.cmp-section__item')); // strict structure
    if (columnEls.length === 0) {
      columnEls = Array.from(columnsRoot.querySelectorAll(':scope > .cmp-section__item'));
    }
  }
  // Fallback: just all .cmp-section__item inside element
  if (columnEls.length === 0) {
    columnEls = Array.from(element.querySelectorAll('.cmp-section__item'));
  }
  // Defensive: filter only those that have real content
  columnEls = columnEls.filter(col => col.querySelector('.cmp-title, .cmp-text, .image'));
  // Each column may have extra wrappers inside (cmp-container_container > div)
  // To maximize robustness, extract the deepest single main child if present
  function getColumnContent(col) {
    // Sometimes it's cmp-container_container > div
    const cc = col.querySelector('.cmp-container_container > div');
    if (cc) return cc;
    // Sometimes just the col
    return col;
  }
  const columns = columnEls.map(getColumnContent);
  // Create header and content row
  const headerRow = ['Columns (columns22)'];
  const contentRow = columns;
  const cells = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}