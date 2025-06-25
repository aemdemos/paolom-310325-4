/* global WebImporter */
export default function parse(element, { document }) {
  // Header row must match the example exactly
  const headerRow = ['Embed (embedVideo12)'];

  // We need to include all text content from the block in the output cell
  // This block is not actually an embed, but an index navigation. We need to preserve its text and structure.

  // We'll use the .cmp-index-panel__sticky-content (if present), which wraps the visible content
  const stickyContent = element.querySelector('.cmp-index-panel__sticky-content');
  let cellContent;

  if (stickyContent) {
    // Reference the actual node in the new table, not a clone
    cellContent = [stickyContent];
  } else {
    // Fallback: reference the full element if sticky content is missing
    cellContent = [element];
  }

  // Build the table with exact structure: header row, one content row
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    [cellContent]
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
