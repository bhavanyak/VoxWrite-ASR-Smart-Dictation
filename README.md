# VoxWrite – ASR Smart Dictation Tool

A browser-based Automatic Speech Recognition (ASR) mini project. It converts live microphone speech into editable text and provides transcript management and optional text-to-speech playback.

## Features
- Live speech-to-text using the Web Speech API (`SpeechRecognition`).
- Continuous recognition with interim results.
- Language selection: English (US), English (India), Tamil (India), and Hindi (India), depending on browser support.
- Optional spoken punctuation formatting.
- Editable transcript with live word and character counts.
- Copy transcript and download as `.txt`.
- Optional text-to-speech with normal playback and five voice-style presets.
- Clear messages for unsupported browsers, blocked microphones, missing microphones, network errors, and no speech.
- No application backend or database.

## Technologies
- HTML5 – page structure
- CSS3 – responsive interface and styling
- JavaScript (ES6+) – event handling and application logic
- Web Speech API – speech recognition and speech synthesis
- Google Chrome / Microsoft Edge – recommended browser
- Git and GitHub – version control and project hosting

## Project structure
```text
ASR_Smart_Dictation_Project/
├── index.html
├── style.css
├── script.js
├── README.md
└── ASR_Task2_Project_Report.pdf
```

## How to run
1. Download or clone this repository.
2. Open the project folder in Visual Studio Code.
3. Start a local web server. For example, install the **Live Server** extension and select **Open with Live Server** on `index.html`.
4. Open the local URL in the latest Google Chrome or Microsoft Edge.
5. Allow microphone permission when prompted.
6. Select a recognition language and click **Start speaking**.
7. Speak clearly. Click **Stop** to finish.
8. Edit the transcript, then use **Copy text** or **Download .txt**.
9. To hear the transcript, click **Speak normally** or choose a style and click **Speak in style**.

> Do not rely on opening the HTML file directly with `file://`. Use a local server. Microphone and speech API behavior depends on browser support. Some browser speech-recognition implementations use a vendor-operated recognition service; this project does not provide a guarantee of fully offline recognition.

## Testing checklist
- [ ] Open the app in a supported browser.
- [ ] Confirm microphone permission can be granted.
- [ ] Dictate a short sentence and check the live transcript.
- [ ] Test Stop and Start again; previous transcript should remain.
- [ ] Test language selection where supported.
- [ ] Say “comma”, “period”, and “question mark” with punctuation formatting enabled.
- [ ] Edit transcript and verify word/character counters.
- [ ] Test Copy text and Download `.txt`.
- [ ] Test normal text-to-speech and each voice preset.
- [ ] Test the unsupported-browser and microphone-denied messages where possible.

## Limitations
- The Web Speech API is not implemented identically in all browsers.
- Recognition may require an internet connection and may send audio to the browser vendor's speech service.
- Accuracy varies with background noise, accent, pronunciation, microphone quality, and selected language.
- The available voices for text-to-speech depend on the operating system and browser.
- This is an educational prototype, not a production medical, legal, or emergency transcription system.

## GitHub upload
Create a new public repository named `voxwrite-asr-smart-dictation`. From this project folder, run:

```bash
git init
git add .
git commit -m "Add VoxWrite ASR smart dictation project"
git branch -M main
git remote add origin https://github.com/<your-username>/voxwrite-asr-smart-dictation.git
git push -u origin main
```

Replace `<your-username>` with your GitHub username. Add the final GitHub repository URL to your college submission.
