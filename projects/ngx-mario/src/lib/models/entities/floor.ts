import { Entity } from './entity';
import { Game } from '../game';
import { Player } from './player';
import { Sprite } from '../sprites/sprite';

export class Floor extends Entity {

  invisible: boolean = false;
  constructor(pos: [number, number], sprite: Sprite, hitbox: [number, number, number, number] = [0, 0, 16, 16], invisible: boolean = false) {
    super({
      pos: pos,
      sprite: sprite,
      hitbox: hitbox,
    });
    this.invisible = invisible;
  }

  isCollideWith(ent: any, block: boolean = false): void {
    const hpos1 = [
      Math.floor(this.pos[0] + this.hitbox[0]),
      Math.floor(this.pos[1] + this.hitbox[1]),
    ];
    const hpos2 = [
      Math.floor(ent.pos[0] + ent.hitbox[0]),
      Math.floor(ent.pos[1] + ent.hitbox[1]),
    ];

    // Verifica sovrapposizione hitbox
    const overlapX = !(
      hpos1[0] > hpos2[0] + ent.hitbox[2] ||
      hpos1[0] + this.hitbox[2] < hpos2[0]
    );
    const overlapY = !(
      hpos1[1] > hpos2[1] + ent.hitbox[3] ||
      hpos1[1] + this.hitbox[3] < hpos2[1]
    );

    if (overlapX && overlapY) {
      if (!this.standing) {
        ent.bump?.(); // bump only if defined
        return;
      }

      const center = hpos2[0] + ent.hitbox[2] / 2;

      // Sopra il blocco
      if (Math.abs(hpos2[1] + ent.hitbox[3] - hpos1[1]) <= ent.vel[1]) {

        const above =
          Game.level.statics[this.pos[1] / 16 - 1]?.[this.pos[0] / 16];
        if (above || (block && this.invisible)) return;

        ent.vel[1] = 0;
        ent.pos[1] = hpos1[1] - ent.hitbox[3] - ent.hitbox[1];
        ent.standing = true;
        if (ent instanceof Player) {
          ent.jumping = 0;
        }
      }
      // Sotto il blocco
      else if (
        Math.abs(hpos2[1] - hpos1[1] - this.hitbox[3]) > ent.vel[1] &&
        center + 2 >= hpos1[0] &&
        center - 2 <= hpos1[0] + this.hitbox[2]
      ) {
        ent.vel[1] = 0;
        ent.pos[1] = hpos1[1] + this.hitbox[3];

        if (ent instanceof Player) {
          this.bonk(ent.power);
          ent.jumping = 0;
        }
      }
      // Colpo laterale
      else {
        ent.collideWall?.(this);
      }
    }
  }

  bonk(_power?: number): void {
    // Implementabile in sottoclassi
  }
}
