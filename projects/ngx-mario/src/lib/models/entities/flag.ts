import { Entity } from "./entity";
import { Game } from "../game";
import { Sprites } from "../sprites/sprites";
import { SpriteType } from "../sprites/sprite_type";

export class Flag extends Entity {
    done?: boolean;
    hit?: boolean;

  constructor(pos: number) {
      super({
        pos: [pos, 0],
        sprite: Sprites.get(SpriteType.flagpole2),
        hitbox: [0, 0, 0, 0],
      });
      // Le bandiere hanno una y fissa: 49
      this.pos = [pos, 49];
      this.hitbox = [0, 0, 0, 0];
      this.vel = [0, 0];
      this.acc = [0, 0];
    }

    override collideWall(): void {
      // Nessuna azione richiesta
    }

    update(_dt: number): void {
      if (!this.done && this.pos[1] >= 170) {
        this.vel = [0, 0];
        this.pos[1] = 170;
        Game.player.exit();
        this.done = true;
      }
      this.pos[1] += this.vel[1];
    }

    override checkCollisions(): void {
      this.isPlayerCollided();
    }

    isPlayerCollided(): void {
      if (this.hit) return;

      if (Game.player.pos[0] + 8 >= this.pos[0]) {
        Game.music.pause();
        Game.sounds.star.pause();
        Game.sounds.flagpole.play();

        setTimeout(() => {
          Game.music.clear.play();
        }, 2000);

        this.hit = true;
        Game.player.flag();
        this.vel = [0, 2];
      }
    }

    override render(): void {
      this.sprite.render(
        Game.ctx,
        this.pos[0] - 8,
        this.pos[1],
        Game.vX,
        Game.vY
      );
    }
}