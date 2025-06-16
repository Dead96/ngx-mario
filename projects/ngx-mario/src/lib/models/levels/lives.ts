import { Player } from '../entities/player';
import { Game } from '../game';
import { Input } from '../input';
import { Prop } from '../props/prop';
import { TitleMenu } from '../props/title_menu';
import { SpriteType } from '../sprites/sprite_type';
import { Sprites } from '../sprites/sprites';
import { Text } from '../texts/text';
import { Level } from './level';

type ShowLifeScreenFn = (world: number, level: number) => Promise<void>;

export const showLifeScreen: ShowLifeScreenFn = (
  world: number,
  level: number
) => {
  return new Promise((resolve) => {
    const gameover = Game.player.lives < 0;

    Game.level = new Level({
      playerPos: [16 * 16, 0],
      world: world,
      level: level,
      background: '#000000',
      scrolling: false,
      static: true,
    });

    Game.resetTime();
    Input.reset();
    Game.player.noInput = true;
    var ground = [[16, 69]];
    Game.player.pos[0] = Game.level.playerPos[0];
    Game.player.pos[1] = Game.level.playerPos[1];
    Game.vX = 0;

    //build THE GROUND
    ground.forEach((loc) => {
      Game.level.putFloor(loc[0], loc[1]);
    });

    if (gameover) {
      Game.sounds.gameover.currentTime = 0;
      Game.sounds.gameover.play();
      Game.level.texts.push(new Text([94, 100], `GAME OVER`, { size: 10 }));
      setTimeout(() => {
        Game.player = new Player([0, 0]);
        Game.init();
      }, 6000);
    } else {
      Game.level.scenery[0][0] = new Prop(
        [96, 119],
        Sprites.get(SpriteType.mario)
      );
      Game.level.texts.push(
        new Text([99, 100], `WORLD ${world}-${level}`, { size: 9 }),
        new Text([125, 131], `x`, { size: 9 }),
        new Text([149, 131], Game.player.lives.toString(), { size: 9 })
      );
      setTimeout(() => {
        Game.player.noInput = false;
        Game.resetTime();
        resolve();
      }, 2750);
    }
  });
};
