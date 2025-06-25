/* global WebImporter */
export default function parse(element, { document }) {
  // Compose the header row exactly as in the example
  const headerRow = ['Embed (embedVideo44)'];

  // For the content cell: gather any images, text, and the embedded video link
  const content = [];

  // Gather all direct children for flexible parsing
  const children = Array.from(element.children);
  let foundIframe = false;

  // Recursively search for iframe, images, and capture text nodes
  function extractContent(node) {
    node.childNodes.forEach(child => {
      if (child.nodeType === Node.ELEMENT_NODE) {
        if (child.tagName === 'IFRAME') {
          // Only create a link for non-image embeds
          const src = child.getAttribute('src');
          if (src) {
            const a = document.createElement('a');
            a.href = src;
            a.textContent = src;
            content.push(a);
            foundIframe = true;
          }
        } else if (child.tagName === 'IMG') {
          content.push(child);
        } else {
          // For other elements, recurse into them
          extractContent(child);
        }
      } else if (child.nodeType === Node.TEXT_NODE && child.textContent.trim()) {
        content.push(child.textContent.trim());
      }
    });
  }

  // If the direct children are wrappers, dig into them
  if (children.length === 1 && children[0].children.length) {
    extractContent(children[0]);
  } else {
    extractContent(element);
  }

  // If no content found (edge case), add empty string
  if (content.length === 0) content.push('');

  const cells = [
    headerRow,
    [content.length === 1 ? content[0] : content]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
