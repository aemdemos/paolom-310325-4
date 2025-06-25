/* global WebImporter */
export default function parse(element, { document }) {
  // Find all top-level column containers (each column)
  const outerColumnContainers = Array.from(
    element.querySelectorAll(':scope > div.column-container > div.wrap.c-thirds > div.container.responsivegrid.cmp-section__item')
  );

  // Helper for extracting content of each column (icon and text)
  function getColumnContent(colSection) {
    const contentArr = [];
    const innerColumnWrap = colSection.querySelector('.columncontainer .column-container .wrap.c-25-75');
    if (innerColumnWrap) {
      const innerContainers = Array.from(innerColumnWrap.querySelectorAll(':scope > div.container.responsivegrid.cmp-section__item'));
      if (innerContainers.length === 2) {
        const iconImg = innerContainers[0].querySelector('img');
        if (iconImg) contentArr.push(iconImg);
        const cmpText = innerContainers[1].querySelector('.cmp-text');
        if (cmpText) contentArr.push(cmpText);
      } else {
        const fallbackImg = innerColumnWrap.querySelector('img');
        if (fallbackImg) contentArr.push(fallbackImg);
        const fallbackText = innerColumnWrap.querySelector('.cmp-text');
        if (fallbackText) contentArr.push(fallbackText);
      }
    } else {
      const fallbackImg = colSection.querySelector('img');
      if (fallbackImg) contentArr.push(fallbackImg);
      const fallbackText = colSection.querySelector('.cmp-text');
      if (fallbackText) contentArr.push(fallbackText);
    }
    return contentArr.length > 0 ? contentArr : [''];
  }

  let columnsRow = [];
  if (outerColumnContainers.length > 0) {
    columnsRow = outerColumnContainers.map(getColumnContent);
  } else {
    const fallback = Array.from(element.querySelectorAll(':scope > div.container.responsivegrid.cmp-section__item'));
    columnsRow = fallback.map(getColumnContent);
  }

  const columnCount = columnsRow.length;
  if (columnCount === 0) return;
  // The header row must have one cell for each column, heading in the first, others empty
  const headerRow = ['Columns (columns65)', ...Array(columnCount - 1).fill('')];

  const tableArray = [headerRow, columnsRow];
  const table = WebImporter.DOMUtils.createTable(tableArray, document);
  element.replaceWith(table);
}
