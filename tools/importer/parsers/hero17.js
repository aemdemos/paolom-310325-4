/* global WebImporter */
export default function parse(element, { document }) {
  // Table header: must be exactly 'Hero' and only 1 column
  const rows = [['Hero']];

  // Find first prominent image (if present)
  let heroImg = element.querySelector('img');
  rows.push([heroImg ? heroImg : '']);

  // Gather all visible text content that is relevant for the hero
  // We'll grab all headings, subheadings, and any visible summary/CTA text in their proper DOM order.
  const content = [];

  // Helper: collect all unique elements with text content in correct appearance order
  const textSelectors = [
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    '.cmp-title__text',
    '.cmp-bio-hero-title',
    'p',
    '.cmp-bio-hero-detail'
  ];
  const ordered = [];
  const already = new Set();
  // Use a TreeWalker to visit all descendants in DOM order
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_ELEMENT, null);
  while (walker.nextNode()) {
    const node = walker.currentNode;
    // Skip the image
    if (node.tagName === 'IMG') continue;
    if (textSelectors.some(sel => node.matches && node.matches(sel)) && node.textContent.trim()) {
      if (!already.has(node)) {
        ordered.push(node);
        already.add(node);
      }
    }
  }
  // Also include any <a> with visible text content (e.g., CTAs, social links), but only if not already added
  const links = element.querySelectorAll('a');
  links.forEach(a => {
    if (a.textContent.trim() && !already.has(a)) {
      ordered.push(a);
      already.add(a);
    }
  });
  if (ordered.length) {
    content.push(...ordered);
  }
  rows.push([content.length ? content : '']);

  // Create the table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(table);
}
