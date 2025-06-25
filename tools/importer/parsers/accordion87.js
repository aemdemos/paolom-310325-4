/* global WebImporter */
export default function parse(element, { document }) {
  // Find all accordion items
  const accordionItems = element.querySelectorAll('.cmp-accordion__item');
  const cells = [];

  // Header row with exactly one cell as per requirements
  cells.push(['Accordion (accordion87)']);

  accordionItems.forEach((item) => {
    // Title cell: get the button text from dt
    let title = '';
    const dt = item.querySelector('dt');
    if (dt) {
      const btn = dt.querySelector('button');
      if (btn) {
        title = btn.textContent.trim();
      } else {
        title = dt.textContent.trim();
      }
    }

    // Content cell: robust extraction
    let contentCell = null;
    const dd = item.querySelector('dd');
    if (dd) {
      // Get first element child or dd itself
      let mainContent = null;
      for (let i = 0; i < dd.children.length; i++) {
        if (dd.children[i].nodeType === 1) {
          mainContent = dd.children[i];
          break;
        }
      }
      if (!mainContent) mainContent = dd;

      // Special handling: replace iframe with no src with placeholder paragraph
      if (mainContent.querySelector) {
        const iframes = mainContent.querySelectorAll('iframe');
        iframes.forEach((iframe) => {
          if (!iframe.src || iframe.src.trim() === '') {
            const placeholder = document.createElement('p');
            placeholder.textContent = '[Embedded content unavailable: iframe missing src attribute]';
            iframe.replaceWith(placeholder);
          } else {
            // Replace iframe with link if src exists (but not images)
            const a = document.createElement('a');
            a.href = iframe.src;
            a.textContent = iframe.src;
            iframe.replaceWith(a);
          }
        });
      }
      contentCell = mainContent;
    }
    cells.push([title, contentCell]);
  });

  // Create table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
