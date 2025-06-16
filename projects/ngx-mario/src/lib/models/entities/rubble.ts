import { Entity } from "./entity";
import { Game } from "../game";
import { Sprite } from "../sprites/sprite";
import { Sprites } from "../sprites/sprites";
import { SpriteType } from "../sprites/sprite_type";

export class Rubble extends Entity {
  private sprites: (Sprite | undefined)[] = [];
  private poss: [number, number][] = [];
  private vels: [number, number][] = [];
  private idx?: number;

  constructor() {
    super({
      pos: [0, 0],
      sprite: Sprites.get(SpriteType.rubble),
      hitbox: [0, 0, 16, 16],
    });
  }

  spawn(pos: [number, number]): void {
    this.idx = Game.level.items.length;
    Game.level.items.push(this);

    for (let i = 0; i < 4; i++) {
      this.sprites[i] = Sprites.get(SpriteType.rubble); // Assume restituisce un oggetto Sprite
    }

    this.poss[0] = pos;
    this.poss[1] = [pos[0] + 8, pos[1]];
    this.poss[2] = [pos[0], pos[1] + 8];
    this.poss[3] = [pos[0] + 8, pos[1] + 8];

    this.vels[0] = [-1.25, -5];
    this.vels[1] = [1.25, -5];
    this.vels[2] = [-1.25, -3];
    this.vels[3] = [1.25, -3];
  }

  update(dt: number): void {
    for (let i = 0; i < 4; i++) {
      const sprite = this.sprites[i];
      if (!sprite) continue;

      this.vels[i][1] += 0.3;
      this.poss[i][0] += this.vels[i][0];
      this.poss[i][1] += this.vels[i][1];
      sprite.update(dt);

      if (this.poss[i][1] > 256) {
        this.sprites[i] = undefined;
      }
    }

    if (this.sprites.every((sprite) => sprite === undefined)) {
      if (this.idx !== undefined) {
        delete Game.level.items[this.idx];
      }
    }
  }

  override checkCollisions(): void {
    // intentionally left blank
  }

  override render(ctx: CanvasRenderingContext2D, vX: number, vY: number): void {
    for (let i = 0; i < 4; i++) {
      const sprite = this.sprites[i];
      if (!sprite) continue;
      sprite.render(ctx, this.poss[i][0], this.poss[i][1], vX, vY);
    }
  }
}