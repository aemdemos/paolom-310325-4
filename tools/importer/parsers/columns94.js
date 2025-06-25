/* global WebImporter */
export default function parse(element, { document }) {
  // Find the wrap div that contains the columns
  const wrap = element.querySelector('.wrap.c-thirds');
  if (!wrap) return;

  // Get all direct child .container.responsivegrid.cmp-section__item (the three columns)
  const sectionItems = wrap.querySelectorAll(':scope > .container.responsivegrid.cmp-section__item');

  // For each column, extract its .cmp-container_container content (usually a single <div> holding the column block)
  const columns = [];
  sectionItems.forEach((section) => {
    const container = section.querySelector('.cmp-container_container');
    if (!container) {
      columns.push('');
    } else {
      const innerDiv = container.querySelector(':scope > div');
      if (innerDiv) {
        columns.push(innerDiv);
      } else {
        columns.push(container);
      }
    }
  });

  // The header row must be exactly one cell/column
  const headerRow = ['Columns (columns94)'];
  // The second row contains three columns (the three columns content)
  const cells = [headerRow, columns];

  // Create the block table and replace the original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
