const getPixels = require('get-pixels');

export const rgbToHex = (rgb) => {
  let hex = Number(rgb).toString(16);
  if (hex.length < 2) {
    hex = '0' + hex;
  }
  return hex;
};

export const fullColorHex = (r, g, b) => {
  let red = rgbToHex(r);
  let green = rgbToHex(g);
  let blue = rgbToHex(b);
  return red + green + blue;
};

export const getColorFromImage = async (image) => {
  const pixels = await new Promise((resolve, reject) => {
    getPixels(image, function(err, pixels) {
      if(err) {
        reject(err)
        return
      }
      resolve(pixels.data);
    })
  });

  // @ts-ignore
  return fullColorHex(pixels[0], pixels[1], pixels[2]);
}