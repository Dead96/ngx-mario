import { Entity } from "./entity";
import { Game } from "../game";
import { Player } from "./player";
import { Sprite } from "../sprites/sprite";
import { Enemy } from "./enemy";

export class Goomba extends Enemy {
  idx: number;

  constructor(pos: [number, number], sprite: Sprite) {
    super(
      pos,
      sprite,
      [0, 0, 16, 16]
    );
    this.vel[0] = -0.5;
    this.idx = Game.level.enemies.length;
  }

  override render(ctx: CanvasRenderingContext2D, vX: number, vY: number): void {
    this.sprite.render(ctx, this.pos[0], this.pos[1], vX, vY);
  }

  update(dt: number, vX: number): void {
    const dx = this.pos[0] - vX;

    if (dx > 336) return;
    if (dx < -32) {
      delete Game.level.enemies[this.idx];
      return;
    }

    if (this.dying !== false) {
      this.dying--;
      if (this.dying <= 0) {
        delete Game.level.enemies[this.idx];
        return;
      }
    }

    this.acc[1] = 0.2;
    this.vel[1] += this.acc[1];
    this.pos[0] += this.vel[0];
    this.pos[1] += this.vel[1];
    this.sprite.update(dt);
  }

  override collideWall(): void {
    this.vel[0] = -this.vel[0];
  }

  override checkEnemyCollisions(vX: number): void {
    if (this.flipping) return;

    const h = this.pos[1] % 16 === 0 ? 1 : 2;
    const w = this.pos[0] % 16 === 0 ? 1 : 2;
    const baseX = Math.floor(this.pos[0] / 16);
    const baseY = Math.floor(this.pos[1] / 16);

    if (baseY + h > 15) {
      delete Game.level.enemies[this.idx];
      return;
    }

    for (let i = 0; i < h; i++) {
      for (let j = 0; j < w; j++) {
        Game.level.statics[baseY + i]?.[baseX + j]?.isCollideWith(this);
        Game.level.blocks[baseY + i]?.[baseX + j]?.isCollideWith(this);
      }
    }

    for (const enemy of Game.level.enemies) {
      if (!enemy || enemy === this || enemy.pos[0] - vX > 336) continue;
      this.isCollideWith(enemy);
    }

    this.isCollideWith(Game.player);
  }

  isCollideWith(ent: any): void {
    if (ent instanceof Player && (this.dying || ent.invincibility)) return;

    const hpos1 = [this.pos[0] + this.hitbox[0], this.pos[1] + this.hitbox[1]];
    const hpos2 = [ent.pos[0] + ent.hitbox[0], ent.pos[1] + ent.hitbox[1]];
    
    const threshold = 0.01;
    const overlapX = !(hpos1[0] + threshold > hpos2[0] + ent.hitbox[2] || hpos1[0] + this.hitbox[2] < hpos2[0] + threshold);
    const overlapY = !(hpos1[1] + threshold > hpos2[1] + ent.hitbox[3] || hpos1[1] + this.hitbox[3] < hpos2[1] + threshold);

    if (overlapX && overlapY) {
      let score = 0;
      if (ent instanceof Player) {
        if (ent.starTime) {
          this.bump();
        } else if (ent.vel[1] > 0) {
          this.stomp();
          score = 100;
        } else {
          ent.damage();
        }
      } else if(ent instanceof Goomba) {
        ent.collideWall();
      }
      
      if(score) Game.addScore(score, this);
    }
  }

  stomp(): void {
    Game.sounds.stomp.play();
    Game.player.bounce = true;
    this.sprite.pos[0] = 32;
    this.sprite.speed = 0;
    this.vel[0] = 0;
    this.dying = 10;
  }

  override bump(): void {
    Game.sounds.kick.play();
    this.sprite.img = 'assets/ngx-mario/sprites/enemyr.png';
    this.flipping = true;
    this.pos[1] -= 1;
    this.vel[0] = 0;
    this.vel[1] = -2.5;
    Game.addScore(100, this);
  }
}