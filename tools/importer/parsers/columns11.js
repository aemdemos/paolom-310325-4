/* global WebImporter */
export default function parse(element, { document }) {
  // Get all carousel slides
  const slides = Array.from(element.querySelectorAll('.cmp-carousel__item'));
  if (!slides.length) return;

  // Table header: exactly one column, per requirements
  const headerRow = ['Columns (columns11)'];

  // Second row: one column per testimonial/slide
  const columnsRow = slides.map(slide => {
    const container = slide.querySelector('.cmp-container_container');
    if (!container) return '';
    const frag = document.createElement('div');

    const title = container.querySelector('.cmp-title__text');
    if (title) frag.appendChild(title);

    const img = container.querySelector('.cmp-quote-img img');
    if (img) frag.appendChild(img);

    const quote = container.querySelector('.cmp-quote-text q');
    if (quote) frag.appendChild(quote);

    const nameRole = container.querySelector('.cmp-quote-title');
    if (nameRole) {
      frag.appendChild(document.createElement('br'));
      frag.appendChild(nameRole);
    }

    const button = container.querySelector('.cmp-button');
    if (button) {
      frag.appendChild(document.createElement('br'));
      frag.appendChild(button);
    }

    return frag;
  });

  // Build the correct table structure: header is 1 col, then columnsRow is N cols
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    columnsRow
  ], document);
  element.replaceWith(table);
}
