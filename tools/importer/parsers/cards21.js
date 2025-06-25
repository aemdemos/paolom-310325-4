/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the desktop or mobile cards container
  let articleCards = [];
  let cardList = element.querySelector('.card-list__container.carousel');
  if (cardList) {
    articleCards = Array.from(cardList.querySelectorAll('article.cmp-card-list__item'));
  } else {
    // mobile fallback
    cardList = element.querySelector('.card-list__containerMobile .card-list__row');
    if (cardList) {
      articleCards = Array.from(cardList.querySelectorAll('article.cmp-card-list__item'));
    }
  }
  if (!articleCards.length) return;

  // Header row exactly as in the spec
  const rows = [['Cards (cards21)']];

  // For every card, extract the image and the text block
  articleCards.forEach(card => {
    let imgEl = '';
    let textBlock = document.createDocumentFragment();
    // Get the anchor that wraps the card
    const cardA = card.querySelector('a.cmp-card');
    if (cardA) {
      // Extract background-image as <img>
      const bg = cardA.querySelector('.cmp-card-background');
      if (bg) {
        const style = bg.getAttribute('style') || '';
        const match = style.match(/background-image:\s*url\(['"]?([^'")]+)['"]?\)/);
        if (match && match[1]) {
          imgEl = document.createElement('img');
          imgEl.src = match[1];
          imgEl.alt = '';
        }
      }
      // Find the main card content
      const insight = cardA.querySelector('.cmp-card-insight');
      if (insight) {
        // type (optional): as its own line if present
        const type = insight.querySelector('.cmp-card-content-type');
        if (type && type.textContent.trim()) {
          const typeDiv = document.createElement('div');
          typeDiv.textContent = type.textContent.trim();
          textBlock.appendChild(typeDiv);
        }
        // title (strong)
        const title = insight.querySelector('.cmp-card-content-title');
        if (title && title.textContent.trim()) {
          const strong = document.createElement('strong');
          strong.textContent = title.textContent.trim();
          textBlock.appendChild(strong);
        }
        // description (as <p>)
        const desc = insight.querySelector('.cmp-card-content-des');
        if (desc && desc.textContent.trim()) {
          const p = document.createElement('p');
          p.textContent = desc.textContent.trim();
          textBlock.appendChild(p);
        }
        // CTA (as link, if exists)
        const cta = insight.querySelector('.cmp-card-content-label span');
        if (cta && cta.textContent.trim() && cardA.href) {
          const a = document.createElement('a');
          a.href = cardA.href;
          a.textContent = cta.textContent.trim();
          textBlock.appendChild(a);
        }
        // Tags (optional, not required in the example)
      } else {
        // fallback: all content except the image background
        const cardContent = cardA.querySelector('.cmp-card__content');
        if (cardContent) {
          Array.from(cardContent.children).forEach(child => {
            if (!child.classList.contains('cmp-card-background')) {
              textBlock.appendChild(child);
            }
          });
        } else {
          // fallback: just text
          textBlock.appendChild(document.createTextNode(cardA.textContent.trim()));
        }
      }
    } else {
      // fallback: text from the card itself
      textBlock.appendChild(document.createTextNode(card.textContent.trim()));
    }
    rows.push([
      imgEl || '',
      textBlock
    ]);
  });

  // Create and replace the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
