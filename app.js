// Frontend logic for live speech-to-text
let listening = false;
let ws;
let mediaRecorder;
const listenBtn = document.getElementById('listen-btn');
const transcriptArea = document.getElementById('transcript');

listenBtn.addEventListener('click', async () => {
  if (!listening) {
    await startListening();
  } else {
    stopListening();
  }
});

async function startListening() {
  listenBtn.textContent = 'Stop Listening';
  listenBtn.classList.add('listening');
  transcriptArea.value = '';
  listening = true;

  // Connect to backend WebSocket
  ws = new WebSocket(`ws://${window.location.host}`);
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.transcript !== undefined) {
      transcriptArea.value = data.transcript;
    }
  };
  ws.onclose = stopListening;

  // Get microphone access
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
  mediaRecorder.start(250); // send audio in 250ms chunks

  mediaRecorder.ondataavailable = (e) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(e.data);
    }
  };
}

function stopListening() {
  listening = false;
  listenBtn.textContent = 'Start Listening';
  listenBtn.classList.remove('listening');
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop();
  }
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.close();
  }
} 