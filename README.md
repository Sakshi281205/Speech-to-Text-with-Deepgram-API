# Live Speech-to-Text with Deepgram API

A cool tool that listens to your voice and types it out live! Just a button, a text area, and your voice – feel like a tech wizard.

## Features
- Start/stop live transcription with a button
- See your speech appear in real-time
- Modern, clean UI

## Demo

![Demo Screenshot](demo.png)
<!-- Or add a link to a demo video here -->

## Setup & Run

1. **Clone the repo**
   ```bash
   git clone <your-repo-url>
   cd Speech-to-Text-with-Deepgram-API
   ```
2. **Install dependencies**
   ```bash
   npm install express ws @deepgram/sdk
   ```
3. **Get a Deepgram API Key**
   - Sign up at [Deepgram](https://deepgram.com/) and get your API key.
   - Set it as an environment variable:
     ```bash
     export DEEPGRAM_API_KEY=your_deepgram_api_key
     ```
     Or replace in `server.js` directly (not recommended for production).
4. **Run the server**
   ```bash
   node server.js
   ```
5. **Open in your browser**
   - Go to [http://localhost:3000](http://localhost:3000)

## How it works
- The browser captures your microphone audio and sends it to the backend.
- The backend relays audio to Deepgram's real-time API.
- Transcriptions are sent back and displayed live.

## Requirements
- Node.js
- Modern browser (Chrome, Edge, Firefox)

## License
MIT