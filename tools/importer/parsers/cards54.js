/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as in the example
  const cells = [['Cards (cards54)']];

  // Find each card article, which is a card
  const cardArticles = element.querySelectorAll('article.cmp-card-list__item');
  cardArticles.forEach((article) => {
    const cardLink = article.querySelector('a.cmp-card');
    // --- IMAGE CELL ---
    let imgEl = null;
    if (cardLink && cardLink.hasAttribute('data-background')) {
      const bgUrl = cardLink.getAttribute('data-background');
      imgEl = document.createElement('img');
      imgEl.src = bgUrl;
      // Use aria-label from the .cmp-card-background div as alt if present
      const bgDiv = cardLink.querySelector('.cmp-card-background');
      if (bgDiv && bgDiv.hasAttribute('aria-label')) {
        imgEl.alt = bgDiv.getAttribute('aria-label') || '';
      } else {
        imgEl.alt = '';
      }
    }
    // --- TEXT CELL ---
    const contentEls = [];
    const insight = article.querySelector('.cmp-card-insight');
    if (insight) {
      // TYPE (optional, sometimes present)
      const typeEl = insight.querySelector('.cmp-card-content-type');
      if (typeEl && typeEl.textContent.trim()) {
        const div = document.createElement('div');
        div.textContent = typeEl.textContent.trim();
        div.style.fontSize = '0.8em';
        div.style.fontWeight = 'bold';
        contentEls.push(div);
      }
      // TITLE (should be prominent)
      const titleEl = insight.querySelector('.cmp-card-content-title');
      if (titleEl && titleEl.textContent.trim()) {
        const strong = document.createElement('strong');
        strong.textContent = titleEl.textContent.trim();
        contentEls.push(strong);
      }
      // DESCRIPTION
      const descEl = insight.querySelector('.cmp-card-content-des');
      if (descEl && descEl.textContent.trim()) {
        const p = document.createElement('div');
        p.textContent = descEl.textContent.trim();
        contentEls.push(p);
      }
      // TAGS (optional, only visible ones)
      const tagsView = insight.querySelector('.cmp-card-content-tags-view');
      if (tagsView) {
        const tags = Array.from(tagsView.querySelectorAll('span'))
          .map((span) => span.textContent.trim())
          .filter((txt) => txt.length > 0);
        if (tags.length > 0) {
          const tagsDiv = document.createElement('div');
          tagsDiv.textContent = tags.map(t => `#${t}`).join(' ');
          tagsDiv.style.fontSize = '0.8em';
          contentEls.push(tagsDiv);
        }
      }
      // CTA (Learn more)
      const ctaLabel = insight.querySelector('.cmp-card-content-label span');
      if (ctaLabel && ctaLabel.textContent.trim() && cardLink && cardLink.href) {
        const a = document.createElement('a');
        a.href = cardLink.href;
        a.textContent = ctaLabel.textContent.trim();
        if (cardLink.hasAttribute('target')) {
          a.target = cardLink.getAttribute('target');
        }
        contentEls.push(a);
      }
    }
    cells.push([imgEl, contentEls]);
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
