/* global WebImporter */
export default function parse(element, { document }) {
  // Find the columns wrapper with three columns
  const colWrap = element.querySelector('.wrap.c-thirds');
  if (!colWrap) return;
  // Find the 3 column containers (each with .container.responsivegrid.cmp-section__item)
  const columns = Array.from(colWrap.querySelectorAll(':scope > .container.responsivegrid.cmp-section__item'));
  // For each column, extract the image and the text below
  const colCells = columns.map(col => {
    const inner = col.querySelector('.cmp-container_container > div');
    if (!inner) return '';
    // Get image (icon SVG)
    let img = inner.querySelector('.image img');
    // Get all .text content (which is a wrapper for a .cmp-text)
    let textDiv = inner.querySelector('.text');
    let textContent = [];
    if (textDiv) {
      textContent = Array.from(textDiv.childNodes);
    }
    // Cell: image first, then everything in .text
    if (img && textContent.length > 0) {
      return [img, ...textContent];
    }
    if (img) return img;
    if (textContent.length > 0) return textContent;
    return '';
  });
  // Ensure header row is exactly one cell, as per the requirements
  const cells = [
    ['Columns (columns73)'], // single cell header row
    colCells // as many columns as needed, one cell per column
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
