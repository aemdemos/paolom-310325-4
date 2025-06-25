/* global WebImporter */
export default function parse(element, { document }) {
  // Header row exactly as required
  const rows = [['Cards (cards60)']];

  // Select all card articles
  const cardArticles = element.querySelectorAll('article');

  cardArticles.forEach((card) => {
    // Find the anchor containing all card content
    const link = card.querySelector('a.cmp-card');
    // --- IMAGE LOGIC ---
    let imgSrc = null;
    if (link && link.hasAttribute('data-background')) {
      imgSrc = link.getAttribute('data-background');
    } else {
      const bgDiv = link ? link.querySelector('.cmp-card-background') : null;
      if (bgDiv && bgDiv.style.backgroundImage) {
        const match = bgDiv.style.backgroundImage.match(/url\(["']?(.*?)["']?\)/);
        if (match) imgSrc = match[1];
      }
    }
    let imgEl = null;
    if (imgSrc) {
      imgEl = document.createElement('img');
      imgEl.src = imgSrc;
      imgEl.alt = '';
    }

    // --- TEXT BLOCK LOGIC ---
    // Reference the insight node if present, otherwise fallback
    let insight = link ? link.querySelector('.cmp-card-insight') : null;
    let textCell;
    if (insight) {
      // Compose text cell from type, title, description, cta, and tags if present
      const parts = [];
      // Content type (Stories, etc)
      const type = insight.querySelector('.cmp-card-content-type');
      if (type && type.textContent.trim()) {
        const typeDiv = document.createElement('div');
        typeDiv.textContent = type.textContent.trim();
        typeDiv.style.textTransform = 'uppercase';
        typeDiv.style.fontSize = '0.85em';
        parts.push(typeDiv);
      }
      // Title (strong for clearest meaning)
      const title = insight.querySelector('.cmp-card-content-title');
      if (title && title.textContent.trim()) {
        const strong = document.createElement('strong');
        strong.textContent = title.textContent.trim();
        parts.push(strong);
      }
      // Description
      const desc = insight.querySelector('.cmp-card-content-des');
      if (desc && desc.textContent.trim()) {
        const p = document.createElement('p');
        p.textContent = desc.textContent.trim();
        parts.push(p);
      }
      // CTA (label, as a link)
      const cta = insight.querySelector('.cmp-card-content-label span');
      if (cta && cta.textContent.trim() && link && link.href) {
        const a = document.createElement('a');
        a.href = link.href;
        a.textContent = cta.textContent.trim();
        parts.push(a);
      }
      // Tags (optional, add as a list if present)
      const tagsView = insight.querySelector('.cmp-card-content-tags-view');
      if (tagsView) {
        const tagSpans = tagsView.querySelectorAll('span');
        if (tagSpans.length > 0) {
          const tagList = document.createElement('div');
          tagList.style.marginTop = '0.5em';
          tagSpans.forEach(span => {
            const tag = document.createElement('span');
            tag.textContent = span.textContent.trim();
            tag.style.marginRight = '0.5em';
            tagList.appendChild(tag);
          });
          parts.push(tagList);
        }
      }
      textCell = parts.length === 1 ? parts[0] : parts;
    } else if (link) {
      // Fallback: use all the text in the link if .cmp-card-insight not found
      textCell = link.textContent.trim();
    } else {
      textCell = '';
    }

    rows.push([imgEl || '', textCell]);
  });

  // Create and replace the table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
