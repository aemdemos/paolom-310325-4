/* global WebImporter */
export default function parse(element, { document }) {
  // Header row exactly as required
  const headerRow = ['Embed (embedVideo89)'];

  // Collect all relevant content for the cell
  const cellContent = [];

  // Collect all .text blocks, in order, which contain paragraphs, headings, lists, etc.
  element.querySelectorAll(':scope .text').forEach(block => {
    cellContent.push(block);
  });

  // Find the brightcove player block
  const brightcove = element.querySelector('.brightcoveplayer');
  if (brightcove) {
    // Add poster image if available
    const posterImg = brightcove.querySelector('.vjs-poster img');
    if (posterImg && posterImg.src) {
      cellContent.push(posterImg);
    }
    // Compose the video link (Brightcove)
    const bcContainer = brightcove.querySelector('.brightcove-container, [data-video-id]');
    if (bcContainer && bcContainer.dataset && bcContainer.dataset.account && bcContainer.dataset.player && bcContainer.dataset.videoId) {
      const url = `https://players.brightcove.net/${bcContainer.dataset.account}/${bcContainer.dataset.player}_default/index.html?videoId=${bcContainer.dataset.videoId}`;
      const a = document.createElement('a');
      a.href = url;
      a.textContent = url;
      cellContent.push(a);
    }
  }

  // Only create the table if there is meaningful content
  if (cellContent.length > 0) {
    const rows = [headerRow, [cellContent]];
    const table = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(table);
  }
}
