/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get all card containers in all columns/wraps
  function getAllCardContainers(root) {
    const items = [];
    // Find all .column-container > .wrap within the element
    root.querySelectorAll('.column-container > .wrap').forEach(wrap => {
      wrap.querySelectorAll('.container.cmp-section__item.has-card').forEach(cardContainer => {
        items.push(cardContainer);
      });
    });
    return items;
  }

  const cardContainers = getAllCardContainers(element);
  const rows = [['Cards (cards35)']];

  cardContainers.forEach(cardWrap => {
    // Find the card anchor
    const anchor = cardWrap.querySelector('a.cmp-card');
    if (!anchor) return; // skip if not found
    // IMAGE: get background-image from .cmp-card-background
    let imgEl = null;
    const bgDiv = anchor.querySelector('.cmp-card-background');
    if (bgDiv) {
      const style = bgDiv.getAttribute('style') || '';
      const match = style.match(/background-image:url\(([^)]+)\)/);
      if (match) {
        imgEl = document.createElement('img');
        imgEl.src = match[1];
        // Try to get alt text from title
        const title = anchor.querySelector('.cmp-card-content-title');
        imgEl.alt = title ? title.textContent.trim() : '';
      }
    }

    // TEXT CELL: title, description, CTA, tags
    const textCell = document.createElement('div');
    // Title (strong)
    const titleDiv = anchor.querySelector('.cmp-card-content-title');
    if (titleDiv) {
      const strong = document.createElement('strong');
      strong.textContent = titleDiv.textContent.trim();
      textCell.appendChild(strong);
    }
    // Description
    const descDiv = anchor.querySelector('.cmp-card-content-des');
    if (descDiv) {
      const desc = document.createElement('div');
      desc.textContent = descDiv.textContent.trim();
      textCell.appendChild(desc);
    }
    // CTA (use visible anchor text from .cmp-card-content-label, link to anchor href)
    const ctaDiv = anchor.querySelector('.cmp-card-content-label');
    if (ctaDiv && anchor.href) {
      const ctaLink = document.createElement('a');
      ctaLink.href = anchor.href;
      ctaLink.textContent = ctaDiv.textContent.trim();
      textCell.appendChild(ctaLink);
    }
    // Tags (if present, add as text comma separated)
    const tagsView = anchor.querySelectorAll('.cmp-card-content-tags-view span');
    if (tagsView.length > 0) {
      const tags = Array.from(tagsView).map(span => span.textContent.trim()).filter(Boolean);
      if (tags.length) {
        const tagsDiv = document.createElement('div');
        tagsDiv.textContent = tags.join(', ');
        textCell.appendChild(tagsDiv);
      }
    }
    rows.push([imgEl, textCell]);
  });

  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
