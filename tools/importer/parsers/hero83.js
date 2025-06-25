/* global WebImporter */
export default function parse(element, { document }) {
  // Find the background image URL and alt text
  let bgImgUrl = '';
  let bgImgAlt = '';
  const bgSpan = element.querySelector('.cmp-container__background .desktop-background');
  if (bgSpan && bgSpan.style.backgroundImage) {
    const match = bgSpan.style.backgroundImage.match(/url\(['"]?([^'")]+)['"]?\)/);
    if (match) {
      bgImgUrl = match[1];
    }
    bgImgAlt = bgSpan.getAttribute('aria-label') || '';
  }

  // Only create <img> if background image url exists
  let bgImgEl = '';
  if (bgImgUrl) {
    bgImgEl = document.createElement('img');
    bgImgEl.src = bgImgUrl;
    bgImgEl.alt = bgImgAlt;
  }

  // Find the title (heading) element
  let headingEl = '';
  const cmpTitleText = element.querySelector('.cmp-title__text');
  if (cmpTitleText) {
    const headingAncestor = cmpTitleText.closest('h1, h2, h3, h4, h5, h6');
    headingEl = headingAncestor || cmpTitleText;
  }

  // Find the paragraph text
  let textEl = '';
  const cmpText = element.querySelector('.cmp-text');
  if (cmpText) {
    textEl = cmpText;
  }

  // Find the button (if exists)
  let buttonEl = '';
  const cmpButton = element.querySelector('.cmp-button a');
  if (cmpButton) {
    buttonEl = cmpButton;
  }

  // Compose content cell with available elements, keeping order: heading, text, button
  const contentElements = [];
  if (headingEl) contentElements.push(headingEl);
  if (textEl) contentElements.push(textEl);
  if (buttonEl) contentElements.push(buttonEl);

  // Build the block table as per the example
  const cells = [
    ['Hero'],
    [bgImgEl ? bgImgEl : ''],
    [contentElements]
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
