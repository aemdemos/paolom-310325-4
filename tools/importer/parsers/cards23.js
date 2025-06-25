/* global WebImporter */
export default function parse(element, { document }) {
  // Header row must match the example exactly
  const headerRow = ['Cards (cards23)'];

  // Find the direct container holding all <article> cards
  let cardRow = element.querySelector('.card-list__row') || element;
  const cardArticles = Array.from(cardRow.querySelectorAll(':scope > article'));

  const rows = cardArticles.map((article) => {
    // Find the main card link
    const cardLink = article.querySelector('a.cmp-card');

    // Build the image cell
    let imgSrc = '';
    let imgAlt = '';
    if (cardLink) {
      imgSrc = cardLink.getAttribute('data-background') || '';
      // Try to get alt from .after aria-label
      const afterDiv = cardLink.querySelector('.cmp-card-background .after');
      if (afterDiv) {
        imgAlt = afterDiv.getAttribute('aria-label') || '';
      }
    }
    let imgEl = null;
    if (imgSrc) {
      imgEl = document.createElement('img');
      imgEl.src = imgSrc;
      imgEl.alt = imgAlt;
    }

    // Build the text cell: preserve as much structure as possible from .cmp-card-insight
    let textContent = [];
    const insight = cardLink?.querySelector('.cmp-card-insight');
    if (insight) {
      // Type (e.g., Live webinar)
      const type = insight.querySelector('.cmp-card-content-type');
      if (type) {
        const typeDiv = document.createElement('div');
        typeDiv.textContent = type.textContent;
        typeDiv.style.textTransform = 'uppercase';
        textContent.push(typeDiv);
      }
      // Date
      const date = insight.querySelector('.cmp-card-content-date');
      if (date) {
        const dateDiv = document.createElement('div');
        dateDiv.textContent = date.textContent;
        textContent.push(dateDiv);
      }
      // Title: strong
      const title = insight.querySelector('.cmp-card-content-title');
      if (title) {
        const strong = document.createElement('strong');
        strong.textContent = title.textContent;
        textContent.push(strong);
        textContent.push(document.createElement('br'));
      }
      // Description
      const desc = insight.querySelector('.cmp-card-content-des');
      if (desc) {
        const descDiv = document.createElement('div');
        descDiv.textContent = desc.textContent;
        textContent.push(descDiv);
      }
      // CTA (register/read more)
      const ctaSpan = insight.querySelector('.cmp-card-content-label span');
      if (ctaSpan && cardLink?.href) {
        const ctaLink = document.createElement('a');
        ctaLink.href = cardLink.href;
        ctaLink.textContent = ctaSpan.textContent;
        ctaLink.target = cardLink.target || '_self';
        textContent.push(document.createElement('br'));
        textContent.push(ctaLink);
      }
      // Tags: from .cmp-card-content-tags-view > span
      const tagsView = insight.querySelector('.cmp-card-content-tags-view');
      if (tagsView) {
        const tags = Array.from(tagsView.querySelectorAll('span'))
          .map(tag => '#' + tag.textContent.trim())
          .join(' ');
        if (tags) {
          const tagsDiv = document.createElement('div');
          tagsDiv.textContent = tags;
          textContent.push(tagsDiv);
        }
      }
    }
    // Defensive: if nothing, use the card's content area
    if (!textContent.length && cardLink) {
      const contentDiv = cardLink.querySelector('.cmp-card__content');
      if (contentDiv) textContent.push(contentDiv);
    }
    // Defensive: fallback to article
    if (!textContent.length) textContent.push(article);

    return [imgEl, textContent];
  });

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);

  element.replaceWith(table);
}
