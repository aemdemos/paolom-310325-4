/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row
  const headerRow = ['Cards (cards97)'];
  const rows = [headerRow];

  // 2. Find all card articles
  const cardArticles = element.querySelectorAll(':scope .cmp-card-list__item');

  cardArticles.forEach((article) => {
    // Get the anchor
    const anchor = article.querySelector('a.cmp-card');
    let imageEl = null;
    let textContentArr = [];

    // Get image from data-background
    const bgUrl = anchor && anchor.getAttribute('data-background');
    if (bgUrl) {
      imageEl = document.createElement('img');
      imageEl.src = bgUrl;
      imageEl.alt = '';
    }

    // Get card text content
    const insight = anchor.querySelector('.cmp-card-insight');
    if (insight) {
      // Title
      const titleDiv = insight.querySelector('.cmp-card-content-title');
      if (titleDiv && titleDiv.textContent.trim()) {
        const titleEl = document.createElement('div');
        const strongEl = document.createElement('strong');
        strongEl.textContent = titleDiv.textContent.trim();
        titleEl.appendChild(strongEl);
        textContentArr.push(titleEl);
      }
      // Description
      const descDiv = insight.querySelector('.cmp-card-content-des');
      if (descDiv && descDiv.textContent.trim()) {
        const descEl = document.createElement('div');
        descEl.textContent = descDiv.textContent.trim();
        textContentArr.push(descEl);
      }
      // CTA (label)
      const labelDiv = insight.querySelector('.cmp-card-content-label span');
      if (labelDiv && labelDiv.textContent.trim() && anchor.href) {
        const linkEl = document.createElement('a');
        linkEl.href = anchor.href;
        linkEl.textContent = labelDiv.textContent.trim();
        textContentArr.push(linkEl);
      }
    }

    rows.push([
      imageEl,
      textContentArr
    ]);
  });

  // 3. Create and replace with the table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
