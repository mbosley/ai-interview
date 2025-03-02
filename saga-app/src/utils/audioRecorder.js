/**
 * A utility for recording audio in the browser.
 */
class AudioRecorder {
  constructor() {
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.stream = null;
    this.isRecording = false;
    this.audioBlob = null;
    this.audioUrl = null;
  }

  /**
   * Request microphone permissions and set up the recorder
   */
  async setup() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(this.stream);
      
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };
      
      this.mediaRecorder.onstop = () => {
        this.audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        this.audioUrl = URL.createObjectURL(this.audioBlob);
        
        // Reset chunks for next recording
        this.audioChunks = [];
      };
      
      return true;
    } catch (error) {
      console.error('Error setting up audio recorder:', error);
      return false;
    }
  }

  /**
   * Start recording audio
   */
  start() {
    if (!this.mediaRecorder) {
      console.error('Media recorder not initialized. Call setup() first.');
      return false;
    }
    
    try {
      this.mediaRecorder.start();
      this.isRecording = true;
      return true;
    } catch (error) {
      console.error('Error starting recording:', error);
      return false;
    }
  }

  /**
   * Stop recording audio
   */
  stop() {
    if (!this.mediaRecorder || !this.isRecording) {
      console.error('Not currently recording.');
      return false;
    }
    
    try {
      this.mediaRecorder.stop();
      this.isRecording = false;
      return true;
    } catch (error) {
      console.error('Error stopping recording:', error);
      return false;
    }
  }

  /**
   * Get the recorded audio as a Blob
   */
  getAudioBlob() {
    return this.audioBlob;
  }

  /**
   * Get the URL for the recorded audio
   */
  getAudioUrl() {
    return this.audioUrl;
  }

  /**
   * Cleanup resources when done
   */
  cleanup() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
    }
    
    if (this.audioUrl) {
      URL.revokeObjectURL(this.audioUrl);
    }
    
    this.mediaRecorder = null;
    this.stream = null;
    this.isRecording = false;
    this.audioChunks = [];
    this.audioBlob = null;
    this.audioUrl = null;
  }
}

export default AudioRecorder;