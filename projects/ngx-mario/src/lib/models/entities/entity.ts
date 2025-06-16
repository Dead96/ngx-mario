import { Sprite } from "../sprites/sprite";

export interface EntityOptions {
  pos: [number, number];
  sprite: Sprite;
  hitbox: [number, number, number, number];
}

export class Entity {
    vel: [number, number] = [0, 0];
    acc: [number, number] = [0, 0];
    standing: boolean = true;
    pos: [number, number];
    sprite: Sprite;
    hitbox: [number, number, number, number];
    left: boolean = false;

    constructor(options: EntityOptions) {
        this.pos = options.pos;
        this.sprite = options.sprite;
        this.hitbox = options.hitbox;
    }

    render(ctx: CanvasRenderingContext2D, vX: number, vY: number): void {
        this.sprite.render(ctx, this.pos[0], this.pos[1], vX, vY);
    }

    collideWall(wall: Entity): void {
        // the wall will always be a 16x16 block with hitbox = [0,0,16,16]
        if (this.pos[0] > wall.pos[0]) {
            // from the right
            this.pos[0] = wall.pos[0] + wall.hitbox[2] - this.hitbox[0];
            this.vel[0] = Math.max(0, this.vel[0]);
            this.acc[0] = Math.max(0, this.acc[0]);
        } else {
            this.pos[0] = wall.pos[0] + wall.hitbox[0] - this.hitbox[2] - this.hitbox[0];
            this.vel[0] = Math.min(0, this.vel[0]);
            this.acc[0] = Math.min(0, this.acc[0]);
        }
    }

    checkCollisions(): void {
        // intentionally empty
    }

    bump(): void {
        // intentionally empty
    }
}