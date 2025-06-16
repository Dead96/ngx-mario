import { Entity } from './entity';
import { Game } from '../game';
import { Sprites } from '../sprites/sprites';
import { SpriteType } from '../sprites/sprite_type';

export class Fireflower extends Entity {
  spawning: number;
  waiting: number;
  targetpos: number[];
  idx: number;

  constructor(pos: [number, number]) {
    super({
      pos: pos,
      sprite: Sprites.get(SpriteType.fireFlower),
      hitbox: [0, 0, 16, 16],
    });
    this.spawning = 0;
    this.waiting = 0;
    this.targetpos = [];
    this.idx = 0;
  }

  override render(ctx: CanvasRenderingContext2D, vX: number, vY: number): void {
    if (typeof this.spawning === 'number' && this.spawning > 1) return;
    this.sprite.render(ctx, this.pos[0], this.pos[1], vX, vY);
  }

  spawn(): void {
    Game.sounds.itemAppear.play();
    this.idx = Game.level.items.length;
    Game.level.items.push(this);
    this.spawning = 12;
    this.targetpos = [];
    this.targetpos[0] = this.pos[0];
    this.targetpos[1] = this.pos[1] - 16;
  }

  update(dt: number): void {
    if (this.spawning > 1) {
      this.spawning -= 1;
      if (this.spawning == 1) this.vel[1] = -0.5;
      return;
    }
    if (this.spawning) {
      if (this.pos[1] <= this.targetpos[1]) {
        this.pos[1] = this.targetpos[1];
        this.vel[1] = 0;
        this.spawning = 0;
      }
    }

    this.vel[1] += this.acc[1];
    this.pos[0] += this.vel[0];
    this.pos[1] += this.vel[1];
    this.sprite.update(dt);
  }

  override checkCollisions(): void {
    if (this.spawning) {
      return;
    }
    this.isPlayerCollided();
  }

  isPlayerCollided(): void {
    var hpos1 = [this.pos[0] + this.hitbox[0], this.pos[1] + this.hitbox[1]];
    var hpos2 = [
      Game.player.pos[0] + Game.player.hitbox[0],
      Game.player.pos[1] + Game.player.hitbox[1],
    ];

    //if the hitboxes actually overlap
    if (
      !(
        hpos1[0] > hpos2[0] + Game.player.hitbox[2] ||
        hpos1[0] + this.hitbox[2] < hpos2[0]
      )
    ) {
      if (
        !(
          hpos1[1] > hpos2[1] + Game.player.hitbox[3] ||
          hpos1[1] + this.hitbox[3] < hpos2[1]
        )
      ) {
        Game.player.powerUp(this.idx, this);
      }
    }
  }

  override bump(): void {
    // No-op by design
  }
}
