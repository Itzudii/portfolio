
export function fix(value) {
  if (value < 1) return value
  return 1
}

export function hexToRgb(hex) {
  hex = hex.replace('#', '');
  if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
  const n = parseInt(hex, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

export async function loadImage(src) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = () => resolve(img);
        img.onerror = reject;
      });
    }


export async function loadjson(src) {
  const response = await fetch(src);
  const data = await response.json();
  return data;

}

export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
  
}
export function randomChoice(array) {
        return array[randomInt(0,array.length-1)]

    }

export function getRandomString(length,_prefix = ' ') {
  if (!Number.isInteger(length) || length < 0) {
    throw new TypeError('length must be a non-negative integer');
  }

  const symbols = 'abcdefghijklmnopqrstuvwxyz';
  const out = [];

  for (let i = 0; i < length; i++) {
    out.push(randomChoice(symbols));
  }

  return out.join(_prefix);
}

export function clamp(min,_var,max) {
      if (_var <= min){
        return min
      }else if (_var >= max){
        return max
      }else{
        return _var
      }
      
    }
export function domtopng(canvas,filename){

  const link = document.createElement("a");
  link.download = filename; // File name
  link.href = canvas.toDataURL("image/png"); // Convert to base64 PNG
  link.click();
}

// examples
