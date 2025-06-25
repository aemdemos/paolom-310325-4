/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get the columns (direct children of wrap)
  function getColumnsFromWrap(wrap) {
    // Find all .container elements directly under the wrap
    const containers = Array.from(wrap.querySelectorAll(':scope > .container'));
    return containers.map(container => {
      // The standard structure: .cmp-container_container > div > (.image|.text)
      // But sometimes may have only image or only text
      const cc = container.querySelector('.cmp-container_container > div');
      if (!cc) return container;
      // Gather all .image or .text children in this column
      // Always preserve order
      const items = [];
      cc.childNodes.forEach(child => {
        if (child.nodeType === 1) {
          // Only Elements
          if (child.classList.contains('image') || child.classList.contains('cmp-image')) {
            items.push(child);
          } else if (child.classList.contains('text') || child.classList.contains('cmp-text')) {
            items.push(child);
          }
        }
      });
      // If nothing found, fallback to cc
      if (items.length === 0) return cc;
      if (items.length === 1) return items[0];
      return items;
    });
  }

  // Find the correct wrap element (the one with class 'wrap')
  let wrap = element.querySelector('.wrap');
  if (!wrap) {
    // Sometimes .wrap is directly on the element
    if (element.classList.contains('wrap')) wrap = element;
    // Sometimes top-level is the .column-container > .wrap
    else {
      const maybeWrap = element.querySelector(':scope > .column-container > .wrap');
      if (maybeWrap) wrap = maybeWrap;
      else wrap = element; // fallback, shouldn't happen
    }
  }

  // Extract columns
  const columnsContent = getColumnsFromWrap(wrap);
  // If we don't have at least 2 columns, not a columns block
  if (columnsContent.length < 2) return;

  // Build the table rows
  const headerRow = ['Columns (columns1)'];
  const contentRow = columnsContent;

  const cells = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  element.replaceWith(table);
}
