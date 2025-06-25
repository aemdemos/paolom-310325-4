/* global WebImporter */
export default function parse(element, { document }) {
  // Build the table header as per example
  const rows = [
    ['Accordion (accordion3)']
  ];

  // Find the cmp-accordion block (should be inside this element)
  const accordion = element.querySelector('.cmp-accordion');
  if (!accordion) return;

  // Each accordion item is a <dl class="cmp-accordion__item">
  const items = accordion.querySelectorAll('.cmp-accordion__item');
  items.forEach((item) => {
    // Left cell: title from dt > button
    let titleEl = null;
    const dt = item.querySelector('dt');
    if (dt) {
      const btn = dt.querySelector('button');
      if (btn) {
        // Use the actual button DOM element as the source, but we want just the text in a semantic container
        titleEl = document.createElement('p');
        titleEl.textContent = btn.textContent.trim();
      } else {
        titleEl = document.createElement('p');
        titleEl.textContent = dt.textContent.trim();
      }
    } else {
      titleEl = document.createElement('p');
      titleEl.textContent = '';
    }

    // Right cell: contents of <dd>
    const dd = item.querySelector('dd');
    let contentEl = null;
    if (dd) {
      // We want all the visible/meaningful content
      // If the dd has a single main child container (e.g. .container), use its children
      // Otherwise, use dd itself
      const ddChildren = Array.from(dd.children);
      if (ddChildren.length === 1 && ddChildren[0].classList.contains('container')) {
        // Dig into the container
        // Typically: .container > .cmp-container > .cmp-container_container > (content)
        let containerContent = ddChildren[0];
        // .cmp-container
        let cmpContainer = containerContent.querySelector('.cmp-container_container');
        if (cmpContainer) {
          // Use all children of cmp-container_container in a <div>
          const div = document.createElement('div');
          Array.from(cmpContainer.children).forEach(child => div.appendChild(child));
          contentEl = div;
        } else {
          // Fallback: use all children of the .container
          const div = document.createElement('div');
          Array.from(containerContent.children).forEach(child => div.appendChild(child));
          contentEl = div;
        }
      } else {
        // Use all direct children of dd
        const div = document.createElement('div');
        ddChildren.forEach(child => div.appendChild(child));
        contentEl = div;
      }
    }

    rows.push([
      titleEl,
      contentEl
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
