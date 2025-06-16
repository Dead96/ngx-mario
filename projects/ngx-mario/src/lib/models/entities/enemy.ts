import { Sprite } from "../sprites/sprite";
import { Entity } from "./entity";

export class Enemy extends Entity {
    dying: number | false = false;
    flipping: boolean = false;

    constructor(pos: [number, number], sprite: Sprite, hitbox?: [number, number, number, number]) {
        super({
            pos,
            sprite,
            hitbox: hitbox ?? [0, 0, 16, 16]
        });
    }

    checkEnemyCollisions(vX: number): void {
        // intentionally empty
    }
}
