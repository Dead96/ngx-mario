import { Entity } from './entity';
import { Fireball } from './fireball';
import { Game } from '../game';
import { Input } from '../input';
import { Sprites } from '../sprites/sprites';
import { SpriteType } from '../sprites/sprite_type';
import { Mushroom } from './mushroom';
import { Fireflower } from './fireflower';
import { Prop } from '../props/prop';
import { Position } from '../position';

export class Player extends Entity {
  power = 0;
  coins = 0;
  lives = 3;
  score = 0;
  lastPoints = 0;
  powering: number[] = [];
  bounce = false;
  jumping = 0;
  canJump = true;
  invincibility = 0;
  crouching = false;
  fireballs = 0;
  runheld = false;
  noInput = false;
  targetPos: [number, number] = [0, 0];
  shooting = 0;
  waiting = 0;
  dying = 0;
  piping = false;
  pipeLoc?: () => void;
  flagging = false;
  exiting = false;
  exited = false;
  starTime = 0;
  touchedItem?: number;
  maxSpeed: number = 0;
  moveAcc: number = 0;

  // Power-up animation helpers
  powerSprites: [number, number][] = [];
  powerSizes: [number, number][] = [];
  shift: number[] = [];

  constructor(pos: [number, number]) {
    super({
      pos,
      sprite: Sprites.get(SpriteType.mario),
      hitbox: [0, 0, 16, 16],
    });
  }

  run(): void {
    this.maxSpeed = 2.5;
    if (this.power === 2 && !this.runheld) {
      this.shoot();
    }
    this.runheld = true;
  }

  shoot(): void {
    if (this.fireballs >= 2) return;
    this.fireballs++;
    const fb = new Fireball([this.pos[0] + 8, this.pos[1]]);
    fb.spawn(this.left);
    this.shooting = 2;
  }

  noRun(): void {
    this.maxSpeed = 1.5;
    this.moveAcc = 0.07;
    this.runheld = false;
  }

  moveRight(): void {
    if (this.vel[1] === 0 && this.standing) {
      if (this.crouching) {
        this.noWalk();
        return;
      }
      this.acc[0] = this.moveAcc;
      this.left = false;
    } else {
      this.acc[0] = this.moveAcc;
    }
  }

  moveLeft(): void {
    if (this.vel[1] === 0 && this.standing) {
      if (this.crouching) {
        this.noWalk();
        return;
      }
      this.acc[0] = -this.moveAcc;
      this.left = true;
    } else {
      this.acc[0] = -this.moveAcc;
    }
  }

  noWalk(): void {
    this.maxSpeed = 0;
    if (this.vel[0] === 0) return;

    if (Math.abs(this.vel[0]) <= 0.1) {
      this.vel[0] = 0;
      this.acc[0] = 0;
    }
  }

  crouch(): void {
    this.crouching = this.power > 0 && this.standing;
  }

  noCrouch(): void {
    this.crouching = false;
  }

  jump(): void {
    if (this.vel[1] > 0) return;

    if (this.jumping > 0) {
      this.jumping--;
    } else if (this.standing && this.canJump) {
      this.jumping = 20;
      this.canJump = false;
      this.standing = false;
      this.vel[1] = -6;

      const sound =
        this.power === 0 ? Game.sounds.smallJump : Game.sounds.bigJump;
      sound.currentTime = 0;
      sound.play();
    }
  }

  noJump(): void {
    this.canJump = true;
    if (this.jumping) {
      if (this.jumping <= 16) {
        this.vel[1] = 0;
        this.jumping = 0;
      } else {
        this.jumping--;
      }
    }
  }

  setAnimation(): void {
    if (this.dying) return;

    // Invincibility flicker animation
    if (this.starTime) {
      const index =
        this.starTime > 60
          ? Math.floor(this.starTime / 2) % 3
          : Math.floor(this.starTime / 8) % 3;

      this.sprite.pos[1] = Game.level.invincibility[index];
      if (this.power === 0) this.sprite.pos[1] += 32;
      this.starTime--;

      if (this.starTime === 0) {
        this.sprite.pos[1] = [32, 0, 96][this.power] || 0;
        Game.music.play();
        Game.sounds.star.pause();
      }
    }

    if (this.crouching) {
      this.sprite.pos[0] = 176;
      this.sprite.speed = 0;
      return;
    }

    if (this.jumping) {
      this.sprite.pos[0] = 160;
      this.sprite.speed = 0;
    } else if (this.standing) {
      if (Math.abs(this.vel[0]) > 0) {
        if (this.vel[0] * this.acc[0] >= 0) {
          this.sprite.pos[0] = 96;
          this.sprite.frames = [0, 1, 2];
          this.sprite.speed = this.vel[0] < 0.2 ? 5 : Math.abs(this.vel[0]) * 8;
        } else if (
          (this.vel[0] > 0 && this.left) ||
          (this.vel[0] < 0 && !this.left)
        ) {
          this.sprite.pos[0] = 144;
          this.sprite.speed = 0;
        }
      } else {
        this.sprite.pos[0] = 80;
        this.sprite.speed = 0;
      }

      if (this.shooting) {
        this.sprite.pos[0] += 160;
        this.shooting--;
      }
    }

    if (this.flagging) {
      this.sprite.pos[0] = 192;
      this.sprite.frames = this.vel[1] === 0 ? [0] : [0, 1];
      this.sprite.speed = 10;
    }

    this.sprite.img = this.left
      ? 'assets/ngx-mario/sprites/playerl.png'
      : 'assets/ngx-mario/sprites/player.png';
  }

  update(dt: number, vX: number): void {
    // Powering animation
    if (this.powering.length > 0) {
      const next = this.powering.shift();
      if (next === 5) return;

      this.sprite.pos = this.powerSprites[next!];
      this.sprite.size = this.powerSizes[next!];
      this.pos[1] += this.shift[next!];

      if (this.powering.length === 0 && this.touchedItem !== undefined) {
        delete Game.level.items[this.touchedItem];
      }
      return;
    }

    if (this.invincibility > 0) {
      this.invincibility -= Math.round(dt * 60);
    }

    if (this.waiting > 0) {
      this.waiting -= dt;
      if (this.waiting > 0) return;
      this.waiting = 0;
    }

    if (this.bounce) {
      this.bounce = false;
      this.standing = false;
      this.vel[1] = -3;
    }

    if (this.pos[0] <= vX) {
      this.pos[0] = vX;
      this.vel[0] = Math.max(this.vel[0], 0);
    }

    if (Math.abs(this.vel[0]) > this.maxSpeed) {
      this.vel[0] -= 0.05 * Math.sign(this.vel[0]);
      this.acc[0] = 0;
    }

    if (this.dying) {
      if (this.pos[1] < this.targetPos[1]) this.vel[1] = 1;
      this.dying -= dt;
      if (this.dying < 0) {
        Input.reset();
      }
    } else {
      this.acc[1] = 0.25;
      if (this.pos[1] > 240) this.die();
    }

    if (this.piping && this.pipeLoc) {
      this.acc = [0, 0];
      const [px, py] = [Math.round(this.pos[0]), Math.round(this.pos[1])];
      if (px === this.targetPos[0] && py === this.targetPos[1]) {
        this.piping = false;
        this.pipeLoc();
      }
    }

    if (this.flagging) {
      this.acc = [0, 0];
    }

    if (this.exiting) {
      this.left = false;
      this.flagging = false;
      this.vel[0] = 1.5;
      if (this.pos[0] >= this.targetPos[0]) {
        this.sprite.size = [0, 0];
        this.vel = [0, 0];
        if (!this.exited) {
          this.exited = true;
        }
      }
    }

    this.vel[0] += this.acc[0];
    this.vel[1] += this.acc[1];
    this.pos[0] += this.vel[0];
    this.pos[1] += this.vel[1];

    if (this.standing && !this.starTime)
      this.lastPoints = 0;

    this.setAnimation();
    this.sprite.update(dt);
  }

  override checkCollisions(): void {
    if (this.piping || this.dying) return;

    const h = this.power > 0 ? 2 : 1;
    const w = this.pos[0] % 16 !== 0 ? 2 : 1;
    const hh = this.pos[1] % 16 !== 0 ? h + 1 : h;

    const baseX = Math.floor(this.pos[0] / 16);
    const baseY = Math.floor(this.pos[1] / 16);

    for (let i = 0; i < hh; i++) {
      if (baseY + i < 0 || baseY + i >= 15) continue;
      for (let j = 0; j < w; j++) {
        Game.level.statics[baseY + i][baseX + j]?.isCollideWith(this);
        Game.level.blocks[baseY + i][baseX + j]?.isCollideWith(this);
      }
    }
  }

  powerUp(idx: number, ent: Entity): void {
    Game.sounds.powerup.play();
    this.powering = [
      0, 5, 2, 5, 1, 5, 2, 5, 1, 5, 2, 5, 3, 5, 1, 5, 2, 5, 3, 5, 1, 5, 4,
    ];
    this.touchedItem = idx;

    let score = 0;
    if (ent instanceof Mushroom && this.power === 0) {
      score = 1000;
      this.sprite.pos[0] = 80;
      var newy = this.sprite.pos[1] - 32;
      this.powerSprites = [
        [80, newy + 32],
        [80, newy + 32],
        [320, newy],
        [80, newy],
        [128, newy],
      ];
      this.powerSizes = [
        [16, 16],
        [16, 16],
        [16, 32],
        [16, 32],
        [16, 32],
      ];
      this.shift = [0, 16, -16, 0, -16];
      this.power = 1;
      this.hitbox = [0, 0, 16, 32];
    } else if (ent instanceof Fireflower && this.power < 2) {
      score = 2000;
      this.sprite.pos[0] = 80;
      var newy = this.sprite.pos[1] - 32;
      var curx = this.sprite.pos[0];
      this.powerSprites = [
        [curx, 96],
        [curx, Game.level.invincibility[0]],
        [curx, Game.level.invincibility[1]],
        [curx, Game.level.invincibility[2]],
        [curx, 96],
      ];
      this.powerSizes = [
        [16, 32],
        [16, 32],
        [16, 32],
        [16, 32],
        [16, 32],
      ];
      this.shift = this.power < 1 ? [0, 16, -16, 0, -16] : [0, 0, 0, 0, 0];
      this.power = 2;
      this.hitbox = [0, 0, 16, 32];
    } else {
      this.powering = [];
      delete Game.level.items[idx];
      score = 5000;
      //no animation, but we play the sound and you get 5000 points.
    }
    Game.addScore(score, this);
  }

  damage(): void {
    if (this.power === 0) {
      this.die();
    } else {
      Game.sounds.pipe.play();
      this.powering = [
        0, 5, 1, 5, 2, 5, 1, 5, 2, 5, 1, 5, 2, 5, 1, 5, 2, 5, 1, 5, 2, 5, 3,
      ];
      this.shift = [0, 16, -16, 16];
      this.sprite.pos = [160, 0];
      this.powerSprites = [
        [160, 0],
        [240, 32],
        [240, 0],
        [160, 32],
      ];
      this.powerSizes = [
        [16, 32],
        [16, 16],
        [16, 32],
        [16, 16],
      ];
      this.invincibility = 120;
      this.power = 0;
      this.hitbox = [0, 0, 16, 16];
    }
  }

  die(): void {
    console.log('Player died');

    Game.music.pause();
    Game.sounds.star.pause();
    Game.music.death.play();

    this.noWalk();
    this.noRun();
    this.noJump();

    this.acc[0] = 0;
    this.sprite.pos = [176, 32];
    this.sprite.speed = 0;
    this.power = 0;
    this.waiting = 0.5;
    this.dying = 2;

    if (this.pos[1] < 240) {
      this.targetPos = [this.pos[0], this.pos[1] - 128];
      this.vel = [0, -5];
    } else {
      this.vel = [0, 0];
      this.targetPos = [this.pos[0], this.pos[1] - 16];
    }

    setTimeout(() => {
      const lives = Game.player.lives - 1;
      const coins = Game.player.coins;
      const score = Game.player.score;
      Game.player = new Player([16 * 16, 0]);
      Game.player.coins = coins;
      Game.player.score = score;
      Game.player.lives = lives;
      Input.reset();
      Game.resetTime();
      if (Game.level.loader) Game.level.loader();
    }, 4000);
  }

  star(idx: number): void {
    delete Game.level.items[idx];
    Game.sounds.star.currentTime = 0;
    Game.sounds.star.play();
    setTimeout(() => {
      Game.music.pause();
    }, 75);
    Game.addScore(1000, this);
    this.starTime = 660;
  }

  pipe(
    direction: 'LEFT' | 'RIGHT' | 'UP' | 'DOWN',
    destination: () => void
  ): void {
    Game.sounds.pipe.play();
    this.piping = true;
    this.pipeLoc = destination;

    const move: [number, number] = {
      LEFT: [-1, 0] as [number, number],
      RIGHT: [1, 0] as [number, number],
      DOWN: [0, 1] as [number, number],
      UP: [0, -1] as [number, number],
    }[direction];

    this.vel = move;
    const offsetY =
      direction === 'UP' || direction === 'DOWN' ? this.hitbox[3] : 0;
    this.targetPos = [
      Math.round(this.pos[0] + move[0] * (offsetY || 16)),
      Math.round(this.pos[1] + move[1] * (offsetY || 16)),
    ];
  }

  flag(): void {
    this.noInput = true;
    this.flagging = true;
    this.vel = [0, 2];
    this.acc = [0, 0];
    const flagpoleBaseY = 192;
    const flagpolePlayerY = flagpoleBaseY - this.pos[1];
    const score = this.getFlagScore(flagpolePlayerY);
    Game.addScore(score, new Position([this.pos[0] + 12, this.pos[1]]), false);
  }

  getFlagScore(flagpolePlayerY: number): number {
    if (flagpolePlayerY <= 17) return 100;
    if (flagpolePlayerY <= 57) return 400;
    if (flagpolePlayerY <= 81) return 800;
    if (flagpolePlayerY <= 127) return 2000;
    if (flagpolePlayerY <= 153) return 4000;
    return 5000;
  }

  exit(): void {
    this.pos[0] += 16;
    this.targetPos = [Game.level.exit * 16, this.pos[1]];
    this.left = true;
    this.setAnimation();
    this.waiting = 1;
    this.exiting = true;
  }
}
