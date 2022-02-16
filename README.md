# Overview

Kaluma library for SSD1306 (Monochrome OLED Display)

You can get monochrome OLED displays from belows:

- [1" 128x32 - I2C (from Adafruit)](https://www.adafruit.com/product/931)
- [1.3" 128x64 - I2C/SPI (from Adafruit)](https://www.adafruit.com/product/938)
- [0.96" 128x64 - I2C/SPI (from Adafruit)](https://www.adafruit.com/product/326)
- [1" 128x32 - SPI (from Adafruit)](https://www.adafruit.com/product/661)

# Wiring

## I2C

Here is a wiring example for `I2C0`.

| Raspberry Pi Pico | SSD1306 (OLED) |
| ----------------- | -------------- |
| 3V3               | VCC (VDD)      |
| GND               | GND            |
| GP4 (I2C0 SDA)    | SDA            |
| GP5 (I2C0 SCL)    | SCL (SCK)      |

![wiring_i2c](https://github.com/niklauslee/ssd1306/blob/main/images/wiring_i2c.jpg?raw=true)

## SPI

Here is a wiring example for `SPI0`.

| Raspberry Pi Pico | SSD1306 (OLED) |
| ----------------- | -------------- |
| 3V3               | 3V3            |
| GND               | GND            |
| GP19 (SPI0 TX)    | DATA           |
| GP18 (SPI0 CLK)   | CLK            |
| GP20              | D/C            |
| GP21              | RST            |
| GP17              | CS             |

![wiring_spi](https://github.com/niklauslee/ssd1306/blob/main/images/wiring_spi.jpg?raw=true)

# Usage

## I2C

You can initialize SSD1306 driver using I2C interface as below:

```js
const {SSD1306} = require('ssd1306/i2c');
const ssd1306 = new SSD1306();
ssd1306.setup(board.i2c(0), {
  width: 128,
  height: 64  
});

const gc = ssd1306.getContext();
// Use graphics APIs
// gc.drawRect(0, 0, width, height);
// gc.display();
```

## SPI

You can initialize SSD1306 driver using SPI interface as below:

```js
const {SSD1306} = require('ssd1306/spi');
const ssd1306 = new SSD1306();

ssd1306.setup(board.spi(0), {
  width: 128,
  height: 64,
  dc: 20,
  rst: 21,
  cs: 17
})

const gc = ssd1306.getContext();
// Use graphics APIs
// gc.drawRect(0, 0, width, height);
// gc.display();
```

# API

## I2C

### Class: i2c.SSD1306

A class for SSD1306 driver communicating with I2C interface.

#### new SSD1306()

Create an instance of SSD1306 driver.

#### ssd1306.setup(i2c[, options])

- **`i2c`** `<I2C>` An instance of `I2C` to communicate.
- **`options`** `<object>` Options for initialization.
  - **`width`** `<number>` Width of display in pixels. Default: `128`.
  - **`height`** `<number>` Height of display in pixels. Default: `64`.
  - **`rst`** `<number>` Pin number for reset. Default: `-1`.
  - **`address`** `<number>` I2C slave address. Default: `0x3c`.
  - **`extVcc`** `<boolean>` Indicate whether to use external VCC. Default: `false`.
  - **`rotation`** `<number>` Rotation of screen. One of `0` (0 degree), `1` (90 degree in clockwise), `2` (180 degree in clockwise), and `3` (270 degree in clockwise). Default: `0`.

Setup SSD1306 driver for a given I2C bus and options.

#### ssd1306.getContext()

- **Returns**: `<BufferedGraphicsContext>` An instance of buffered graphic context for SSD1306.

#### ssd1306.on()

Turn on the display.

#### ssd1306.off()

Turn off the display.

#### ssd1306.setContrast(contrast)

- **`contrast`** `<number>` Contrast value.

Set contrast of the display.

## SPI

### Class: spi.SSD1306

A class for SSD1306 driver communicating with SPI interface.

#### new SSD1306()

Create an instance of SSD1306 driver.

#### ssd1306.setup(spi[, options])

- **`spi`** `<SPI>` An instance of `SPI` to communicate.
- **`options`** `<object>` Options for initialization.
  - **`width`** `<number>` Width of display in pixels.
  - **`height`** `<number>` Height of display in pixels.
  - **`dc`** `<number>` Pin number for DC.
  - **`rst`** `<number>` Pin number for RST (Reset).
  - **`cs`** `<number>` Pin number of CS (Chip select).
  - **`extVcc`** `<boolean>` Indicate whether to use external VCC. Default: `false`.
  - **`rotation`** `<number>` Rotation of screen. One of `0` (0 degree), `1` (90 degree in clockwise), `2` (180 degree in clockwise), and `3` (270 degree in clockwise). Default: `0`.

Setup SSD1306 driver for a given SPI bus and options.

#### ssd1306.getContext()

- **Returns**: `<BufferedGraphicsContext>` An instance of buffered graphic context for SSD1306.

#### ssd1306.on()

Turn on the display.

#### ssd1306.off()

Turn off the display.

#### ssd1306.setContrast(contrast)

- **`contrast`** `<number>` Contrast value.

Set contrast of the display.

# Examples

* `examples/ex_i2c_128x32.js` (128x32 resolution via I2C)
* `examples/ex_i2c_128x64.js` (128x64 resolution via I2C)
* `examples/ex_spi_128x32.js` (128x32 resolution via SPI)
* `examples/ex_spi_128x64.js` (128x64 resolution via SPI)
