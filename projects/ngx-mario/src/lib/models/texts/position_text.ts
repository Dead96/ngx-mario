import { Entity } from '../entities/entity';
import { Game } from '../game';
import { Position } from '../position';
import { Text } from './text';

export class PositionText extends Text {
  private static readonly deltaX: number = 8;
  private static readonly deltaY: number = 2
  private itemPos: [number, number];
  private lastDt: number = 0;
  private move: boolean;

  constructor(text: string, item: Position, move: boolean = true) {
    super([item.pos[0] + PositionText.deltaX, item.pos[1] - PositionText.deltaY], text, { size: 6, color: 'white' });
    this.itemPos = item.pos;
    this.lastDt = Date.now().valueOf();
    this.move = move;
  }

  override update(_: number): void {
    const dt = Date.now().valueOf();
    const delta = dt - this.lastDt;
    const moveY = this.move ? delta * 0.02 : 0;

    if (moveY > 12) {
      var idx = Game.level.texts.indexOf(this);
      if (idx > -1) {
        Game.level.texts.splice(idx, 1); // Remove text if it goes off-screen
      }
    } else {
      this.pos[0] = this.itemPos[0] + PositionText.deltaX; // Move text with the camera
      this.pos[1] = this.itemPos[1] - PositionText.deltaY - moveY // Move text upwards slowly
    }
  }
}
