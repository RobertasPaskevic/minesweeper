const prompt = require("prompt");
const { WON, LOST, UNCOVERED, BOMB, EMPTY } = require("./game");
const { GameBuilder } = require("./gameBuilder");

prompt.start();

class UI {
  constructor() {
    this.game = new GameBuilder()
      .setWidth(3)
      .setHeight(3)
      .setMines(1)
      .setRandomizerSeed(342347)
      .build();
  }
  run() {
    this.#draw();
    this.#manageInput();
  }
  #draw() {
    process.stdout.write("  ");
    for (let y = 0; y < this.game.width; y++) {
      process.stdout.write(y.toString());
    }
    process.stdout.write("\n  ");
    for (let y = 0; y < this.game.width; y++) {
      process.stdout.write("-");
    }
    process.stdout.write("\n");

    for (let i = 0; i < this.game.height; i++) {
      process.stdout.write(i.toString() + "|");

      for (let y = 0; y < this.game.width; y++) {
        const tile = this.game.tiles.length ? this.game.tiles[i][y] : UNCOVERED;
        const tileChar = this.#getTile(tile);
        process.stdout.write(tileChar);
      }
      process.stdout.write("\n");
    }
  }
  #getTile(tile) {
    if (tile === UNCOVERED) return "_";
    else if (tile === BOMB) return "💣";
    else if (tile === EMPTY) return " ";
    else return tile.toString();
  }
  #manageInput() {
    prompt.get(["x", "y"], (_err, result) => {
      if (!this.game.isValidCoordinate(result.x, result.y))
        return this.#manageInput();
      const moveResult = this.game.revealTile(
        parseInt(result.x),
        parseInt(result.y)
      );

      if (moveResult) {
        this.#draw();
        if (moveResult === WON) return console.log("YOU HAVE WON!");
        else if (moveResult === LOST) return console.log("YOU HAVE LOST!");
      }

      this.run();
    });
  }
}

module.exports = UI;
