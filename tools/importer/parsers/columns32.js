/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as per block name, exactly as required
  const headerRow = ['Columns (columns32)'];

  // Get the tab list (vertical tabs/buttons)
  const tabList = element.querySelector('.cmp-tabs__tablist');
  let leftCol;
  if (tabList) {
    // Reference the existing tabList directly for full flexibility
    leftCol = tabList;
  } else {
    // Fallback: include all content if not found
    leftCol = document.createElement('div');
    leftCol.textContent = '';
  }

  // Find the active tabpanel (should only be one with --active)
  const activeTabPanel = element.querySelector('.cmp-tabs__tabpanel--active');
  let rightCol;
  if (activeTabPanel) {
    // Reference the entire activeTabPanel to ensure all content is included
    rightCol = activeTabPanel;
  } else {
    // Fallback: create empty div
    rightCol = document.createElement('div');
    rightCol.textContent = '';
  }

  // Compose the block table; two columns, content is referenced
  const cells = [
    headerRow,
    [leftCol, rightCol]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
