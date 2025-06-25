/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract background image URL and alt text
  function getBackgroundImageAndAlt(el) {
    let bgUrl = '';
    let bgAlt = '';
    let bgSpan = null;
    const bgContainer = el.querySelector('.cmp-container__background');
    if (bgContainer) {
      bgSpan = bgContainer.querySelector('.desktop-background') || bgContainer.querySelector('.mobile-background') || bgContainer.querySelector('span[role="img"]');
      if (bgSpan && bgSpan.style && bgSpan.style.backgroundImage) {
        const match = bgSpan.style.backgroundImage.match(/url\(['"]?([^'"]+)['"]?\)/);
        if (match && match[1]) {
          bgUrl = match[1];
        }
      }
      if (bgSpan && bgSpan.getAttribute('aria-label')) {
        bgAlt = bgSpan.getAttribute('aria-label');
      }
    }
    return { bgUrl, bgAlt };
  }

  // 1. Find the main container with possible background image
  const heroContainer = element.querySelector('.cmp-container.has-desktopBg, .cmp-container.has-mobileBg, .cmp-container[style*="background"]') || element.querySelector('.cmp-container');
  // Extract image URL and alt
  let imageEl = '';
  if (heroContainer) {
    const { bgUrl, bgAlt } = getBackgroundImageAndAlt(heroContainer);
    if (bgUrl) {
      imageEl = document.createElement('img');
      imageEl.src = bgUrl;
      imageEl.alt = bgAlt || '';
    }
  }

  // 2. Find the content area (find the first .wrap or fallback to first .columncontainer or .column-container)
  let contentWrap = element.querySelector('.column-container .wrap, .columncontainer .wrap');
  if (!contentWrap) {
    contentWrap = element.querySelector('.columncontainer, .column-container');
  }
  let mainSection = null;
  if (contentWrap) {
    mainSection = contentWrap.querySelector('.cmp-section__item');
  }
  // Fallback: pick first .cmp-section__item anywhere
  if (!mainSection) {
    mainSection = element.querySelector('.cmp-section__item');
  }

  // Compose the content cell: heading, subheading, copy, CTA
  let contentCellContents = [];
  if (mainSection) {
    // Find the heading/title
    const titleEl = mainSection.querySelector('.cmp-title__text, h1, h2, h3, h4, h5, h6');
    if (titleEl) contentCellContents.push(titleEl);

    // Find text block (can contain paragraphs, headings, etc.)
    const textEl = mainSection.querySelector('.cmp-text');
    if (textEl) {
      // Append all its children to preserve headings, paragraphs, etc.
      Array.from(textEl.childNodes).forEach((node) => {
        if (node.nodeType === 1) contentCellContents.push(node);
      });
    }

    // Find CTA/button
    let btn = mainSection.querySelector('a.cmp-button, button.cmp-button');
    if (btn) contentCellContents.push(btn);
  }

  // Build rows for the Hero block
  const rows = [
    ['Hero'],
    [imageEl || ''],
    [contentCellContents.length ? contentCellContents : '']
  ];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  
  // Replace the original element
  element.replaceWith(table);
}
