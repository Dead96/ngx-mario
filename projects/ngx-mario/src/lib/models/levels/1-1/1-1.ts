import { Bcoin } from '../../entities/bcoin';
import { Game } from '../../game';
import { Mushroom } from '../../entities/mushroom';
import { Star } from '../../entities/star';
import { Level } from '../level';
import { oneonetunnel } from './1-1.tunnel';
import { showLifeScreen } from '../lives';
import { OneUp } from '../../entities/oneup';
import { menu } from '../menu';

export const oneone = (afterTunnel: boolean = false) => {

  const start = () => {
    console.log('Loading level 1-1');
    
    Game.player.pos = [56, 192 - (Game.player.power > 0 ? 32 : 0)];
    Game.level = new Level({
      playerPos: [Game.player.pos[0], Game.player.pos[1]],
      loader: oneone,
      next: menu,
      background: '#7974FF',
      world: 1,
      level: 1,
      scrolling: true,
      invincibility: [144, 192, 240],
      exit: 204,
    });

    var ground = [[0, 69], [71, 86], [89, 153], [155, 214]];
    Game.vX = 0;

    //build THE GROUND
    ground.forEach((loc) => {
      Game.level.putFloor(loc[0], loc[1]);
    });

    //build scenery
    var clouds = [[7, 3], [19, 2], [56, 3], [67, 2], [87, 2], [103, 2], [152, 3], [163, 2], [200, 3]];
    clouds.forEach((cloud) => {
      Game.level.putCloud(cloud[0], cloud[1]);
    });

    var twoClouds = [[36, 2], [132, 2], [180, 2]];
    twoClouds.forEach((cloud) => {
      Game.level.putTwoCloud(cloud[0], cloud[1]);
    });

    var threeClouds = [[27, 3], [75, 3], [123, 3], [171, 3]];
    threeClouds.forEach((cloud) => {
      Game.level.putThreeCloud(cloud[0], cloud[1]);
    });

    var bHills = [0, 48, 96, 144, 192]
    bHills.forEach((hill) => {
      Game.level.putBigHill(hill, 12);
    });

    var sHills = [16, 64, 111, 160];
    sHills.forEach((hill) => {
      Game.level.putSmallHill(hill, 12);
    });

    var bushes = [23, 71, 118, 167];
    bushes.forEach((bush) => {
      Game.level.putBush(bush, 12);
    });

    var twoBushes = [41, 89, 137];
    twoBushes.forEach((bush) => {
      Game.level.putTwoBush(bush, 12);
    });

    var threeBushes = [11, 59, 106];
    threeBushes.forEach((bush) => {
      Game.level.putThreeBush(bush, 12);
    });

    //interactable terrain
    Game.level.putQBlock(16, 9, new Bcoin([256, 144]));
    Game.level.putBrick(20, 9, null);
    Game.level.putQBlock(21, 9, new Mushroom([336, 144]));
    Game.level.putBrick(22, 9, null);
    Game.level.putQBlock(22, 5, new Bcoin([352, 80]));
    Game.level.putQBlock(23, 9, new Bcoin([368, 144]));
    Game.level.putBrick(24, 9, null);
    Game.level.putPipe(28, 13, 2);
    Game.level.putPipe(38, 13, 3);
    Game.level.putPipe(46, 13, 4);
    Game.level.putRealPipe(57, 9, 4, "DOWN", oneonetunnel);
    Game.level.putQBlock(63, 9, new OneUp([1008, 144]), true);
    Game.level.putBrick(77, 9, null);
    Game.level.putQBlock(78, 9, new Mushroom([1248, 144]));
    Game.level.putBrick(79, 9, null);
    Game.level.putBrick(80, 5, null);
    Game.level.putBrick(81, 5, null);
    Game.level.putBrick(82, 5, null);
    Game.level.putBrick(83, 5, null);
    Game.level.putBrick(84, 5, null);
    Game.level.putBrick(85, 5, null);
    Game.level.putBrick(86, 5, null);
    Game.level.putBrick(87, 5, null);
    Game.level.putBrick(91, 5, null);
    Game.level.putBrick(92, 5, null);
    Game.level.putBrick(93, 5, null);
    Game.level.putQBlock(94, 5, new Bcoin([1504, 80]));
    Game.level.putBrick(94, 9, null);
    Game.level.putBrick(100, 9, new Star([1600, 144]));
    Game.level.putBrick(101, 9, null);
    Game.level.putQBlock(105, 9, new Bcoin([1680, 144]));
    Game.level.putQBlock(108, 9, new Bcoin([1728, 144]));
    Game.level.putQBlock(108, 5, new Mushroom([1728, 80]));
    Game.level.putQBlock(111, 9, new Bcoin([1776, 144]));
    Game.level.putBrick(117, 9, null);
    Game.level.putBrick(120, 5, null);
    Game.level.putBrick(121, 5, null);
    Game.level.putBrick(122, 5, null);
    Game.level.putBrick(123, 5, null);
    Game.level.putBrick(128, 5, null);
    Game.level.putQBlock(129, 5, new Bcoin([2074, 80]));
    Game.level.putBrick(129, 9, null);
    Game.level.putQBlock(130, 5, new Bcoin([2080, 80]));
    Game.level.putBrick(130, 9, null);
    Game.level.putBrick(131, 5, null);
    Game.level.putWall(134, 13, 1);
    Game.level.putWall(135, 13, 2);
    Game.level.putWall(136, 13, 3);
    Game.level.putWall(137, 13, 4);
    Game.level.putWall(140, 13, 4);
    Game.level.putWall(141, 13, 3);
    Game.level.putWall(142, 13, 2);
    Game.level.putWall(143, 13, 1);
    Game.level.putWall(148, 13, 1);
    Game.level.putWall(149, 13, 2);
    Game.level.putWall(150, 13, 3);
    Game.level.putWall(151, 13, 4);
    Game.level.putWall(152, 13, 4);
    Game.level.putWall(155, 13, 4);
    Game.level.putWall(156, 13, 3);
    Game.level.putWall(157, 13, 2);
    Game.level.putWall(158, 13, 1);
    Game.level.putPipe(163, 13, 2);
    Game.level.putBrick(168, 9, null);
    Game.level.putBrick(169, 9, null);
    Game.level.putQBlock(170, 9, new Bcoin([2720, 144]));
    Game.level.putBrick(171, 9, null);
    Game.level.putPipe(179, 13, 2);
    Game.level.putWall(181, 13, 1);
    Game.level.putWall(182, 13, 2);
    Game.level.putWall(183, 13, 3);
    Game.level.putWall(184, 13, 4);
    Game.level.putWall(185, 13, 5);
    Game.level.putWall(186, 13, 6);
    Game.level.putWall(187, 13, 7);
    Game.level.putWall(188, 13, 8);
    Game.level.putWall(189, 13, 8);
    Game.level.putFlagpole(198);

    //and enemies
    Game.level.putGoomba(22, 12);
    Game.level.putGoomba(40, 12);
    Game.level.putGoomba(50, 12);
    Game.level.putGoomba(51, 12);
    Game.level.putGoomba(82, 4);
    Game.level.putGoomba(84, 4);
    Game.level.putGoomba(100, 12);
    Game.level.putGoomba(102, 12);
    Game.level.putGoomba(114, 12);
    Game.level.putGoomba(115, 12);
    Game.level.putGoomba(122, 12);
    Game.level.putGoomba(123, 12);
    Game.level.putGoomba(125, 12);
    Game.level.putGoomba(126, 12);
    Game.level.putGoomba(170, 12);
    Game.level.putGoomba(172, 12);
    Game.level.putKoopa(35, 11);

    Game.level.putCastle(202, 8);

    if(!afterTunnel)
      Game.music.reset();
    Game.music.playOverworld();
  };

  if (!afterTunnel) {
    showLifeScreen(1, 1).then(() => {  
      start();
    });
  } else {
    start();
  }
};
