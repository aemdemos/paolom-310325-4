/* global WebImporter */
export default function parse(element, { document }) {
  // Find all tab panels within the tabs block
  const tabPanels = element.querySelectorAll('[role="tabpanel"][data-cmp-hook-tabs="tabpanel"]');

  tabPanels.forEach((tabPanel) => {
    // Find the largest group of columns.
    // Look for .wrap.c-40-60, .wrap.c-thirds, .wrap.c-half inside the current tabPanel
    let wrap = tabPanel.querySelector('.wrap.c-40-60, .wrap.c-thirds, .wrap.c-half');
    let columns = [];

    if (wrap) {
      // Each direct .container.responsivegrid.cmp-section__item is a column
      const colContainers = wrap.querySelectorAll(':scope > .container.responsivegrid.cmp-section__item');
      if (colContainers.length > 0) {
        columns = Array.from(colContainers).map((col) => {
          // Collect all direct children that are meaningful (text blocks, buttons, etc)
          const colInner = col.querySelector('.cmp-container_container');
          if (colInner) {
            // Get all immediate children (to preserve layout and all text/buttons)
            return Array.from(colInner.children).filter(child => child.textContent && child.textContent.trim());
          } else {
            return [col];
          }
        });
      } else {
        // fallback to wrap's immediate children
        columns = [wrap];
      }
    } else {
      // fallback to all content inside tabPanel
      columns = [tabPanel];
    }

    // Flatten columns if any are arrays of one element, and remove empty columns
    columns = columns.map(col => (Array.isArray(col) && col.length === 1 ? col[0] : col))
                   .filter(col => {
                      if (Array.isArray(col)) return col.some(el => el.textContent && el.textContent.trim());
                      return col && col.textContent && col.textContent.trim();
                   });

    // Build the table only if we have columns with content
    if (columns.length > 0) {
      const rows = [];
      rows.push(['Columns (columns33)']);
      rows.push(columns);
      const table = WebImporter.DOMUtils.createTable(rows, document);
      tabPanel.replaceWith(table);
    }
  });
  // Remove the original tabs container
  element.remove();
}
