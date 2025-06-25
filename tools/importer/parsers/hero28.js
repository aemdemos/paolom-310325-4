/* global WebImporter */
export default function parse(element, { document }) {
  // Step 1: Extract the poster image from the <video> or fallback to first <img>
  let imgEl = '';
  const video = element.querySelector('video');
  if (video && video.poster) {
    imgEl = video.closest('.vjs-poster')?.querySelector('img') || document.createElement('img');
    if (!imgEl.src) {
      imgEl.src = video.poster;
      imgEl.alt = '';
    }
  } else {
    const img = element.querySelector('img');
    if (img && img.src) {
      imgEl = img;
    }
  }

  // Step 2: Extract all visible text content overlays from the player area
  // Look for visible headings, paragraphs, buttons, a, or text inside overlays
  let contentFragments = [];
  // Get all h1-h4, p, a, button directly in the player area
  const overlaySelectors = [
    ".player-embed-wrap h1",
    ".player-embed-wrap h2",
    ".player-embed-wrap h3",
    ".player-embed-wrap h4",
    ".player-embed-wrap p",
    ".player-embed-wrap a",
    ".player-embed-wrap button"
  ];
  // Also check for overlays in the main brightcove container
  overlaySelectors.push(
    ".brightcove-container h1",
    ".brightcove-container h2",
    ".brightcove-container h3",
    ".brightcove-container h4",
    ".brightcove-container p",
    ".brightcove-container a",
    ".brightcove-container button"
  );
  overlaySelectors.forEach(sel => {
    element.querySelectorAll(sel).forEach(el => {
      if (el.innerText && el.innerText.trim()) {
        contentFragments.push(el);
      }
    });
  });

  // For fallback, get visible text nodes in the player-embed-wrap (not navigation text)
  const playerWrap = element.querySelector('.player-embed-wrap') || element;
  Array.from(playerWrap.childNodes).forEach(node => {
    if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
      const text = node.textContent.trim();
      if (text.length > 0) {
        const span = document.createElement('span');
        span.textContent = text;
        contentFragments.push(span);
      }
    }
  });

  // Remove duplicate nodes
  contentFragments = Array.from(new Set(contentFragments));

  // If nothing is found, leave the cell empty
  const contentCell = contentFragments.length > 0 ? contentFragments : '';

  // Compose the block table as in the example: 1 column, 3 rows
  const cells = [
    ['Hero'],
    [imgEl || ''],
    [contentCell],
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
