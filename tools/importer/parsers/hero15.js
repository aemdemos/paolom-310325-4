/* global WebImporter */
export default function parse(element, { document }) {
  // HERO block: 1 col, 3 rows: header ("Hero"), image (optional), heading/text (optional)

  // There is no Section Metadata block in the example markdown, don't add one.
  // The table header must be exactly 'Hero' and nothing else.
  // All content must be dynamically extracted from the element.

  // There is no image in this share block, so the second row should be empty.

  // Extract all visible text, but avoid hidden/irrelevant control labels.

  // Gather share label (e.g., Share this) as heading, if present
  let heading = '';
  const shareLabel = element.querySelector('.share-title');
  if (shareLabel) {
    heading = shareLabel.textContent.trim();
  }
  
  // Additionally, try to extract all visible text from exposed share links (e.g. Facebook, Twitter, etc.)
  // We'll gather all unique aria-labels from <a> elements within share links
  const linkLabels = Array.from(element.querySelectorAll('a[aria-label]'))
    .map(a => a.getAttribute('aria-label'))
    .filter(l => l && l.trim())
    .map(l => l.trim());

  // Combine heading and link labels into a single string (to match all content)
  let combinedText = heading;
  if (linkLabels.length) {
    // If heading exists, add space or line break
    combinedText = combinedText ? (combinedText + '\n' + linkLabels.join('\n')) : linkLabels.join('\n');
  }

  // If no heading or linkLabels, fall back to getting all visible text (excluding hidden-button)
  if (!combinedText) {
    // Helper: get all visible text (ignoring elements with display:none, .hidden-button, script or style)
    function getVisibleText(node) {
      let out = '';
      for (const child of node.childNodes) {
        if (child.nodeType === Node.TEXT_NODE) {
          const tx = child.textContent.trim();
          if (tx) out += tx + ' ';
        } else if (child.nodeType === Node.ELEMENT_NODE && child.tagName !== 'SCRIPT' && child.tagName !== 'STYLE') {
          if (!child.classList.contains('hidden-button') && getComputedStyle(child).display !== 'none') {
            out += getVisibleText(child);
          }
        }
      }
      return out;
    }
    combinedText = getVisibleText(element).trim();
  }

  // Format result as a single text block (using a <div>) to preserve structure for future blocks
  let textContentEl = '';
  if (combinedText) {
    textContentEl = document.createElement('div');
    combinedText.split('\n').forEach(line => {
      const p = document.createElement('p');
      p.textContent = line;
      textContentEl.appendChild(p);
    });
  }

  // Build table as specified: header row, (empty) image row, then text content row
  const cells = [
    ['Hero'],
    [''],
    [textContentEl || ''],
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
