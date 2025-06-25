/* global WebImporter */
export default function parse(element, { document }) {
  // Find the innermost .wrap.c-thirds (the row of columns)
  let wrap = element.querySelector('.wrap.c-thirds');
  if (!wrap) {
    // fallback: find the deepest wrap.c-thirds
    const wraps = element.querySelectorAll('.wrap.c-thirds');
    if (wraps.length > 0) wrap = wraps[wraps.length - 1];
  }

  // The columns are .container.responsivegrid.cmp-section__item inside the wrap
  let columns = [];
  if (wrap) {
    columns = Array.from(wrap.querySelectorAll(':scope > .container.responsivegrid.cmp-section__item'));
    if (columns.length === 0) {
      // fallback: all descendants
      columns = Array.from(wrap.querySelectorAll('.container.responsivegrid.cmp-section__item'));
    }
  } else {
    // fallback: at top level
    columns = Array.from(element.querySelectorAll('.container.responsivegrid.cmp-section__item'));
  }

  // Compose each column's content - keep semantic structure, reference HTML elements directly
  const colCells = columns.map(col => {
    const colParts = [];
    // image
    const cmpImg = col.querySelector('.cmp-image');
    if (cmpImg) colParts.push(cmpImg);
    // title (h3)
    const cmpTitle = col.querySelector('.cmp-title');
    if (cmpTitle) colParts.push(cmpTitle);
    // text (first cmp-text)
    const cmpText = col.querySelector('.cmp-text');
    if (cmpText) colParts.push(cmpText);
    // button (cmp-button inside .button.base-component)
    const btnDiv = col.querySelector('.button.base-component');
    if (btnDiv) {
      const btn = btnDiv.querySelector('a.cmp-button');
      if (btn) colParts.push(btn);
    }
    return colParts;
  });

  // If no columns, do nothing
  if (colCells.length === 0) return;
  // Table header exactly as per block name
  const headerRow = ['Columns (columns69)'];
  const tableRows = [headerRow, colCells];

  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(block);
}
