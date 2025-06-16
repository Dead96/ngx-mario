import { SpriteType } from '../sprites/sprite_type';
import { Sprites } from '../sprites/sprites';
import { Prop } from './prop';

export class Castle extends Prop {
  constructor(pos: [number, number]) {
    super(
      pos,
      Sprites.get(SpriteType.castle)
    );
  }
}
