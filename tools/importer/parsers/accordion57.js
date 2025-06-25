/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main accordion wrapper (should contain .cmp-accordion)
  let accordion = element.querySelector('.cmp-accordion');
  if (!accordion) accordion = element;

  // Accordion items are immediate <dl> children
  const items = accordion.querySelectorAll(':scope > dl.cmp-accordion__item');
  const rows = [];
  // Table header: must match the block name exactly
  rows.push(['Accordion (accordion57)']);

  items.forEach((item) => {
    // Extract title from dt > button
    const dt = item.querySelector('dt.cmp-accordion__header');
    let titleContent = '';
    if (dt) {
      const btn = dt.querySelector('button');
      if (btn) {
        // If there are HTML elements (like <b>, <i>) inside the button, keep them
        titleContent = Array.from(btn.childNodes).length > 1 ? btn : btn.textContent.trim();
      } else {
        titleContent = dt.textContent.trim();
      }
    }
    // Content: dd (panel)
    const dd = item.querySelector('dd[data-cmp-hook-accordion="panel"]');
    let contentCell = '';
    if (dd) {
      // Find the main content wrapper inside dd
      let mainContent = null;
      // Use first .container or .cmp-container if present, else use dd
      mainContent = dd.querySelector(':scope > .container, :scope > .cmp-container');
      if (!mainContent) {
        // sometimes content is directly in dd
        mainContent = dd;
      }
      contentCell = mainContent;
    }
    // Each row is [title, content]
    rows.push([titleContent, contentCell]);
  });

  // Create block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(table);
}
