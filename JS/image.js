/*!
 * jSnake.js - A JavaScript Game Development Library
 * Copyright © 2025 [Uditya Patel]
 * Licensed under the GNU General Public License v3.0
 * https://www.gnu.org/licenses/gpl-3.0.en.html
 */
// export class filter {
//     constructor(imgobj){
//         this.imgobj = imgobj;
//     }
//     async _transformation(img,fnc) {
//             let canv = document.createElement('canvas');
//             let ctx = canv.getContext('2d');
//             canv.width = img.width;
//             canv.height =img.height;
    
//             fnc(ctx);
//             // ctx.translate(canv.width / 2, canv.height / 2);
            
//             ctx.drawImage(img, -img.width / 2, -img.height / 2);
//             return await this.imageload( canv.toDataURL());
            
//         }
//     async blur(img) {
//              return await this._transformation(img, (ctx) => {
//                 ctx.rotate(90 * Math.PI / 180);
//             },[img.height,img.width]);
//         }
// }
export class image {
    /**
     * 
     * @param {string} src 
     * eg. -> 'https://example.com/image.png', 'assets/image.jpg'
     * This class is used to load and manipulate images.
     * @returns {Image}
     */
    async imageload(src){
            return new Promise((resolve,reject) => {
                const img = new Image();
                img.src = src;
                img.onload = () => resolve(img);
                img.onerror = () => reject;
            });  
        }
        /**
         * hidden method to apply transformation on image
         * @description This method applies a transformation function to an image and returns a new image not use by user!.
         * @param {Image} img 
         * @param {method} fnc 
         * @param {[width,height]} size 
         * @returns {Image}
         */

        async _transformation(img,fnc,size) {
            let canv = document.createElement('canvas');
            let ctx = canv.getContext('2d');
            canv.width = size[0];
            canv.height =size[1];
    
            ctx.translate(canv.width / 2, canv.height / 2);
            fnc(ctx);
            
            ctx.drawImage(img, -img.width / 2, -img.height / 2);
            return await this.imageload( canv.toDataURL());
            
        }
        /**
         * This method scale image and returns a new image.
         * @param {Image} img - The image to be transformed.
         * @param {method} fnc - The transformation function to be applied.
         * @param {[scalevalue,scalevalue]} size - The size of the canvas to draw the transformed image on.
         * -> [1,1] -> no scale
         * -> [2,2] -> double size
         * -> [0.5,0.5] -> half size
         * -> [0.5,1] -> half width and full height
         * -> [1,0.5] -> full width and half height
         * -> [-1,-1] -> flip image
         * -> [1,-1] -> flip image vertically
         * -> [-1,1] -> flip image horizontally
         * @returns {Image} - The transformed image.
         */
        async scale(img,point) {
            return await this._transformation(img, (ctx) => {
                ctx.scale(point[0], point[1]);
            },[img.width*Math.abs(point[0]),img.height*Math.abs(point[1])]);
            
        }
        /**
         * This method rotates image 90 degrees clockwise and returns a new image.
         * @param {Image} img - The image to be transformed.
         * @returns {Image} - The transformed image.
         */

        async rotate90(img) {
             return await this._transformation(img, (ctx) => {
                ctx.rotate(90 * Math.PI / 180);    
            },[img.height,img.width]);
        }

        _match(dic) {
        const meta = {
            blur: "px",
            brightness: "",
            contrast: "",
            grayscale: "%",
            invert: "%",
            opacity: "",
            saturate: "",
            sepia: "%"
        };

        const newStrings = [];
        for (const key in dic) {
            if (dic.hasOwnProperty(key)) {
                newStrings.push(`${key}(${dic[key]}${meta[key] || ""})`);
            }
        }

        return newStrings.join(" ");
    }

        async filter(img, dict = {}) {
  return await this._transformation(
    img,
    (ctx) => {
      console.log(this._match(dict));
      ctx.filter = this._match(dict);
    },
    [img.height, img.width]
  );
//         async filter(img, {
//   _blur = 0,
//   brightness = 1,
//   contrast = 1,
//   grayscale = 0,
//   invert = 0,
//   opacity = 1,
//   saturate = 1,
//   sepia = 0,
//   dropShadow = [0, 0, 0, 'transparent']
// } = {}) {
//   return await this._transformation(
//     img,
//     (ctx) => {
//       ctx.filter = `
//         blur(${_blur}px)
//         brightness(${brightness})
//         contrast(${contrast})
//         grayscale(${grayscale}%)
//         invert(${invert}%)
//         opacity(${opacity})
//         saturate(${saturate})
//         sepia(${sepia}%)
//         drop-shadow(${dropShadow[0]}px ${dropShadow[1]}px ${dropShadow[2]}px ${dropShadow[3]})
//       `;
//     },
//     [img.height, img.width]
//   );
}
        
        


        /**
     * get the type of the sprite
     * @returns {string}
     */
        __type__(){
        return 'image';
    }
}
