const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const transcript = document.getElementById("transcript");
const statusBox = document.getElementById("status");
const supportBadge = document.getElementById("supportBadge");
const language = document.getElementById("language");
const punctuation = document.getElementById("punctuation");
let recognition = null;
let listening = false;
let finalText = "";

function updateCounts() {
  const value = transcript.value.trim();
  const words = value ? value.split(/\s+/).length : 0;
  document.getElementById("wordCount").textContent = `${words} words`;
  document.getElementById("charCount").textContent = `${transcript.value.length} characters`;
}
function setStatus(message, active=false) {
  statusBox.textContent = message;
  statusBox.classList.toggle("listening", active);
}
function formatPunctuation(text) {
  if (!punctuation.checked) return text;
  return text
    .replace(/\bcomma\b/gi, ",")
    .replace(/\bperiod\b|\bfull stop\b/gi, ".")
    .replace(/\bquestion mark\b/gi, "?")
    .replace(/\bexclamation mark\b/gi, "!")
    .replace(/\s+([,.?!])/g, "$1");
}
function setupRecognition() {
  if (!SpeechRecognition) {
    supportBadge.textContent = "Speech API unavailable";
    supportBadge.style.color = "#ffbd75";
    startBtn.disabled = true;
    setStatus("This browser does not support live speech recognition. Please use the latest Google Chrome or Microsoft Edge.");
    return;
  }
  supportBadge.textContent = "Speech API supported";
  recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = language.value;

  recognition.onstart = () => {
    listening = true; startBtn.disabled = true; stopBtn.disabled = false;
    setStatus("Listening… speak clearly into your microphone.", true);
  };
  recognition.onresult = (event) => {
    let interim = "";
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const piece = event.results[i][0].transcript;
      if (event.results[i].isFinal) finalText += formatPunctuation(piece) + " ";
      else interim += piece;
    }
    transcript.value = finalText + interim;
    updateCounts();
  };
  recognition.onerror = (event) => {
    const messages = {
      "not-allowed": "Microphone permission was blocked. Allow microphone access in browser settings.",
      "audio-capture": "No microphone was detected. Connect or enable a microphone.",
      "network": "The browser speech service reported a network error. Check your connection and try again.",
      "no-speech": "No speech was detected. Try speaking closer to the microphone."
    };
    setStatus(messages[event.error] || `Speech recognition error: ${event.error}`);
  };
  recognition.onend = () => {
    listening = false; startBtn.disabled = false; stopBtn.disabled = true;
    finalText = transcript.value;
    setStatus("Recognition stopped. You can edit, copy, or download your transcript.");
  };
}
startBtn.addEventListener("click", () => {
  if (!recognition) return;
  recognition.lang = language.value;
  finalText = transcript.value.trim() ? transcript.value.trim() + " " : "";
  try { recognition.start(); } catch (e) { setStatus("Recognition is already starting. Please wait."); }
});
stopBtn.addEventListener("click", () => { if (recognition && listening) recognition.stop(); });
language.addEventListener("change", () => {
  if (listening && recognition) recognition.stop();
  if (recognition) recognition.lang = language.value;
});
transcript.addEventListener("input", () => { finalText = transcript.value; updateCounts(); });
document.getElementById("copyBtn").addEventListener("click", async () => {
  try { await navigator.clipboard.writeText(transcript.value); setStatus("Transcript copied to clipboard."); }
  catch { setStatus("Clipboard access was unavailable. Select the text and copy it manually."); }
});
document.getElementById("downloadBtn").addEventListener("click", () => {
  const blob = new Blob([transcript.value], {type:"text/plain;charset=utf-8"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = "voxwrite-transcript.txt"; a.click();
  URL.revokeObjectURL(url); setStatus("Transcript download started.");
});
document.getElementById("clearBtn").addEventListener("click", () => {
  transcript.value = ""; finalText = ""; updateCounts(); setStatus("Transcript cleared.");
});
document.getElementById("speakBtn").addEventListener("click", () => speakText(transcript.value, 1, 1));
document.getElementById("styleBtn").addEventListener("click", () => {
  const style = document.getElementById("voiceStyle").value;
  if (!style) { setStatus("Please choose a voice style first."); return; }
  const presets = {
    robot:{cue:"beep",pitch:0.65,rate:0.9},
    chipmunk:{cue:"squeak",pitch:1.8,rate:1.25},
    narrator:{cue:"hmm",pitch:0.9,rate:0.88},
    announcer:{cue:"ta-da",pitch:0.8,rate:0.95},
    whisper:{cue:"shh",pitch:1.05,rate:0.82}
  };
  const p = presets[style];
  const keep = document.getElementById("keepWords").checked;
  const source = transcript.value.trim();
  if (!source) { setStatus("Enter or dictate some text before using text-to-speech."); return; }
  const output = keep ? source : source.split(/\s+/).map(() => p.cue).join(", ");
  speakText(output, p.pitch, p.rate);
});
document.getElementById("cancelSpeechBtn").addEventListener("click", () => {
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  setStatus("Audio playback stopped.");
});
function speakText(text, pitch, rate) {
  if (!("speechSynthesis" in window)) { setStatus("Text-to-speech is not supported in this browser."); return; }
  if (!text.trim()) { setStatus("There is no text to read aloud."); return; }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.pitch = pitch; utterance.rate = rate;
  const voices = window.speechSynthesis.getVoices();
  const localEnglish = voices.find(v => v.lang.toLowerCase().startsWith("en") && v.localService);
  if (localEnglish) utterance.voice = localEnglish;
  utterance.onstart = () => setStatus("Playing text-to-speech audio…");
  utterance.onend = () => setStatus("Audio playback completed.");
  utterance.onerror = () => setStatus("Text-to-speech playback could not be completed.");
  window.speechSynthesis.speak(utterance);
}
setupRecognition();
updateCounts();
