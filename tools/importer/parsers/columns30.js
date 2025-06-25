/* global WebImporter */
export default function parse(element, { document }) {
  // Extract all direct filter select divs (each is a column)
  const columnDivs = Array.from(element.querySelectorAll(':scope > div'));

  // Header row as required by the spec/example: single cell
  const headerRow = ['Columns (columns30)'];

  // Each cell in the columns row should be the select from its column
  // (Reference the existing select elements.)
  const columnsRow = columnDivs.map(div => {
    const select = div.querySelector('select');
    if (select) return select;
    // fallback to div itself if no select found
    return div;
  });

  // Table structure: header row (single cell), followed by a row of columns (each cell)
  const tableArr = [headerRow, columnsRow];

  // Create table block
  const block = WebImporter.DOMUtils.createTable(tableArr, document);

  // Replace the original element with the new table
  element.replaceWith(block);
}
