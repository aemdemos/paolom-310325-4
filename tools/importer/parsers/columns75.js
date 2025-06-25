/* global WebImporter */
export default function parse(element, { document }) {
  // Find all immediate child .columncontainer (these are top-level in the supplied element)
  const columnContainers = Array.from(element.querySelectorAll(':scope > .columncontainer'));
  const rows = [];

  // Each .columncontainer contains a .wrap.c-25-75, which is the two column layout
  columnContainers.forEach((colContainer) => {
    const wrap = colContainer.querySelector(':scope > .column-container > .wrap.c-25-75');
    if (!wrap) return;

    // Each column is in .container.responsivegrid > .cmp-container > .cmp-container_container > div
    const containers = wrap.querySelectorAll(':scope > .container.responsivegrid > .cmp-container > .cmp-container_container > div');
    if (containers.length !== 2) return; // Defensive: should have two columns

    // For each column: try to reference the icon (img) and the text
    const getCellContent = (containerDiv) => {
      // Get the icon (img)
      const imageEl = containerDiv.querySelector('.image, .cmp-image');
      let img = null;
      if (imageEl) {
        img = imageEl.querySelector('img');
      }
      // Get the text
      const textEl = containerDiv.querySelector('.text, .cmp-text');
      // Compose cell content
      if (img && textEl) {
        return [img, textEl];
      } else if (img) {
        return img;
      } else if (textEl) {
        return textEl;
      } else {
        // If neither, insert a blank node
        return document.createTextNode('');
      }
    };
    const leftCell = getCellContent(containers[0]);
    const rightCell = getCellContent(containers[1]);
    rows.push([leftCell, rightCell]);
  });

  // Only output block if there is at least one row
  if (rows.length > 0) {
    // Header row must match exactly
    const headerRow = ['Columns (columns75)'];
    const tableRows = [headerRow, ...rows];
    const block = WebImporter.DOMUtils.createTable(tableRows, document);
    element.replaceWith(block);
  }
}