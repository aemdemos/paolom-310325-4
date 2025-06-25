/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main columns wrapper (two columns)
  const wrap = element.querySelector('.columncontainer .column-container .wrap');
  let leftCol, rightCol;
  if (wrap) {
    const containers = wrap.querySelectorAll(':scope > .container');
    leftCol = containers[0];
  }
  // The right column is after the .columncontainer: it's the .bio-bottom (visible one)
  rightCol = element.querySelector('.bio-bottom');

  // Helper: gather all non-empty children (including text nodes)
  function collectContent(node) {
    const content = [];
    if (!node) return content;
    node.childNodes.forEach(child => {
      if (child.nodeType === Node.ELEMENT_NODE) {
        content.push(child);
      } else if (child.nodeType === Node.TEXT_NODE && child.textContent.trim()) {
        content.push(document.createTextNode(child.textContent));
      }
    });
    return content;
  }

  // For left column, reference the whole inner container to preserve all text, headings, lists, etc
  let leftContent = [];
  if (leftCol) {
    const cmpContainer = leftCol.querySelector('.cmp-container_container');
    if (cmpContainer) {
      leftContent = [cmpContainer];
    } else {
      leftContent = collectContent(leftCol);
    }
  }
  // For right column, reference the whole .bio-bottom (so all text, image, and social links are preserved)
  let rightContent = [];
  if (rightCol) {
    rightContent = [rightCol];
  }

  // Build the table as per the block specification
  const cells = [
    ['Columns (columns27)'],
    [leftContent, rightContent]
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
