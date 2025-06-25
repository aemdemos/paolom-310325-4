/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get all text content nodes (including formatting) from the card
  function getCardTextContent(cardLink) {
    // Prefer .cmp-card-insight. If not present, use .modal-background or the link itself
    let container = cardLink.querySelector('.cmp-card-insight')
      || cardLink.querySelector('.modal-background')
      || cardLink;
    // Remove unwanted elements (tags, toggles, etc.) directly from the existing DOM to maximize reuse
    const toRemove = container.querySelectorAll('.cmp-card-content-tags, .cmp-card-content-tags-all-toggle, .cmp-card-content-tags-all, .cmp-card-content-tags-view, .tabs-view');
    toRemove.forEach(el => el.remove());
    // Move possible CTA label to end as a link if present
    const labelSpan = container.querySelector('.cmp-card-content-label span');
    let ctaLink = null;
    if (labelSpan && cardLink.href) {
      ctaLink = document.createElement('a');
      ctaLink.href = cardLink.href;
      ctaLink.textContent = labelSpan.textContent.trim();
    }
    // Collect all non-empty childNodes (preserving formatting)
    const nodes = Array.from(container.childNodes).filter(n => {
      if (n.nodeType === Node.TEXT_NODE) {
        return n.textContent.trim().length > 0;
      }
      if (n.nodeType === Node.ELEMENT_NODE) {
        // Exclude label span, handled as CTA; exclude empty elements
        if (n.contains && labelSpan && n.contains(labelSpan)) return false;
        if (n.tagName === 'BR' && !n.textContent.trim()) return false;
        return true;
      }
      return false;
    });
    // Add CTA link at the end if present
    if (ctaLink) nodes.push(document.createElement('br'), ctaLink);
    // Remove trailing <br>
    while (nodes.length && nodes[nodes.length - 1].tagName === 'BR') {
      nodes.pop();
    }
    return nodes;
  }

  // Build the cards table
  const tableRows = [['Cards (cards39)']];
  // Support all carousel slides (each with cards)
  const carouselSlides = element.querySelectorAll('.cmp-carousel__item');
  carouselSlides.forEach(slide => {
    const cardArticles = slide.querySelectorAll('article.cmp-card-list__item');
    cardArticles.forEach(article => {
      const cardLink = article.querySelector('a.cmp-card');
      if (!cardLink) return;
      // Get image from data-background
      let imgEl = null;
      if (cardLink.hasAttribute('data-background')) {
        const imgUrl = cardLink.getAttribute('data-background');
        imgEl = document.createElement('img');
        imgEl.src = imgUrl;
        // Get alt from cmp-card-background aria-label
        const bgDiv = cardLink.querySelector('.cmp-card-background');
        imgEl.alt = (bgDiv && bgDiv.getAttribute('aria-label')) || '';
      }
      const textContentNodes = getCardTextContent(cardLink);
      tableRows.push([imgEl, textContentNodes]);
    });
  });
  // Fallback: flat list of cards
  if (tableRows.length === 1) {
    const cardArticles = element.querySelectorAll('article.cmp-card-list__item');
    cardArticles.forEach(article => {
      const cardLink = article.querySelector('a.cmp-card');
      if (!cardLink) return;
      let imgEl = null;
      if (cardLink.hasAttribute('data-background')) {
        const imgUrl = cardLink.getAttribute('data-background');
        imgEl = document.createElement('img');
        imgEl.src = imgUrl;
        const bgDiv = cardLink.querySelector('.cmp-card-background');
        imgEl.alt = (bgDiv && bgDiv.getAttribute('aria-label')) || '';
      }
      const textContentNodes = getCardTextContent(cardLink);
      tableRows.push([imgEl, textContentNodes]);
    });
  }
  // Only build if we found cards
  if (tableRows.length > 1) {
    const table = WebImporter.DOMUtils.createTable(tableRows, document);
    element.replaceWith(table);
  }
}
