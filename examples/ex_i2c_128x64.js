/**
 * Example for display 128x64 via I2C
 */

const { SSD1306 } = require("../i2c");
const showcase = require("./gc-mono-showcase");

const ssd1306 = new SSD1306();
ssd1306.setup(board.i2c(0), {
  width: 128,
  height: 64,
});

const gc = ssd1306.getContext();
showcase(gc, 3000);
