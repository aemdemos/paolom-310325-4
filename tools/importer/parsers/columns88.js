/* global WebImporter */
export default function parse(element, { document }) {
  // --- COLUMN 1: Image ---
  // Find the image wrapper or the image itself
  let leftContent = null;
  const imgWrapper = element.querySelector('.cmp-img-bio');
  if (imgWrapper) {
    leftContent = imgWrapper;
  } else {
    // fallback: just the first image
    const img = element.querySelector('img');
    if (img) leftContent = img;
  }

  // --- COLUMN 2: Bio Content (social/contact links) ---
  let rightContent = null;
  const bioContent = element.querySelector('.bio-content');
  if (bioContent) {
    rightContent = bioContent;
  } else {
    // fallback: all direct children except the image wrapper
    rightContent = document.createElement('div');
    Array.from(element.children).forEach((child) => {
      if (!child.classList.contains('cmp-img-bio')) {
        rightContent.appendChild(child);
      }
    });
  }

  // The header row must be a single cell, even if the next row has multiple columns.
  const cells = [
    ['Columns (columns88)'],
    [leftContent, rightContent]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
