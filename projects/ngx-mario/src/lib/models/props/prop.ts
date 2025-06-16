import { Position } from "../position";
import { Sprite } from "../sprites/sprite";

export class Prop extends Position {
  sprite: Sprite | null;

  constructor(pos: [number, number], sprite: Sprite) {
    super(pos);
    this.sprite = sprite;
  }

  render(ctx: CanvasRenderingContext2D, vX: number, vY: number): void {
    this.sprite?.render(ctx, this.pos[0], this.pos[1], vX, vY);
  }
}