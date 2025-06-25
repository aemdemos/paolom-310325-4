/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .wrap.c-25-75 (main columns wrapper)
  const wrap = element.querySelector('.wrap.c-25-75');
  if (!wrap) return;

  // The layout is two children: left column (heading/content), right column (carousel)
  const colDivs = Array.from(wrap.children);
  if (colDivs.length < 2) return;

  // LEFT COLUMN: should include ALL content (not just the heading)
  let leftColContainer = colDivs[0].querySelector('.cmp-container_container') || colDivs[0];
  // Collect all direct children (elements and significant text nodes)
  const leftColContentNodes = Array.from(leftColContainer.childNodes).filter(node => {
    // Only include non-empty text nodes and element nodes
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent.trim().length > 0;
    }
    return true;
  });
  // If only one node, use as is; if multiple, use array
  const leftColContent = leftColContentNodes.length === 1 ? leftColContentNodes[0] : leftColContentNodes;

  // RIGHT COLUMNS: carousel columns (only want *first* slide's columns)
  const carousel = colDivs[1].querySelector('.carousel');
  if (!carousel) return;
  let firstSlide = carousel.querySelector('.cmp-carousel__item--active') || carousel.querySelector('.cmp-carousel__item');
  if (!firstSlide) return;
  // Find the columns group: .wrap.c-thirds inside the first slide
  const thirdsWrap = firstSlide.querySelector('.wrap.c-thirds');
  if (!thirdsWrap) return;
  // The columns: .container.responsivegrid.cmp-section__item
  const columnSections = thirdsWrap.querySelectorAll('.container.responsivegrid.cmp-section__item');
  if (!columnSections.length) return;
  // For each column, reference the whole block (not clone) to preserve structure and text
  const rightCols = Array.from(columnSections);

  // Compose the content row: first is the left content, then each column from the slide
  const contentRow = [leftColContent, ...rightCols];

  // HEADER ROW: must be a single cell as per the example
  const headerRow = ['Columns (columns93)'];

  // Build the block table with a single cell header row
  const cells = [headerRow, contentRow];
  // Create table
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Merge header row into one by setting colspan
  const maxCols = contentRow.length;
  const thead = table.querySelector('thead');
  if (thead) {
    const tr = thead.querySelector('tr');
    if (tr && tr.children.length > 1) {
      tr.children[0].colSpan = maxCols;
      while (tr.children.length > 1) {
        tr.removeChild(tr.children[1]);
      }
    } else if (tr && tr.children.length === 1) {
      tr.children[0].colSpan = maxCols;
    }
  }
  element.replaceWith(table);
}
