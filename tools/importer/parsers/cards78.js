/* global WebImporter */
export default function parse(element, { document }) {
  // Helper function to create <img> from data-background
  function createImgFromBackground(bgUrl, altText) {
    if (!bgUrl) return null;
    const img = document.createElement('img');
    img.src = bgUrl;
    img.alt = altText || '';
    return img;
  }

  // Get all card articles
  const cards = Array.from(element.querySelectorAll('article.cmp-card-list__item'));
  const rows = [];
  // Add correct block header
  rows.push(['Cards (cards78)']);

  cards.forEach(card => {
    // Each card anchor
    const anchor = card.querySelector('a.cmp-card');
    const bgUrl = anchor ? anchor.getAttribute('data-background') : '';
    // Get insight section
    const content = anchor ? anchor.querySelector('.cmp-card__content') : null;
    const insight = content ? content.querySelector('.cmp-card-insight') : null;

    // Extract parts
    let typeText = '', titleText = '', descText = '', ctaText = '', ctaHref = '';
    if (insight) {
      const typeEl = insight.querySelector('.cmp-card-content-type');
      typeText = typeEl ? typeEl.textContent.trim() : '';
      const titleEl = insight.querySelector('.cmp-card-content-title');
      titleText = titleEl ? titleEl.textContent.trim() : '';
      const descEl = insight.querySelector('.cmp-card-content-des');
      descText = descEl ? descEl.textContent.trim() : '';
      const ctaEl = insight.querySelector('.cmp-card-content-label span');
      ctaText = ctaEl ? ctaEl.textContent.trim() : '';
      ctaHref = anchor ? anchor.href : '';
    }

    // First cell: image element
    const img = createImgFromBackground(bgUrl, titleText);

    // Second cell: text content
    const cellContent = [];
    if (typeText) {
      const typeDiv = document.createElement('div');
      typeDiv.style.textTransform = 'uppercase';
      typeDiv.style.fontSize = '11px';
      typeDiv.style.fontWeight = 'bold';
      typeDiv.textContent = typeText;
      cellContent.push(typeDiv);
    }
    if (titleText) {
      const titleEl = document.createElement('div');
      const strong = document.createElement('strong');
      strong.textContent = titleText;
      titleEl.appendChild(strong);
      cellContent.push(titleEl);
    }
    if (descText) {
      const descEl = document.createElement('div');
      descEl.textContent = descText;
      cellContent.push(descEl);
    }
    if (ctaText && ctaHref) {
      const ctaLink = document.createElement('a');
      ctaLink.href = ctaHref;
      ctaLink.textContent = ctaText;
      cellContent.push(ctaLink);
    }

    rows.push([
      img,
      cellContent
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
