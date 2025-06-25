/* global WebImporter */
export default function parse(element, { document }) {
  // Find the column container: look for .columncontainer or .column-container as root
  let columncontainer = element.querySelector('.columncontainer, .column-container');
  if (!columncontainer) {
    // Try to find inside one more level if not found
    columncontainer = element.querySelector('.cmp-container > .cmp-container_container > div > .columncontainer, .cmp-container > .cmp-container_container > div > .column-container');
    if (!columncontainer) return; // Nothing to process
  }
  // Each .container.responsivegrid.cmp-section__item child represents a column
  const colNodes = Array.from(columncontainer.querySelectorAll(':scope > .container.responsivegrid.cmp-section__item'));
  if (colNodes.length === 0) return;

  // For each column, grab its content as a single block (to preserve all formatting and elements)
  const columnCells = colNodes.map(colNode => {
    // The interesting content is usually in .cmp-container_container > div
    const content = colNode.querySelector('.cmp-container_container > div');
    return content || colNode; // fallback to the entire column node if not found
  });

  // Compose the table rows as per specification
  const headerRow = ['Columns (columns2)'];
  const contentRow = columnCells;

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  element.replaceWith(table);
}
