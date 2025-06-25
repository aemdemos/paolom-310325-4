/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Extract the first relevant image for the hero background
  let imageEl = null;
  const imageContainer = element.querySelector('.image, .cmp-image');
  if (imageContainer) {
    imageEl = imageContainer.querySelector('img');
  } else {
    imageEl = element.querySelector('img');
  }

  // 2. Extract content: Headline (title), subheading/paragraph, CTA/button
  // We'll look for .cmp-title__text, .cmp-text, and a.cmp-button (span.cmp-button__text inside)
  const contentElements = [];
  // Title - usually h2.cmp-title__text
  const title = element.querySelector('.cmp-title__text');
  if (title) contentElements.push(title);
  // Subheading/paragraph
  const text = element.querySelector('.cmp-text');
  if (text) contentElements.push(text);
  // CTA button
  const cta = element.querySelector('a.cmp-button');
  if (cta) contentElements.push(cta);

  // 3. Build the table: 1 col, 3 rows: header, image, content
  const rows = [
    ['Hero'],
    [imageEl || ''],
    [contentElements]
  ];

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
