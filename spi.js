const { BufferedGraphicsContext } = require("graphics");

/**
 * SSD1306 class
 */
class SSD1306 {
  /**
   * Setup SSD1306 for SPI connection
   * @param {SPI} spi
   * @param {Object} options
   *   .width {number=128}
   *   .height {number=64}
   *   .dc {number=-1}
   *   .rst {number=-1}
   *   .cs {number=-1}
   *   .extVcc {boolean=false}
   *   .rotation {number=0}
   */
  setup(spi, options, callback) {
    this.spi = spi;
    options = Object.assign(
      {
        width: 128,
        height: 64,
        dc: -1,
        rst: -1,
        cs: -1,
        extVcc: false,
        rotation: 0,
      },
      options
    );
    this.width = options.width;
    this.height = options.height;
    this.dc = options.dc;
    this.rst = options.rst;
    this.cs = options.cs;
    this.extVcc = options.extVcc;
    this.rotation = options.rotation;
    this.context = null;
    if (this.dc > -1) pinMode(this.dc, OUTPUT);
    if (this.rst > -1) pinMode(this.rst, OUTPUT);
    if (this.cs > -1) pinMode(this.cs, OUTPUT);
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

  /**
   * Reset
   */
  reset() {
    if (this.rst > -1) {
      digitalWrite(this.rst, HIGH);
      delay(1);
      digitalWrite(this.rst, LOW);
      delay(10);
      digitalWrite(this.rst, HIGH);
    }
  }

  select() {
    if (this.cs > -1) digitalWrite(this.cs, LOW);
  }

  deselect() {
    if (this.cs > -1) digitalWrite(this.cs, HIGH);
  }

  sendCommands(cmds) {
    if (this.cs > -1) digitalWrite(this.cs, LOW);
    digitalWrite(this.dc, LOW);
    this.spi.send(cmds);
    if (this.cs > -1) digitalWrite(this.cs, HIGH);
  }

  sendData(buffer) {
    if (this.cs > -1) digitalWrite(this.cs, LOW);
    digitalWrite(this.dc, HIGH);
    this.spi.send(buffer);
    if (this.cs > -1) digitalWrite(this.cs, HIGH);
  }

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
          this.sendData(buffer);
        },
      });
    }
    return this.context;
  }

  on() {
    this.sendCommands(new Uint8Array([0xaf]));
  }

  off() {
    this.sendCommands(new Uint8Array([0xae]));
  }

  setContrast(c) {
    this.sendCommands(new Uint8Array([0x81, c]));
  }
}

exports.SSD1306 = SSD1306;
