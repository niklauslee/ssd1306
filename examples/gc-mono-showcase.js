const font = require("simple-fonts/lee-sans");
const logo = require("./logo.bmp.json");

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
