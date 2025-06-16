import { Input } from './input';
import { Level } from './levels/level';
import { Music } from './music';
import { Player } from './entities/player';
import { Resources } from './resources';
import { Sounds } from './sounds';
import { Sprite } from './sprites/sprite';
import { Sprites } from './sprites/sprites';
import { SpriteType } from './sprites/sprite_type';
import { PositionText } from './texts/position_text';
import { Enemy } from './entities/enemy';
import { oneone } from './levels/1-1/1-1';
import { menu } from './levels/menu';
import { Position } from './position';

export class Game {
  private static canvas: HTMLCanvasElement;
  private static lastTime: number;
  private static gameTime = 0;
  private static currentTime = 0;
  private static maxTime = 400;
  private static updateables: any[] = [];

  static ctx: CanvasRenderingContext2D;
  static vX = 0;
  static vY = 0;
  static vWidth = 256;
  static vHeight = 240;

  static level: Level;
  static player: Player;
  static sounds: Sounds = new Sounds();
  static music: Music = new Music();
  static input: Input = new Input();
  static fireballs: any[] = [];
  static hudCoinSprite: Sprite = Sprites.get(SpriteType.hudCoin);

  static initialize(canvas: HTMLCanvasElement): void {
    Input.initialize();
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d')!;
    this.resizeByRatio(this.canvas);
    const scaleX = this.canvas.clientWidth / this.vWidth;
    const scaleY = this.canvas.clientHeight / this.vHeight;
    this.ctx.scale(scaleX, scaleY);

    Game.player = new Player([0, 0]);

    Resources.load([
      'assets/ngx-mario/sprites/player.png',
      'assets/ngx-mario/sprites/enemy.png',
      'assets/ngx-mario/sprites/tiles.png',
      'assets/ngx-mario/sprites/playerl.png',
      'assets/ngx-mario/sprites/items.png',
      'assets/ngx-mario/sprites/enemyr.png',
      'assets/ngx-mario/sprites/castle.png',
      'assets/ngx-mario/sprites/titlescreen.png',
    ]);

    const font = new FontFace(
      'MyFont',
      'url(/assets/ngx-mario/fonts/pixel-emulator.otf)'
    );
    font.load().then(() => {
      document.fonts.add(font);
      Resources.onReady(() => this.init());
    });
  }

  static resizeByRatio(canvas: HTMLCanvasElement): void {
    const ratio = this.vWidth / this.vHeight;
    const currentRatio = canvas.clientWidth / canvas.clientHeight;

    let width = canvas.clientWidth;
    let height = canvas.clientHeight;

    if (currentRatio !== ratio) {
      if (currentRatio > ratio) {
        width = Math.floor(height * ratio);
      } else {
        height = Math.floor(width / ratio);
      }
    }

    canvas.width = width;
    canvas.height = height;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
  }

  static resetTime(): void {
    this.gameTime = 0;
    this.lastTime = Date.now();
  }

  static init(): void {
    this.resetTime();
    menu();
    this.lastTime = Date.now();
    this.mainLoop();
  }

  private static mainLoop(): void {
    const now = Date.now();
    const dt = (now - this.lastTime) / 1000;
    this.update(dt);
    if (!Game.player.exiting)
      this.currentTime = Math.max(0, Math.floor(this.maxTime - this.gameTime));
    this.render();
    this.manageTime();
    this.lastTime = now;
    //this.drawDebugLines();
    this.requestAnimFrame(() => this.mainLoop());
  }

  private static manageTime(): void {
    if (Game.level.world === 0 || Game.level.static) return;

    if (this.currentTime === 0 && !Game.player.dying && !Game.player.exiting) {
      Game.player.die();
    }

    if (
      !Game.player.exiting &&
      this.currentTime === 100 &&
      !Game.music.speededUp
    ) {
      Game.music.speededUp = true;
      Game.music.pause();
      Game.sounds.outoftime.currentTime = 0;
      Game.sounds.outoftime.play();
      Game.sounds.outoftime.onended = () => {
        Game.music.play(true);
        Game.sounds.outoftime.onended = null;
      };
    }

    if (Game.player.exited && Game.player.exiting) {
      if (this.currentTime != 0) {
        this.currentTime--;
        Game.player.score += 50;
      }

      if (this.currentTime == 0 && Game.music.clear.ended) {   
        Game.player.exiting = false;
        setTimeout(() => {
          Game.player.sprite.size =
            Game.player.power === 0 ? [16, 16] : [16, 32];
          Game.player.noInput = false;
          Input.reset();
          if (Game.player.power !== 0) Game.player.pos[1] -= 16;
          Game.music.reset();
          if (Game.level.next) Game.level.next();
          else if (Game.level.loader) Game.level.loader();
          else oneone();
          Game.player.exited = false;
        }, 1000);
      }
    }
  }

  private static drawDebugLines(step: number = 16): void {
    const ctx = this.ctx;
    const { width, height } = ctx.canvas;

    ctx.strokeStyle = 'red';
    ctx.lineWidth = 0.5;

    // Righe verticali
    for (let x = 0; x <= width; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Righe orizzontali
    for (let y = 0; y <= height; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  }

  private static update(dt: number): void {
    this.gameTime += this.player.dying || this.player.exiting || this.player.exited ? 0 : dt / 0.5;

    this.hudCoinSprite.update(dt, this.gameTime);
    this.handleInput(dt);
    this.updateEntities(dt);
    this.checkCollisions();
  }

  private static handleInput(dt: number): void {
    if (Game.level.world === 0 && Input.isDown('ENTER')) {
      this.resetTime();
      oneone();
      this.lastTime = Date.now();
    }

    const player = Game.player;
    if (player.piping || player.dying || player.noInput) return;

    Input.isDown('RUN') ? player.run() : player.noRun();
    Input.isDown('JUMP') ? player.jump() : player.noJump();
    Input.isDown('DOWN') ? player.crouch() : player.noCrouch();

    if (Input.isDown('LEFT')) player.moveLeft();
    else if (Input.isDown('RIGHT')) player.moveRight();
    else player.noWalk();
  }

  private static updateEntities(dt: number): void {
    const player = Game.player;
    player.update(dt, this.vX);

    this.updateables.forEach((ent) => ent.update(dt, this.gameTime));

    const player_vX = player.pos[0] - 80;
    if (player.exiting || player.exited) {
      const max_vX = (Game.level.exit - 7.5) * 16;
      this.vX = Math.min(max_vX, player_vX);
    } else if (Game.level.scrolling && player.pos[0] > this.vX + 80) {
      this.vX = player_vX;
    }

    if (player.powering.length || player.dying) return;

    Game.level.items.forEach((ent: any) => ent.update(dt));
    Game.level.enemies.forEach((ent: any) => ent.update(dt, this.vX));
    Game.fireballs.forEach((fb: any) => fb.update(dt));
    Game.level.pipes.forEach((pipe: any) => pipe.update(dt));
    Game.level.texts.forEach((ent) => ent.update(dt));
  }

  private static checkCollisions(): void {
    const player = Game.player;
    if (player.powering.length || player.dying) return;

    player.checkCollisions();
    Game.level.items.forEach((item) => item.checkCollisions());
    Game.level.enemies.forEach((ent) => ent.checkEnemyCollisions(this.vX));
    Game.fireballs.forEach((fb) => fb.checkCollisions());
    Game.level.pipes.forEach((pipe) => pipe.checkCollisions());
  }

  private static renderHUD(): void {
    const ctx = this.ctx;
    const coins = '00' + Game.player.coins;
    const score = '000000000' + Game.player.score;
    const firstLine = 20;
    const secondLine = 26;
    ctx.font = '8px MyFont, sans-serif';
    ctx.fillStyle = 'white';

    ctx.fillText(`MARIO`, 17, firstLine);
    ctx.fillText(score.substring(score.length - 6), 17, secondLine);

    var coinX = 83;
    var coinY = firstLine - 0.6;
    this.hudCoinSprite.render(ctx, coinX, coinY, 0, 0);
    ctx.fillText(`x${coins.substring(coins.length - 2)}`, 93, secondLine);

    ctx.fillText(`WORLD`, 145, firstLine);
    if (Game.level.world > 0) {
      ctx.fillText(`${Game.level.world}-${Game.level.level}`, 152, secondLine);
    }

    ctx.fillText(`TIME`, 218, firstLine);
    if (Game.level.world > 0 && !Game.level.static && (Game.player.exiting || !Game.player.exited)) {
      const time = this.currentTime;
      const timeStr =
        time < 10 ? `00${time}` : time < 100 ? `0${time}` : `${time}`;
      ctx.fillText(timeStr, 222, secondLine);
    }
  }

  private static render(): void {
    const ctx = this.ctx;
    const player = Game.player;
    this.updateables = [];

    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.fillStyle = Game.level.background;
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.renderHUD();

    for (let i = 0; i < 15; i++) {
      for (
        let j = Math.floor(this.vX / 16) - 1;
        j < Math.floor(this.vX / 16) + 20;
        j++
      ) {
        const scenery = Game.level.scenery[i]?.[j];
        if (scenery) this.renderEntity(scenery);
      }
    }

    Game.level.items.forEach((item) => this.renderEntity(item));
    Game.level.enemies.forEach((enemy) => this.renderEntity(enemy));
    Game.level.texts.forEach((text) => this.renderEntity(text));
    Game.fireballs.forEach((fb) => this.renderEntity(fb));

    for (let i = 0; i < 15; i++) {
      for (
        let j = Math.floor(this.vX / 16) - 1;
        j < Math.floor(this.vX / 16) + 20;
        j++
      ) {
        const staticTile = Game.level.statics[i]?.[j];
        const block = Game.level.blocks[i]?.[j];

        if (staticTile) this.renderEntity(staticTile);
        if (block) {
          this.renderEntity(block);
          this.updateables.push(block);
        }
      }
    }

    if (player.invincibility % 2 === 0) {
      this.renderEntity(player);
    }

    Game.level.pipes.forEach((pipe) => this.renderEntity(pipe));
  }

  private static renderEntity(entity: any): void {
    entity.render(this.ctx, this.vX, this.vY);
  }

  private static requestAnimFrame(callback: FrameRequestCallback): void {
    (
      window.requestAnimationFrame ||
      function (cb: FrameRequestCallback) {
        window.setTimeout(cb, 1000 / 60);
      }
    )(callback);
  }

  static addCoins(amount: number): void {
    Game.sounds.coin.currentTime = 0.05;
    Game.sounds.coin.play();
    let coins = Game.player.coins + amount;
    if (coins > 99) {
      Game.player.score += (coins - 99) * 100;
      coins = 99 - Game.player.coins;
      Game.addLives(Math.floor(coins / 100));
    }
    Game.player.coins = coins;
  }

  static addLives(lives: number): void {
    Game.player.lives += lives;
    Game.sounds.oneup.currentTime = 0;
    Game.sounds.oneup.play();
  }

  static readonly points = [100, 200, 400, 800, 1000, 2000, 4000, 5000, 8000];
  static addScore(amount: number, item: Position, move: boolean = true): void {
    if (item instanceof Enemy) {
      let text = '';
      const lastScore = Game.player.lastPoints;
      if (lastScore > 0) {
        const index = Game.points.indexOf(lastScore);
        if (index >= 0 && index < Game.points.length - 1) {
          amount = Game.points[index + 1];
        } else {
          amount = Game.points[Game.points.length - 1];
          Game.addLives(1);
          text = '1UP';
        }
      } else {
        amount = Game.points[0];
      }
      Game.player.lastPoints = amount;
      text = text || `${amount}`;
      Game.player.score += amount;
      Game.level.texts.push(new PositionText(text, item || Game.player, move));
    } else {
      Game.player.score += amount;
      Game.level.texts.push(
        new PositionText(`${amount}`, item || Game.player, move)
      );
    }
  }
}
