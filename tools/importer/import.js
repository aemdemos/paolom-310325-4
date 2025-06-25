/*
 * Copyright 2024 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
/* global WebImporter */
/* eslint-disable no-console */
import columns2Parser from './parsers/columns2.js';
import hero10Parser from './parsers/hero10.js';
import accordion3Parser from './parsers/accordion3.js';
import cards8Parser from './parsers/cards8.js';
import carousel5Parser from './parsers/carousel5.js';
import columns1Parser from './parsers/columns1.js';
import cards9Parser from './parsers/cards9.js';
import cards13Parser from './parsers/cards13.js';
import columns11Parser from './parsers/columns11.js';
import carousel18Parser from './parsers/carousel18.js';
import accordion4Parser from './parsers/accordion4.js';
import hero14Parser from './parsers/hero14.js';
import cards19Parser from './parsers/cards19.js';
import hero15Parser from './parsers/hero15.js';
import hero24Parser from './parsers/hero24.js';
import columns22Parser from './parsers/columns22.js';
import hero17Parser from './parsers/hero17.js';
import hero16Parser from './parsers/hero16.js';
import search20Parser from './parsers/search20.js';
import columns26Parser from './parsers/columns26.js';
import cards23Parser from './parsers/cards23.js';
import cards21Parser from './parsers/cards21.js';
import columns30Parser from './parsers/columns30.js';
import columns27Parser from './parsers/columns27.js';
import columns32Parser from './parsers/columns32.js';
import columns33Parser from './parsers/columns33.js';
import columns34Parser from './parsers/columns34.js';
import hero36Parser from './parsers/hero36.js';
import video25Parser from './parsers/video25.js';
import columns31Parser from './parsers/columns31.js';
import columns38Parser from './parsers/columns38.js';
import columns7Parser from './parsers/columns7.js';
import cards40Parser from './parsers/cards40.js';
import cards39Parser from './parsers/cards39.js';
import embedVideo44Parser from './parsers/embedVideo44.js';
import cardsNoImages42Parser from './parsers/cardsNoImages42.js';
import accordion45Parser from './parsers/accordion45.js';
import cards43Parser from './parsers/cards43.js';
import hero47Parser from './parsers/hero47.js';
import hero6Parser from './parsers/hero6.js';
import columns46Parser from './parsers/columns46.js';
import embedVideo12Parser from './parsers/embedVideo12.js';
import hero55Parser from './parsers/hero55.js';
import cards54Parser from './parsers/cards54.js';
import cardsNoImages51Parser from './parsers/cardsNoImages51.js';
import accordion57Parser from './parsers/accordion57.js';
import embedVideo50Parser from './parsers/embedVideo50.js';
import hero58Parser from './parsers/hero58.js';
import cardsNoImages56Parser from './parsers/cardsNoImages56.js';
import columns62Parser from './parsers/columns62.js';
import columns63Parser from './parsers/columns63.js';
import cards35Parser from './parsers/cards35.js';
import cards49Parser from './parsers/cards49.js';
import hero67Parser from './parsers/hero67.js';
import columns59Parser from './parsers/columns59.js';
import columns69Parser from './parsers/columns69.js';
import columns65Parser from './parsers/columns65.js';
import cards68Parser from './parsers/cards68.js';
import columns53Parser from './parsers/columns53.js';
import columns70Parser from './parsers/columns70.js';
import cards60Parser from './parsers/cards60.js';
import columns64Parser from './parsers/columns64.js';
import accordion72Parser from './parsers/accordion72.js';
import columns73Parser from './parsers/columns73.js';
import tabs41Parser from './parsers/tabs41.js';
import accordion76Parser from './parsers/accordion76.js';
import columns75Parser from './parsers/columns75.js';
import cards78Parser from './parsers/cards78.js';
import hero80Parser from './parsers/hero80.js';
import cards82Parser from './parsers/cards82.js';
import hero83Parser from './parsers/hero83.js';
import cards81Parser from './parsers/cards81.js';
import tabs84Parser from './parsers/tabs84.js';
import columns29Parser from './parsers/columns29.js';
import accordion66Parser from './parsers/accordion66.js';
import columns77Parser from './parsers/columns77.js';
import columns88Parser from './parsers/columns88.js';
import hero28Parser from './parsers/hero28.js';
import carousel86Parser from './parsers/carousel86.js';
import tableStripedBordered85Parser from './parsers/tableStripedBordered85.js';
import accordion92Parser from './parsers/accordion92.js';
import accordion95Parser from './parsers/accordion95.js';
import columns94Parser from './parsers/columns94.js';
import hero91Parser from './parsers/hero91.js';
import cards97Parser from './parsers/cards97.js';
import columns90Parser from './parsers/columns90.js';
import columns99Parser from './parsers/columns99.js';
import embedVideo74Parser from './parsers/embedVideo74.js';
import embedVideo89Parser from './parsers/embedVideo89.js';
import columns100Parser from './parsers/columns100.js';
import embedVideo98Parser from './parsers/embedVideo98.js';
import accordion87Parser from './parsers/accordion87.js';
import columns93Parser from './parsers/columns93.js';
import cards71Parser from './parsers/cards71.js';
import columns79Parser from './parsers/columns79.js';
import columns96Parser from './parsers/columns96.js';
import headerParser from './parsers/header.js';
import metadataParser from './parsers/metadata.js';
import cleanupTransformer from './transformers/cleanup.js';
import imageTransformer from './transformers/images.js';
import linkTransformer from './transformers/links.js';
import { TransformHook } from './transformers/transform.js';
import {
  generateDocumentPath,
  handleOnLoad,
  TableBuilder,
  mergeInventory,
} from './import.utils.js';

const parsers = {
  metadata: metadataParser,
  columns2: columns2Parser,
  hero10: hero10Parser,
  accordion3: accordion3Parser,
  cards8: cards8Parser,
  carousel5: carousel5Parser,
  columns1: columns1Parser,
  cards9: cards9Parser,
  cards13: cards13Parser,
  columns11: columns11Parser,
  carousel18: carousel18Parser,
  accordion4: accordion4Parser,
  hero14: hero14Parser,
  cards19: cards19Parser,
  hero15: hero15Parser,
  hero24: hero24Parser,
  columns22: columns22Parser,
  hero17: hero17Parser,
  hero16: hero16Parser,
  search20: search20Parser,
  columns26: columns26Parser,
  cards23: cards23Parser,
  cards21: cards21Parser,
  columns30: columns30Parser,
  columns27: columns27Parser,
  columns32: columns32Parser,
  columns33: columns33Parser,
  columns34: columns34Parser,
  hero36: hero36Parser,
  video25: video25Parser,
  columns31: columns31Parser,
  columns38: columns38Parser,
  columns7: columns7Parser,
  cards40: cards40Parser,
  cards39: cards39Parser,
  embedVideo44: embedVideo44Parser,
  cardsNoImages42: cardsNoImages42Parser,
  accordion45: accordion45Parser,
  cards43: cards43Parser,
  hero47: hero47Parser,
  hero6: hero6Parser,
  columns46: columns46Parser,
  embedVideo12: embedVideo12Parser,
  hero55: hero55Parser,
  cards54: cards54Parser,
  cardsNoImages51: cardsNoImages51Parser,
  accordion57: accordion57Parser,
  embedVideo50: embedVideo50Parser,
  hero58: hero58Parser,
  cardsNoImages56: cardsNoImages56Parser,
  columns62: columns62Parser,
  columns63: columns63Parser,
  cards35: cards35Parser,
  cards49: cards49Parser,
  hero67: hero67Parser,
  columns59: columns59Parser,
  columns69: columns69Parser,
  columns65: columns65Parser,
  cards68: cards68Parser,
  columns53: columns53Parser,
  columns70: columns70Parser,
  cards60: cards60Parser,
  columns64: columns64Parser,
  accordion72: accordion72Parser,
  columns73: columns73Parser,
  tabs41: tabs41Parser,
  accordion76: accordion76Parser,
  columns75: columns75Parser,
  cards78: cards78Parser,
  hero80: hero80Parser,
  cards82: cards82Parser,
  hero83: hero83Parser,
  cards81: cards81Parser,
  tabs84: tabs84Parser,
  columns29: columns29Parser,
  accordion66: accordion66Parser,
  columns77: columns77Parser,
  columns88: columns88Parser,
  hero28: hero28Parser,
  carousel86: carousel86Parser,
  tableStripedBordered85: tableStripedBordered85Parser,
  accordion92: accordion92Parser,
  accordion95: accordion95Parser,
  columns94: columns94Parser,
  hero91: hero91Parser,
  cards97: cards97Parser,
  columns90: columns90Parser,
  columns99: columns99Parser,
  embedVideo74: embedVideo74Parser,
  embedVideo89: embedVideo89Parser,
  columns100: columns100Parser,
  embedVideo98: embedVideo98Parser,
  accordion87: accordion87Parser,
  columns93: columns93Parser,
  cards71: cards71Parser,
  columns79: columns79Parser,
  columns96: columns96Parser,
};

const transformers = {
  cleanup: cleanupTransformer,
  images: imageTransformer,
  links: linkTransformer,
};

WebImporter.Import = {
  findSiteUrl: (instance, siteUrls) => (
    siteUrls.find(({ id }) => id === instance.urlHash)
  ),
  transform: (hookName, element, payload) => {
    // perform any additional transformations to the page
    Object.entries(transformers).forEach(([, transformerFn]) => (
      transformerFn.call(this, hookName, element, payload)
    ));
  },
  getParserName: ({ name, key }) => key || name,
  getElementByXPath: (document, xpath) => {
    const result = document.evaluate(
      xpath,
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null,
    );
    return result.singleNodeValue;
  },
  getFragmentXPaths: (
    { urls = [], fragments = [] },
    sourceUrl = '',
  ) => (fragments.flatMap(({ instances = [] }) => instances)
    .filter((instance) => {
      // find url in urls array
      const siteUrl = WebImporter.Import.findSiteUrl(instance, urls);
      if (!siteUrl) {
        return false;
      }
      return siteUrl.url === sourceUrl;
    })
    .map(({ xpath }) => xpath)),
};

const pageElements = [{ name: 'metadata' }];

/**
* Page transformation function
*/
function transformPage(main, { inventory, ...source }) {
  const { urls = [], blocks: inventoryBlocks = [] } = inventory;
  const { document, params: { originalURL } } = source;

  // get fragment elements from the current page
  const fragmentElements = WebImporter.Import.getFragmentXPaths(inventory, originalURL)
    .map((xpath) => WebImporter.Import.getElementByXPath(document, xpath))
    .filter((el) => el);

  // get dom elements for each block on the current page
  const blockElements = inventoryBlocks
    .flatMap((block) => block.instances
      .filter((instance) => WebImporter.Import.findSiteUrl(instance, urls)?.url === originalURL)
      .map((instance) => ({
        ...block,
        element: WebImporter.Import.getElementByXPath(document, instance.xpath),
      })))
    .filter((block) => block.element);

  // remove fragment elements from the current page
  fragmentElements.forEach((element) => {
    if (element) {
      element.remove();
    }
  });

  // before page transform hook
  WebImporter.Import.transform(TransformHook.beforePageTransform, main, { ...source });

  const tableBuilder = TableBuilder(WebImporter.DOMUtils.createTable);
  // transform all block elements using parsers
  [...pageElements, ...blockElements].forEach(({ element = main, ...pageBlock }) => {
    const parserName = WebImporter.Import.getParserName(pageBlock);
    const parserFn = parsers[parserName];
    if (!parserFn) return;
    try {
      // before parse hook
      WebImporter.Import.transform(TransformHook.beforeParse, element, { ...source });
      // parse the element
      WebImporter.DOMUtils.createTable = tableBuilder.build(parserName);
      parserFn.call(this, element, { ...source });
      WebImporter.DOMUtils.createTable = tableBuilder.restore();
      // after parse hook
      WebImporter.Import.transform(TransformHook.afterParse, element, { ...source });
    } catch (e) {
      console.warn(`Failed to parse block: ${pageBlock.key}`, e);
    }
  });
}

/**
* Fragment transformation function
*/
function transformFragment(main, { fragment, inventory, ...source }) {
  const { document, params: { originalURL } } = source;

  if (fragment.name === 'nav') {
    const navEl = document.createElement('div');

    // get number of blocks in the nav fragment
    const navBlocks = Math.floor(fragment.instances.length / fragment.instances.filter((ins) => ins.uuid.includes('-00-')).length);
    console.log('navBlocks', navBlocks);

    for (let i = 0; i < navBlocks; i += 1) {
      const { xpath } = fragment.instances[i];
      const el = WebImporter.Import.getElementByXPath(document, xpath);
      if (!el) {
        console.warn(`Failed to get element for xpath: ${xpath}`);
      } else {
        navEl.append(el);
      }
    }

    // body width
    const bodyWidthAttr = document.body.getAttribute('data-hlx-imp-body-width');
    const bodyWidth = bodyWidthAttr ? parseInt(bodyWidthAttr, 10) : 1000;

    try {
      const headerBlock = headerParser(navEl, {
        ...source, document, fragment, bodyWidth,
      });
      main.append(headerBlock);
    } catch (e) {
      console.warn('Failed to parse header block', e);
    }
  } else {
    const tableBuilder = TableBuilder(WebImporter.DOMUtils.createTable);

    (fragment.instances || [])
      .filter((instance) => {
        const siteUrl = WebImporter.Import.findSiteUrl(instance, inventory.urls);
        if (!siteUrl) {
          return false;
        }
        return `${siteUrl.url}#${fragment.name}` === originalURL;
      })
      .map(({ xpath }) => ({
        xpath,
        element: WebImporter.Import.getElementByXPath(document, xpath),
      }))
      .filter(({ element }) => element)
      .forEach(({ xpath, element }) => {
        main.append(element);

        const fragmentBlock = inventory.blocks
          .find(({ instances }) => instances.find((instance) => {
            const siteUrl = WebImporter.Import.findSiteUrl(instance, inventory.urls);
            return `${siteUrl.url}#${fragment.name}` === originalURL && instance.xpath === xpath;
          }));

        if (!fragmentBlock) return;
        const parserName = WebImporter.Import.getParserName(fragmentBlock);
        const parserFn = parsers[parserName];
        if (!parserFn) return;
        try {
          WebImporter.DOMUtils.createTable = tableBuilder.build(parserName);
          parserFn.call(this, element, source);
          WebImporter.DOMUtils.createTable = tableBuilder.restore();
        } catch (e) {
          console.warn(`Failed to parse block: ${fragmentBlock.key}, with xpath: ${xpath}`, e);
        }
      });
  }
}

export default {
  onLoad: async (payload) => {
    await handleOnLoad(payload);
  },

  transform: async (source) => {
    const { document, params: { originalURL } } = source;

    // sanitize the original URL
    /* eslint-disable no-param-reassign */
    source.params.originalURL = new URL(originalURL).href;

    /* eslint-disable-next-line prefer-const */
    let publishUrl = window.location.origin;
    // $$publishUrl = '{{{publishUrl}}}';

    let inventory = null;
    // $$inventory = {{{inventory}}};
    if (!inventory) {
      const siteUrlsUrl = new URL('/tools/importer/site-urls.json', publishUrl);
      const inventoryUrl = new URL('/tools/importer/inventory.json', publishUrl);
      try {
        // fetch and merge site-urls and inventory
        const siteUrlsResp = await fetch(siteUrlsUrl.href);
        const inventoryResp = await fetch(inventoryUrl.href);
        const siteUrls = await siteUrlsResp.json();
        inventory = await inventoryResp.json();
        inventory = mergeInventory(siteUrls, inventory, publishUrl);
      } catch (e) {
        console.error('Failed to merge site-urls and inventory');
      }
      if (!inventory) {
        return [];
      }
    }

    let main = document.body;

    // before transform hook
    WebImporter.Import.transform(TransformHook.beforeTransform, main, { ...source, inventory });

    // perform the transformation
    let path = null;
    const sourceUrl = new URL(originalURL);
    const fragName = sourceUrl.hash ? sourceUrl.hash.substring(1) : '';
    if (fragName) {
      // fragment transformation
      const fragment = inventory.fragments.find(({ name }) => name === fragName);
      if (!fragment) {
        return [];
      }
      main = document.createElement('div');
      transformFragment(main, { ...source, fragment, inventory });
      path = fragment.path;
    } else {
      // page transformation
      transformPage(main, { ...source, inventory });
      path = generateDocumentPath(source, inventory);
    }

    // after transform hook
    WebImporter.Import.transform(TransformHook.afterTransform, main, { ...source, inventory });

    return [{
      element: main,
      path,
    }];
  },
};
