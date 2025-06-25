/* global WebImporter */
export default function parse(element, { document }) {
  // Header as in the example
  const headerRow = ['Accordion (accordion72)'];

  // Find the cmp-accordion container (could be on element itself)
  let cmpAccordion = element.querySelector('.cmp-accordion');
  if (!cmpAccordion && element.classList.contains('cmp-accordion')) {
    cmpAccordion = element;
  }
  if (!cmpAccordion) {
    cmpAccordion = element;
  }

  // Get all accordion items
  const accordionItems = Array.from(cmpAccordion.querySelectorAll('dl.cmp-accordion__item'));

  const rows = [headerRow];

  accordionItems.forEach(item => {
    // Get title
    let titleEl = item.querySelector('dt.cmp-accordion__header > button');
    let titleText = '';
    if (titleEl) {
      titleText = titleEl.textContent.trim();
    } else {
      // fallback if button not present
      let dt = item.querySelector('dt.cmp-accordion__header');
      titleText = dt ? dt.textContent.trim() : '';
    }
    // Get content
    // The content is in <dd data-cmp-hook-accordion="panel">
    let dd = item.querySelector('dd[data-cmp-hook-accordion="panel"]');
    let contentCell = '';
    if (dd) {
      // Remove hidden/aria-hidden so it renders
      dd.removeAttribute('hidden');
      dd.removeAttribute('aria-hidden');
      // Gather all *meaningful* children (skip empty text nodes)
      const children = Array.from(dd.childNodes).filter(node => {
        return !(node.nodeType === Node.TEXT_NODE && node.textContent.trim() === '');
      });
      if (children.length === 1) {
        contentCell = children[0];
      } else if (children.length > 1) {
        contentCell = children;
      } else {
        // fallback: dd itself
        contentCell = dd;
      }
    }
    rows.push([titleText, contentCell]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
