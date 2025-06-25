/* global WebImporter */
export default function parse(element, { document }) {
  // Find all column containers (each is a column)
  const columns = Array.from(element.querySelectorAll('.container.responsivegrid.cmp-section__item'));

  // Header row: exactly one cell as required
  const cells = [ ['Columns (columns26)'] ];

  // Content row: one cell per column, each containing the full content
  const contentRow = columns.map((col) => {
    // Main content container
    const cmpContainer = col.querySelector('.cmp-container_container');
    if (!cmpContainer) return '';
    // Collect blocks inside the content container
    const firstContentDiv = cmpContainer.querySelector(':scope > div');
    const contentBlocks = [];
    if (firstContentDiv) {
      // Get all immediate children (expected: .text and .embed)
      Array.from(firstContentDiv.children).forEach((block) => {
        if (block.classList.contains('text')) {
          contentBlocks.push(block);
        } else if (block.classList.contains('embed')) {
          const iframe = block.querySelector('iframe');
          if (iframe && iframe.src) {
            const a = document.createElement('a');
            a.href = iframe.src;
            a.textContent = 'Video';
            a.target = '_blank';
            contentBlocks.push(a);
          }
        }
      });
    }
    // fallback: if no blocks found, just return cmpContainer
    return contentBlocks.length ? (contentBlocks.length === 1 ? contentBlocks[0] : contentBlocks) : cmpContainer;
  });
  cells.push(contentRow);

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
