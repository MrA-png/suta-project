# Suta: AI The Secret Whisperer

<p align="center">
  <img src="/icons/ai.svg" width="80" height="80" alt="Suta Logo" />
</p>

**Suta** is a high-performance, real-time AI whispering system designed as a cognitive companion for professionals across all industries. Operating through a sleek, terminal-inspired interface, Suta serves as a silent strategic coach that captures live audio streams—from high-stakes meetings to job interviews—and provides instantaneous, context-aware "whispers" tailored to the user’s specific identity.

## 🎯 Who is it for?

Thanks to its fully customizable **Neural Personality Engine**, Suta is a versatile tool for any professional navigating intense communication sessions:

*   **Job Candidates & Interviewees**: Across any field who want to articulate their career highlights and pre-defined strategies with confidence.
*   **Bilingual Professionals**: Specifically those operating in **English and Indonesian** environments. Suta provides a seamless bridge for users who need to process English technical dialogue and respond with Indonesian insights (or vice versa) in real-time.

## 🧠 The Role of Artificial Intelligence

AI serves as the "neural core" of Suta, transforming live audio into actionable intelligence. The system utilizes a sophisticated multi-model pipeline to ensure sub-second response times:

1.  **Low-Latency Transcription**: Utilizing **Deepgram’s Nova-2** model, Suta achieves sub-second audio-to-text conversion, ensuring the AI captures every nuance of the live conversation.
2.  **Strategic Reasoning**: Users can toggle between two high-performance models depending on the need:
    *   **Gemini 2.0 Flash**: Optimized for extreme speed and efficiency in real-time response generation.
    *   **OpenRouter (openai/gpt-oss-120b:free)**: Leveraged for deep reasoning and processing complex technical queries.
3.  **Specialized Bilingual Synthesis**: The AI cross-references live dialogue with the user’s custom **JSON Personality Profile** to provide accurate whispers that are "one-take ready." Upon detecting 2 seconds of silence, Suta delivers paragraph-style responses in English or Indonesian, allowing users to remain composed and articulate without manual editing.

**Suta serves as your secret tactical advantage, whispering expert-level insights directly to your screen so you can navigate any high-stakes conversation with unshakeable confidence and perfect technical precision.**

---

## 🛠 Tech Stack

- **Frontend**: [Nuxt 3](https://nuxt.com/) (Vue.js)
- **Styling**: Vanilla CSS & TailwindCSS (for utility layout)
- **Transcription**: [Deepgram Nova-2](https://deepgram.com/)
- **AI Models**: Google Gemini 2.0 Flash & OpenRouter API
- **Icons**: Custom SVG System
- **State Management**: Nuxt `useState` & LocalStorage

## 🚀 Getting Started

### Prerequisites

- Node.js (v18.x or later)
- API Keys for Deepgram, Google Gemini, and OpenRouter

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

---

<p align="center">
  Built with technical excellence by <b>Suta Assist</b> &copy; 2026
</p>
