// ===== Performance Analyzer =====

import { PERF_THRESHOLDS } from './constants';
import { countPathPoints, countComplexFeatures } from './svgParser';

/**
 * Analyze SVG performance and return score + warnings
 */
export function analyzeSvgPerformance(svgCode, elements) {
  if (!svgCode) {
    return { score: 100, warnings: [], stats: null };
  }

  const warnings = [];
  let score = 100;

  // Count elements
  const elementCount = countAllElements(elements);
  const stats = {
    elementCount,
    ...countComplexFeatures(svgCode),
    fileSize: new Blob([svgCode]).size,
  };

  // Check element count
  if (elementCount > PERF_THRESHOLDS.maxElements) {
    const penalty = Math.min(30, (elementCount - PERF_THRESHOLDS.maxElements) * 0.5);
    score -= penalty;
    warnings.push({
      severity: 'high',
      message: `${elementCount} elements detected (recommended: <${PERF_THRESHOLDS.maxElements})`,
      suggestion: 'Consider simplifying the SVG or animating fewer elements',
    });
  }

  // Check filters
  if (stats.filters > PERF_THRESHOLDS.maxFilters) {
    score -= 15;
    warnings.push({
      severity: 'high',
      message: `${stats.filters} SVG filters found — these are GPU-intensive`,
      suggestion: 'Remove blur, drop-shadow or feGaussianBlur filters for better FPS',
    });
  }

  // Check gradients
  if (stats.gradients > PERF_THRESHOLDS.maxGradients) {
    score -= 10;
    warnings.push({
      severity: 'medium',
      message: `${stats.gradients} gradients detected`,
      suggestion: 'Use solid fills where possible for better performance',
    });
  }

  // Check path complexity
  const pathD = svgCode.match(/\bd="([^"]+)"/g) || [];
  let totalPoints = 0;
  pathD.forEach((match) => {
    const d = match.slice(3, -1);
    totalPoints += countPathPoints(d);
  });

  if (totalPoints > PERF_THRESHOLDS.maxPathPoints) {
    score -= 15;
    warnings.push({
      severity: 'medium',
      message: `Complex paths with ${totalPoints} commands`,
      suggestion: 'Simplify paths using an SVG editor or SVGO',
    });
  }
  stats.pathPoints = totalPoints;

  // Check file size
  if (stats.fileSize > 100000) {
    score -= 10;
    warnings.push({
      severity: 'medium',
      message: `Large file size: ${(stats.fileSize / 1024).toFixed(1)} KB`,
      suggestion: 'Optimize with the built-in SVG cleaner',
    });
  }

  // Good news if small
  if (warnings.length === 0) {
    warnings.push({
      severity: 'low',
      message: 'SVG is well-optimized for animation!',
      suggestion: 'No performance concerns detected',
    });
  }

  return {
    score: Math.max(0, Math.round(score)),
    warnings,
    stats,
  };
}

function countAllElements(elements) {
  let count = 0;
  const recurse = (items) => {
    for (const el of items) {
      count++;
      if (el.children?.length) recurse(el.children);
    }
  };
  recurse(elements || []);
  return count;
}
