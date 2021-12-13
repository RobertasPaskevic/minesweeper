const { ADJACENT_OFFSETS } = require("./consts");
const Prando = require("prando");

const LOST = 1;
const WON = 2;

const UNCOVERED = -2;
const BOMB = -1;
const EMPTY = 0;

class Game {
  width = 9;
  height = 9;
  minesNumber = 2;
  tiles = [];
  #mines = [];
  #revelead = 0;

  constructor(width, height, minesNumber) {
    this.width = width;
    this.height = height;
    this.minesNumber = minesNumber;
  }
  revealTile(x, y) {
    if (!this.tiles.length) {
      this.#startGame(x, y);
    }

    if (this.#mines[y][x]) {
      this.tiles[y][x] = BOMB;
      return LOST;
    } else {
      this.#setTileVisible(x, y);
      if (this.tiles[y][x] === 0) this.#revealTiles(x, y);
    }

    if (this.#revelead >= this.height * this.width - this.minesNumber) {
      return WON;
    }
  }
  #revealTiles(x, y) {
    const coordinates = [[x, y]];

    while (coordinates.length) {
      const coordinate = coordinates.shift();

      for (let i = 0; i < ADJACENT_OFFSETS.length; i++) {
        const adjacentX = coordinate[0] + ADJACENT_OFFSETS[i][0];
        const adjacentY = coordinate[1] + ADJACENT_OFFSETS[i][1];

        if (!this.isValidCoordinate(adjacentX, adjacentY)) {
          continue;
        }

        let adjacentTileBeforeUncover = this.tiles[adjacentY][adjacentX];
        this.#setTileVisible(adjacentX, adjacentY);
        if (
          this.tiles[adjacentY][adjacentX] === EMPTY &&
          adjacentTileBeforeUncover === UNCOVERED
        ) {
          coordinates.push([adjacentX, adjacentY]);
        }
      }
    }
  }
  #setTileVisible(x, y) {
    if (this.tiles[y][x] !== UNCOVERED) return;
    let mines = 0;
    for (let i = 0; i < ADJACENT_OFFSETS.length; i++) {
      const adjacentX = x + ADJACENT_OFFSETS[i][0];
      const adjacentY = y + ADJACENT_OFFSETS[i][1];

      if (!this.isValidCoordinate(adjacentX, adjacentY)) {
        continue;
      }

      if (this.#mines[adjacentY][adjacentX]) mines++;
    }
    this.tiles[y][x] = mines;
    this.#revelead++;
  }
  isValidCoordinate(x, y) {
    return x >= 0 && y >= 0 && x < this.width && y < this.height;
  }
  #startGame(x, y) {
    this.#fillTiles();
    this.#placeMines(x, y);
  }
  #fillTiles() {
    this.tiles = [];
    this.#mines = [];
    for (let i = 0; i < this.height; i++) {
      this.tiles.push([]);
      this.#mines.push([]);
      for (let y = 0; y < this.width; y++) {
        this.tiles[i].push(UNCOVERED);
        this.#mines[i].push(0);
      }
    }
  }
  #placeMines(x, y) {
    const rng = this.seed ? new Prando(this.seed) : new Prando();

    for (let i = 0; i < this.minesNumber; i++) {
      let xValue = rng.nextInt(0, this.width - 1);
      let yValue = rng.nextInt(0, this.height - 1);
      while (
        (xValue === x && yValue === y) ||
        this.#mines[yValue][xValue] !== EMPTY
      ) {
        xValue = rng.nextInt(0, this.width - 1);
        yValue = rng.nextInt(0, this.height - 1);
      }
      this.#mines[yValue][xValue] = 1;
    }
  }
}

module.exports = { Game, WON, LOST, UNCOVERED, BOMB, EMPTY };
