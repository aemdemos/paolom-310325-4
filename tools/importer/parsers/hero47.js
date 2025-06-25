/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header row
  const headerRow = ['Hero'];

  // 2. Background image extraction (desktop preferred, fallback to mobile)
  let bgUrl = '';
  const desktopBg = element.querySelector('.desktop-background');
  if (desktopBg && desktopBg.style && desktopBg.style.backgroundImage) {
    const m = desktopBg.style.backgroundImage.match(/url\(["']?([^"')]+)["']?\)/);
    if (m) {
      bgUrl = m[1];
    }
  }
  if (!bgUrl) {
    const mobileBg = element.querySelector('.mobile-background');
    if (mobileBg && mobileBg.style && mobileBg.style.backgroundImage) {
      const m = mobileBg.style.backgroundImage.match(/url\(["']?([^"')]+)["']?\)/);
      if (m) {
        bgUrl = m[1];
      }
    }
  }

  // 3. Create an <img> element if background found, else empty
  let imgElem = '';
  if (bgUrl) {
    imgElem = document.createElement('img');
    imgElem.src = bgUrl;
    imgElem.alt = '';
  }

  // 4. Gather hero content: title, subheading, and CTA as elements
  const contentCell = [];
  const heroContent = element.querySelector('.cmp-hero__content');
  if (heroContent) {
    // Title (h1/h2/h3)
    const title = heroContent.querySelector('.cmp-hero__title h1, .cmp-hero__title h2, .cmp-hero__title h3');
    if (title) contentCell.push(title);
    // Subheading (none in this example, but if present as h2/h3 not inside title)
    // CTA (button link)
    const cta = heroContent.querySelector('.cmp-hero__cta a');
    if (cta) contentCell.push(cta);
  }

  // 5. Assemble table
  const rows = [
    headerRow,
    [imgElem || ''],
    [contentCell.length ? contentCell : '']
  ];

  // 6. Create block table and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
