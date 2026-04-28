# Suta: AI The Secret Whisperer

<p align="center">
  <img src="assets/logo/suta-logo.png" width="120" height="120" alt="Suta Logo" />
</p>

**Suta** is a high-performance, real-time AI whispering system designed as a cognitive companion for professionals across all industries. Operating through a sleek, terminal-inspired interface, Suta serves as a silent strategic coach that captures live audio streams—from high-stakes meetings to job interviews—and provides instantaneous, context-aware "whispers" tailored to the user’s specific identity.

## 🎯 Who is it for?

Thanks to its fully customizable **Neural Personality Engine**, Suta is a versatile tool for any professional navigating intense communication sessions:

*   **Job Candidates & Interviewees**: Across any field who want to articulate their career highlights and pre-defined strategies with confidence.
*   **Bilingual Professionals**: Specifically those operating in **English and Indonesian** environments. Suta provides a seamless bridge for users who need to process English technical dialogue and respond with Indonesian insights (or vice versa) in real-time.

## 🧠 The Role of Artificial Intelligence

AI serves as the "neural core" of Suta, transforming live audio into actionable intelligence. The system utilizes a sophisticated multi-model pipeline to ensure sub-second response times:

1.  **Low-Latency Transcription**: Utilizing **Deepgram’s Nova-2** model, Suta achieves sub-second audio-to-text conversion, ensuring the AI captures every nuance of the live conversation.
2.  **Strategic Reasoning (Stealth & Ultra-Low Latency)**: In high-stakes sessions, speed is the ultimate leverage. Suta utilizes a high-speed neural pipeline to deliver tactical "whispers" in sub-second cycles:
    *   **Groq LPU™ Integration**: Optimized for extreme speed, leveraging Llama 3.3 70B for near-instantaneous response generation.
    *   **Gemini 2.0 Flash**: High-fidelity reasoning with large context windows for deep technical continuity.
    *   **OpenRouter**: Access to a broad spectrum of open-weights models like GPT-OSS and Qwen for specialized queries.
3.  **Specialized Bilingual Synthesis**: The AI cross-references live dialogue with the user’s custom **JSON Personality Profile** to provide accurate whispers that are "one-take ready." Upon detecting 2 seconds of silence, Suta delivers paragraph-style responses in English or Indonesian, allowing users to remain composed and articulate without manual editing.

**Suta serves as your secret tactical advantage, whispering expert-level insights directly to your screen so you can navigate any high-stakes conversation with unshakeable confidence and perfect technical precision.**

---

## 🛠 Tech Stack

- **Frontend**: [Nuxt 3](https://nuxt.com/) (Vue.js)
- **Styling**: Vanilla CSS & TailwindCSS (for utility layout)
- **Transcription**: [Deepgram Nova-2](https://deepgram.com/)
- **AI Models**: Groq LPU™ (Llama 3.3), Google Gemini 2.0 & OpenRouter
- **Icons**: Custom SVG System
- **State Management**: Nuxt `useState` & LocalStorage

## 🚀 Getting Started

### Prerequisites

- Node.js (v18.x or later)
- API Keys for Deepgram, Groq, Google Gemini, and OpenRouter

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/suta-project.git
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Setup Environment Variables:
   Copy the example environment file and fill in your API keys:
   ```bash
   cp .env.example .env
   ```
   Or create a `.env` manually in the root directory:
   ```env
   # Deepgram: https://console.deepgram.com/
   DEEPGRAM_API_KEY=your_deepgram_key

   # Groq: https://console.groq.com/
   GROQ_API_KEY=your_groq_key

   # Google AI Studio: https://aistudio.google.com/
   GEMINI_API_KEY=your_gemini_key

   # Open Router: https://openrouter.ai/
   OPENROUTER_API_KEY=your_openrouter_key
   ```

4. Run the Development Server:
   ```bash
   npm run dev
   ```

## 🔒 Security & Privacy

Suta is built with a **Privacy-First Architecture**:
- **Zero-Server Persistence**: Your conversation history and Neural Profiles are stored locally in your browser's LocalStorage.
- **Local Keys**: API keys are managed via environment variables and never stored on a centralized server.
- **Purge Command**: Easily clear all session data with a single click in the terminal.

## ⚖️ License

This project is licensed under a **Proprietary License**. All rights are reserved by **MrA-png**. 

Usage, modification, or redistribution of this software is strictly prohibited without explicit written permission from the author. For inquiries, please contact the author via [GitHub](https://github.com/MrA-png).

---

<p align="center">
  Built with technical excellence by <b>Suta Assist</b> &copy; 2026 <b>MrA-png</b>
</p>
