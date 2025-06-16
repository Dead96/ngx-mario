import { Sprite } from './sprite';
import { SpriteType } from './sprite_type';

export class Sprites {
  static get(type: SpriteType): Sprite {
    switch (type) {
      case SpriteType.mario:
        return new Sprite(type, 'assets/ngx-mario/sprites/player.png', [80, 32], [16, 16], 0, []);
      case SpriteType.coin:
        return new Sprite(type, 'assets/ngx-mario/sprites/items.png', [0, 96], [16, 16], 6, [0, 0, 0, 0, 1, 2, 1]);
      case SpriteType.rubble:
        return new Sprite(type, 'assets/ngx-mario/sprites/items.png', [64, 0], [8, 8], 3, [0, 1]);
      case SpriteType.bcoin:
        return new Sprite(type, 'assets/ngx-mario/sprites/items.png', [0, 112], [16, 16], 20, [0, 1, 2, 3]);
      case SpriteType.goomba:
        return new Sprite(type, 'assets/ngx-mario/sprites/enemy.png', [0, 16], [16, 16], 3, [0, 1]);
      case SpriteType.koopa:
        return new Sprite(type, 'assets/ngx-mario/sprites/enemy.png', [96, 0], [16, 32], 2, [0, 1]);
      case SpriteType.floor:
        return new Sprite(type, 'assets/ngx-mario/sprites/tiles.png', [0, 0], [16, 16], 0);
      case SpriteType.floor_underground:
        return new Sprite(type, 'assets/ngx-mario/sprites/tiles.png', [0, 32], [16, 16], 0);
      case SpriteType.cloud:
        return new Sprite(type, 'assets/ngx-mario/sprites/tiles.png', [0, 320], [48, 32], 0);
      case SpriteType.wall:
        return new Sprite(type, 'assets/ngx-mario/sprites/tiles.png', [0, 16], [16, 16], 0);
      case SpriteType.wall_underground:
        return new Sprite(type, 'assets/ngx-mario/sprites/tiles.png', [32, 32], [16, 16], 0);
      case SpriteType.brick:
        return new Sprite(type, 'assets/ngx-mario/sprites/tiles.png', [16, 0], [16, 16], 0);
      case SpriteType.brickBounce:
        return new Sprite(type, 'assets/ngx-mario/sprites/tiles.png', [32, 0], [16, 16], 0);
      case SpriteType.ublock:
        return new Sprite(type, 'assets/ngx-mario/sprites/tiles.png', [48, 0], [16, 16], 0);
      case SpriteType.superShroom:
        return new Sprite(type, 'assets/ngx-mario/sprites/items.png', [0, 0], [16, 16], 0);
      case SpriteType.fireFlower:
        return new Sprite(type, 'assets/ngx-mario/sprites/items.png', [0, 32], [16, 16], 20, [0, 1, 2, 3]);
      case SpriteType.star:
        return new Sprite(type, 'assets/ngx-mario/sprites/items.png', [0, 48], [16, 16], 20, [0, 1, 2, 3]);
      case SpriteType.pipeLEnd:
        return new Sprite(type, 'assets/ngx-mario/sprites/tiles.png', [0, 128], [16, 16], 0);
      case SpriteType.pipeREnd:
        return new Sprite(type, 'assets/ngx-mario/sprites/tiles.png', [16, 128], [16, 16], 0);
      case SpriteType.pipeLMid:
        return new Sprite(type, 'assets/ngx-mario/sprites/tiles.png', [0, 144], [16, 16], 0);
      case SpriteType.pipeRMid:
        return new Sprite(type, 'assets/ngx-mario/sprites/tiles.png', [16, 144], [16, 16], 0);
      case SpriteType.pipeUpMid:
        return new Sprite(type, 'assets/ngx-mario/sprites/tiles.png', [0, 144], [32, 16], 0);
      case SpriteType.pipeSideMid:
        return new Sprite(type, 'assets/ngx-mario/sprites/tiles.png', [48, 128], [16, 32], 0);
      case SpriteType.pipeLeft:
        return new Sprite(type, 'assets/ngx-mario/sprites/tiles.png', [32, 128], [16, 32], 0);
      case SpriteType.pipeTop:
        return new Sprite(type, 'assets/ngx-mario/sprites/tiles.png', [0, 128], [32, 16], 0);
      case SpriteType.castle:
        return new Sprite(type, 'assets/ngx-mario/sprites/castle.png', [0, -1], [80, 80], 0);
      case SpriteType.qblock:
        return new Sprite(type, 'assets/ngx-mario/sprites/tiles.png', [384, 0], [16, 16], 8, [0, 0, 0, 0, 1, 2, 1]);
      case SpriteType.cloud0:
        return new Sprite(type, 'assets/ngx-mario/sprites/tiles.png', [0, 320], [16, 32], 0);
      case SpriteType.cloud1:
        return new Sprite(type, 'assets/ngx-mario/sprites/tiles.png', [16, 320], [16, 32], 0);
      case SpriteType.cloud2:
        return new Sprite(type, 'assets/ngx-mario/sprites/tiles.png', [32, 320], [16, 32], 0);
      case SpriteType.hill0:
        return new Sprite(type, 'assets/ngx-mario/sprites/tiles.png', [128, 128], [16, 16], 0);
      case SpriteType.hill1:
        return new Sprite(type, 'assets/ngx-mario/sprites/tiles.png', [144, 128], [16, 16], 0);
      case SpriteType.hill2:
        return new Sprite(type, 'assets/ngx-mario/sprites/tiles.png', [160, 128], [16, 16], 0);
      case SpriteType.hill3:
        return new Sprite(type, 'assets/ngx-mario/sprites/tiles.png', [128, 144], [16, 16], 0);
      case SpriteType.hill4:
        return new Sprite(type, 'assets/ngx-mario/sprites/tiles.png', [144, 144], [16, 16], 0);
      case SpriteType.hill5:
        return new Sprite(type, 'assets/ngx-mario/sprites/tiles.png', [160, 144], [16, 16], 0);
      case SpriteType.bush:
        return new Sprite(type, 'assets/ngx-mario/sprites/tiles.png', [176, 144], [48, 16], 0);
      case SpriteType.bush0:
        return new Sprite(type, 'assets/ngx-mario/sprites/tiles.png', [176, 144], [16, 16], 0);
      case SpriteType.bush1:
        return new Sprite(type, 'assets/ngx-mario/sprites/tiles.png', [192, 144], [16, 16], 0);
      case SpriteType.bush2:
        return new Sprite(type, 'assets/ngx-mario/sprites/tiles.png', [208, 144], [16, 16], 0);
      case SpriteType.flagpole0:
        return new Sprite(type, 'assets/ngx-mario/sprites/tiles.png', [256, 128], [16, 16], 0);
      case SpriteType.flagpole1:
        return new Sprite(type, 'assets/ngx-mario/sprites/tiles.png', [256, 144], [16, 16], 0);
      case SpriteType.flagpole2:
        return new Sprite(type, 'assets/ngx-mario/sprites/items.png', [128, 32], [16, 16], 0);
      case SpriteType.hudCoin:
        return new Sprite(type, 'assets/ngx-mario/sprites/items.png', [0, 160], [8, 8], 10, [0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 1]);
      case SpriteType.lPipe0:
        return new Sprite(type, 'assets/ngx-mario/sprites/tiles.png', [32, 128], [16, 16], 0);
      case SpriteType.lPipe1:
        return new Sprite(type, 'assets/ngx-mario/sprites/tiles.png', [32, 144], [16, 16], 0);
      case SpriteType.lPipe2:
        return new Sprite(type, 'assets/ngx-mario/sprites/tiles.png', [48, 128], [16, 16], 0);
      case SpriteType.lPipe3:
        return new Sprite(type, 'assets/ngx-mario/sprites/tiles.png', [48, 144], [16, 16], 0);
      case SpriteType.lPipe4:
        return new Sprite(type, 'assets/ngx-mario/sprites/tiles.png', [64, 128], [16, 16], 0);
      case SpriteType.lPipe5:
        return new Sprite(type, 'assets/ngx-mario/sprites/tiles.png', [64, 144], [16, 16], 0);
      case SpriteType.fireball:
        return new Sprite(type, 'assets/ngx-mario/sprites/items.png', [96, 144], [8, 8], 5, [0, 1, 2, 3]);
      case SpriteType.titleMenu:
        return new Sprite(type, 'assets/ngx-mario/sprites/titlescreen.png', [40, 144], [176, 88], 0);
      case SpriteType.invisibleQBlock:
        return new Sprite(type, 'assets/ngx-mario/sprites/tiles.png', [448, 0], [16, 16], 0);
      case SpriteType.oneup:
        return new Sprite(type, 'assets/ngx-mario/sprites/items.png', [16, 0], [16, 16], 0);
      default:
        throw new Error(`Unsupported SpriteType: ${type}`);
    }
  }
}
