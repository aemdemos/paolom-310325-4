/* global WebImporter */
export default function parse(element, { document }) {
  // Build the table: first row is a single cell header, all subsequent are two columns
  const cells = [];

  // Add the single-cell header row
  cells.push(['Tabs (tabs41)']);

  // Find tab labels
  const tabHeader = element.querySelector('.cmp-tab-header');
  const tabButtons = tabHeader ? tabHeader.querySelectorAll('.cmp-tabs__tablist > button') : [];

  // Find tab content panels
  const tabPanels = Array.from(element.querySelectorAll('.cmp-tabs__tabpanel[data-cmp-hook-tabs="tabpanel"]'));

  // For each tab, add a row with [label, content]
  for (let i = 0; i < Math.max(tabButtons.length, tabPanels.length); i++) {
    // Tab label
    let label = '';
    if (tabButtons[i]) {
      const btn = tabButtons[i];
      const labelLink = btn.querySelector('a');
      label = labelLink ? labelLink.textContent.trim() : btn.textContent.trim();
    } else {
      label = '';
    }
    // Tab content
    let contentCell = '';
    if (tabPanels[i]) {
      // Only include meaningful children (not scripts/styles)
      const panel = tabPanels[i];
      // Only include element children (ignore scripts/styles)
      const contentNodes = Array.from(panel.childNodes).filter(node => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const tag = node.tagName.toUpperCase();
          return tag !== 'SCRIPT' && tag !== 'STYLE';
        }
        // Keep non-empty text nodes
        return node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== '';
      });
      if (contentNodes.length === 1) {
        contentCell = contentNodes[0];
      } else if (contentNodes.length > 1) {
        contentCell = contentNodes;
      } else {
        contentCell = '';
      }
    } else {
      contentCell = '';
    }
    // Push two-column row
    cells.push([label, contentCell]);
  }

  // Create table and replace element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
