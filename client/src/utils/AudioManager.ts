class AudioManager {
  private static instance: AudioManager;
  private audio: HTMLAudioElement | null = null;

  private constructor() {}

  static getInstance() {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

play(src: string, loop = true, volume = 0.4) {
  if (!this.audio) {
    this.audio = new Audio(src);
    this.audio.loop = loop;
    this.audio.volume = volume;
    this.audio.load();
    this.audio.play().catch(() => {});
  } else if (this.audio.src !== src) {
    this.stop();
    this.play(src, loop, volume);
  } else {
    this.audio.play().catch(() => {});
  }
}

  stop() {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
      this.audio = null;
    }
  }
}

export default AudioManager.getInstance();
