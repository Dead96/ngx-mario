import { Resources } from "../resources";
import { SpriteType } from "./sprite_type";

export class Sprite {
  type: SpriteType;
  pos: [number, number];
  size: [number, number];
  speed: number;
  img: string;
  once: boolean;
  frames: number[];
  done: boolean = false;
  private _index: number = 0;
  private lastUpdated?: number;

  constructor(
    type: SpriteType,
    img: string,
    pos: [number, number],
    size: [number, number],
    speed: number,
    frames?: number[],
    once: boolean = false,
  ) {
    this.type = type;
    this.pos = pos;
    this.size = size;
    this.speed = speed;
    this.img = img;
    this.once = once;
    this.frames = frames ?? [];
  }

  update(dt: number, gameTime?: number): void {
    if (gameTime !== undefined && gameTime === this.lastUpdated) return;
    this._index += this.speed * dt;
    if (gameTime !== undefined) this.lastUpdated = gameTime;
  }

  setFrame(frame: number): void {
    this._index = frame;
  }

  render(
    ctx: CanvasRenderingContext2D,
    posx: number,
    posy: number,
    vX: number,
    vY: number
  ): void {
    let frame: number;

    if (this.speed > 0) {
      const max = this.frames.length;
      const idx = Math.floor(this._index);
      frame = this.frames[idx % max];

      if (this.once && idx >= max) {
        this.done = true;
        return;
      }
    } else {
      frame = 0;
    }

    let x = this.pos[0];
    let y = this.pos[1];
    x += frame * this.size[0];

    const img = Resources.get(this.img);
    ctx.drawImage(
      img,
      x + 1 / 3,
      y + 1 / 3,
      this.size[0] - 2 / 3,
      this.size[1] - 2 / 3,
      Math.round(posx - vX),
      Math.round(posy - vY),
      this.size[0],
      this.size[1]
    );
  }
}