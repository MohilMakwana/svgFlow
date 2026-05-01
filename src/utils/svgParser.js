// ===== SVG Parser Utility =====
// Parses SVG code string into a structured element tree

import { ANIMATABLE_ELEMENTS } from './constants';

let elementCounter = 0;

/**
 * Parse SVG code string and extract animatable elements
 * @param {string} svgCode - Raw SVG markup
 * @returns {{ elements: Array, error: string|null }}
 */
export function parseSvgCode(svgCode) {
  if (!svgCode || !svgCode.trim()) {
    return { elements: [], error: null };
  }

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgCode, 'image/svg+xml');
    const errorNode = doc.querySelector('parsererror');

    if (errorNode) {
      return { elements: [], error: 'Invalid SVG syntax' };
    }

    const svg = doc.querySelector('svg');
    if (!svg) {
      return { elements: [], error: 'No <svg> element found' };
    }

    elementCounter = 0;
    const elements = extractElements(svg);
    return { elements, error: null };
  } catch (err) {
    return { elements: [], error: err.message };
  }
}

/**
 * Recursively extract animatable elements from SVG DOM
 */
function extractElements(node, depth = 0) {
  const elements = [];

  for (const child of node.children) {
    const tag = child.tagName.toLowerCase();

    if (ANIMATABLE_ELEMENTS.includes(tag)) {
      elementCounter++;
      const id = child.getAttribute('id') || `el-${tag}-${elementCounter}`;

      elements.push({
        id,
        tag,
        depth,
        label: child.getAttribute('id') || child.getAttribute('class') || `${tag} #${elementCounter}`,
        attributes: getRelevantAttributes(child),
        hasChildren: child.children.length > 0,
        children: extractElements(child, depth + 1),
        pathLength: tag === 'path' ? estimatePathLength(child) : null,
      });
    }
  }

  return elements;
}

/**
 * Get display-relevant attributes from an SVG element
 */
function getRelevantAttributes(el) {
  const attrs = {};
  const relevant = ['fill', 'stroke', 'stroke-width', 'opacity', 'transform', 'class', 'r', 'cx', 'cy', 'x', 'y', 'width', 'height', 'rx', 'ry', 'd'];

  for (const name of relevant) {
    const val = el.getAttribute(name);
    if (val) attrs[name] = val;
  }
  return attrs;
}

/**
 * Estimate path length for stroke-dasharray animations
 */
function estimatePathLength(pathEl) {
  try {
    if (typeof pathEl.getTotalLength === 'function') {
      return Math.round(pathEl.getTotalLength());
    }
  } catch { /* fallback */ }

  const d = pathEl.getAttribute('d') || '';
  return countPathPoints(d) * 10;
}

/**
 * Count approximate path complexity
 */
export function countPathPoints(d) {
  if (!d) return 0;
  return (d.match(/[MLHVCSQTAZmlhvcsqtaz]/g) || []).length;
}

/**
 * Count complex SVG features (filters, gradients, clips)
 */
export function countComplexFeatures(svgCode) {
  const counts = {
    filters: (svgCode.match(/<filter/gi) || []).length,
    gradients: (svgCode.match(/<(linearGradient|radialGradient)/gi) || []).length,
    clipPaths: (svgCode.match(/<clipPath/gi) || []).length,
    masks: (svgCode.match(/<mask/gi) || []).length,
    patterns: (svgCode.match(/<pattern/gi) || []).length,
  };
  counts.total = Object.values(counts).reduce((a, b) => a + b, 0);
  return counts;
}

/**
 * Inject unique IDs into SVG elements for targeting animations
 */
export function injectElementIds(svgCode) {
  if (!svgCode) return svgCode;

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgCode, 'image/svg+xml');
    const errorNode = doc.querySelector('parsererror');
    if (errorNode) return svgCode;

    const svg = doc.querySelector('svg');
    if (!svg) return svgCode;

    let counter = 0;
    const walk = (node) => {
      for (const child of node.children) {
        const tag = child.tagName.toLowerCase();
        if (ANIMATABLE_ELEMENTS.includes(tag) && !child.getAttribute('id')) {
          counter++;
          child.setAttribute('id', `el-${tag}-${counter}`);
        }
        walk(child);
      }
    };
    walk(svg);

    const serializer = new XMLSerializer();
    let result = serializer.serializeToString(svg);

    // Remove XML prolog or DOCTYPE which breaks dangerouslySetInnerHTML
    result = result.replace(/<\?xml.*?\?>\s*/g, '');
    result = result.replace(/<!DOCTYPE.*?>\s*/gi, '');

    // Remove all xmlns declarations to prevent duplication, then add to root
    result = result.replace(/ xmlns="http:\/\/www\.w3\.org\/2000\/svg"/g, '');
    result = result.replace(/<svg/i, '<svg xmlns="http://www.w3.org/2000/svg"');

    return result.trim();
  } catch {
    return svgCode;
  }
}

/**
 * Flatten nested element tree into a flat list
 */
export function flattenElements(elements) {
  const flat = [];
  const recurse = (items) => {
    for (const el of items) {
      flat.push(el);
      if (el.children?.length) recurse(el.children);
    }
  };
  recurse(elements);
  return flat;
}
