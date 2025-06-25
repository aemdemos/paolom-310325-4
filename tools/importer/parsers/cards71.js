/* global WebImporter */
export default function parse(element, { document }) {
  // The header row matches the block name exactly per spec
  const headerRow = ['Cards (cards71)'];
  const cells = [headerRow];

  // Helper to extract the relevant card image element from a card column container
  function extractImage(div) {
    // Image is usually inside .image or .cmp-image
    const imgDiv = div.querySelector('.image, .cmp-image');
    if (imgDiv) {
      const img = imgDiv.querySelector('img');
      if (img) return img;
    }
    return null;
  }

  // Helper to extract the text block (title, description, cta) from a card column container
  function extractText(div) {
    // Compose an array to preserve element order and references
    const result = [];
    // Text content is inside .cmp-text
    const text = div.querySelector('.cmp-text');
    if (text) result.push(text);
    // Call to action is inside .cmp-button (if present)
    const btn = div.querySelector('.cmp-button');
    if (btn) result.push(btn);
    // Return array if both, or single element if only one
    if (result.length === 1) return result[0];
    if (result.length > 1) return result;
    // If nothing found, fallback to all content
    return div;
  }

  // For each set of cards (in this HTML, each .columncontainer is a row of 2 cards)
  element.querySelectorAll('.columncontainer').forEach((columncontainer) => {
    columncontainer.querySelectorAll(':scope > .column-container > .wrap').forEach((wrap) => {
      // Each .wrap contains two children, each a card column
      const cols = Array.from(wrap.children).filter(x => x.matches('.container.responsivegrid'));
      if (cols.length === 2) {
        // For the first card column:
        const col1Content = cols[0].querySelector('.cmp-container_container > div');
        // For the second card column:
        const col2Content = cols[1].querySelector('.cmp-container_container > div');
        // Determine which side is image, which is text
        const col1Img = extractImage(col1Content);
        const col2Img = extractImage(col2Content);
        const col1Text = extractText(col1Content);
        const col2Text = extractText(col2Content);
        // Card 1: (image, text) if possible
        if (col1Img && col2Text) cells.push([col1Img, col2Text]);
        // Card 2: (image, text) if possible
        if (col2Img && col1Text) cells.push([col2Img, col1Text]);
      }
    });
  });

  // Create the table block and replace the element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
