/*!
 * jSnake.js - A JavaScript Game Development Library
 * Copyright © 2025 [Uditya Patel]
 * Licensed under the GNU General Public License v3.0
 * https://www.gnu.org/licenses/gpl-3.0.en.html
 */

import { image } from "./image.js";
import { Font } from "./font.js";

export const Img = new image();
export const font = Font;

export class Display {
    /**
     * display class create a canvas
     * -> provide methods to fill color
    */
    constructor(id) {
        this.canvas = document.getElementById(id);
        this.ctx = this.canvas.getContext('2d');
        this.w = this.canvas.style.width;
        this.h = this.canvas.style.height;
    }
    /**
     * set the canvas size
     * @param {Array} size - [width, height]
     * @returns {Display instance}
     */
    set_mode(size) {
        let [w, h] = size;
        this.canvas.width = w;
        this.canvas.height = h;
        this.w= w;
        this.h= h;
        return this
    }
    /**
     * use to fill color to the screen.
     * @param {[0,0,0]} color -> tuples[int,int,int]
         * red => int range(0,255)
         * green => int range(0,255)
         * blue => int range(0,255)
    */
    fill(color) {
        let [r, g, b] = color;
        this.ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    /**
     * 
     * @param {image,Rect} img 
     * @param {[x,y]} coord
     * @returns {void}
     */

    blit(img, coord) {
        try {
            img.__type__(); // for rect
            this.ctx.drawImage(img.image, coord[0], coord[1]);
            return 0;

        } catch (error) {
            ''
        }
        //  for image or for Image inbuild class
        this.ctx.drawImage(img, coord[0], coord[1]);
        
    }
    
    scale_blit(img,dpos,dsize){
        
        this.ctx.drawImage(img, dpos[0],dpos[1],dsize[0],dsize[1]);
        
    }
    slice_blit(img,spos,ssize,dpos,dsize){
        this.ctx.drawImage(img,spos[0],spos[1],ssize[0],ssize[1], dpos[0],dpos[1],dsize[0],dsize[1]);
    }
    
    

    /**
     * get the type of the sprite
     * @returns {string}
     */
    __type__() {
        return 'Display';
    }

}