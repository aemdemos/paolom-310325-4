/* global WebImporter */
export default function parse(element, { document }) {
  // Header row
  const headerRow = ['Embed (embedVideo50)'];

  // Attempt to extract the main content node holding the embed content
  let contentBlock = element.querySelector('.embed, .cmp-embed, .htmlScriptEditor.section');
  if (!contentBlock) contentBlock = element;

  // Try to extract iframe for the video link
  const iframe = contentBlock.querySelector('iframe');

  // Prepare an array to gather all text/content inside the contentBlock
  const contentNodes = [];
  contentBlock.childNodes.forEach((node) => {
    // Include text nodes with actual content
    if (node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0) {
      contentNodes.push(document.createTextNode(node.textContent));
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      contentNodes.push(node);
    }
  });

  // Always add the video link at the end (if present)
  if (iframe && iframe.src) {
    const linkEl = document.createElement('a');
    linkEl.href = iframe.src;
    linkEl.textContent = iframe.src;
    // If there's other content, add a line break for clarity
    if (contentNodes.length > 0) {
      contentNodes.push(document.createElement('br'));
    }
    contentNodes.push(linkEl);
  }

  // If no content at all, just make an empty cell
  if (contentNodes.length === 0) {
    contentNodes.push(document.createTextNode(''));
  }

  // Build the table cells
  const cells = [
    headerRow,
    [contentNodes]
  ];
  
  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
