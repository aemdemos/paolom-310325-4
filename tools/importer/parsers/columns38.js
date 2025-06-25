/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as specified: single cell with block name
  const headerRow = ['Columns (columns38)'];

  // Get all 1st-level <div> children that represent the columns
  const columnDivs = Array.from(element.querySelectorAll(':scope > div'));

  // Each cell is a reference to the actual cmp-linklist element in the DOM (preserving semantics and references)
  const contentRow = columnDivs.map(colDiv => {
    const cmpLinklist = colDiv.querySelector(':scope > .cmp-linklist');
    // If element is missing, fallback to empty string for resilience
    return cmpLinklist || '';
  });

  const table = WebImporter.DOMUtils.createTable([
    headerRow, // single cell header row
    contentRow // one row, as many columns as there are columns
  ], document);

  element.replaceWith(table);
}
