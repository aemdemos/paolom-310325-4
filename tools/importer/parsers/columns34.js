/* global WebImporter */
export default function parse(element, { document }) {
  // Find all tab panels in desktop version
  const tabpanels = element.querySelectorAll('.hideOnMobile .cmp-tabs__tabpanel');
  if (!tabpanels.length) return;

  // Compose the header as required
  const headerRow = ['Columns (columns34)'];

  // For each tabpanel, extract main content block (the .cmp-container_container children)
  const columns = [];
  tabpanels.forEach(panel => {
    let contentBlock = panel.querySelector('.cmp-container_container');
    if (!contentBlock) contentBlock = panel;
    // All direct children that contain visible content
    const meaningfulChildren = Array.from(contentBlock.children).filter(child => {
      return child.textContent && child.textContent.trim().length > 0;
    });
    if (meaningfulChildren.length === 1) {
      columns.push(meaningfulChildren[0]);
    } else if (meaningfulChildren.length > 1) {
      columns.push(meaningfulChildren);
    } else {
      // fallback to any text nodes
      const textNodes = Array.from(contentBlock.childNodes).filter(n => n.nodeType === 3 && n.textContent.trim().length > 0);
      if (textNodes.length) {
        const div = document.createElement('div');
        textNodes.forEach(node => div.appendChild(node));
        columns.push(div);
      } else {
        columns.push('');
      }
    }
  });

  // Build the cells array as per block spec: header row, then a single row with all columns
  const cells = [headerRow, columns];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
