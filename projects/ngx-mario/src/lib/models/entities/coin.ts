import { Entity } from "./entity";
import { Game } from "../game";
import { Sprite } from "../sprites/sprite";

export class Coin extends Entity {
  idx: number;

  constructor(pos: [number, number], sprite: Sprite) {
    super({
      pos,
      sprite,
      hitbox: [0, 0, 16, 16]
    });
    this.idx = Game.level.items.length;
  }

  override render(ctx: CanvasRenderingContext2D, vX: number, vY: number): void {
    this.sprite.render(ctx, this.pos[0], this.pos[1], vX, vY);
  }

  update(dt: number): void {
    this.sprite.update(dt);
  }

  override checkCollisions(): void {
    this.isPlayerCollided();
  }

  isPlayerCollided(): void {
    const hpos1 = [
      this.pos[0] + this.hitbox[0],
      this.pos[1] + this.hitbox[1]
    ];
    const hpos2 = [
      Game.player.pos[0] + Game.player.hitbox[0],
      Game.player.pos[1] + Game.player.hitbox[1]
    ];

    const overlapX =
      !(hpos1[0] > hpos2[0] + Game.player.hitbox[2] ||
        hpos1[0] + this.hitbox[2] < hpos2[0]);

    const overlapY =
      !(hpos1[1] > hpos2[1] + Game.player.hitbox[3] ||
        hpos1[1] + this.hitbox[3] < hpos2[1]);

    if (overlapX && overlapY) {
      this.collect();
    }
  }

  collect(): void {
    Game.addCoins(1);
    Game.player.score += 200;
    delete Game.level.items[this.idx];
  }
}