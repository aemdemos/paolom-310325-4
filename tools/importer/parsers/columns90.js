/* global WebImporter */
export default function parse(element, { document }) {
  // Find the columns wrapper that contains the repeated column items
  const wrap = element.querySelector('.wrap.c-thirds, .wrap.with-divider.c-thirds');
  let columns = [];

  if (wrap) {
    // Find all immediate column containers within the wrapper
    const colItems = Array.from(wrap.querySelectorAll(':scope > .container.cmp-section__item'));
    columns = colItems.map((col) => {
      // Each column: collect all content in its .cmp-container_container (preferred), else all children
      const container = col.querySelector('.cmp-container_container');
      if (container) {
        // Return direct children as an array
        return Array.from(container.children);
      } else {
        return Array.from(col.children);
      }
    });
  } else {
    // If wrap not found, fallback: try to find a single .columncontainer
    const singleCol = element.querySelector('.columncontainer, .column-container');
    if (singleCol) {
      columns = [Array.from(singleCol.children)];
    } else {
      columns = [Array.from(element.children)];
    }
  }

  // Instead of using createTable for the header row, construct the table manually to allow proper colspan
  const table = document.createElement('table');
  const headerTr = document.createElement('tr');
  const th = document.createElement('th');
  th.textContent = 'Columns (columns90)';
  th.setAttribute('colspan', columns.length);
  headerTr.appendChild(th);
  table.appendChild(headerTr);

  const rowTr = document.createElement('tr');
  columns.forEach((colNodes) => {
    const td = document.createElement('td');
    colNodes.forEach((node) => td.appendChild(node));
    rowTr.appendChild(td);
  });
  table.appendChild(rowTr);

  element.replaceWith(table);
}
