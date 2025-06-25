/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main columns wrapper
  const mainColumnsWrap = element.querySelector('.column-container .wrap.c-60-40');
  if (!mainColumnsWrap) return;
  // The two columns inside the wrap
  const columns = mainColumnsWrap.querySelectorAll(':scope > .container.responsivegrid');
  const leftCol = columns[0];

  // Get the bio image/social block (right cell)
  const rightCol = element.querySelector('.bio-bottom');

  // LEFT COLUMN: assemble all title/text/divider blocks as one cell
  let leftCellContent = null;
  if (leftCol) {
    const leftInner = leftCol.querySelector('.cmp-container_container');
    if (leftInner) {
      leftCellContent = document.createElement('div');
      Array.from(leftInner.children).forEach(child => {
        leftCellContent.appendChild(child);
      });
    }
  }

  // RIGHT COLUMN: image and social link
  let rightCellContent = null;
  if (rightCol) {
    const img = rightCol.querySelector('img');
    const social = rightCol.querySelector('.social-contact');
    if (img || social) {
      rightCellContent = document.createElement('div');
      if (img) rightCellContent.appendChild(img);
      if (social) rightCellContent.appendChild(social);
    }
  }

  // Compose table with a single-cell header row as required
  const cells = [
    ['Columns (columns53)'],
    [leftCellContent, rightCellContent]
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
