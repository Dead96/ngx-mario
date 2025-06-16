export class Music {
  private overworld: HTMLAudioElement;
  private underground: HTMLAudioElement;
  clear: HTMLAudioElement;
  death: HTMLAudioElement;

  speededUp: boolean = false;
  playing: HTMLAudioElement | null = null;

  constructor() {
    this.overworld = new Audio('assets/ngx-mario/sounds/overworld.ogg');
    this.underground = new Audio('assets/ngx-mario/sounds/underground.ogg');
    this.clear = new Audio('assets/ngx-mario/sounds/stage_clear.wav');
    this.death = new Audio('assets/ngx-mario/sounds/mariodie.wav');
  }

  playOverworld(resume: boolean = false): void {
    this.playing = this.overworld;
    this.play();
  }

  playUnderground(resume: boolean = false): void {
    this.playing = this.underground;
    this.play();
  }

  play(resume: boolean = false): void {
    this.pause();
    if (this.playing) {
      if (!resume)
        this.playing.currentTime = 0;
      this.playing.playbackRate = this.speededUp ? 1.5 : 1;
      this.playing.loop = true;
    }
    this.playing?.play();
  }

  pause(): void {
    this.playing?.pause();
  }

  reset(): void {
    this.overworld.currentTime = 0;
    this.underground.currentTime = 0;
    this.underground.playbackRate = 1;
    this.overworld.playbackRate = 1;
    this.playing = null;
    this.speededUp = false;
  }
}
