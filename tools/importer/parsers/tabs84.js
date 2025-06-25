/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as required in the example
  const headerRow = ['Tabs (tabs84)'];

  // Select the tablist and the buttons (tabs)
  const tabList = element.querySelector('[role="tablist"]');
  const tabButtons = tabList ? tabList.querySelectorAll('button[role="tab"]') : [];

  // Select all tabpanel elements
  const tabPanels = element.querySelectorAll('[role="tabpanel"]');

  // For each tab, extract the label and the associated panel content
  const rows = [];

  tabButtons.forEach((btn) => {
    // Tab label: prefer <a> text, fallback to button text
    let label = '';
    const anchor = btn.querySelector('a');
    if (anchor && anchor.textContent) {
      label = anchor.textContent.trim();
    } else {
      label = btn.textContent.trim();
    }

    // Find tabpanel by aria-controls attribute (robust)
    const tabpanelId = btn.getAttribute('aria-controls');
    let panel = null;
    if (tabpanelId) {
      panel = element.querySelector(`#${tabpanelId}`);
    }

    // If not found, fallback by index
    let panelContent = panel;
    if (!panelContent) {
      // fallback: find by index in NodeList
      const idx = Array.from(tabButtons).indexOf(btn);
      if (tabPanels[idx]) panelContent = tabPanels[idx];
    }

    // If we have content (panelContent), reference it directly; otherwise leave cell empty
    rows.push([label, panelContent || document.createElement('div')]);
  });

  // Compose the table data
  const tableData = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(tableData, document);

  // Replace the original element with the new block
  element.replaceWith(block);
}
