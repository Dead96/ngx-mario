import { Floor } from '../entities/floor';
import { Prop } from '../props/prop';
import { Coin } from '../entities/coin';
import { Goomba } from '../entities/goomba';
import { Koopa } from '../entities/koopa';
import { Direction, Pipe } from '../pipe';
import { Block } from '../entities/block';
import { Flag } from '../entities/flag';
import { Sprites } from '../sprites/sprites';
import { Entity } from '../entities/entity';
import { Enemy } from '../entities/enemy';
import { SpriteType } from '../sprites/sprite_type';
import { Text } from '../texts/text';
import { Sprite } from '../sprites/sprite';

export type LevelFn = () => void;

export interface LevelOptions {
  playerPos: [number, number];
  scrolling: boolean;
  loader?: LevelFn;
  next?: LevelFn;
  background: string;
  world: number;
  level: number;
  static?: boolean;
  exit?: number;
  invincibility?: number[];
}

export class Level {
  playerPos: [number, number] = [0, 0];
  scrolling: boolean = false;
  static: boolean = false; // If true, the level is static and does not scroll
  loader?: LevelFn;
  next?: LevelFn;
  background: string = '';
  exit: number = -1; // -1 means no exit
  world: number;
  level: number;
  invincibility: number[] = [];
  statics: Floor[][];
  scenery: Prop[][];
  texts: Text[] = [];
  blocks: Block[][];
  enemies: Enemy[];
  items: Entity[];
  pipes: Pipe[];

  constructor(options: LevelOptions) {
    this.playerPos = options.playerPos;
    this.scrolling = options.scrolling;
    this.world = options.world;
    this.level = options.level;
    this.loader = options.loader;
    this.next = options.next;
    this.background = options.background;
    this.exit = options.exit ?? -1; // Default to -1 if not provided
    this.invincibility = options.invincibility ?? [];
    this.static = options.static ?? false;

    this.statics = Array.from({ length: 15 }, () => []);
    this.scenery = Array.from({ length: 15 }, () => []);
    this.blocks = Array.from({ length: 15 }, () => []);

    this.enemies = [];
    this.items = [];
    this.pipes = [];
  }

  putFloor(start: number, end: number, underground: boolean = false): void {
    for (let i = start; i < end; i++) {
      this.statics[13][i] = new Floor([16 * i, 208], Sprites.get(underground ? SpriteType.floor_underground : SpriteType.floor));
      this.statics[14][i] = new Floor([16 * i, 224], Sprites.get(underground ? SpriteType.floor_underground : SpriteType.floor));
    }
  }

  putGoomba(x: number, y: number): void {
    this.enemies.push(new Goomba([16 * x, 16 * y], Sprites.get(SpriteType.goomba)));
  }

  putKoopa(x: number, y: number): void {
    this.enemies.push(new Koopa([16 * x, 16 * y], Sprites.get(SpriteType.koopa), false));
  }

  putWall(x: number, y: number, height: number, underground: boolean = false): void {
    for (let i = y - height; i < y; i++) {
      this.statics[i][x] = new Floor([16 * x, 16 * i], Sprites.get(underground ? SpriteType.wall_underground : SpriteType.wall));
    }
  }

  putPipe(x: number, y: number, height: number): void {
    for (let i = y - height; i < y; i++) {
      if (i === y - height) {
        this.statics[i][x] = new Floor([16 * x, 16 * i], Sprites.get(SpriteType.pipeLEnd));
        this.statics[i][x + 1] = new Floor(
          [16 * x + 16, 16 * i],
          Sprites.get(SpriteType.pipeREnd)
        );
      } else {
        this.statics[i][x] = new Floor([16 * x, 16 * i], Sprites.get(SpriteType.pipeLMid));
        this.statics[i][x + 1] = new Floor(
          [16 * x + 16, 16 * i],
          Sprites.get(SpriteType.pipeRMid)
        );
      }
    }
  }

  putLeftPipe(x: number, y: number): void {
    this.statics[y][x] = new Floor([16 * x, 16 * y], Sprites.get(SpriteType.pipeLeft));
    this.statics[y + 1][x] = new Floor(
      [16 * x, 16 * (y + 1)],
      Sprites.get(SpriteType.lPipe1)
    );
    this.statics[y][x + 1] = new Floor(
      [16 * (x + 1), 16 * y],
      Sprites.get(SpriteType.lPipe2)
    );
    this.statics[y + 1][x + 1] = new Floor(
      [16 * (x + 1), 16 * (y + 1)],
      Sprites.get(SpriteType.lPipe3)
    );
    this.statics[y][x + 2] = new Floor(
      [16 * (x + 2), 16 * y],
      Sprites.get(SpriteType.lPipe4)
    );
    this.statics[y + 1][x + 2] = new Floor(
      [16 * (x + 2), 16 * (y + 1)],
      Sprites.get(SpriteType.lPipe4)
    );
  }

  putCoin(x: number, y: number): void {
    this.items.push(new Coin([16 * x, 16 * y], Sprites.get(SpriteType.coin)));
  }

  putCloud(x: number, y: number): void {
    this.scenery[y][x] = new Prop([16 * x, 16 * y], Sprites.get(SpriteType.cloud));
  }

  putQBlock(x: number, y: number, item: any, invisible: boolean = false): void {
    this.blocks[y][x] = new Block({
      pos: [16 * x, 16 * y],
      item: item,
      invisible: invisible,
      sprite: invisible ? Sprites.get(SpriteType.invisibleQBlock) : Sprites.get(SpriteType.qblock),
      usedSprite: Sprites.get(SpriteType.ublock),
    });
  }

  putBrick(x: number, y: number, item: any): void {
    this.blocks[y][x] = new Block({
      pos: [16 * x, 16 * y],
      item: item,
      sprite: Sprites.get(SpriteType.brick),
      bounceSprite: Sprites.get(SpriteType.brickBounce),
      usedSprite: Sprites.get(SpriteType.ublock),
      breakable: !item,
    });
  }

  putBigHill(x: number, y: number): void {
    const px = x * 16,
      py = y * 16;
    this.scenery[y][x] = new Prop([px, py], Sprites.get(SpriteType.hill0));
    this.scenery[y][x + 1] = new Prop([px + 16, py], Sprites.get(SpriteType.hill3));
    this.scenery[y - 1][x + 1] = new Prop(
      [px + 16, py - 16],
      Sprites.get(SpriteType.hill0)
    );
    this.scenery[y][x + 2] = new Prop([px + 32, py], Sprites.get(SpriteType.hill4));
    this.scenery[y - 1][x + 2] = new Prop(
      [px + 32, py - 16],
      Sprites.get(SpriteType.hill3)
    );
    this.scenery[y - 2][x + 2] = new Prop(
      [px + 32, py - 32],
      Sprites.get(SpriteType.hill1)
    );
    this.scenery[y][x + 3] = new Prop([px + 48, py], Sprites.get(SpriteType.hill5));
    this.scenery[y - 1][x + 3] = new Prop(
      [px + 48, py - 16],
      Sprites.get(SpriteType.hill2)
    );
    this.scenery[y][x + 4] = new Prop([px + 64, py], Sprites.get(SpriteType.hill2));
  }

  putBush(x: number, y: number): void {
    this.scenery[y][x] = new Prop([16 * x, 16 * y], Sprites.get(SpriteType.bush));
  }

  putThreeBush(x: number, y: number): void {
    const px = x * 16,
      py = y * 16;
    this.scenery[y][x] = new Prop([px, py], Sprites.get(SpriteType.bush0));
    this.scenery[y][x + 1] = new Prop([px + 16, py], Sprites.get(SpriteType.bush1));
    this.scenery[y][x + 2] = new Prop([px + 32, py], Sprites.get(SpriteType.bush1));
    this.scenery[y][x + 3] = new Prop([px + 48, py], Sprites.get(SpriteType.bush1));
    this.scenery[y][x + 4] = new Prop([px + 64, py], Sprites.get(SpriteType.bush2));
  }

  putTwoBush(x: number, y: number): void {
    const px = x * 16,
      py = y * 16;
    this.scenery[y][x] = new Prop([px, py], Sprites.get(SpriteType.bush0));
    this.scenery[y][x + 1] = new Prop([px + 16, py], Sprites.get(SpriteType.bush1));
    this.scenery[y][x + 2] = new Prop([px + 32, py], Sprites.get(SpriteType.bush1));
    this.scenery[y][x + 3] = new Prop([px + 48, py], Sprites.get(SpriteType.bush2));
  }

  putSmallHill(x: number, y: number): void {
    const px = x * 16,
      py = y * 16;
    this.scenery[y][x] = new Prop([px, py], Sprites.get(SpriteType.hill0));
    this.scenery[y][x + 1] = new Prop([px + 16, py], Sprites.get(SpriteType.hill3));
    this.scenery[y - 1][x + 1] = new Prop(
      [px + 16, py - 16],
      Sprites.get(SpriteType.hill1)
    );
    this.scenery[y][x + 2] = new Prop([px + 32, py], Sprites.get(SpriteType.hill2));
  }

  putCastle(x: number, y: number): void {
    const px = x * 16,
      py = y * 16;
    this.scenery[y][x] = new Prop([px, py], Sprites.get(SpriteType.castle));
  }

  putTwoCloud(x: number, y: number): void {
    const px = x * 16,
      py = y * 16;
    this.scenery[y][x] = new Prop([px, py], Sprites.get(SpriteType.cloud0));
    this.scenery[y][x + 1] = new Prop([px + 16, py], Sprites.get(SpriteType.cloud1));
    this.scenery[y][x + 2] = new Prop([px + 32, py], Sprites.get(SpriteType.cloud1));
    this.scenery[y][x + 3] = new Prop([px + 48, py], Sprites.get(SpriteType.cloud2));
  }

  putThreeCloud(x: number, y: number): void {
    const px = x * 16,
      py = y * 16;
    this.scenery[y][x] = new Prop([px, py], Sprites.get(SpriteType.cloud0));
    this.scenery[y][x + 1] = new Prop([px + 16, py], Sprites.get(SpriteType.cloud1));
    this.scenery[y][x + 2] = new Prop([px + 32, py], Sprites.get(SpriteType.cloud1));
    this.scenery[y][x + 3] = new Prop([px + 48, py], Sprites.get(SpriteType.cloud1));
    this.scenery[y][x + 4] = new Prop([px + 64, py], Sprites.get(SpriteType.cloud2));
  }

  putRealPipe(
    x: number,
    y: number,
    length: number,
    direction: Direction,
    destination: any
  ): void {
    const px = x * 16;
    const py = y * 16;
    this.pipes.push(
      new Pipe({
        pos: [px, py],
        length,
        direction,
        destination,
      })
    );
  }

  putFlagpole(x: number): void {
    this.statics[12][x] = new Floor([16 * x, 192], Sprites.get(SpriteType.wall));
    for (let i = 3; i < 12; i++) {
      this.scenery[i][x] = new Prop([16 * x, 16 * i], Sprites.get(SpriteType.flagpole1));
    }
    this.scenery[2][x] = new Prop([16 * x, 32], Sprites.get(SpriteType.flagpole0));
    this.items.push(new Flag(16 * x));
  }
}
