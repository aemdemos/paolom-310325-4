/* global WebImporter */
export default function parse(element, { document }) {
  // Table header must match exactly as per instructions
  const headerRow = ['Accordion (accordion92)'];
  const cells = [headerRow];

  // Find all accordion items (dl.cmp-accordion__item)
  const accordionItems = element.querySelectorAll('.cmp-accordion__item');
  accordionItems.forEach((item) => {
    // Title cell: the text of the button inside the dt
    let titleCell = '';
    const dt = item.querySelector('dt.cmp-accordion__header');
    if (dt) {
      const btn = dt.querySelector('.cmp-accordion__button');
      if (btn) {
        titleCell = btn.textContent.trim();
      }
    }

    // Content cell: the immediate children of dd.cmp-accordion__panel
    let contentCell = '';
    const dd = item.querySelector('dd.cmp-accordion__panel');
    if (dd) {
      // Unwrap through single-child containers to get to the meaningful content
      let contentNodes = [];
      let curr = dd;
      // Unwrap <div> wrappers if they are the only child, e.g. .container, .cmp-container, .cmp-container_container
      while (
        curr &&
        curr.children.length === 1 &&
        curr.children[0].tagName === 'DIV' &&
        (curr.children[0].classList.contains('container') ||
         curr.children[0].classList.contains('responsivegrid') ||
         curr.children[0].classList.contains('cmp-container') ||
         curr.children[0].classList.contains('cmp-container_container')
        )
      ) {
        curr = curr.children[0];
      }
      // Now curr is the innermost div with content
      if (curr && curr.children.length > 0) {
        // Some containers have a further single <div> child holding the actual content
        if (curr.children.length === 1 && curr.children[0].tagName === 'DIV') {
          contentNodes = Array.from(curr.children[0].children);
        } else {
          contentNodes = Array.from(curr.children);
        }
      } else {
        // If it's just text or empty
        contentNodes = [curr];
      }
      // Remove empty nodes
      contentNodes = contentNodes.filter(node => node && (node.textContent.trim() !== '' || node.querySelector));
      // If only one node, don't wrap in array
      contentCell = contentNodes.length === 1 ? contentNodes[0] : contentNodes;
    }

    cells.push([titleCell, contentCell]);
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
