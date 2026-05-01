// ===== Animation Code Generator =====
// Generates exportable code in CSS, Tailwind, Framer Motion, GSAP, SVG SMIL

/**
 * Build transform string from config
 */
function buildTransformString(t) {
  const parts = [];
  if (t.translateX || t.translateY) parts.push(`translate(${t.translateX || 0}px, ${t.translateY || 0}px)`);
  if (t.rotation) parts.push(`rotate(${t.rotation}deg)`);
  if (t.scaleX !== 1 || t.scaleY !== 1) parts.push(`scale(${t.scaleX}, ${t.scaleY})`);
  if (t.skewX) parts.push(`skewX(${t.skewX}deg)`);
  if (t.skewY) parts.push(`skewY(${t.skewY}deg)`);
  return parts.join(' ') || 'none';
}

/**
 * Generate CSS @keyframes from animation config
 */
export function generateCssKeyframes(config, elementId = 'animated-element') {
  const { transform, opacity, stroke, timing, interaction } = config;
  const animName = `svg-motion-${elementId}`;
  const trigger = interaction?.trigger || 'auto';
  const transformStr = buildTransformString(transform);

  let css = `/* SvgFlow — CSS Keyframes Export */\n\n`;
  css += `@keyframes ${animName} {\n`;
  css += `  0% {\n`;
  css += `    transform: none;\n`;
  css += `    opacity: ${opacity.from};\n`;
  if (stroke.dashoffset) css += `    stroke-dashoffset: ${stroke.dashoffset};\n`;
  css += `  }\n`;
  css += `  100% {\n`;
  css += `    transform: ${transformStr};\n`;
  css += `    opacity: ${opacity.to};\n`;
  if (stroke.dashoffset) css += `    stroke-dashoffset: 0;\n`;
  css += `  }\n`;
  css += `}\n\n`;

  const selector = trigger === 'hover'
    ? `#${elementId}:hover`
    : `#${elementId}`;

  css += `${selector} {\n`;
  css += `  animation: ${animName} ${timing.duration}s ${timing.easing} ${timing.delay}s ${timing.iterationCount} ${timing.direction} ${timing.fillMode};\n`;

  if (trigger === 'hover') {
    css += `}\n\n`;
    css += `#${elementId} {\n`;
    css += `  transition: transform ${timing.duration}s ${timing.easing};\n`;
  }

  if (trigger === 'click') {
    css += `}\n\n`;
    css += `/* Add .is-animating class via JavaScript on click */\n`;
    css += `#${elementId}.is-animating {\n`;
    css += `  animation: ${animName} ${timing.duration}s ${timing.easing} ${timing.delay}s ${timing.iterationCount} ${timing.direction} ${timing.fillMode};\n`;
  }

  css += `}\n`;
  return css;
}

/**
 * Generate Tailwind CSS classes
 */
export function generateTailwindClasses(config) {
  const { transform, opacity, timing } = config;
  let tw = `/* SvgFlow — Tailwind Export */\n\n`;
  tw += `/* Add to tailwind.config.js → theme.extend.keyframes */\n`;
  tw += `keyframes: {\n`;
  tw += `  'svg-motion': {\n`;
  tw += `    '0%': {\n`;
  tw += `      transform: 'none',\n`;
  tw += `      opacity: '${opacity.from}',\n`;
  tw += `    },\n`;
  tw += `    '100%': {\n`;
  tw += `      transform: '${buildTransformString(transform)}',\n`;
  tw += `      opacity: '${opacity.to}',\n`;
  tw += `    },\n`;
  tw += `  },\n`;
  tw += `},\n`;
  tw += `animation: {\n`;
  tw += `  'svg-motion': 'svg-motion ${timing.duration}s ${timing.easing} ${timing.delay}s ${timing.iterationCount} ${timing.direction}',\n`;
  tw += `},\n\n`;
  tw += `/* Usage: className="animate-svg-motion" */\n`;
  return tw;
}

/**
 * Generate Framer Motion code
 */
export function generateFramerMotion(config) {
  const { transform, opacity, timing } = config;
  let code = `/* SvgFlow — Framer Motion Export */\n\n`;
  code += `import { motion } from 'framer-motion';\n\n`;
  code += `const animationVariants = {\n`;
  code += `  initial: {\n`;
  code += `    opacity: ${opacity.from},\n`;
  code += `    rotate: 0,\n`;
  code += `    scale: 1,\n`;
  code += `    x: 0,\n`;
  code += `    y: 0,\n`;
  code += `  },\n`;
  code += `  animate: {\n`;
  code += `    opacity: ${opacity.to},\n`;
  if (transform.rotation) code += `    rotate: ${transform.rotation},\n`;
  if (transform.scaleX !== 1 || transform.scaleY !== 1) code += `    scale: ${transform.scaleX},\n`;
  if (transform.translateX) code += `    x: ${transform.translateX},\n`;
  if (transform.translateY) code += `    y: ${transform.translateY},\n`;
  code += `  },\n`;
  code += `};\n\n`;
  code += `const transition = {\n`;
  code += `  duration: ${timing.duration},\n`;
  code += `  delay: ${timing.delay},\n`;
  code += `  ease: '${timing.easing}',\n`;
  code += `  repeat: ${timing.iterationCount === 'infinite' ? 'Infinity' : timing.iterationCount},\n`;
  code += `  repeatType: '${timing.direction.includes('alternate') ? 'reverse' : 'loop'}',\n`;
  code += `};\n\n`;
  code += `// Usage:\n`;
  code += `<motion.svg\n`;
  code += `  variants={animationVariants}\n`;
  code += `  initial="initial"\n`;
  code += `  animate="animate"\n`;
  code += `  transition={transition}\n`;
  code += `/>\n`;
  return code;
}

/**
 * Generate GSAP code
 */
export function generateGsap(config) {
  const { transform, opacity, timing } = config;
  let code = `/* SvgFlow — GSAP Export */\n\n`;
  code += `import { gsap } from 'gsap';\n\n`;
  code += `gsap.to('#animated-element', {\n`;
  code += `  duration: ${timing.duration},\n`;
  code += `  delay: ${timing.delay},\n`;
  if (transform.rotation) code += `  rotation: ${transform.rotation},\n`;
  if (transform.scaleX !== 1) code += `  scaleX: ${transform.scaleX},\n`;
  if (transform.scaleY !== 1) code += `  scaleY: ${transform.scaleY},\n`;
  if (transform.translateX) code += `  x: ${transform.translateX},\n`;
  if (transform.translateY) code += `  y: ${transform.translateY},\n`;
  if (transform.skewX) code += `  skewX: ${transform.skewX},\n`;
  if (transform.skewY) code += `  skewY: ${transform.skewY},\n`;
  code += `  opacity: ${opacity.to},\n`;
  code += `  ease: '${mapEasingToGsap(timing.easing)}',\n`;
  code += `  repeat: ${timing.iterationCount === 'infinite' ? -1 : parseInt(timing.iterationCount) - 1},\n`;
  code += `  yoyo: ${timing.direction.includes('alternate')},\n`;
  code += `});\n`;
  return code;
}

/**
 * Generate plain CSS with vendor prefixes
 */
export function generatePlainCss(config, elementId = 'animated-element') {
  const { transform, opacity, timing } = config;
  const transformStr = buildTransformString(transform);

  let css = `/* SvgFlow — Plain CSS Export */\n\n`;
  css += `#${elementId} {\n`;
  css += `  -webkit-animation: svg-motion ${timing.duration}s ${timing.easing} ${timing.delay}s ${timing.iterationCount} ${timing.direction};\n`;
  css += `  animation: svg-motion ${timing.duration}s ${timing.easing} ${timing.delay}s ${timing.iterationCount} ${timing.direction};\n`;
  css += `  -webkit-animation-fill-mode: ${timing.fillMode};\n`;
  css += `  animation-fill-mode: ${timing.fillMode};\n`;
  css += `}\n\n`;
  css += `@-webkit-keyframes svg-motion {\n`;
  css += `  from { opacity: ${opacity.from}; -webkit-transform: none; }\n`;
  css += `  to { opacity: ${opacity.to}; -webkit-transform: ${transformStr}; }\n`;
  css += `}\n\n`;
  css += `@keyframes svg-motion {\n`;
  css += `  from { opacity: ${opacity.from}; transform: none; }\n`;
  css += `  to { opacity: ${opacity.to}; transform: ${transformStr}; }\n`;
  css += `}\n`;
  return css;
}

function mapEasingToGsap(easing) {
  const map = {
    'ease': 'power1.inOut',
    'ease-in': 'power2.in',
    'ease-out': 'power2.out',
    'ease-in-out': 'power2.inOut',
    'linear': 'none',
  };
  return map[easing] || 'power1.inOut';
}
