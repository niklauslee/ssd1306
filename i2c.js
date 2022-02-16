const { BufferedGraphicsContext } = require("graphics");

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
