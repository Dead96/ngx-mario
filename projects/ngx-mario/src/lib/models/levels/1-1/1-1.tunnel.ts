import { Game } from "../../game";
import { Level, LevelFn } from "../level";
import { oneone } from "./1-1";

export const oneonetunnel: LevelFn = () => {
  Game.level = new Level({
    playerPos: [40, 16],
    loader: oneone,
    world: 1,
    level: 1,
    background: '#000000',
    scrolling: false,
  });

  Game.player.pos[0] = Game.level.playerPos[0];
  Game.player.pos[1] = Game.level.playerPos[1];
  Game.vX = 0;

  Game.level.putFloor(0, 16, true);
  Game.level.putWall(0, 13, 11, true);

  const walls: number[] = [4, 5, 6, 7, 8, 9, 10];
  walls.forEach((loc) => {
    Game.level.putWall(loc, 13, 3, true);
    Game.level.putWall(loc, 3, 1, true);
  });

  const coins: [number, number][] = [
    [5, 5],
    [6, 5],
    [7, 5],
    [8, 5],
    [9, 5],
    [4, 7],
    [5, 7],
    [6, 7],
    [7, 7],
    [8, 7],
    [9, 7],
    [10, 7],
    [4, 9],
    [5, 9],
    [6, 9],
    [7, 9],
    [8, 9],
    [9, 9],
    [10, 9],
  ];
  coins.forEach(([x, y]) => {
    Game.level.putCoin(x, y);
  });
  Game.level.putRealPipe(13, 11, 3, 'RIGHT', () => {
    Game.music.pause();
    oneone(true);
    Game.player.pos = [2616, 177];
    Game.player.pipe('UP', () => {});
  });

  Game.level.putPipe(15, 13, 13);

  Game.music.pause();
  Game.music.playUnderground();
};
