# 🌊 SvgFlow — The Professional SVG Motion Studio

[![React 19](https://img.shields.io/badge/React-19-blue.svg?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.0-646CFF.svg?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS 4](https://img.shields.io/badge/Tailwind--CSS-4.0-38B2AC.svg?logo=tailwind-css)](https://tailwindcss.com/)

**SvgFlow** is a high-performance, AI-powered playground and production studio for SVG animations. It bridges the gap between static vector illustrations and production-ready motion code. Whether you need CSS Keyframes, Tailwind classes, Framer Motion variants, or GSAP timelines, SvgFlow handles the heavy lifting so you can focus on the art.

---

## ✨ Key Features

### 🤖 AI Copilot (The Brain)
- **Structural Editing:** Add, remove, or modify SVG shapes using natural language (e.g., *"Add a red circle in the center"*).
- **Intelligent Animation:** Ask for effects like *"Make it bounce on hover"* and get production-ready configs instantly.
- **Design Audit:** Automatically analyze your SVG for complexity, color palettes, and optimization opportunities.
- **Illustration Generation:** Create brand-new, high-quality SVGs from a text prompt.

### 🎭 Animation Engine
- **Multi-Engine Export:** Generate code for **CSS, Tailwind CSS, Framer Motion, GSAP, and Plain CSS**.
- **Visual Timeline:** A professional-grade, multi-track-ready timeline for precise control over duration, delay, and easing.
- **Presets Library:** Instant access to high-quality presets like Pulse, Float, Draw-on, and Spin.

### 🛠️ Developer Tools
- **Live Code Editor:** Tweak your SVG markup with a built-in CodeMirror editor and see changes in real-time.
- **Layer Tree:** A hierarchical view of your SVG elements with selection context awareness for AI actions.
- **Optimization:** Built-in tools to clean up and optimize SVG paths for better performance.

---

## 🚀 Tech Stack

- **Frontend:** [React 19](https://react.dev/) (Concurrent Mode)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/) (Next-Gen CSS Engine)
- **State Management:** [Redux Toolkit](https://redux-toolkit.js.org/)
- **UI Components:** [Radix UI / Base UI](https://base-ui.com/) + [Lucide Icons](https://lucide.dev/)
- **Code Editor:** [CodeMirror 6](https://codemirror.net/)
- **AI Integration:** OpenAI GPT-4o, Anthropic Claude 3.5 Sonnet, and Groq (Llama 3.3)
- **Build System:** [Vite 8](https://vitejs.dev/)

---

## 🛠️ Getting Started

### 1. Clone the repository
```bash
git clone <repo_url>
cd svgflow
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up Environment (Optional for AI)
To use the AI Copilot features, you will need an API key from OpenAI, Anthropic, or Groq. You can configure these directly within the **Settings** page of the app (stored securely in `localStorage`).

### 4. Run the development server
```bash
npm run dev
```

The app will be running at `http://localhost:5173`.

---

## 📖 Usage Guide

### The Workflow
1. **Upload/Generate:** Drag & drop an SVG file or use the AI Copilot to generate a new illustration.
2. **Select & Tweak:** Click an element in the **Layer Tree** to select it.
3. **Animate:** Use the **Animation Controls** or ask the AI to suggest a motion.
4. **Export:** Head to the **Export Panel** and copy the code for your favorite framework.

### Example AI Prompts
- *"Draw a professional tech logo for a company called 'CloudSync'."*
- *"Remove the background circle and make the icon color electric blue."*
- *"Analyze this SVG and suggest improvements."*
- *"Animate the 'rocket-path' with a floating effect."*

---

## 🎨 Design Philosophy
SvgFlow is designed with a **"Premium Dark"** aesthetic, utilizing high-contrast accents, glassmorphism, and smooth micro-animations to provide a professional workspace for creative developers.

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🤝 Contributing
Contributions are welcome! If you have a feature request or found a bug, please open an issue or submit a pull request.

