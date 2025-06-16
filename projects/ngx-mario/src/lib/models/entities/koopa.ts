import { Entity } from './entity';
import { Game } from '../game';
import { Goomba } from './goomba';
import { Player } from './player';
import { Sprite } from '../sprites/sprite';
import { Sprites } from '../sprites/sprites';
import { Enemy } from './enemy';
import { SpriteType } from '../sprites/sprite_type';

export class Koopa extends Enemy {
  shell: number | false = false;
  para: boolean;
  idx: number;
  turn: boolean = false;

  constructor(pos: [number, number], sprite: Sprite, para: boolean) {
    super(pos, sprite, [2, 8, 12, 24]);
    this.vel[0] = -0.5;
    this.para = para;
    this.idx = Game.level.enemies.length;
  }

  override render(ctx: CanvasRenderingContext2D, vX: number, vY: number): void {
    this.sprite.render(ctx, this.pos[0], this.pos[1], vX, vY);
  }

  update(dt: number, vX: number): void {
    if (this.turn) {
      this.vel[0] = -this.vel[0];
      if (this.shell) Game.sounds.bump.play();
      this.turn = false;
    }

    this.left = this.vel[0] < 0;

    this.sprite.img = this.left
      ? 'assets/ngx-mario/sprites/enemy.png'
      : 'assets/ngx-mario/sprites/enemyr.png';

    const distFromViewport = this.pos[0] - vX;

    if (distFromViewport > 336) return;
    if (distFromViewport < -32) {
      delete Game.level.enemies[this.idx];
      return;
    }

    if (this.dying !== false) {
      this.dying -= 1;
      if (this.dying <= 0) {
        delete Game.level.enemies[this.idx];
        return;
      }
    }

    if (this.shell !== false) {
      if (this.vel[0] === 0) {
        this.shell -= 1;
        if (this.shell < 120) this.sprite.speed = 5;

        if (this.shell === 0) {
          this.sprite = Sprites.get(SpriteType.koopa);
          this.hitbox = [2, 8, 12, 24];

          if (this.left) {
            this.sprite.img = 'assets/ngx-mario/sprites/enemyr.png';
            this.vel[0] = 0.5;
            this.left = false;
          } else {
            this.vel[0] = -0.5;
            this.left = true;
          }
          this.pos[1] -= 16;
        }
      } else {
        this.shell = 360;
        this.sprite.speed = 0;
        this.sprite.setFrame(0);
      }
    }

    this.acc[1] = 0.2;
    this.vel[1] += this.acc[1];
    this.pos[0] += this.vel[0];
    this.pos[1] += this.vel[1];

    this.sprite.update(dt);
  }

  override collideWall(): void {
    this.turn = true;
  }

  override checkEnemyCollisions(vX: number): void {
    let h = this.shell ? 1 : 2;
    if (this.pos[1] % 16 !== 0) h += 1;
    const w = this.pos[0] % 16 === 0 ? 1 : 2;

    const baseX = Math.floor(this.pos[0] / 16);
    const baseY = Math.floor(this.pos[1] / 16);

    if (baseY + h > 15) {
      delete Game.level.enemies[this.idx];
      return;
    }

    if (this.flipping) return;

    for (let i = 0; i < h; i++) {
      for (let j = 0; j < w; j++) {
        Game.level.statics[baseY + i]?.[baseX + j]?.isCollideWith(this);
        Game.level.blocks[baseY + i]?.[baseX + j]?.isCollideWith(this);
      }
    }

    for (const enemy of Game.level.enemies) {
      if (!enemy || enemy === this) continue;
      if (enemy.pos[0] - vX > 336) continue;
      this.isCollideWith(enemy);
    }

    this.isCollideWith(Game.player);
  }

  isCollideWith(ent: any): void {
    if (ent instanceof Player && (this.dying || ent.invincibility)) return;

    const hpos1 = [this.pos[0] + this.hitbox[0], this.pos[1] + this.hitbox[1]];
    const hpos2 = [ent.pos[0] + ent.hitbox[0], ent.pos[1] + ent.hitbox[1]];

    const threshold = 0.01;
    const overlapX = !(
      hpos1[0] + threshold > hpos2[0] + ent.hitbox[2] ||
      hpos1[0] + this.hitbox[2] < hpos2[0] + threshold
    );
    const overlapY = !(
      hpos1[1] + threshold > hpos2[1] + ent.hitbox[3] ||
      hpos1[1] + this.hitbox[3] < hpos2[1] + threshold
    );

    let score = 0;
    if (overlapX && overlapY) {
      if (ent instanceof Player) {
        if (ent.starTime) {
          this.bump();
          score = 100;
          return;
        }

        if (ent.vel[1] > 0) {
          Game.player.bounce = true;
        }

        if (this.shell) {
          Game.sounds.kick.play();
          score = 100;
          if (this.vel[0] === 0) {
            this.vel[0] = ent.left ? -4 : 4;
          } else {
            if (ent.bounce) {
              this.vel[0] = 0;
            } else {
              score = 0;
              ent.damage();
            }
          }
        } else if (ent.vel[1] > 0) {
          this.stomp();
          score = 100;
        } else {
          score = 0;
          ent.damage();
        }
      } else {
        if (this.shell && ent instanceof Goomba) {
          ent.bump();
          score = 100;
        } else {
          this.collideWall();
        }
      }

      if (score) Game.addScore(score, this);
    }
  }

  stomp(): void {
    Game.player.bounce = true;

    if (this.para) {
      this.para = false;
      this.sprite.pos[0] -= 32;
    } else {
      Game.sounds.stomp.play();
      this.shell = 360;
      this.sprite.pos[0] += 64;
      this.sprite.pos[1] += 16;
      this.sprite.size = [16, 16];
      this.hitbox = [2, 0, 12, 16];
      this.sprite.speed = 0;
      this.sprite.frames = [0, 1];
      this.vel = [0, 0];
      this.pos[1] += 16;
    }
  }

  override bump(): void {
    Game.sounds.kick.play();
    if (this.flipping) return;
    this.flipping = true;
    this.sprite.pos = [160, 0];
    this.sprite.size = [16, 16];
    this.hitbox = [2, 0, 12, 16];
    this.sprite.speed = 0;
    this.vel[0] = 0;
    this.vel[1] = -2.5;
  }
}
