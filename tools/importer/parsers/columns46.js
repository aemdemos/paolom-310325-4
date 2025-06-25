/* global WebImporter */
export default function parse(element, { document }) {
  // Find the hero block inside the experience fragment
  const hero = element.querySelector('.cmp-hero');
  if (!hero) return;

  // Left column content: eyebrow, title, subtitle, CTA buttons (preserving elements)
  const leftColEls = [];
  const content = hero.querySelector('.cmp-hero__content');
  if (content) {
    const eyebrow = content.querySelector('.cmp-hero__eyeBrow');
    if (eyebrow && eyebrow.textContent.trim()) leftColEls.push(eyebrow);
    const title = content.querySelector('.cmp-hero__title');
    if (title && title.textContent.trim()) leftColEls.push(title);
    const subtitle = content.querySelector('.cmp-hero__subText');
    if (subtitle && subtitle.textContent.trim()) leftColEls.push(subtitle);
    const cta = content.querySelector('.cmp-hero__cta');
    if (cta && cta.textContent.trim()) leftColEls.push(cta);
  }

  // Right column content: hero background images as <img>
  const rightColEls = [];
  const bg = hero.querySelector('.cmp-hero__background');
  if (bg) {
    const desktopBg = bg.querySelector('.desktop-background');
    if (desktopBg && desktopBg.style && desktopBg.style.backgroundImage) {
      const match = desktopBg.style.backgroundImage.match(/url\(["']?(.*?)["']?\)/);
      if (match && match[1]) {
        const img = document.createElement('img');
        img.src = match[1];
        img.alt = 'Hero desktop background';
        rightColEls.push(img);
      }
    }
    const mobileBg = bg.querySelector('.mobile-background');
    if (mobileBg && mobileBg.style && mobileBg.style.backgroundImage) {
      const match = mobileBg.style.backgroundImage.match(/url\(["']?(.*?)["']?\)/);
      if (match && match[1]) {
        const img = document.createElement('img');
        img.src = match[1];
        img.alt = 'Hero mobile background';
        rightColEls.push(img);
      }
    }
  }

  // Make header row have as many entries as the number of columns (for colspan effect)
  const numCols = 2;
  const headerRow = ['Columns (columns46)'];
  // Fill out the rest of the header row with empty strings
  while (headerRow.length < numCols) headerRow.push('');

  const cells = [
    headerRow,
    [leftColEls, rightColEls],
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
