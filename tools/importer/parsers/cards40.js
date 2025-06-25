/* global WebImporter */
export default function parse(element, { document }) {
  // Header row
  const rows = [
    ['Cards (cards40)']
  ];

  // Find all cards in the block
  const cardDivs = element.querySelectorAll('.card.base-component');

  cardDivs.forEach(cardDiv => {
    const cardAnchor = cardDiv.querySelector('a.cmp-card');
    if (!cardAnchor) return;

    // Get image from data-background or background-image
    let imgUrl = cardAnchor.getAttribute('data-background');
    if (!imgUrl) {
      const bgDiv = cardAnchor.querySelector('.cmp-card-background');
      if (bgDiv && bgDiv.style.backgroundImage) {
        const m = bgDiv.style.backgroundImage.match(/url\(["']?(.*?)["']?\)/);
        if (m) imgUrl = m[1];
      }
    }
    let imgEl = null;
    if (imgUrl) {
      imgEl = document.createElement('img');
      imgEl.src = imgUrl;
      imgEl.alt = '';
    }

    // Extract card text content (title, description, cta)
    const insight = cardAnchor.querySelector('.cmp-card-insight');
    const textContent = [];
    if (insight) {
      // Title
      const titleDiv = insight.querySelector('.cmp-card-content-title');
      if (titleDiv) {
        const titleEl = document.createElement('strong');
        titleEl.textContent = titleDiv.textContent.trim();
        textContent.push(titleEl);
        // Only add line break if more follows
        const descDiv = insight.querySelector('.cmp-card-content-des');
        const ctaDiv = insight.querySelector('.cmp-card-content-label');
        if (descDiv || ctaDiv) textContent.push(document.createElement('br'));
      }
      // Description
      const descDiv = insight.querySelector('.cmp-card-content-des');
      if (descDiv) {
        textContent.push(document.createTextNode(descDiv.textContent.trim()));
        if (insight.querySelector('.cmp-card-content-label')) textContent.push(document.createElement('br'));
      }
      // CTA (link at the bottom)
      const ctaDiv = insight.querySelector('.cmp-card-content-label');
      if (ctaDiv && cardAnchor.href) {
        const ctaEl = document.createElement('a');
        ctaEl.href = cardAnchor.href;
        ctaEl.textContent = ctaDiv.textContent.trim();
        textContent.push(ctaEl);
      }
    }
    // Remove trailing <br>, if present
    while (textContent.length && textContent[textContent.length-1].tagName === 'BR') {
      textContent.pop();
    }

    rows.push([
      imgEl,
      textContent.length ? textContent : ''
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
