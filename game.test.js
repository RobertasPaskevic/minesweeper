const { WON, LOST, UNCOVERED, BOMB, EMPTY } = require("./game");
const { GameBuilder } = require("./gameBuilder");

test("Has proper amount of tiles", () => {
  const game = new GameBuilder().setHeight(20).setWidth(15).build();
  game.revealTile(0, 0);
  expect(game.tiles.length).toBe(20);
  expect(game.tiles[0].length).toBe(15);
});

test("Loses the game when every tile is a bomb", () => {
  const game = new GameBuilder()
    .setHeight(3)
    .setWidth(3)
    .setMines(3)
    .setRandomizerSeed(1)
    .build();
  game.revealTile(0, 0);
  const actionResult = game.revealTile(2, 0);
  expect(actionResult).toBe(LOST);
});

test("Wins the game when there are no bombs", () => {
  const game = new GameBuilder()
    .setHeight(3)
    .setWidth(3)
    .setMines(1)
    .setRandomizerSeed(342347)
    .build();
  game.revealTile(0, 0);
  game.revealTile(2, 0);
  const actionResult = game.revealTile(2, 2);
  expect(actionResult).toBe(WON);
});
