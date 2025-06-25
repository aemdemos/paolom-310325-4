/* global WebImporter */
export default function parse(element, { document }) {
  // Collect all card wrappers from all column containers
  const cards = [];
  // Find all columncontainer wrappers in the supplied element
  element.querySelectorAll('.columncontainer .column-container > .wrap.c-thirds').forEach(wrap => {
    wrap.querySelectorAll('.container.responsivegrid.cmp-section__item').forEach(card => {
      // Image: select the first <img> inside the card
      const img = card.querySelector('img');
      // Title: get the .cmp-title__text (should be an <h2>); keep as is for semantic/structure
      const title = card.querySelector('.cmp-title__text');
      // Subtitle: the first .cmp-text (italic, RSM alum/boomerang/etc)
      const subtitleDiv = card.querySelectorAll('.cmp-text')[0];
      // Description: the next .cmp-text
      const descDiv = card.querySelectorAll('.cmp-text')[1];
      // CTA: button/link
      const cta = card.querySelector('.cmp-button');
      // Build left cell (image)
      const cellImg = img;
      // Build right cell (structured content, using EXISTING elements, no clone)
      const cellContent = [];
      if (title && title.parentElement) cellContent.push(title.parentElement); // use <h2> parent so styles apply
      if (subtitleDiv) cellContent.push(subtitleDiv);
      if (descDiv) cellContent.push(descDiv);
      if (cta) cellContent.push(cta);
      cards.push([cellImg, cellContent]);
    });
  });
  const headerRow = ['Cards (cards49)'];
  const rows = [headerRow, ...cards];
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
