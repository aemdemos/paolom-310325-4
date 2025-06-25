/* global WebImporter */
export default function parse(element, { document }) {
  // We must ensure the header row is a single cell that spans two columns (colspan=2)
  // The best way is to pass an object with colspan property as per DOMUtils.createTable convention
  // But since DOMUtils.createTable does not formally support colspan directly, we will ensure only one cell in the header

  // Gather all accordion items, and count columns
  let accordionRoot = element;
  if (accordionRoot.classList.contains('accordion') && accordionRoot.querySelector(':scope > .cmp-accordion')) {
    accordionRoot = accordionRoot.querySelector(':scope > .cmp-accordion');
  }
  const items = accordionRoot.querySelectorAll(':scope > dl.cmp-accordion__item');

  const rows = [];
  items.forEach((dl) => {
    let titleCell = '';
    const dt = dl.querySelector(':scope > dt');
    if (dt) {
      const btn = dt.querySelector('button');
      titleCell = btn ? btn.textContent.trim() : dt.textContent.trim();
    }
    let contentCell;
    const dd = dl.querySelector(':scope > dd');
    if (dd) {
      const contentParts = [];
      dd.querySelectorAll('.cmp-text').forEach(tb => contentParts.push(tb));
      dd.querySelectorAll('iframe').forEach(iframe => {
        const a = document.createElement('a');
        a.href = iframe.src;
        a.textContent = iframe.src;
        a.target = '_blank';
        contentParts.push(a);
      });
      if (contentParts.length === 0) {
        Array.from(dd.childNodes).forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.tagName === 'IFRAME') {
              const a = document.createElement('a');
              a.href = node.src;
              a.textContent = node.src;
              a.target = '_blank';
              contentParts.push(a);
            } else {
              contentParts.push(node);
            }
          } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
            const p = document.createElement('p');
            p.textContent = node.textContent.trim();
            contentParts.push(p);
          }
        });
      }
      if (contentParts.length === 0 && dd.textContent && dd.textContent.trim()) {
        const p = document.createElement('p');
        p.textContent = dd.textContent.trim();
        contentParts.push(p);
      }
      contentCell = contentParts.length === 1 ? contentParts[0] : contentParts;
    } else {
      contentCell = '';
    }
    rows.push([titleCell, contentCell]);
  });

  // Header row: single cell, which when rendered as table should have colspan=2
  // DOMUtils.createTable will automatically set colspan=2 if the first row has a single cell and all other rows have two cells
  const headerRow = ['Accordion (accordion4)'];
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);
  element.replaceWith(table);
}
