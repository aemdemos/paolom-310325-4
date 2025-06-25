/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find the relevant text content block from the element
  let textContentElement = null;
  // Select the first .cmp-text, .text, or first heading/paragraph block with meaningful text
  const textSelectors = [
    '.cmp-text',
    '[data-cmp-is="cmp-text"]',
    '.text',
    'h1', 'h2', 'h3', 'p'
  ];
  for (const selector of textSelectors) {
    const el = element.querySelector(selector);
    if (el && el.textContent.trim()) {
      textContentElement = el;
      break;
    }
  }

  // 2. Extract video poster image if present
  let posterImg = null;
  const posterCandidate = element.querySelector('.vjs-poster img');
  if (posterCandidate && posterCandidate.src) {
    posterImg = posterCandidate;
  }

  // 3. Extract Brightcove player URL
  let videoUrl = null;
  const brightcove = element.querySelector('.brightcove-container');
  if (brightcove) {
    const videoId = brightcove.dataset.videoId;
    const account = brightcove.dataset.account;
    const player = brightcove.dataset.player;
    if (videoId && account && player) {
      videoUrl = `https://players.brightcove.net/${account}/${player}_default/index.html?videoId=${videoId}`;
    }
  }

  // 4. Compose cell content in semantic order: text, image, link
  const cellContent = [];
  if (textContentElement) {
    cellContent.push(textContentElement);
    if (posterImg || videoUrl) cellContent.push(document.createElement('br'));
  }
  if (posterImg) {
    cellContent.push(posterImg);
    if (videoUrl) cellContent.push(document.createElement('br'));
  }
  if (videoUrl) {
    const link = document.createElement('a');
    link.href = videoUrl;
    link.textContent = videoUrl;
    cellContent.push(link);
  }
  if (cellContent.length === 0) {
    cellContent.push(document.createTextNode('Video embed could not be determined'));
  }

  // 5. Build the block table as specified in the example
  const table = WebImporter.DOMUtils.createTable([
    ['Embed (embedVideo98)'],
    [cellContent]
  ], document);

  // 6. Replace the original element in the DOM
  element.replaceWith(table);
}
