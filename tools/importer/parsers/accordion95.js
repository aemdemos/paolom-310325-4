/* global WebImporter */
export default function parse(element, { document }) {
  // Block header must match exactly as in the example
  const headerRow = ['Accordion (accordion95)'];

  // Find the <dt> for the title cell
  let titleCell = '';
  const dt = element.querySelector('dt');
  if (dt) {
    // Accordion title is inside a button within dt
    const btn = dt.querySelector('button, [role=button]');
    if (btn) {
      titleCell = btn;
    } else {
      // fallback to raw dt text if no button
      titleCell = document.createTextNode(dt.textContent.trim());
    }
  }

  // Find the <dd> for the content cell
  let contentCell = '';
  const dd = element.querySelector('dd');
  if (dd) {
    // Try to extract the main container only, if present
    // If no container, use all child nodes
    let container = dd.querySelector(':scope > .container, :scope > .cmp-container');
    if (container) {
      contentCell = container;
    } else {
      // Otherwise, include all direct children (including text nodes)
      const nodes = Array.from(dd.childNodes).filter(node => {
        // Remove whitespace-only text nodes for cleaner output
        return node.nodeType !== Node.TEXT_NODE || node.textContent.trim() !== '';
      });
      // Use array only if >1 node, else just the node itself
      if (nodes.length === 1) {
        contentCell = nodes[0];
      } else if (nodes.length > 1) {
        contentCell = nodes;
      } else {
        contentCell = document.createTextNode('');
      }
    }
  }

  // Compose table rows
  const rows = [
    headerRow,
    [titleCell, contentCell]
  ];

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
