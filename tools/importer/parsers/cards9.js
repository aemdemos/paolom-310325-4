/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header: block name, exactly as given
  const headerRow = ['Cards (cards9)'];
  const rows = [headerRow];

  // 2. Find the row of cards
  const cardsRow = element.querySelector('.card-list__row, .dynamic-list-item-container');
  if (!cardsRow) return;
  const cardArticles = Array.from(cardsRow.querySelectorAll(':scope > article'));

  cardArticles.forEach(card => {
    const anchor = card.querySelector('a.cmp-card');
    if (!anchor) return;

    // --- IMAGE CELL ---
    let imgEl = null;
    const imgSrc = anchor.getAttribute('data-background');
    if (imgSrc) {
      imgEl = document.createElement('img');
      imgEl.src = imgSrc;
      // set alt from card title if available
      const titleEl = card.querySelector('.cmp-card-content-title');
      imgEl.alt = titleEl && titleEl.textContent.trim() ? titleEl.textContent.trim() : '';
    }

    // --- TEXT CELL ---
    const insight = card.querySelector('.cmp-card-insight');
    const contentEls = [];

    // Content type or date (optional)
    const typeOrDateEl = insight && (insight.querySelector('.cmp-card-content-type') || insight.querySelector('.cmp-card-content-date'));
    if (typeOrDateEl && typeOrDateEl.textContent.trim()) {
      const typeP = document.createElement('p');
      typeP.textContent = typeOrDateEl.textContent.trim();
      typeP.style.fontWeight = 'bold';
      contentEls.push(typeP);
    }

    // Title (strong)
    const titleEl = insight && insight.querySelector('.cmp-card-content-title');
    if (titleEl && titleEl.textContent.trim()) {
      const strong = document.createElement('strong');
      strong.textContent = titleEl.textContent.trim();
      contentEls.push(strong);
    }

    // Description
    const descEl = insight && insight.querySelector('.cmp-card-content-des');
    if (descEl && descEl.textContent.trim()) {
      const descP = document.createElement('p');
      descP.textContent = descEl.textContent.trim();
      contentEls.push(descP);
    }

    // CTA (label): as link, if present
    const labelEl = insight && insight.querySelector('.cmp-card-content-label span');
    if (labelEl && labelEl.textContent.trim()) {
      const link = document.createElement('a');
      link.href = anchor.getAttribute('href');
      link.textContent = labelEl.textContent.trim();
      contentEls.push(link);
    }

    // Tags (if present, as visible tags)
    const tagsEl = insight && insight.querySelector('.cmp-card-content-tags-view');
    if (tagsEl) {
      const tagSpans = Array.from(tagsEl.querySelectorAll('span')).filter(s => s.textContent.trim());
      if (tagSpans.length > 0) {
        const tagsDiv = document.createElement('div');
        tagSpans.forEach(tag => {
          const tagSpan = document.createElement('span');
          tagSpan.textContent = tag.textContent.trim();
          tagSpan.style.marginRight = '0.5em';
          tagsDiv.appendChild(tagSpan);
        });
        contentEls.push(tagsDiv);
      }
    }

    rows.push([imgEl, contentEls]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
