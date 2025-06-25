/* global WebImporter */
export default function parse(element, { document }) {
  // Create the table rows array
  const cells = [];

  // 1. Header row: block name, single cell (per the example)
  cells.push(['Table (striped, bordered)']);

  // 2. Column header row: two columns, e.g. 'Meet the honorees', 'Website'
  const linkPanel = element.querySelector('.cmp-index-panel__link');
  if (!linkPanel) return;

  let col1 = 'Section';
  const anchorHeader = linkPanel.querySelector('.cmp-index-panel__anchor-header');
  if (anchorHeader && anchorHeader.textContent.trim()) {
    col1 = anchorHeader.textContent.trim();
  }
  cells.push([col1, 'Website']);

  // 3. Data rows: each <li> from the index list
  const anchorLis = linkPanel.querySelectorAll('ul > li');
  anchorLis.forEach(li => {
    const anchorSpan = li.querySelector('.cmp-index-panel__anchor');
    if (anchorSpan && anchorSpan.textContent.trim()) {
      const name = anchorSpan.textContent.trim();
      const dataLink = anchorSpan.getAttribute('data-link') || name;
      const a = document.createElement('a');
      a.href = `#${dataLink}`;
      a.textContent = `#${dataLink}`;
      cells.push([name, a]);
    }
  });

  // 4. Create the table and replace the element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
