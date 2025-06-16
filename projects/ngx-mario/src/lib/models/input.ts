export class Input {
  private static pressedKeys: { [key: string]: boolean } = {};

  static initialize(): void {
    document.addEventListener('keydown', (e) => this.setKey(e, true));
    document.addEventListener('keyup', (e) => this.setKey(e, false));
    window.addEventListener('blur', () => {
      this.pressedKeys = {};
    });
  }

  private static setKey(event: KeyboardEvent, status: boolean): void {
    const code = event.keyCode;
    let key: string;

    switch (code) {
      case 32:
        key = 'SPACE'; break;
      case 37:
        key = 'LEFT'; break;
      case 38:
        key = 'UP'; break;
      case 39:
        key = 'RIGHT'; break;
      case 40:
        key = 'DOWN'; break;
      case 88:
        key = 'JUMP'; break;
      case 90:
        key = 'RUN'; break;
      case 13:
        key = 'ENTER'; break;
      default:
        key = String.fromCharCode(code).toUpperCase();
    }

    this.pressedKeys[key] = status;
  }

  static isDown(key: string): boolean {
    return !!this.pressedKeys[key.toUpperCase()];
  }

  static reset(): void {
    this.pressedKeys['RUN'] = false;
    this.pressedKeys['LEFT'] = false;
    this.pressedKeys['RIGHT'] = false;
    this.pressedKeys['DOWN'] = false;
    this.pressedKeys['JUMP'] = false;
  }
}