import { Game } from '../game';
import { TitleMenu } from '../props/title_menu';
import { Text } from '../texts/text';
import { Level, LevelFn } from './level';

export const menu: LevelFn = () => {
  Game.level = new Level({
    playerPos: [56, 192 - (Game.player.power > 0 ? 32 : 0)],
    world: 0,
    level: 0,
    loader: menu,
    background: '#7974FF',
    scrolling: false,
  });

  var ground = [[0, 69]];
  Game.player.pos[0] = Game.level.playerPos[0];
  Game.player.pos[1] = Game.level.playerPos[1];
  Game.vX = 0;

  //build THE GROUND
  ground.forEach((loc) => {
    Game.level.putFloor(loc[0], loc[1]);
  });

  var bHills = [0, 48, 96, 144, 192];
  bHills.forEach((hill) => {
    Game.level.putBigHill(hill, 12);
  });

  var threeBushes = [11, 59, 106];
  threeBushes.forEach((bush) => {
    Game.level.putThreeBush(bush, 12);
  });

  Game.level.scenery[2][2] = new TitleMenu([
    40,
    32,
  ]);

  Game.level.putWall(16, 13, 11, true);

  Game.level.texts.push(
    new Text([130, 130], '©1985 Nintendo', { size: 8 }),
    new Text([68, 160], 'Press Enter to start', { size: 8 })
  );
};
