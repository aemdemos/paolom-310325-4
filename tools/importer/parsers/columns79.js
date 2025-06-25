/* global WebImporter */
export default function parse(element, { document }) {
  // Find all columns in a robust, flexible way
  let columns = Array.from(
    element.querySelectorAll(
      ':scope > .column-container > .wrap > .container.responsivegrid.cmp-section__item, :scope > .container.responsivegrid.cmp-section__item'
    )
  );
  if (columns.length === 0) {
    columns = Array.from(element.querySelectorAll('.container.responsivegrid.cmp-section__item'));
  }

  // For each column, extract all direct content (including text nodes and elements)
  const columnsContentArray = columns.map((col) => {
    // Find the deepest container that holds the column's visible content
    let contentRoot = col.querySelector('.cmp-container_container > div') || col;
    const contentParts = [];
    // Include all direct text nodes (preserving whitespace and line breaks)
    Array.from(contentRoot.childNodes).forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== '') {
        contentParts.push(document.createTextNode(node.textContent));
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        contentParts.push(node);
      }
    });
    if (contentParts.length === 1) return contentParts[0];
    if (contentParts.length > 1) return contentParts;
    return '';
  });

  // Compose the table rows as per the required structure
  const headerRow = ['Columns (columns79)'];
  const contentRow = [columnsContentArray];
  const tableRows = [headerRow, contentRow];

  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
