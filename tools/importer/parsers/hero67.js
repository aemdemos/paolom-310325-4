/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Extract background image (prefer desktop, fallback to mobile)
  let bgUrl = null;
  const bgContainer = element.querySelector('.cmp-container__background');
  if (bgContainer) {
    let bgSpan = bgContainer.querySelector('.desktop-background') || bgContainer.querySelector('.mobile-background');
    if (bgSpan) {
      const style = bgSpan.getAttribute('style') || '';
      const match = style.match(/background-image\s*:\s*url\(([^)]+)\)/i);
      if (match && match[1]) {
        bgUrl = match[1].replace(/['"]/g, '');
      }
    }
  }

  // 2. Create background image element (if any)
  let bgImgEl = '';
  if (bgUrl) {
    bgImgEl = document.createElement('img');
    bgImgEl.src = bgUrl;
    bgImgEl.alt = '';
  }

  // 3. Find the content: heading, subheading, CTA
  // Look for cmp-text as the main content block
  let contentEls = [];
  const cmpText = element.querySelector('.cmp-text');
  if (cmpText) {
    Array.from(cmpText.children).forEach(child => {
      // Filter out empty paragraphs and empty headings
      const isEmptyPara = child.tagName.toLowerCase() === 'p' && child.textContent.trim() === '';
      const isEmptyHeading = (child.tagName.toLowerCase() === 'h1' || child.tagName.toLowerCase() === 'h2' || child.tagName.toLowerCase() === 'h3') && child.textContent.trim() === '';
      if (isEmptyPara || isEmptyHeading) return;
      contentEls.push(child);
    });
  }
  // Find CTA button (if any)
  const ctaBtn = element.querySelector('.cmp-button');
  if (ctaBtn) {
    contentEls.push(ctaBtn);
  }

  // 4. Compose the block table as per Hero specification
  // Header should be exactly 'Hero' as per the example
  const cells = [
    ['Hero'],
    [bgImgEl],
    [contentEls.length ? contentEls : '']
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // 5. Replace original element with the table
  element.replaceWith(block);
}
