/* global WebImporter */
export default function parse(element, { document }) {
  // Find all column containers: select the three columns
  let columns = Array.from(
    element.querySelectorAll(':scope > div > div.wrap.c-thirds > div.container.responsivegrid.cmp-section__item')
  );
  if (columns.length === 0) {
    columns = Array.from(
      element.querySelectorAll(':scope > div > div.wrap.c-thirds > div.container.responsivegrid')
    );
  }

  // For each column, extract all content (including text and elements)
  const colCells = columns.map(col => {
    const container = col.querySelector('.cmp-container_container') || col;
    // Gather all direct children in order, converting iframes to links
    const items = [];
    Array.from(container.childNodes).forEach(node => {
      if (node.nodeType === 1 && node.querySelector && node.querySelector('iframe')) {
        // For each iframe inside this element, convert to a link
        node.querySelectorAll('iframe').forEach(iframe => {
          const link = document.createElement('a');
          link.href = iframe.src;
          link.textContent = iframe.src;
          items.push(link);
        });
      } else if (node.nodeType === 1 || (node.nodeType === 3 && node.textContent.trim())) {
        items.push(node);
      }
    });
    return items.length ? items : [container];
  });

  // Build the table: header row is a single cell, content row matches number of columns
  const cells = [
    ['Columns (columns96)'],
    colCells
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
