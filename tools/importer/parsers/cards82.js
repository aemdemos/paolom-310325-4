/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row (exactly as required)
  const headerRow = ['Cards (cards82)'];
  const rows = [headerRow];

  // Get all direct card items
  const cards = element.querySelectorAll(':scope > li');
  cards.forEach(card => {
    // First cell: image (reference original <img> element)
    let img = null;
    const imgWrap = card.querySelector('.cmp-bio-card__avatar .cmp-bio-card__image');
    if (imgWrap) {
      img = imgWrap.querySelector('img');
    }

    // Second cell: content
    const contentParts = [];
    // Name as heading (strong for bold/heading style; preserve semantic meaning)
    const name = card.querySelector('.cmp-bio-card__name');
    if (name && name.textContent.trim()) {
      const strong = document.createElement('strong');
      strong.textContent = name.textContent.trim();
      contentParts.push(strong);
      contentParts.push(document.createElement('br'));
    }
    // Job title (plain span)
    const job = card.querySelector('.cmp-bio-card__job-title');
    if (job && job.textContent.trim()) {
      const jobSpan = document.createElement('span');
      jobSpan.textContent = job.textContent.trim();
      contentParts.push(jobSpan);
      contentParts.push(document.createElement('br'));
    }
    // CTA link
    const ctaWrap = card.querySelector('.cmp-bio-card__link a');
    if (ctaWrap) {
      // Place on new line
      contentParts.push(document.createElement('br'));
      contentParts.push(ctaWrap);
    }
    // If nothing, include at least an empty div to fill the cell
    const cell2 = contentParts.length ? contentParts : document.createElement('div');

    rows.push([img, cell2]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
