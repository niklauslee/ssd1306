/**
 * Example for display 128x32 via SPI
 */

const { SSD1306 } = require("../spi");
const font = require("simple-fonts/lee-sans");
const logo = require("./logo.bmp.json");
const showcase = require("./gc-mono-showcase");

const ssd1306 = new SSD1306();
ssd1306.setup(board.spi(0), {
  width: 128,
  height: 32,
  dc: 20,
  rst: 21,
  cs: 17,
  extVcc: false,
  rotation: 0,
});

const gc = ssd1306.getContext();
showcase(gc, 3000);
