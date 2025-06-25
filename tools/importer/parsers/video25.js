/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Gather all visible text content (headings, paragraphs, etc.)
  const textEls = [];
  // Only collect direct text children or those clearly associated with the video block
  element.querySelectorAll('h1, h2, h3, h4, h5, h6, p').forEach(el => {
    // Avoid collecting hidden content
    if (el.textContent && el.offsetParent !== null) {
      textEls.push(el);
    }
  });
  // If no visible headings/paragraphs, check for any .cmp-text blocks (usually wraps the text)
  if (textEls.length === 0) {
    const cmpText = element.querySelector('.cmp-text, [data-cmp-is="cmp-text"], .text');
    if (cmpText) textEls.push(cmpText);
  }

  // 2. Gather the video poster image (must reference existing img element if present)
  let poster = '';
  let posterImgEl = null;
  // Try to get the poster from a video tag or a .vjs-poster img
  let videoTag = element.querySelector('video[poster]');
  if (videoTag) {
    poster = videoTag.getAttribute('poster');
  } else {
    const vjsPosterImg = element.querySelector('.vjs-poster img');
    if (vjsPosterImg) poster = vjsPosterImg.getAttribute('src');
  }
  // Reference an existing <img> if available, otherwise create one
  if (poster) {
    const imgEl = element.querySelector('img[src="'+poster+'"]');
    if (imgEl) {
      posterImgEl = imgEl;
    } else {
      posterImgEl = document.createElement('img');
      posterImgEl.src = poster;
      posterImgEl.alt = '';
      posterImgEl.loading = 'lazy';
    }
  }

  // 3. Extract Brightcove video info to build the player link
  let videoId = '', accountId = '', playerId = '';
  let bcContainer = element.querySelector('.brightcove-container');
  if (!bcContainer) {
    videoTag = element.querySelector('video[data-video-id]');
    if (videoTag) {
      videoId = videoTag.getAttribute('data-video-id') || '';
      accountId = videoTag.getAttribute('data-account') || '';
      playerId = videoTag.getAttribute('data-player') || '';
    }
  } else {
    videoId = bcContainer.getAttribute('data-video-id') || '';
    accountId = bcContainer.getAttribute('data-account') || '';
    playerId = bcContainer.getAttribute('data-player') || '';
  }
  let videoUrl = '';
  if (videoId && accountId) {
    const player = playerId || 'default';
    videoUrl = `https://players.brightcove.net/${accountId}/${player}_default/index.html?videoId=${videoId}`;
  }

  // 4. Build the single content cell: all text, then the image, then the link
  const cellContent = [];
  // Add text content
  if (textEls.length > 0) cellContent.push(...textEls);
  // Add poster image (if available)
  if (posterImgEl) cellContent.push(posterImgEl);
  // Add video player link (if available)
  if (videoUrl) {
    const link = document.createElement('a');
    link.href = videoUrl;
    link.textContent = videoUrl;
    cellContent.push(link);
  }

  // 5. Compose and replace with the block table
  const cells = [
    ['Video'],
    [cellContent]
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
