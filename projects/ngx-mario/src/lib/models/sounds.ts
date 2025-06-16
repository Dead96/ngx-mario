export class Sounds {
  smallJump: HTMLAudioElement;
  bigJump: HTMLAudioElement;
  breakBlock: HTMLAudioElement;
  bump: HTMLAudioElement;
  coin: HTMLAudioElement;
  fireball: HTMLAudioElement;
  flagpole: HTMLAudioElement;
  kick: HTMLAudioElement;
  pipe: HTMLAudioElement;
  itemAppear: HTMLAudioElement;
  powerup: HTMLAudioElement;
  stomp: HTMLAudioElement;
  gameover: HTMLAudioElement;
  star: HTMLAudioElement;
  oneup: HTMLAudioElement;
  outoftime: HTMLAudioElement;

  constructor() {
    this.smallJump = new Audio('assets/ngx-mario/sounds/jump-small.wav');
    this.bigJump = new Audio('assets/ngx-mario/sounds/jump-super.wav');
    this.breakBlock = new Audio('assets/ngx-mario/sounds/breakblock.wav');
    this.bump = new Audio('assets/ngx-mario/sounds/bump.wav');
    this.coin = new Audio('assets/ngx-mario/sounds/coin.wav');
    this.star = new Audio('assets/ngx-mario/sounds/star.wav');
    this.fireball = new Audio('assets/ngx-mario/sounds/fireball.wav');
    this.flagpole = new Audio('assets/ngx-mario/sounds/flagpole.wav');
    this.kick = new Audio('assets/ngx-mario/sounds/kick.wav');
    this.pipe = new Audio('assets/ngx-mario/sounds/pipe.wav');
    this.itemAppear = new Audio('assets/ngx-mario/sounds/itemAppear.wav');
    this.powerup = new Audio('assets/ngx-mario/sounds/powerup.wav');
    this.stomp = new Audio('assets/ngx-mario/sounds/stomp.wav');
    this.gameover = new Audio('assets/ngx-mario/sounds/gameover.wav');
    this.oneup = new Audio('assets/ngx-mario/sounds/1up.wav');
    this.outoftime = new Audio('assets/ngx-mario/sounds/smb_warning.wav');
  }
}
