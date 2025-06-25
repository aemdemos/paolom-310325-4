/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header, exactly as in the example
  const headerRow = ['Search'];

  // Try to extract all unique visible text content from the search area, for context preservation
  // This block should contain the visible label or placeholder if present
  let searchText = '';
  // 1. Prefer placeholder on any input[type=text|search]
  let input = element.querySelector('input[type="search"], input[type="text"]');
  if (input && input.placeholder) {
    searchText = input.placeholder;
  } else {
    // 2. Look for button or label with 'search' text
    const searchBtn = Array.from(element.querySelectorAll('button, label, span, div')).find(el =>
      el.textContent && el.textContent.trim().toLowerCase().includes('search')
    );
    if (searchBtn) {
      searchText = searchBtn.textContent.trim();
    }
  }

  // 3. If nothing found, as a last resort, use generic content
  if (!searchText) {
    searchText = 'Search...';
  }

  // Compose the block table as in the markdown example: 1 column, header + content
  const cells = [
    headerRow,
    [searchText],
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}