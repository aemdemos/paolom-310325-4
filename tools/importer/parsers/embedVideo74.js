/* global WebImporter */
export default function parse(element, { document }) {
  // Find all immediate 'container.responsivegrid' children in the block
  const containers = element.querySelectorAll(':scope > .container.responsivegrid');
  // Collect images from each container (if any)
  const images = [];
  containers.forEach(container => {
    const img = container.querySelector('img');
    if (img) images.push(img);
  });
  // Only build the block if we found at least one image
  if (images.length === 0) return;
  // Place images in a fragment in order
  const frag = document.createDocumentFragment();
  images.forEach(img => { frag.appendChild(img); });
  // Build table as per Embed (embedVideo74) block spec
  const cells = [
    ['Embed (embedVideo74)'],
    [frag]
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
