import { Position } from "../position";

export class Text extends Position {
    text: string;
    size: number = 16;
    color: string = 'white';

    constructor(pos: [number, number], text: string, options?: { size?: number, color?: string }) {
        super(pos);
        this.text = text;
        if (options) {
            if (options.size) {
                this.size = options.size;
            }
            if (options.color) {
                this.color = options.color;
            }
        }
    }

    update(dt: number): void {
        // Update logic can be added here if needed
    }

    render(ctx: CanvasRenderingContext2D, vX: number, vY: number): void {
        ctx.fillStyle = this.color;
        ctx.font = `${this.size}px MyFont`;
        ctx.fillText(this.text, this.pos[0] - vX, this.pos[1] - vY);
    }
}