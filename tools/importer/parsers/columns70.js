/* global WebImporter */
export default function parse(element, { document }) {
  // The header row must contain exactly one cell, per the example
  const headerRow = ['Columns (columns70)'];

  // Get the 4 buttons as columns
  // Select all .container.responsivegrid representing columns
  const containers = element.querySelectorAll('.column-container > .wrap > .container.responsivegrid');
  const columns = [];
  containers.forEach((container) => {
    const btn = container.querySelector('a.cmp-button');
    if (btn) columns.push(btn);
    else columns.push(container); // fallback
  });

  // The structure: header row (1 col), then a single row with multiple columns (the buttons)
  const cells = [
    headerRow,
    columns
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
