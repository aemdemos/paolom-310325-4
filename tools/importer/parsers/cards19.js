/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header must match exactly
  const headerRow = ['Cards (cards19)'];
  const cells = [headerRow];

  // 2. Find the list items (cards)
  const ul = element.querySelector('ul.cmp-bio-card-list__items');
  if (!ul) return;
  const items = ul.querySelectorAll(':scope > li');

  items.forEach((li) => {
    // IMAGE cell (first cell): use the <img> reference, or blank if not found
    const img = li.querySelector('.cmp-bio-card__image img');
    const imageCell = img || '';

    // TEXT content cell (second cell):
    //  - Name (as strong)
    //  - Job Title (as span)
    //  - CTA link (as is, reference)
    const contentDiv = li.querySelector('.cmp-bio-card__content');
    const textFragments = [];

    // Name/title (required)
    const nameDiv = contentDiv && contentDiv.querySelector('.cmp-bio-card__name');
    if (nameDiv && nameDiv.textContent.trim()) {
      const strong = document.createElement('strong');
      strong.textContent = nameDiv.textContent.trim();
      textFragments.push(strong);
      textFragments.push(document.createElement('br'));
    }
    // Job title (optional, but present in all)
    const jobDiv = contentDiv && contentDiv.querySelector('.cmp-bio-card__job-title');
    if (jobDiv && jobDiv.textContent.trim()) {
      const span = document.createElement('span');
      span.textContent = jobDiv.textContent.trim();
      textFragments.push(span);
      textFragments.push(document.createElement('br'));
    }
    // CTA link (optional, but present in all)
    const ctaDiv = contentDiv && contentDiv.querySelector('.cmp-bio-card__link a');
    if (ctaDiv) {
      textFragments.push(ctaDiv);
    }

    // Remove trailing <br> if link is missing (so we don't have an empty line at the bottom)
    if (
      textFragments.length > 0 &&
      !ctaDiv &&
      textFragments[textFragments.length - 1].tagName === 'BR'
    ) {
      textFragments.pop();
    }

    cells.push([imageCell, textFragments]);
  });

  // 3. Create the table and replace the element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
