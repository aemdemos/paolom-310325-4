/* global WebImporter */
export default function parse(element, { document }) {
  // Extract the background image from the desktop-background span's style
  let bgImgEl = '';
  const bgSpan = element.querySelector('.cmp-blog-feed__background .desktop-background');
  if (bgSpan) {
    const style = bgSpan.getAttribute('style') || '';
    const match = style.match(/background-image:url\(([^)]+)\)/);
    if (match && match[1]) {
      const img = document.createElement('img');
      img.src = match[1].trim();
      img.alt = '';
      bgImgEl = img;
    }
  }

  // For the content cell: gather heading, subheading, featured post, latest posts, and main CTA
  const content = [];
  
  // Heading
  const heading = element.querySelector('.cmp-blog-feed__title');
  if (heading) content.push(heading);

  // Subheading
  const subheading = element.querySelector('.cmp-blog-feed__sub-title');
  if (subheading) content.push(subheading);

  // Featured Post
  const featured = element.querySelector('.cmp-blog-feed__feature');
  if (featured) content.push(featured);

  // Latest Posts
  const latest = element.querySelector('.cmp-blog-feed__lastest');
  if (latest) content.push(latest);

  // Main Blog CTA
  const mainCta = element.querySelector('.cmp-blog-feed__link');
  if (mainCta) content.push(mainCta);

  // Build table as per the Hero block structure
  const rows = [
    ['Hero'],
    [bgImgEl],
    [content]
  ];

  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(table);
}