// ===== SVG Optimizer =====
// Strips comments, metadata, empty groups from SVG markup

export function optimizeSvgCode(svgCode) {
  if (!svgCode) return svgCode;

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgCode, 'image/svg+xml');
    const svg = doc.querySelector('svg');
    if (!svg) return svgCode;

    // Remove comments
    const walker = doc.createTreeWalker(svg, NodeFilter.SHOW_COMMENT);
    const comments = [];
    while (walker.nextNode()) comments.push(walker.currentNode);
    comments.forEach((c) => c.parentNode.removeChild(c));

    // Remove metadata, title, desc elements
    const removable = svg.querySelectorAll('metadata, title, desc');
    removable.forEach((el) => el.parentNode.removeChild(el));

    // Remove empty groups
    const removeEmptyGroups = (node) => {
      const groups = node.querySelectorAll('g');
      groups.forEach((g) => {
        if (g.children.length === 0 && !g.textContent.trim()) {
          g.parentNode.removeChild(g);
        }
      });
    };
    removeEmptyGroups(svg);

    // Remove editor-specific attributes
    const editorAttrs = ['data-name', 'xmlns:xlink', 'xml:space', 'xmlns:serif'];
    const allElements = svg.querySelectorAll('*');
    allElements.forEach((el) => {
      editorAttrs.forEach((attr) => el.removeAttribute(attr));
    });

    const serializer = new XMLSerializer();
    let result = serializer.serializeToString(svg);

    // Clean up xmlns duplication
    result = result.replace(/ xmlns="http:\/\/www\.w3\.org\/2000\/svg"/g, '');
    result = result.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');

    // Remove excessive whitespace
    result = result.replace(/\s+/g, ' ').replace(/> </g, '>\n<');

    return result;
  } catch {
    return svgCode;
  }
}
