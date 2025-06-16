import { Entity } from './entity';
import { Game } from '../game';
import { Sprites } from '../sprites/sprites';
import { SpriteType } from '../sprites/sprite_type';

export class Bcoin extends Entity {
  public idx!: number;
  public active: boolean = false;
  public targetpos!: number;
  private coinAdded: boolean = false;

  constructor(pos: [number, number]) {
    super({
      pos: pos,
      sprite: Sprites.get(SpriteType.bcoin),
      hitbox: [0, 0, 16, 16],
    });
  }

  spawn(ent: Entity): void {
    Game.sounds.coin.currentTime = 0.05;
    Game.sounds.coin.play();

    Game.addCoins(1);
    Game.addScore(100, ent);

    this.idx = Game.level.items.length;
    Game.level.items.push(this);

    this.active = true;
    this.vel[0] = -12;
    this.targetpos = this.pos[1] - 32;
  }

  update(dt: number): void {
    if (!this.active) return;

    if (!this.coinAdded) {
      this.coinAdded = true;
    }

    if (this.vel[0] > 0 && this.pos[1] >= this.targetpos) {
      delete Game.level.items[this.idx];
      return;
    }

    this.acc[0] = 0.75;
    this.vel[0] += this.acc[0];
    this.pos[1] += this.vel[0];
    this.sprite.update(dt);
  }

  override checkCollisions(): void {
    // No collisions for Bcoin
  }
}
