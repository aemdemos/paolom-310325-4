/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract background image as <img> element
  function extractBgImg(el) {
    const bgSpan = el.querySelector('.desktop-background[role="img"], span[role="img"].desktop-background');
    if (bgSpan && bgSpan.style && bgSpan.style.backgroundImage) {
      const match = bgSpan.style.backgroundImage.match(/url\(["']?([^"')]+)["']?\)/);
      if (match && match[1]) {
        const img = document.createElement('img');
        img.src = match[1];
        img.setAttribute('loading', 'lazy');
        const heading = el.querySelector('h1,h2,h3');
        img.alt = heading ? heading.textContent.trim() : '';
        return img;
      }
    }
    return null;
  }

  // Helper to extract columns: finds the best .column-container if present.
  function extractColumns(el) {
    // Find deepest .column-container under el
    let containers = el.querySelectorAll('.column-container');
    let columnsContainer = null;
    if (containers.length > 0) {
      // Use the container with the most .cmp-section__item children
      columnsContainer = Array.from(containers).reduce((best, curr) => {
        const currCount = curr.querySelectorAll(':scope > .container.responsivegrid.cmp-section__item').length;
        const bestCount = best ? best.querySelectorAll(':scope > .container.responsivegrid.cmp-section__item').length : 0;
        return currCount > bestCount ? curr : best;
      }, null);
    }
    if (!columnsContainer) {
      // fallback: the element itself
      columnsContainer = el;
    }
    // Extract direct column items
    let columnNodes = Array.from(columnsContainer.querySelectorAll(':scope > .container.responsivegrid.cmp-section__item'));
    if (columnNodes.length === 0) {
      // fallback: direct .cmp-container children if present
      columnNodes = Array.from(columnsContainer.querySelectorAll(':scope > .cmp-container'));
    }
    // If still none, fallback to all children
    if (columnNodes.length === 0) {
      columnNodes = Array.from(columnsContainer.children);
    }
    // For each column, find the main content wrapper, and flatten extraneous wrappers
    const columnCells = columnNodes.map((node) => {
      // Remove columns that are visually empty
      if (node.textContent.trim() === '' && !node.querySelector('img,a,iframe,button')) return '';
      // Try to find the main content div
      let mainContent = node.querySelector('.cmp-container_container > div') || node;
      // Flatten unnecessary wrappers for content cell: only take the direct children
      // (e.g. title, text, button)
      let children = Array.from(mainContent.children);
      // filter out empty or whitespace nodes
      children = children.filter(child => child.textContent.trim() !== '' || child.querySelector('img,a,iframe,button'));
      // If nothing left, fallback to the mainContent itself
      if (children.length === 0) return mainContent;
      // If only one child left, return that child directly
      if (children.length === 1) return children[0];
      // Otherwise, return all stripped children as array for cell
      return children;
    });
    // Remove trailing/leading empty cells
    return columnCells.filter(cell => cell && (typeof cell === 'string' ? cell.trim() : true));
  }

  // --- ACTUAL PROCESSING ---
  const headerRow = ['Columns (columns7)']; // one cell ONLY, per example
  const bgImgNode = extractBgImg(element);
  let columnCells = extractColumns(element);

  // If exactly 1 content column and bg image, add bg image as second column
  if (bgImgNode && columnCells.length === 1) {
    columnCells = [columnCells[0], bgImgNode];
  } else if (bgImgNode && columnCells.length === 2) {
    // Put bgImgNode in the second cell if that cell does not already have an <img>
    if (!columnCells[1].querySelector || !columnCells[1].querySelector('img')) {
      columnCells[1] = bgImgNode;
    }
  }
  // Remove extra empty columns
  columnCells = columnCells.filter(cell => cell && (typeof cell === 'string' ? cell.trim() : true));

  // Structure: headerRow (one cell), then secondRow (N columns)
  const cells = [headerRow, columnCells];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
