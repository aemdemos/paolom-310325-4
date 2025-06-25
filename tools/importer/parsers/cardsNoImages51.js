/* global WebImporter */
export default function parse(element, { document }) {
  // Exact header as required
  const cells = [['Cards (cardsNoImages51)']];

  // All cards from the given HTML are <li> direct children
  const cardItems = element.querySelectorAll(':scope > li');

  cardItems.forEach((card) => {
    // Prefer the desktop card structure if present, else fallback to whatever is in the <li>
    const prefer = card.querySelector('.hide-on-mobile') || card;
    // Card content for desktop: .cmp-bio-card__content
    const content = prefer.querySelector('.cmp-bio-card__content') || prefer;
    const info = content.querySelector('.cmp-bio-card__info') || content;
    const name = info.querySelector('.cmp-bio-card__name');
    const jobTitle = info.querySelector('.cmp-bio-card__job-title');
    const company = info.querySelector('.cmp-bio-card__company');
    const description = content.querySelector('.cmp-bio-card__description');
    const cta = content.querySelector('.cmp-bio-card__link a');

    // Compose card cell
    const frag = document.createDocumentFragment();

    // Heading: <strong>name</strong> | job title | company
    if (name || jobTitle || company) {
      const p = document.createElement('p');
      let added = false;
      if (name) {
        const strong = document.createElement('strong');
        strong.textContent = name.textContent.trim();
        p.appendChild(strong);
        added = true;
      }
      if (jobTitle) {
        if (added) p.appendChild(document.createTextNode(' | '));
        p.appendChild(document.createTextNode(jobTitle.textContent.trim()));
        added = true;
      }
      if (company) {
        if (added) p.appendChild(document.createTextNode(' | '));
        p.appendChild(document.createTextNode(company.textContent.trim()));
      }
      frag.appendChild(p);
    }

    // Description (all children, preserve structure)
    if (description) {
      Array.from(description.childNodes).forEach((node) => {
        // Keep elements and meaningful text
        if (node.nodeType === Node.ELEMENT_NODE || (node.nodeType === Node.TEXT_NODE && node.textContent.trim())) {
          frag.appendChild(node);
        }
      });
    }

    // CTA (as-is, reference anchor)
    if (cta) {
      const p = document.createElement('p');
      p.appendChild(cta);
      frag.appendChild(p);
    }

    // If fragment is empty, create empty cell, else array of nodes
    if (frag.childNodes.length > 1) {
      cells.push([Array.from(frag.childNodes)]);
    } else if (frag.childNodes.length === 1) {
      cells.push([frag.childNodes[0]]);
    } else {
      // fallback - put all text from card
      cells.push([card.textContent.trim()]);
    }
  });

  // Create the block and replace original
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
