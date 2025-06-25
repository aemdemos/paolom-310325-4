/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Convert iframe to a link (if not an image)
  function iframeToLink(iframe) {
    if (!iframe) return null;
    const src = iframe.getAttribute('src');
    if (!src) return null;
    const a = document.createElement('a');
    a.href = src;
    a.textContent = src;
    return a;
  }

  // Header row (must match exactly)
  const rows = [['Accordion (accordion66)']];

  // Find accordion items
  const accordionRoot = element.querySelector('.cmp-accordion') || element;
  const items = accordionRoot.querySelectorAll(':scope > dl.cmp-accordion__item');

  items.forEach((item) => {
    // Get title
    let title = '';
    const btn = item.querySelector('dt .cmp-accordion__button');
    if (btn) title = btn.textContent.trim();

    // Get content panel
    let contentCell = '';
    const panel = item.querySelector('dd[data-cmp-hook-accordion="panel"]');
    if (panel) {
      // Prefer .cmp-container_container if present, else just all panel children
      const containers = panel.querySelectorAll('.cmp-container_container');
      let collected = [];
      if (containers.length > 0) {
        containers.forEach((container) => {
          // For each child (node), keep elements and non-empty text nodes
          Array.from(container.childNodes).forEach((node) => {
            if (node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0) {
              collected.push(document.createTextNode(node.textContent));
            } else if (node.nodeType === Node.ELEMENT_NODE) {
              // For element nodes, if it contains an iframe, handle special
              const iframe = node.querySelector && node.querySelector('iframe');
              if (iframe) {
                // If the node only contains an iframe and nothing else, just link
                if (node.childNodes.length === 1 && node.firstElementChild === iframe) {
                  collected.push(iframeToLink(iframe));
                } else {
                  // If there's other content, include the full node
                  collected.push(node);
                }
              } else {
                collected.push(node);
              }
            }
          });
        });
      } else {
        // If no .cmp-container_container, process all child nodes of panel
        Array.from(panel.childNodes).forEach((node) => {
          if (node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0) {
            collected.push(document.createTextNode(node.textContent));
          } else if (node.nodeType === Node.ELEMENT_NODE) {
            const iframe = node.querySelector && node.querySelector('iframe');
            if (iframe) {
              if (node.childNodes.length === 1 && node.firstElementChild === iframe) {
                collected.push(iframeToLink(iframe));
              } else {
                collected.push(node);
              }
            } else {
              collected.push(node);
            }
          }
        });
      }
      // If only one node, use that. If more than one, use array (so all content is included)
      if (collected.length === 1) {
        contentCell = collected[0];
      } else if (collected.length > 1) {
        contentCell = collected;
      } else {
        contentCell = '';
      }
    }
    rows.push([title, contentCell]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
