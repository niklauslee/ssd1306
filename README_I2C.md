# Overview

SSD1306 is a monochrome OLED driver (I2C).

> If you need SPI version, go to [@niklauslee/ssd1306](https://kaluma.io/@niklauslee/ssd1306).

![1582693403736.jpg](/api/projects/niklauslee/ssd1306-i2c/photos/1582693403736.jpg)

You can get monochrome OLED displays from belows:

- [1" 128x32 - I2C (from Adafruit)](https://www.adafruit.com/product/931)

# Wiring (I2C)

Here is a wiring example for `I2C0`.

Raspberry Pi Pico | SSD1306 (OLED)
------------ | -------------
3V3 | VCC (VDD)
GND | GND
GP4 (I2C0 SDA) | SDA
GP5 (I2C0 SCL) | SCL (SCK)

![1615792623029.png](/api/projects/niklauslee/ssd1306-i2c/photos/1615792623029.png)

# Usage (I2C)

You can initialize SSD1306 driver using I2C interface as below:

```js
const {SSD1306} = require('@niklauslee/ssd1306-i2c');
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

# API (I2C)

## Class: SSD1306

A class for SSD1306 driver communicating with I2C interface.

### new SSD1306()

Create an instance of SSD1306 driver.

### ssd1306.setup(i2c[, options])

- **`i2c`** `<I2C>` An instance of `I2C` to communicate.
- **`options`** `<object>` Options for initialization.
  - **`width`** `<number>` Width of display in pixels. Default: `128`.
  - **`height`** `<number>` Height of display in pixels. Default: `64`.
  - **`rst`** `<number>` Pin number for reset. Default: `-1`.
  - **`address`** `<number>` I2C slave address. Default: `0x3c`.
  - **`extVcc`** `<boolean>` Indicate whether to use external VCC. Default: `false`.
  - **`rotation`** `<number>` Rotation of screen. One of `0` (0 degree), `1` (90 degree in clockwise), `2` (180 degree in clockwise), and `3` (270 degree in clockwise). Default: `0`.

Setup SSD1306 driver for a given I2C bus and options.

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

* `ex_128x32.js` (128x32 resolution via I2C)
* `ex_128x64.js` (128x64 resolution via I2C)