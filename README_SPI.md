# Overview

SSD1306 is a monochrome OLED driver.

> If you need I2C version, go to [@niklauslee/ssd1306-i2c](https://kaluma.io/@niklauslee/ssd1306-i2c).

You can get monochrome OLED displays from belows:

- [1.3" 128x64 (from Adafruit)](https://www.adafruit.com/product/938)
- [0.96" 128x64 (from Adafruit)](https://www.adafruit.com/product/326)
- [1" 128x32 - SPI (from Adafruit)](https://www.adafruit.com/product/661)

# Wiring (SPI)

Here is a wiring example for `SPI0`.

Raspberry Pi Pico | SSD1306 (OLED)
------------ | -------------
3V3 | 3V3
GND | GND
GP19 (SPI0 TX) | DATA
GP18 (SPI0 CLK) | CLK
GP20 | D/C
GP21 | RST
GP17 | CS

![1615804053807.png](/api/projects/niklauslee/ssd1306/photos/1615804053807.png)


# Usage (SPI)

You can initialize SSD1306 driver using SPI interface as below:

```js
const {SSD1306} = require('@niklauslee/ssd1306');
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

# API (SPI)

If you need I2C version, go to [@niklauslee/ssd1306-i2c](https://kameleon.io/@niklauslee/ssd1306-i2c).

## Class: SSD1306

A class for SSD1306 driver communicating with SPI interface.

### new SSD1306()

Create an instance of SSD1306 driver.

### ssd1306.setup(spi[, options])

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

### ssd1306.getContext()

- **Returns**: `<BufferedGraphicsContext>` An instance of buffered graphic context for SSD1306.

Get a graphic context so that you can use [Graphics APIs](https://docs.kaluma.io/api-reference/graphics).

### ssd1306.on()

Turn on the display.

### ssd1306.off()

Turn off the display.

### ssd1306.setContrast(contrast)

- **`contrast`** `<number>` Contrast value.

Set contrast of the display.

# Examples

* `ex_128x32.js` (128x32 resolution via SPI)
* `ex_128x64.js` (128x64 resolution via SPI)
