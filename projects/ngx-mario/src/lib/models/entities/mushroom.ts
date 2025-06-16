import { Entity } from "./entity";
import { Fireflower } from "./fireflower";
import { Game } from "../game";
import { Sprites } from "../sprites/sprites";
import { SpriteType } from "../sprites/sprite_type";

export class Mushroom extends Entity {
  spawning: number = 0;
  waiting: number = 0;
  idx?: number;
  targetpos?: [number, number];

  constructor(pos: [number, number]) {
    super({
      pos,
      sprite: Sprites.get(SpriteType.superShroom),
      hitbox: [0, 0, 16, 16]
    });
  }

  override render(ctx: CanvasRenderingContext2D, vX: number, vY: number): void {
    if (this.spawning > 1) return;
    this.sprite.render(ctx, this.pos[0], this.pos[1], vX, vY);
  }

  spawn(): void {
    if (Game.player.power > 0) {
      const ff = new Fireflower(this.pos);
      ff.spawn();
      return;
    }

    Game.sounds.itemAppear.play();
    this.idx = Game.level.items.length;
    Game.level.items.push(this);
    this.spawning = 12;
    this.targetpos = [this.pos[0], this.pos[1] - 16];
  }

  update(dt: number): void {
    if (this.spawning > 1) {
      this.spawning--;
      if (this.spawning === 1) this.vel[1] = -0.5;
      return;
    }

    if (this.spawning) {
      if (this.pos[1] <= (this.targetpos as [number, number])[1]) {
        this.pos[1] = (this.targetpos as [number, number])[1];
        this.vel[1] = 0;
        this.waiting = 5;
        this.spawning = 0;
        this.vel[0] = 1;
      }
    } else {
      this.acc[1] = 0.2;
    }

    if (this.waiting > 0) {
      this.waiting--;
    } else {
      this.vel[1] += this.acc[1];
      this.pos[0] += this.vel[0];
      this.pos[1] += this.vel[1];
      this.sprite.update(dt);
    }
  }

  override collideWall(): void {
    this.vel[0] = -this.vel[0];
  }

  override checkCollisions(): void {
    if (this.spawning) return;

    const h = this.pos[1] % 16 === 0 ? 1 : 2;
    const w = this.pos[0] % 16 === 0 ? 1 : 2;

    const baseX = Math.floor(this.pos[0] / 16);
    const baseY = Math.floor(this.pos[1] / 16);

    if (baseY + h > 15) {
      if (this.idx !== undefined) delete Game.level.items[this.idx];
      return;
    }

    for (let i = 0; i < h; i++) {
      for (let j = 0; j < w; j++) {
        Game.level.statics[baseY + i]?.[baseX + j]?.isCollideWith(this);
        Game.level.blocks[baseY + i]?.[baseX + j]?.isCollideWith(this);
      }
    }

    this.isPlayerCollided();
  }

  isPlayerCollided(): void {
    const hpos1 = [this.pos[0] + this.hitbox[0], this.pos[1] + this.hitbox[1]];
    const hpos2 = [Game.player.pos[0] + Game.player.hitbox[0], Game.player.pos[1] + Game.player.hitbox[1]];

    const overlapX = !(hpos1[0] > hpos2[0] + Game.player.hitbox[2] || hpos1[0] + this.hitbox[2] < hpos2[0]);
    const overlapY = !(hpos1[1] > hpos2[1] + Game.player.hitbox[3] || hpos1[1] + this.hitbox[3] < hpos2[1]);

    if (overlapX && overlapY && this.idx !== undefined) {
      Game.player.powerUp(this.idx, this);
    }
  }

  override bump(): void {
    this.vel[1] = -2;
  }
}