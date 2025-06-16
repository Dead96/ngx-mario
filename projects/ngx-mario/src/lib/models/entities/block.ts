import { Floor } from './floor';
import { Game } from '../game';
import { Rubble } from './rubble';
import { Sprite } from '../sprites/sprite';
import { Entity } from './entity';

export interface BlockOptions {
  pos: [number, number];
  sprite: Sprite;
  usedSprite: Sprite;
  bounceSprite?: Sprite;
  breakable?: boolean;
  invisible?: boolean;
  item?: { spawn: () => void };
}

export class Block extends Floor {
  public item?: { spawn: (ent: Entity) => void };
  public usedSprite: Sprite;
  public bounceSprite?: Sprite;
  public breakable: boolean;

  private opos?: [number, number];
  private osprite?: Sprite;

  constructor(options: BlockOptions) {
    super(
      options.pos,
      options.sprite,
      [0, 0, 16, 16],
      options.invisible,
    );

    this.item = options.item;
    this.invisible = options.invisible ?? false;
    this.usedSprite = options.usedSprite;
    this.bounceSprite = options.bounceSprite;
    this.breakable = options.breakable ?? false;
  }

  break(): void {
    Game.sounds.breakBlock.play();
    new Rubble().spawn(this.pos);
    const x = this.pos[0] / 16;
    const y = this.pos[1] / 16;
    delete Game.level.blocks[y][x];
  }

  override bonk(power: number): void {
    Game.sounds.bump.play();
    if (power > 0 && this.breakable) {
      this.break();
    } else if (this.standing) {
      this.standing = false;

      if (this.item) {
        this.item.spawn(this);
        this.item = undefined;
      }

      this.opos = [this.pos[0], this.pos[1]];

      if (this.bounceSprite) {
        this.osprite = this.sprite;
        this.sprite = this.bounceSprite;
      } else {
        this.sprite = this.usedSprite;
      }

      this.vel[1] = -2;
    }
  }

  override isCollideWith(ent: any): void {
    super.isCollideWith(ent, true);
  }

  update(dt: number, gameTime: number): void {
    if (!this.standing && this.opos) {
      if (this.pos[1] < this.opos[1] - 8) {
        this.vel[1] = 2;
      }
      if (this.pos[1] > this.opos[1]) {
        this.vel[1] = 0;
        this.pos = [this.opos[0], this.opos[1]];
        if (this.osprite) {
          this.sprite = this.osprite;
        }
        this.standing = true;
      }
    } else {
      if (this.sprite === this.usedSprite) {
        const x = this.pos[0] / 16;
        const y = this.pos[1] / 16;
        Game.level.statics[y][x] = new Floor(this.pos, this.usedSprite);
        delete Game.level.blocks[y][x];
      }
    }

    this.pos[1] += this.vel[1];
    this.sprite.update(dt, gameTime);
  }
}
