/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

const { BufferedGraphicsContext } = __webpack_require__(2);

/**
 * SSD1306 class
 */
class SSD1306 {
  /**
   * Setup SSD1306
   * @param {I2C} i2c
   * @param {Object} options
   *   .width {number=128}
   *   .height {number=64}
   *   .rst {number=-1}
   *   .address {number=0x3C}
   *   .extVcc {boolean=false}
   *   .rotation {number=0}
   */
  setup(i2c, options) {
    this.i2c = i2c;
    options = Object.assign(
      {
        width: 128,
        height: 64,
        rst: -1,
        address: 0x3c, // 0x3C for 32px height, 0x3D for others
        extVcc: false,
        rotation: 0,
      },
      options
    );
    this.width = options.width;
    this.height = options.height;
    this.rst = options.rst;
    this.address = options.address;
    this.extVcc = options.extVcc;
    this.rotation = options.rotation;
    this.context = null;
    if (this.rst > -1) pinMode(this.rst, OUTPUT);
    this.reset();
    var initCmds = new Uint8Array([
      0xae, // 0 disp off
      0xd5, // 1 clk div
      0x80, // 2 suggested ratio
      0xa8,
      this.height - 1, // 3 set multiplex, height-1
      0xd3,
      0x00, // 5 display offset (no-offset)
      0x40, // 7 start line (line #0)
      0x8d,
      this.extVcc ? 0x10 : 0x14, // 8 charge pump
      0x20,
      0x00, // 10 memory mode
      0xa1, // 12 seg remap 1
      0xc8, // 13 comscandec
      0xda,
      this.height === 64 ? 0x12 : 0x02, // 14 set compins, height==64 ? 0x12:0x02,
      0x81,
      this.extVcc ? 0x9f : 0xcf, // 16 set contrast
      0xd9,
      this.extVcc ? 0x22 : 0xf1, // 18 set precharge
      0xdb,
      0x40, // 20 set vcom detect
      0xa4, // 22 display all on
      0xa6, // 23 display normal (non-inverted)
      0x2e, // 24 deactivate scroll
      0xaf, // 25 disp on
    ]);
    this.sendCommands(initCmds);
    delay(50);
  }

  sendCommands(cmds) {
    cmds.forEach((c) => this.i2c.write(new Uint8Array([0, c]), this.address));
  }

  /**
   * Reset
   */
  reset() {
    if (this.rst > -1) {
      pinMode(this.rst, OUTPUT);
      digitalWrite(this.rst, HIGH);
      delay(1);
      digitalWrite(this.rst, LOW);
      delay(10);
      digitalWrite(this.rst, HIGH);
    }
  }

  /**
   * Return a graphic context
   * @return {GraphicContext}
   */
  getContext() {
    if (!this.context) {
      this.context = new BufferedGraphicsContext(this.width, this.height, {
        rotation: this.rotation,
        bpp: 1,
        display: (buffer) => {
          var cmds = new Uint8Array([
            0x22, // pages
            0,
            (this.height >> 3) - 1,
            0x21, // columns
            0,
            this.width - 1,
          ]);
          this.sendCommands(cmds);
          var WIRE_MAX = 128;
          var chunk = new Uint8Array(WIRE_MAX + 1);
          chunk[0] = 0x40;
          for (var i = 0; i < buffer.byteLength; i += WIRE_MAX) {
            chunk.set(new Uint8Array(buffer.buffer, i, WIRE_MAX), 1);
            this.i2c.write(chunk, this.address);
          }
        },
      });
    }
    return this.context;
  }

  /**
   * Turn on
   */
  on() {
    this.i2c.write(new Uint8Array([0, 0xaf]), this.address);
  }

  /**
   * Turn off
   */
  off() {
    this.i2c.write(new Uint8Array([0, 0xae]), this.address);
  }

  /**
   * Set contrast
   */
  setContrast(c) {
    this.i2c.write(new Uint8Array([0, 0x81, c]), this.address);
  }
}

exports.SSD1306 = SSD1306;


/***/ }),
/* 2 */
/***/ ((module) => {

"use strict";
module.exports = require("graphics");

/***/ }),
/* 3 */
/***/ ((module) => {

module.exports = {
  bitmap: atob("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAgACAAIAAgACAAAAAgAAAAAAAAACgAKAAAAAAAAAAAAAAAAAAAAAAAAAAJAAkAP8AJAAkAP8AJAAkAAAAAAAAACAAcACoAKAAcAAoAKgAcAAgAAAAAABhAJIAlABoABYAKQBJAIYAAAAAAAAAMABIAEgAcACKAIoAhAB6AAAAAAAAAIAAgAAAAAAAAAAAAAAAAAAAAAAAAABgAIAAgACAAIAAgACAAGAAAAAAAAAAwAAgACAAIAAgACAAIADAAAAAAAAAAAAAIAAgAPgAIABQAAAAAAAAAAAAAAAAACAAIAD4ACAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQABAAIAAAAAAAAAAAAAAAAAA+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAEAAQACAAIABAAEAAgACAAAAAAAAAAHAAiACIAJgAqADIAIgAcAAAAAAAAAAgAGAAoAAgACAAIAAgACAAAAAAAAAAcACIAAgAEAAgAEAAgAD4AAAAAAAAAHAAiAAIAHAACAAIAIgAcAAAAAAAAAAYACgASACIAPwACAAIAAgAAAAAAAAA+ACAAIAA8AAIAAgAiABwAAAAAAAAAHAAiACAAPAAiACIAIgAcAAAAAAAAAD8AAQABAAIABAAIAAgACAAAAAAAAAAcACIAIgAcACIAIgAiABwAAAAAAAAAHAAiACIAIgAeAAIAIgAcAAAAAAAAAAAAAAAgAAAAAAAAACAAAAAAAAAAAAAAAAAAEAAAAAAAAAAQACAAAAAAAAAABAAIABAAIAAgABAACAAEAAAAAAAAAAAAAAA+AAAAAAA+AAAAAAAAAAAAAAAgABAACAAEAAQACAAQACAAAAAAAAAAHAAiAAIABAAIAAgAAAAIAAAAAAAAAA8AEIAmQClAKUAnwBAAD4AAAAAAAAAEAAQACgAKABEAHwAggCCAAAAAAAAAPAAiACIAPAAiACIAIgA8AAAAAAAAAA4AEQAgACAAIAAgABEADgAAAAAAAAA8ACIAIQAhACEAIQAiADwAAAAAAAAAPwAgACAAPgAgACAAIAA/AAAAAAAAAD8AIAAgAD4AIAAgACAAIAAAAAAAAAAOABEAIAAgACcAIQARAA4AAAAAAAAAIQAhACEAPwAhACEAIQAhAAAAAAAAACAAIAAgACAAIAAgACAAIAAAAAAAAAAEAAQABAAEAAQABAAkABgAAAAAAAAAIQAiACQAOAAkACIAIQAhAAAAAAAAACAAIAAgACAAIAAgACAAPgAAAAAAAAAggDGAKoAkgCSAIIAggCCAAAAAAAAAIIAwgCiAJIAigCGAIIAggAAAAAAAAA4AEQAggCCAIIAggBEADgAAAAAAAAA+ACEAIQAhAD4AIAAgACAAAAAAAAAADgARACCAIIAkgCKAEQAOgAAAAAAAAD4AIQAhAD4AJAAiACEAIQAAAAAAAAAeACEAIAAeAAEAAQAhAB4AAAAAAAAAP4AEAAQABAAEAAQABAAEAAAAAAAAACCAIIAggCCAIIAggBEADgAAAAAAAAAggCCAEQARAAoACgAEAAQAAAAAAAAAIAggCBEQERAKoAqgBEAEQAAAAAAAACCAEQAKAAQACgARACCAIIAAAAAAAAAggBEACgAEAAQABAAEAAQAAAAAAAAAPwABAAIABAAIABAAIAA/AAAAAAAAADgAIAAgACAAIAAgACAAOAAAAAAAAAAgACAAEAAQAAgACAAEAAQAAAAAAAAAOAAIAAgACAAIAAgACAA4AAAAAAAAAAgAFAAiAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD4AAAAAAAAAIAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAAgAeACIAHQAAAAAAAAAgACAAIAA8ACIAIgAiADwAAAAAAAAAAAAAAAAAHAAiACAAIgAcAAAAAAAAAAIAAgACAB4AIgAiACIAHgAAAAAAAAAAAAAAAAAcACIAPgAgAB4AAAAAAAAADAAQABAAPAAQABAAEAAQAAAAAAAAAAAAAAAAABwAIgAiACIAHgACABwAAAAgACAAIAA8ACIAIgAiACIAAAAAAAAAAAAgAAAAIAAgACAAIAAgAAAAAAAAAAAACAAAAAgACAAIAAgACAAwAAAAAAAgACAAIAAiACQAOAAkACIAAAAAAAAAMAAQABAAEAAQABAAEAAQAAAAAAAAAAAAAAAAAD8AJIAkgCSAJIAAAAAAAAAAAAAAAAA8ACIAIgAiACIAAAAAAAAAAAAAAAAAHAAiACIAIgAcAAAAAAAAAAAAAAAAADwAIgAiACIAPAAgACAAAAAAAAAAAAAeACIAIgAiAB4AAgACAAAAAAAAAAAALAAwACAAIAAgAAAAAAAAAAAAAAAAAB4AIAAcAAIAPAAAAAAAAAAAABAAEAA+ABAAEAAQAA4AAAAAAAAAAAAAAAAAIgAiACIAIgAeAAAAAAAAAAAAAAAAACIAIgAUABQACAAAAAAAAAAAAAAAAAAggCCAFQAVAAoAAAAAAAAAAAAAAAAAIgAUAAgAFAAiAAAAAAAAAAAAAAAAACIAIgAiACIAHgACABwAAAAAAAAAAAA+AAQACAAQAD4AAAAAAAAACAAQABAAEAAgABAAEAAQAAgAAAAAACAAIAAgACAAIAAgACAAIAAAAAAAAAAgABAAEAAQAAgAEAAQABAAIAAAAAAAAAAZACYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"),
  glyphs: atob("BQgGAQgCAwIECAgJBQkGCAgJBwgIAQICAwgEAwgEBQYGBQYGAgkDBQUGAQgCBAgFBQgGAwgEBQgGBQgGBggHBQgGBQgGBggHBQgGBQgGAQcCAggDBAgFBQYGBAgFBQgGCAgJBwgIBQgGBggHBggHBggHBggHBggHBggHAQgCBAgFBggHBQgGBwgIBwgIBwgIBggHBwgIBggHBggHBwgIBwgIBwgICwgMBwgIBwgIBggHAwgEBAgFAwgEBQMGBQgGAgIDBggHBQgGBQgGBQgGBQgGBAgFBQoGBQgGAQgCAwkEBQgGAggDBwgIBQgGBQgGBQoGBQoGBAgFBQgGBQgGBQgGBQgGBwgIBQgGBQoGBQgGAwkEAQgCAwkEBgMHAQEC"),
  width: 11,
  height: 11,
  first: 32,
  last: 127,
  advanceX: 11,
  advanceY: 11
}


/***/ }),
/* 4 */
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"width":39,"height":32,"bpp":1,"data":"AAAAAgAAHwAHAAA/8B+AAP//OIAB///wwAf//+DgD///4HA////wcH////P4//////z//////v////wA//////D/////8P/////A+OBgP4DwwDAAAPDwMAAA8cAeAADxwA4AAPAADgAA8A4AAAD4GYAAAHgw4AAAOBBgAAAcECAAAB4IYAAADwhgAAAHgOAAAAfPwAAAAP8AAAAAHAAAAA=="}');

/***/ }),
/* 5 */
/***/ ((module) => {

/**
 * Perform mono graphic showcase
 * @param {GraphicContext} gc
 */
function showcase(gc, interval) {
  // start
  gc.clearScreen();
  gc.setFontColor(1);
  gc.drawText(0, 0, "Graphics Examples");
  gc.display();
  delay(interval);

  // pixels
  gc.clearScreen();
  for (let x = 0; x < gc.getWidth(); x += 5) {
    for (let y = 0; y < gc.getHeight(); y += 5) {
      gc.setPixel(x, y, 1);
    }
  }
  gc.display();
  delay(interval);

  // lines
  gc.clearScreen();
  gc.setColor(1);
  for (let x = 0; x < gc.getWidth(); x += 5) {
    gc.drawLine(0, 0, x, gc.getHeight() - 1);
    gc.drawLine(gc.getWidth() - 1, 0, x, gc.getHeight() - 1);
  }
  gc.display();
  delay(interval);

  // rectangles
  gc.clearScreen();
  gc.setColor(1);
  for (let x = 0; x < gc.getWidth(); x += 5) {
    if (x * 2 < Math.min(gc.getHeight(), gc.getWidth())) {
      gc.drawRect(x, x, gc.getWidth() - x * 2, gc.getHeight() - x * 2);
    }
  }
  gc.display();
  delay(interval);

  // filled rectangles
  gc.clearScreen();
  gc.setFillColor(1);
  for (let x = 0; x < gc.getWidth(); x += 10) {
    for (let y = 0; y < gc.getWidth(); y += 10) {
      if (((x + y) / 10) % 2 === 0) {
        gc.fillRect(x, y, 10, 10);
      }
    }
  }
  gc.display();
  delay(interval);

  // circles
  gc.clearScreen();
  gc.setFillColor(1);
  for (let x = 0; x < gc.getWidth(); x += 30) {
    for (let y = 0; y < gc.getWidth(); y += 30) {
      gc.drawCircle(x + 15, y + 15, 14);
      gc.fillCircle(x + 15, y + 15, 8);
    }
  }
  gc.display();
  delay(interval);

  // round rectangles
  gc.clearScreen();
  gc.setFillColor(1);
  for (let x = 0; x < gc.getWidth(); x += 30) {
    for (let y = 0; y < gc.getWidth(); y += 20) {
      gc.drawRoundRect(x, y, 28, 18, 5);
      gc.fillRoundRect(x + 3, y + 3, 22, 12, 4);
    }
  }
  gc.display();
  delay(interval);

  // font
  gc.clearScreen();
  gc.setFontColor(1);
  gc.drawText(
    0,
    0,
    "ABCDEFGHIJKLMN\nOPQRSTUVWXYZ\nabcdefghijklmn\nopqrstuvwxyz\n0123456789\n~!@#$%^&*()-=_+\n[]{}\\|:;'<>/?.,"
  );
  gc.display();
  delay(interval);

  // font scale
  gc.clearScreen();
  gc.setFontColor(1);
  gc.setFontScale(3, 3);
  gc.drawText(
    0,
    0,
    "ABCDEFGHIJKLMN\nOPQRSTUVWXYZ\nabcdefghijklmn\nopqrstuvwxyz\n0123456789\n~!@#$%^&*()-=_+\n[]{}\\|:;'<>/?.,"
  );
  gc.display();
  gc.setFontScale(1, 1);
  delay(interval);

  // custom font
  gc.clearScreen();
  gc.setFontColor(1);
  gc.setFont(font);
  gc.setFontScale(1, 1);
  gc.drawText(0, 0, 'Custom Font\n"Lee Sans"\nVariable-width Font');
  gc.display();
  delay(interval);

  // bitmap (logo)
  gc.clearScreen();
  gc.setColor(1);
  let x = Math.floor((gc.getWidth() - logo.width) / 2);
  let y = Math.floor((gc.getHeight() - logo.height) / 2);
  gc.drawBitmap(x, y, logo);
  gc.display();
}

module.exports = showcase;


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/**
 * Example for display 128x64 via I2C
 */

const { SSD1306 } = __webpack_require__(1);
const font = __webpack_require__(3);
const logo = __webpack_require__(4);
const showcase = __webpack_require__(5);

const ssd1306 = new SSD1306();

ssd1306.setup(board.i2c(0), {
  width: 128,
  height: 64,
});

const gc = ssd1306.getContext();
const interval = 3000;
showcase(gc, interval);

})();

/******/ })()
;