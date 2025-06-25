/* global WebImporter */
export default function parse(element, { document }) {
  // 1. The header row is always Accordion (accordion76)
  const headerRow = ['Accordion (accordion76)'];

  // 2. Find the accordion root, which holds all the dl.cmp-accordion__item
  let accordionRoot = element.querySelector('.cmp-accordion');
  if (!accordionRoot) accordionRoot = element;

  // 3. Get all accordion items
  const items = accordionRoot.querySelectorAll('dl.cmp-accordion__item');
  const rows = [];
  items.forEach((item) => {
    // Extract the title from the button inside dt
    const button = item.querySelector('dt.cmp-accordion__header > button');
    let titleContent = '';
    if (button) {
      titleContent = button.textContent.trim();
    }
    // Extract the content from the panel (dd)
    const panel = item.querySelector('dd[data-cmp-hook-accordion="panel"]');
    let contentCell = '';
    if (panel) {
      // Compose an array of all top-level ELEMENT_NODEs inside the panel
      const contentParts = [];
      // For resilience, include text nodes if not empty, wrap in <p>
      panel.childNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          contentParts.push(node);
        } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0) {
          const p = document.createElement('p');
          p.textContent = node.textContent.trim();
          contentParts.push(p);
        }
      });
      // If only one part, use it, else array, else empty string
      if (contentParts.length === 1) {
        contentCell = contentParts[0];
      } else if (contentParts.length > 1) {
        contentCell = contentParts;
      }
    }
    rows.push([titleContent, contentCell]);
  });
  // 4. Build the block table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);
  // 5. Replace the original element with the table
  element.replaceWith(table);
}
