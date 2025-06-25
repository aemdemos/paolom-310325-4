/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .wrap.with-divider.c-fifths block that contains the columns
  const wrap = element.querySelector('.wrap.with-divider.c-fifths');
  if (!wrap) return;
  // Get direct children columns
  const columnDivs = Array.from(wrap.querySelectorAll(':scope > .container.responsivegrid.cmp-section__item'));
  if (columnDivs.length === 0) return;

  // For each column, extract existing image and heading (h4)
  const cols = columnDivs.map(col => {
    const container = col.querySelector('.cmp-container_container > div');
    if (!container) return '';
    const img = container.querySelector('.image img');
    const title = container.querySelector('.title h4');
    const colContent = [];
    if (img) colContent.push(img);
    if (title) colContent.push(title);
    return colContent.length ? colContent : '';
  });

  // Construct table: First row is single-cell header, second row is N columns
  const table = WebImporter.DOMUtils.createTable([
    ['Columns (columns62)'], // Header row: 1 cell only
    cols // Second row: one cell per column
  ], document);

  element.replaceWith(table);
}
