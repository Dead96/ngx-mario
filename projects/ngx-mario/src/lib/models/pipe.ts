import { Game } from "./game";
import { Input } from "./input";
import { Player } from "./entities/player";
import { Sprite } from "./sprites/sprite";
import { Sprites } from "./sprites/sprites";
import { SpriteType } from "./sprites/sprite_type";

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

interface PipeOptions {
  pos: [number, number];
  direction: Direction;
  destination?: () => void;
  length: number;
}

export class Pipe {
  pos: [number, number];
  direction: Direction;
  destination?: () => void;
  length: number;
  hitbox: [number, number, number, number];
  midsection: Sprite;
  endsection: Sprite;

  constructor(options: PipeOptions) {
    this.pos = options.pos;
    this.direction = options.direction;
    this.destination = options.destination;
    this.length = options.length;

    if (this.direction === 'UP' || this.direction === 'DOWN') {
      this.hitbox = [0, 0, 32, this.length * 16];
      this.midsection = Sprites.get(SpriteType.pipeUpMid);
      this.endsection = Sprites.get(SpriteType.pipeTop);
    } else {
      this.hitbox = [0, 0, 16 * this.length, 32];
      this.midsection = Sprites.get(SpriteType.pipeSideMid);
      this.endsection = Sprites.get(SpriteType.pipeLeft);
    }
  }

  checkPipe(): void {
    if (!this.destination || !Input.isDown(this.direction)) return;

    const h = Game.player.power === 0 ? 16 : 32;
    const x = Math.floor(Game.player.pos[0]);
    const y = Math.floor(Game.player.pos[1]);

    switch (this.direction) {
      case 'RIGHT':
        if (
          x === this.pos[0] - 16 &&
          y >= this.pos[1] &&
          y + h <= this.pos[1] + 32
        ) {
          Game.player.pipe(this.direction, this.destination);
        }
        break;
      case 'LEFT':
        if (
          x === this.pos[0] + 16 * this.length &&
          y >= this.pos[1] &&
          y + h <= this.pos[1] + 32
        ) {
          Game.player.pipe(this.direction, this.destination);
        }
        break;
      case 'UP':
        if (
          y === this.pos[1] + 16 * this.length &&
          x >= this.pos[0] &&
          x + 16 <= this.pos[0] + 32
        ) {
          Game.player.pipe(this.direction, this.destination);
        }
        break;
      case 'DOWN':
        if (
          y + h === this.pos[1] &&
          x >= this.pos[0] &&
          x + 16 <= this.pos[0] + 32
        ) {
          Game.player.pipe(this.direction, this.destination);
        }
        break;
    }
  }

  checkCollisions(): void {
    for (const ent of Game.level.enemies) this.isCollideWith(ent);
    for (const ent of Game.level.items) this.isCollideWith(ent);
    for (const ent of Game.fireballs) this.isCollideWith(ent);
    if (!Game.player.piping) this.isCollideWith(Game.player);
  }

  isCollideWith(ent: any): void {
    if (!ent || !ent.pos) return;

    const hpos1: [number, number] = [
      Math.floor(this.pos[0] + this.hitbox[0]),
      Math.floor(this.pos[1] + this.hitbox[1])
    ];
    const hpos2: [number, number] = [
      Math.floor(ent.pos[0] + ent.hitbox[0]),
      Math.floor(ent.pos[1] + ent.hitbox[1])
    ];

    const overlapsX = !(hpos1[0] > hpos2[0] + ent.hitbox[2] || hpos1[0] + this.hitbox[2] < hpos2[0]);
    const overlapsY = !(hpos1[1] > hpos2[1] + ent.hitbox[3] || hpos1[1] + this.hitbox[3] < hpos2[1]);

    if (overlapsX && overlapsY) {
      const center = hpos2[0] + ent.hitbox[2] / 2;

      // Entity on top of pipe
      if (Math.abs(hpos2[1] + ent.hitbox[3] - hpos1[1]) <= ent.vel[1]) {
        ent.vel[1] = 0;
        ent.pos[1] = hpos1[1] - ent.hitbox[3] - ent.hitbox[1];
        ent.standing = true;
        if (ent instanceof Player) ent.jumping = 0;
      }
      // Entity under the pipe
      else if (
        Math.abs(hpos2[1] - hpos1[1] - this.hitbox[3]) > ent.vel[1] &&
        center + 2 >= hpos1[0] &&
        center - 2 <= hpos1[0] + this.hitbox[2]
      ) {
        ent.vel[1] = 0;
        ent.pos[1] = hpos1[1] + this.hitbox[3];
        if (ent instanceof Player) ent.jumping = 0;
      }
      // Entity hit from side
      else {
        ent.collideWall(this);
      }
    }
  }

  update(_dt: number): void {
    if (this.destination) {
      this.checkPipe();
    }
  }

  render(ctx: CanvasRenderingContext2D, vX: number, vY: number): void {
    switch (this.direction) {
      case 'DOWN':
        this.endsection.render(ctx, this.pos[0], this.pos[1], vX, vY);
        for (let i = 1; i < this.length; i++) {
          this.midsection.render(ctx, this.pos[0], this.pos[1] + i * 16, vX, vY);
        }
        break;
      case 'UP':
        this.endsection.render(ctx, this.pos[0], this.pos[1] + 16 * (this.length - 1), vX, vY);
        for (let i = 0; i < this.length - 1; i++) {
          this.midsection.render(ctx, this.pos[0], this.pos[1] + i * 16, vX, vY);
        }
        break;
      case 'RIGHT':
        this.endsection.render(ctx, this.pos[0], this.pos[1], vX, vY);
        for (let i = 1; i < this.length; i++) {
          this.midsection.render(ctx, this.pos[0] + 16 * i, this.pos[1], vX, vY);
        }
        break;
      case 'LEFT':
        this.endsection.render(ctx, this.pos[0] + 16 * (this.length - 1), this.pos[1], vX, vY);
        for (let i = 0; i < this.length - 1; i++) {
          this.midsection.render(ctx, this.pos[0] + 16 * i, this.pos[1], vX, vY);
        }
        break;
    }
  }
}