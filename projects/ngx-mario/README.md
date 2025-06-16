# ngx-mario

An Angular library that recreates the classic Super Mario Bros (NES) experience. This library is inspired by and built upon the work in [reruns/mario](https://github.com/reruns/mario) — special thanks to the original author for making it available.


## 📦 Installation

```bash
npm i ngx-mario
```

## 🚀 Usage
Import the `NgxMario` in your Angular module/standalone component:

```typescript
import { NgxMario } from 'ngx-mario';

@NgModule({
  declarations: [
    // other components
  ],
  imports: [
      NgxMario
    // other modules
  ],
})
export class AppModule { }
```

Add these lines to your `angular.json` file to include the necessary assets:

```json
{
  ...
    "assets": [
      {
        "glob": "**/*",
        "input": "./node_modules/ngx-mario/src/assets",
        "output": "/assets/ngx-mario"
      }
    ],
  ...
}
```

Then, you can use the `<ngx-mario>` component in your templates:

```html
<ngx-mario></ngx-mario>
```

Note: The component is responsive and will adjust to the size of its container. You can set a specific width and height using CSS.

## 🕹️ Features
- Classic Super Mario Bros gameplay
- Single player mode
- Power-ups (mushrooms, fire flowers)
- Enemies (Goombas, Koopa Troopas)
- Collectibles (coins, stars)
- Block interactions (hit blocks, break bricks, hidden blocks)
- Keyboard controls (arrow keys for movement, X for jump, Z for run)
- Sound effects and music
- High score tracking
- Game over screen
- Life system
- Score system
