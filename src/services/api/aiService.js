// ===== Unified AI Service =====
// Supports OpenAI, Anthropic, and Groq

import { STORAGE_KEYS } from '@/utils/constants';

// ─── System Prompts ───────────────────────────────────────────────────────────

const SYSTEM_PROMPT_ANIMATE = `You are an expert SVG animation engineer. Analyze the provided SVG and suggest 3-5 diverse, high-quality animations.

For each suggestion, return a valid JSON object with exactly these fields:
- name: short, creative animation name
- description: one-sentence description of the effect
- reasoning: why this animation suits this SVG
- config: {
    transform: { rotation: 0, scaleX: 1, scaleY: 1, translateX: 0, translateY: 0, skewX: 0, skewY: 0 },
    opacity: { from: 1, to: 1 },
    stroke: { dasharray: "", dashoffset: 0, drawEffect: false },
    timing: { duration: 1.5, delay: 0, iterationCount: "infinite", direction: "normal", easing: "ease", fillMode: "forwards" }
  }

CRITICAL RULES:
- duration and delay MUST be in seconds (e.g. 1.5, not 1500).
- Respond ONLY with a valid JSON array. Absolutely no markdown, no code fences, no explanation.`;

const SYSTEM_PROMPT_GENERATE = `You are a professional SVG illustrator. Generate beautiful, clean, production-ready SVG code.

CRITICAL RULES:
1. Output ONLY a raw, complete <svg> tag. No markdown, no code fences (no \`\`\`svg), no explanations whatsoever.
2. Use vibrant, modern colors with gradients where appropriate.
3. Fit within a 512x512 viewBox.
4. All major shapes must have descriptive IDs (e.g. id="body", id="eye-left").
5. Keep the code clean and optimized — no unnecessary whitespace or comments.`;

const SYSTEM_PROMPT_EDIT = `You are a surgical SVG code editor. You receive an existing SVG and an instruction. Modify the SVG exactly as instructed.

CRITICAL RULES:
1. Output ONLY the complete, modified <svg> code. No markdown, no code fences, no explanations.
2. Preserve ALL existing IDs, structure, and attributes unless the instruction explicitly changes them.
3. If adding new elements, give them unique descriptive IDs.
4. The output must be valid, well-formed SVG that a browser can render directly.
5. Do NOT remove the viewBox, width, height, or xmlns attributes.`;

const SYSTEM_PROMPT_ANALYZE = `You are a senior SVG design consultant. Analyze the provided SVG structure and give a concise, expert summary.

Respond in this JSON format:
{
  "summary": "2-3 sentence description of the SVG",
  "elementCount": number,
  "complexity": "Simple | Moderate | Complex",
  "colors": ["#hex1", "#hex2"],
  "suggestions": ["Actionable improvement 1", "Actionable improvement 2"]
}

Respond ONLY with valid JSON. No markdown, no code fences.`;

// ─── Config ───────────────────────────────────────────────────────────────────

export function getActiveAiConfig() {
  const provider = localStorage.getItem(STORAGE_KEYS.activeAiProvider) || 'openai';
  const keys = {
    openai: localStorage.getItem(STORAGE_KEYS.openaiKey) || '',
    anthropic: localStorage.getItem(STORAGE_KEYS.anthropicKey) || '',
    groq: localStorage.getItem(STORAGE_KEYS.groqKey) || '',
  };
  return { provider, apiKey: keys[provider] };
}

export function isAiConfigured() {
  const { apiKey } = getActiveAiConfig();
  return !!apiKey?.trim();
}

// ─── Core Intent Classifier ───────────────────────────────────────────────────

/**
 * Classify user prompt into one of: 'generate' | 'edit' | 'analyze' | 'animate'
 */
/**
 * Classify user prompt into one of: 'generate' | 'edit' | 'analyze' | 'animate'
 */
export function classifyIntent(prompt, hasSvg) {
  if (!prompt?.trim()) return hasSvg ? 'animate' : null;
  
  const p = prompt.toLowerCase().trim();
  
  // Generate new SVG keywords
  const generatePatterns = [
    /^draw\b/, /^create\b/, /^generate\b/, /^make a\b/, /^design\b/, /^build a\b/,
    /create (?:a |an )new/, /generate (?:a |an )/, /draw (?:a |an )/, /design (?:a |an )/,
  ];
  if (!hasSvg || generatePatterns.some(p_ => p_.test(p))) return 'generate';

  // Structural edit / Style / Repair keywords
  const editPatterns = [
    /\b(remove|delete|erase|eliminate)\b/,
    /\b(add|insert|append|include|put|place)\b/,
    /\b(replace|swap|change|update|modify|set|fix|repair|clean|optimize)\b/,
    /\b(color|fill|stroke|background|size|shape|text|path|theme|style)\b/,
    /\b(resize|scale|rotate|move|translate|transform)\b/,
    /\b(make it|make the)\b/,
    /\b(glassmorphism|neomorphism|cyberpunk|flat|minimal|rounded)\b/,
    /\brename\b/,
  ];
  if (editPatterns.some(p_ => p_.test(p))) return 'edit';

  // Structural analysis keywords
  const analyzePatterns = [
    /\b(analyze|analyse|explain|describe|what (is|are)|tell me about|inspect|review|audit)\b/,
    /\b(how many|count|list)\b.*\b(elements|shapes|paths)\b/,
  ];
  if (analyzePatterns.some(p_ => p_.test(p))) return 'analyze';

  return 'animate';
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Suggest animations for an existing SVG
 */
export async function suggestAnimations(svgCode, userPrompt, selectedElementId) {
  const { provider, apiKey } = getActiveAiConfig();
  _requireKey(provider, apiKey);

  const selectionContext = selectedElementId ? `The user has currently selected the element with ID: "${selectedElementId}". Prioritize suggestions for this element if the request is specific.` : '';

  const prompt = userPrompt
    ? `User wants: "${userPrompt}"\n${selectionContext}\n\nCreate animations tailored to this request:\n${_truncateSvg(svgCode)}`
    : `Analyze this SVG and suggest 3-5 creative animations.\n${selectionContext}\n\nSVG Code:\n${_truncateSvg(svgCode)}`;

  const raw = await _call(provider, apiKey, SYSTEM_PROMPT_ANIMATE, prompt);
  return _parseJsonArray(raw, 'animation suggestions');
}

/**
 * Generate a brand new SVG from a text description
 */
export async function generateSvg(description) {
  const { provider, apiKey } = getActiveAiConfig();
  _requireKey(provider, apiKey);

  const raw = await _call(provider, apiKey, SYSTEM_PROMPT_GENERATE,
    `Create a high-quality, professional SVG illustration: "${description}"`);
  return _extractSvg(raw);
}

/**
 * Structurally edit an existing SVG
 */
export async function editSvg(svgCode, instruction, selectedElementId) {
  const { provider, apiKey } = getActiveAiConfig();
  _requireKey(provider, apiKey);

  if (!svgCode?.includes('<svg')) throw new Error('No valid SVG loaded to edit');

  const selectionContext = selectedElementId ? `CONTEXT: The user has selected the element with ID: "${selectedElementId}". If the instruction refers to "this", "selected", or "it", it means this element.` : '';

  const prompt = `INSTRUCTION: ${instruction}\n${selectionContext}\n\nCURRENT SVG:\n${_truncateSvg(svgCode, 6000)}`;
  const raw = await _call(provider, apiKey, SYSTEM_PROMPT_EDIT, prompt);
  const result = _extractSvg(raw);
  if (!result) throw new Error('AI returned an invalid SVG. Please try rephrasing your request.');
  return result;
}

/**
 * Analyze SVG structure and return insights
 */
export async function analyzeSvgStructure(svgCode) {
  const { provider, apiKey } = getActiveAiConfig();
  _requireKey(provider, apiKey);

  const raw = await _call(provider, apiKey, SYSTEM_PROMPT_ANALYZE,
    `Analyze this SVG:\n${_truncateSvg(svgCode, 4000)}`);
  
  try {
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
  } catch {}
  return { summary: raw, complexity: 'Unknown', colors: [], suggestions: [] };
}

// ─── Provider Routing ─────────────────────────────────────────────────────────

async function _call(provider, apiKey, systemPrompt, userPrompt) {
  try {
    switch (provider) {
      case 'openai': return await _callOpenAI(apiKey, systemPrompt, userPrompt);
      case 'anthropic': return await _callAnthropic(apiKey, systemPrompt, userPrompt);
      case 'groq': return await _callGroq(apiKey, systemPrompt, userPrompt);
      default: throw new Error(`Unsupported provider: ${provider}`);
    }
  } catch (err) {
    _handleError(err, provider);
  }
}

async function _callOpenAI(apiKey, systemPrompt, userPrompt) {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userPrompt }],
      temperature: 0.7,
      max_tokens: 4096,
    }),
  });
  _checkHttpError(res, 'OpenAI');
  const data = await res.json();
  return data.choices[0].message.content;
}

async function _callGroq(apiKey, systemPrompt, userPrompt) {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userPrompt }],
      temperature: 0.7,
      max_tokens: 4096,
    }),
  });
  _checkHttpError(res, 'Groq');
  const data = await res.json();
  return data.choices[0].message.content;
}

async function _callAnthropic(apiKey, systemPrompt, userPrompt) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerously-allow-custom-cors': 'true',
    },
    body: JSON.stringify({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4096,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    }),
  });
  _checkHttpError(res, 'Anthropic');
  const data = await res.json();
  return data.content[0].text;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function _requireKey(provider, apiKey) {
  if (!apiKey?.trim()) {
    throw new Error(`No API key configured. Please add your ${provider.toUpperCase()} key in Settings.`);
  }
}

async function _checkHttpError(res, providerName) {
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    const msg = errData.error?.message || errData.message || res.statusText;
    throw new Error(`${providerName} error ${res.status}: ${msg}`);
  }
}

function _handleError(err, provider) {
  const msg = err.message || '';
  if (msg.includes('401') || msg.toLowerCase().includes('api key') || msg.includes('authentication')) {
    throw new Error(`Invalid API key for ${provider.toUpperCase()}. Please check your Settings.`);
  }
  if (msg.includes('429')) {
    throw new Error(`Rate limit hit for ${provider.toUpperCase()}. Wait a moment or switch provider in Settings.`);
  }
  if (msg.includes('500') || msg.includes('503')) {
    throw new Error(`${provider.toUpperCase()} server error. Please try again in a moment.`);
  }
  if (msg.includes('Failed to fetch') || msg.includes('NetworkError')) {
    throw new Error(`Network error. Check your internet connection.`);
  }
  throw err;
}

function _truncateSvg(svgCode, maxLen = 4000) {
  if (!svgCode) return '';
  if (svgCode.length <= maxLen) return svgCode;
  // Smart truncation: keep the opening tag and first elements
  return svgCode.slice(0, maxLen) + '\n<!-- ... truncated for brevity -->';
}

function _extractSvg(raw) {
  if (!raw) return null;
  // Strip markdown code fences if present
  let cleaned = raw.replace(/^```(?:svg|xml)?\n?/gm, '').replace(/```\s*$/gm, '').trim();
  // Try to extract just the <svg>...</svg> block
  const match = cleaned.match(/<svg[\s\S]*?<\/svg>/i);
  return match ? match[0].trim() : (cleaned.includes('<svg') ? cleaned : null);
}

function _parseJsonArray(raw, context) {
  if (!raw) throw new Error(`AI returned empty response for ${context}`);
  // Strip markdown fences
  const cleaned = raw.replace(/^```(?:json)?\n?/gm, '').replace(/```\s*$/gm, '').trim();
  const match = cleaned.match(/\[[\s\S]*\]/);
  if (!match) throw new Error(`Could not parse AI ${context} — unexpected format`);
  try {
    const arr = JSON.parse(match[0]);
    return arr.map(_formatSuggestion);
  } catch (e) {
    throw new Error(`JSON parse failed for ${context}: ${e.message}`);
  }
}

function _formatSuggestion(s) {
  const n = (val, fallback) => {
    if (val === undefined || val === null) return fallback;
    const p = parseFloat(val);
    return isNaN(p) ? fallback : p;
  };
  const clampSeconds = (val, def) => {
    let v = n(val, def);
    return v > 30 ? v / 1000 : Math.max(0, v); // auto-fix ms → s
  };

  return {
    name: s.name || 'Unnamed',
    description: s.description || '',
    reasoning: s.reasoning || '',
    config: {
      transform: {
        rotation: n(s.config?.transform?.rotation, 0),
        scaleX: n(s.config?.transform?.scaleX, 1),
        scaleY: n(s.config?.transform?.scaleY, 1),
        translateX: n(s.config?.transform?.translateX, 0),
        translateY: n(s.config?.transform?.translateY, 0),
        skewX: n(s.config?.transform?.skewX, 0),
        skewY: n(s.config?.transform?.skewY, 0),
      },
      opacity: {
        from: n(s.config?.opacity?.from, 1),
        to: n(s.config?.opacity?.to, 1),
      },
      stroke: {
        dasharray: s.config?.stroke?.dasharray || '',
        dashoffset: n(s.config?.stroke?.dashoffset, 0),
        drawEffect: !!s.config?.stroke?.drawEffect,
      },
      timing: {
        duration: clampSeconds(s.config?.timing?.duration, 1.5),
        delay: clampSeconds(s.config?.timing?.delay, 0),
        iterationCount: String(s.config?.timing?.iterationCount || 'infinite'),
        direction: s.config?.timing?.direction || 'normal',
        easing: s.config?.timing?.easing || 'ease',
        fillMode: s.config?.timing?.fillMode || 'forwards',
      },
      interaction: { trigger: 'auto' },
    },
  };
}
