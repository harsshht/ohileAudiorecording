document.addEventListener('DOMContentLoaded', function () {
    const chatMessages = document.getElementById('chat-messages');
    const startRecordButton = document.getElementById('start-record');
    const stopRecordButton = document.getElementById('stop-record');
    const playAudioButton = document.getElementById('play-audio');
    let audioChunks = [];
    let mediaRecorder;
    let audioBlob;

    function displayMessage(message) {
        chatMessages.innerHTML += `<p>${message}</p>`;
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function startRecording() {
        const recordingLines = document.createElement('div');
        recordingLines.className = 'recording-lines';
        chatMessages.appendChild(recordingLines);

        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                mediaRecorder = new MediaRecorder(stream);

                mediaRecorder.ondataavailable = event => {
                    if (event.data.size > 0) {
                        audioChunks.push(event.data);
                    }
                };

                mediaRecorder.onstop = () => {
                    audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                    playAudioButton.disabled = false;
                };

                mediaRecorder.start();
                startRecordButton.disabled = true;
                stopRecordButton.disabled = false;
            })
            .catch(error => {
                console.error('Error accessing microphone:', error);
            });
    }

    function stopRecording() {
        const recordingLines = document.querySelector('.recording-lines');
        if (recordingLines) {
            recordingLines.remove();
        }

        mediaRecorder.stop();
        startRecordButton.disabled = false;
        stopRecordButton.disabled = true;
    }

    function playAudio() {
        const audioPlayer = new Audio(URL.createObjectURL(audioBlob));
        audioPlayer.play();
    }

    startRecordButton.addEventListener('click', startRecording);
    stopRecordButton.addEventListener('click', stopRecording);
    playAudioButton.addEventListener('click', playAudio);

    displayMessage('Welcome! Click "Start Recording" to begin.');
});
