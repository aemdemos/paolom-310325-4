/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find the block's columns: each column is a .cmp-section__item (representing a column)
  // The .cmp-section__item can be nested in wrappers, so we must drill down.
  // We'll collect all top-level .cmp-section__item in visual order

  // Helper to get all immediate .cmp-section__item under the columns container
  function getColumnsFromElement(el) {
    // There may be multiple wrappers. We want .cmp-section__item that are direct children of some wrapper.
    // We'll search recursively for .column-container or .columncontainer, then for its direct .cmp-section__item children
    const columns = [];
    // Try to find .column-container
    let colContainers = el.querySelectorAll('.column-container');
    if (!colContainers.length) {
      colContainers = el.querySelectorAll('.columncontainer');
    }
    if (!colContainers.length) {
      // fallback: try at root level
      colContainers = [el];
    }
    for (const colContainer of colContainers) {
      // Find all direct children with .wrap
      const wraps = Array.from(colContainer.children).filter(c => c.classList && (c.classList.contains('wrap') || c.classList.contains('cmp-section__item')));
      for (const wrap of wraps) {
        // If .wrap, it's a wrapper for a column, so descend to its .cmp-section__item
        if (wrap.classList.contains('wrap')) {
          // Find the direct .cmp-section__item under this wrap
          const section = Array.from(wrap.children).find(c => c.classList && c.classList.contains('cmp-section__item'));
          if (section) {
            columns.push(section);
          }
        } else if (wrap.classList.contains('cmp-section__item')) {
          columns.push(wrap);
        }
      }
      // If not found, try direct .cmp-section__item children of colContainer
      if (!columns.length) {
        const sections = Array.from(colContainer.children).filter(c => c.classList && c.classList.contains('cmp-section__item'));
        columns.push(...sections);
      }
    }
    return columns;
  }

  // Extract columns
  const columns = getColumnsFromElement(element).map(col => {
    // Per best practices, reference the main container within each column for cleanest content
    const container = col.querySelector('.cmp-container_container');
    return container || col;
  });

  // Defensive: if less than 2 columns, fallback
  if (columns.length < 2) {
    // Try to find all .cmp-section__item anywhere in the subtree as fallback
    const fallbackCols = Array.from(element.querySelectorAll('.cmp-section__item'));
    for (let i = columns.length; i < 2 && i < fallbackCols.length; i++) {
      const container = fallbackCols[i].querySelector('.cmp-container_container');
      columns.push(container || fallbackCols[i]);
    }
  }

  // Ensure at least two columns for columns block (per example)
  if (columns.length < 2) {
    // If only one found, just use what we have (edge case handling)
    while (columns.length < 2) columns.push(document.createElement('div'));
  }

  // Compose cells array: header, then one row with the columns
  const headerRow = ['Columns (columns59)'];
  const cells = [
    headerRow,
    columns
  ];

  // Create table
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element with the table
  element.replaceWith(table);
}
