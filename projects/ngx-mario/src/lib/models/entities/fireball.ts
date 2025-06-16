import { Entity } from './entity';
import { Game } from '../game';
import { Sprites } from '../sprites/sprites';
import { SpriteType } from '../sprites/sprite_type';

export class Fireball extends Entity {
  public hit: number = 0;
  public idx!: number;

  constructor(pos: [number, number]) {
    super({
      pos: pos,
      sprite: Sprites.get(SpriteType.fireball),
      hitbox: [0, 0, 8, 8],
    });
  }

  spawn(left: boolean): void {
    Game.sounds.fireball.currentTime = 0;
    Game.sounds.fireball.play();

    if (Game.fireballs[0]) {
      this.idx = 1;
      Game.fireballs[1] = this;
    } else {
      this.idx = 0;
      Game.fireballs[0] = this;
    }

    this.vel[0] = left ? -5 : 5;
    this.standing = false;
    this.vel[1] = 0;
  }

  override render(ctx: CanvasRenderingContext2D, vX: number, vY: number): void {
    this.sprite.render(ctx, this.pos[0], this.pos[1], vX, vY);
  }

  update(dt: number): void {
    if (this.hit == 1) {
      this.sprite.pos = [96, 160];
      this.sprite.size = [16,16];
      this.sprite.frames = [0,1,2];
      this.sprite.speed = 8;
      this.hit += 1;
      return;
    } else if (this.hit == 5) {
      delete Game.fireballs[this.idx];
      Game.player.fireballs -= 1;
      return;
    } else if (this.hit) {
      this.hit += 1;
      return;
    }

    //In retrospect, the way collision is being handled is RIDICULOUS
    //but I don't have to use some horrible kludge for this.
    if (this.standing) {
      this.standing = false;
      this.vel[1] = -4;
    }

    this.acc[1] = 0.5;

    this.vel[1] += this.acc[1];
    this.pos[0] += this.vel[0];
    this.pos[1] += this.vel[1];
    if (this.pos[0] < Game.vX || this.pos[0] > Game.vX + 256) {
      this.hit = 1;
    }
    this.sprite.update(dt);
  }

  override collideWall(): void {
    if (!this.hit) this.hit = 1;
  }

  override checkCollisions(): void {
     if (this.hit) return;
    var h = this.pos[1] % 16 < 8 ? 1 : 2;
    var w = this.pos[0] % 16 < 8 ? 1 : 2;

    var baseX = Math.floor(this.pos[0] / 16);
    var baseY = Math.floor(this.pos[1] / 16);

    if (baseY + h > 15) {
      delete Game.fireballs[this.idx];
      Game.player.fireballs -= 1;
      return;
    }

    for (var i = 0; i < h; i++) {
      for (var j = 0; j < w; j++) {
        if (Game.level.statics[baseY + i][baseX + j]) {
          Game.level.statics[baseY + i][baseX + j].isCollideWith(this);
        }
        if (Game.level.blocks[baseY + i][baseX + j]) {
          Game.level.blocks[baseY + i][baseX + j].isCollideWith(this);
        }
      }
    }

    var that = this;
    Game.level.enemies.forEach(function(enemy){
      if (!enemy || enemy.flipping || enemy.pos[0] - Game.vX > 336){ //stop checking once we get to far away dudes.
        return;
      } else {
        that.isCollideWith(enemy);
      }
    });
  }

  isCollideWith(ent: any): void {
    var hpos1 = [this.pos[0] + this.hitbox[0], this.pos[1] + this.hitbox[1]];
    var hpos2 = [ent.pos[0] + ent.hitbox[0], ent.pos[1] + ent.hitbox[1]];

    //if the hitboxes actually overlap
    if (!(hpos1[0] > hpos2[0]+ent.hitbox[2] || (hpos1[0]+this.hitbox[2] < hpos2[0]))) {
      if (!(hpos1[1] > hpos2[1]+ent.hitbox[3] || (hpos1[1]+this.hitbox[3] < hpos2[1]))) {
        this.hit = 1;
        ent.bump();
      }
    }
  }

  override bump(): void {
    // fireballs don't react to bump
  }
}
