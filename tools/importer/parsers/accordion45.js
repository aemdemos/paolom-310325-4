/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as specified in the instructions and example
  const headerRow = ['Accordion (accordion45)'];
  const rows = [];

  // Find all accordion items
  const accordionItems = element.querySelectorAll('.cmp-accordion__item');
  accordionItems.forEach((item) => {
    // Title: Find button inside dt.cmp-accordion__header
    let titleText = '';
    const headerDt = item.querySelector('dt.cmp-accordion__header');
    if (headerDt) {
      const button = headerDt.querySelector('.cmp-accordion__button');
      if (button) {
        titleText = button.textContent.trim();
      }
    }
    // Content: Find dd.cmp-accordion__panel (the panel body)
    let contentCell;
    const panelDd = item.querySelector('dd.cmp-accordion__panel');
    if (panelDd) {
      // If the content panel just contains a container (the real content), use that
      // Otherwise, use the entire dd
      // We want to reference the container holding the content, not clone it
      let mainContent = null;
      // The panel may wrap the content in several layers of .container.responsivegrid
      // Find the first .container.responsivegrid inside dd
      mainContent = panelDd.querySelector('.container.responsivegrid');
      if (mainContent) {
        contentCell = mainContent;
      } else {
        // fallback, just use the dd
        contentCell = panelDd;
      }
    } else {
      // If no content panel, just make an empty div
      contentCell = document.createElement('div');
    }
    rows.push([titleText, contentCell]);
  });

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);
  element.replaceWith(table);
}
