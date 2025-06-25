/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as per example
  const headerRow = ['Cards (cards68)'];
  const rows = [headerRow];

  // All cards are article elements
  const cardArticles = element.querySelectorAll('article.cmp-card-list__item');
  cardArticles.forEach((article) => {
    // ---- IMAGE CELL ----
    let imgEl = '';
    const cardLink = article.querySelector('a.cmp-card');
    if (cardLink && cardLink.hasAttribute('data-background')) {
      // Use the background image as img src
      const img = document.createElement('img');
      img.src = cardLink.getAttribute('data-background');
      img.alt = '';
      imgEl = img;
    }
    // ---- TEXT CELL ----
    const textCellEls = [];
    // Gather from inside cmp-card-insight
    let insight;
    const content = cardLink && cardLink.querySelector('.cmp-card__content');
    const bg = content && content.querySelector('.cmp-card-background');
    insight = bg && bg.querySelector('.cmp-card-insight');
    // Content type (optional)
    if (insight) {
      const typeEl = insight.querySelector('.cmp-card-content-type');
      if (typeEl && typeEl.textContent.trim()) {
        const typeDiv = document.createElement('div');
        typeDiv.textContent = typeEl.textContent;
        // Add some presentational style for clarity
        typeDiv.style.textTransform = 'uppercase';
        typeDiv.style.fontWeight = 'bold';
        typeDiv.style.fontSize = '0.9em';
        textCellEls.push(typeDiv);
      }
      // Title (strong)
      const titleEl = insight.querySelector('.cmp-card-content-title');
      if (titleEl && titleEl.textContent.trim()) {
        const strong = document.createElement('strong');
        strong.textContent = titleEl.textContent;
        textCellEls.push(strong);
      }
      // Description
      const descEl = insight.querySelector('.cmp-card-content-des');
      if (descEl && descEl.textContent.trim()) {
        const descDiv = document.createElement('div');
        descDiv.textContent = descEl.textContent;
        textCellEls.push(descDiv);
      }
      // CTA: get .cmp-card-content-label span
      const ctaSpan = insight.querySelector('.cmp-card-content-label span');
      if (ctaSpan && cardLink && cardLink.href && ctaSpan.textContent.trim()) {
        const ctaA = document.createElement('a');
        ctaA.href = cardLink.href;
        ctaA.textContent = ctaSpan.textContent;
        ctaA.target = cardLink.target || '_self';
        textCellEls.push(ctaA);
      }
      // Tags (optional)
      // Use '.cmp-card-content-tags-view' or '.cmp-card-content-tags-all' (these contain span children)
      let tagsContainer = insight.querySelector('.cmp-card-content-tags-view') || insight.querySelector('.cmp-card-content-tags-all');
      if (tagsContainer) {
        const tagSpans = tagsContainer.querySelectorAll('span');
        if (tagSpans.length > 0) {
          const tagsDiv = document.createElement('div');
          tagSpans.forEach(tagEl => {
            // Only add non-empty tags
            if (tagEl.textContent.trim()) {
              const tagSpan = document.createElement('span');
              tagSpan.textContent = tagEl.textContent;
              tagSpan.style.marginRight = '0.5em';
              tagsDiv.appendChild(tagSpan);
            }
          });
          if (tagsDiv.childNodes.length > 0) {
            textCellEls.push(tagsDiv);
          }
        }
      }
    }
    // Edge: if textCellEls is empty, push an empty string
    rows.push([
      imgEl,
      textCellEls.length > 0 ? textCellEls : '',
    ]);
  });
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
