import { Component, ElementRef, inject } from '@angular/core';
import { Game } from './models/game';

@Component({
  selector: 'ngx-mario',
  imports: [],
  template: `<canvas></canvas>`,
  styles: `
    canvas {
      width: 100%;
      height: 100%;
    }
  `
})
export class NgxMario {
  el = inject(ElementRef);

  ngAfterViewInit(): void {
    Game.initialize(this.el.nativeElement.querySelector('canvas') as HTMLCanvasElement);
  }
}
