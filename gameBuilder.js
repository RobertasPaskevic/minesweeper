const { Game } = require("./game");

const DEFAULT_WIDTH = 9;
const DEFAULT_HEIGHT = 9;
const DEFAULT_MINES_NUMBER = 2;

class GameBuilder {
  constructor() {
    this.game = new Game(DEFAULT_WIDTH, DEFAULT_HEIGHT, DEFAULT_MINES_NUMBER);
  }
  setWidth(width) {
    this.game.width = width;
    return this;
  }
  setHeight(height) {
    this.game.height = height;
    return this;
  }
  setMines(mines) {
    this.game.minesNumber = mines;
    return this;
  }
  setRandomizerSeed(seed) {
    this.game.seed = seed;
    return this;
  }
  build() {
    return this.game;
  }
}

module.exports = { GameBuilder };
