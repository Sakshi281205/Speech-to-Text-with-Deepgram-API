const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const { Deepgram } = require('@deepgram/sdk');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const DEEPGRAM_API_KEY = process.env.DEEPGRAM_API_KEY || '83de2f74f701b18d0926fff52486ea7aa3d9cf2e';

app.use(express.static(__dirname));

wss.on('connection', (clientWs) => {
  const deepgram = new Deepgram(DEEPGRAM_API_KEY);
  let transcript = '';

  // Connect to Deepgram's real-time API using v3 format
  const dgSocket = deepgram.listen.live({
    punctuate: true,
    interim_results: true,
    language: 'en-US',
    encoding: 'webm',
    sample_rate: 48000,
  });

  dgSocket.on('open', () => {
    console.log('Deepgram connection opened');
  });

  dgSocket.on('transcriptReceived', (data) => {
    const dgData = JSON.parse(data);
    if (dgData.channel && dgData.channel.alternatives[0]) {
      transcript = dgData.channel.alternatives[0].transcript;
      clientWs.send(JSON.stringify({ transcript }));
    }
  });

  dgSocket.on('error', (err) => {
    console.error('Deepgram error:', err);
    clientWs.send(JSON.stringify({ error: 'Deepgram error: ' + err.message }));
    clientWs.close();
  });

  clientWs.on('message', (msg) => {
    // Forward audio to Deepgram
    dgSocket.send(msg);
  });

  clientWs.on('close', () => {
    dgSocket.finish();
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}); 