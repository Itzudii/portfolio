/*!
 * jSnake.js - A JavaScript Game Development Library
 * Copyright © 2025 [Uditya Patel]
 * Licensed under the GNU General Public License v3.0
 * https://www.gnu.org/licenses/gpl-3.0.en.html
 */
export class Font {
    /**
     * 
     * @param {pygame.display.set_mode()} screen 
     * @param {string} font 
     * ->'arial', 'times new roman', 'courier new', etc.
     * @param {int} size 
     */


    constructor(screen, font, size) {
        this.screen = screen;
        this.font = font;
        this.fontsize = size;
    }
    /**
     * render text on the screen
     * @param {string} text - the text to render
     * @param {[0,0,0]} color - tuples[int,int,int]
     * @param {[x,y]} position - the x and y coordinates of the text
     */
    fillrender(text, color, position) {
        let [r, g, b] = color;
        this.screen.ctx.font = `${this.fontsize}px ${this.font}`;
        this.screen.ctx.fillStyle = `rgb(${r},${g},${b})`;
        this.screen.ctx.textBaseline = "top";
        this.screen.ctx.fillText(text, position[0], position[1]);

    }
    /**
     * render text with outline on the screen
     * @param {string} text - the text to render
     * @param {[0,0,0]} color - tuples[int,int,int]
     * @param {[x,y]} position - the x and y coordinates of the text
     * @param {int} width - the width of the outline
     * @returns {void}
    */
    outlinerender(text, color, position, width) {
        let [r, g, b] = color;
        this.screen.ctx.font = `${this.fontsize}px ${this.font}`;
        this.screen.ctx.strokeStyle = `rgb(${r},${g},${b})`;
        this.screen.ctx.lineWidth = width;
        this.screen.ctx.textBaseline = "top";
        this.screen.ctx.strokeText(text, position[0], position[1]);

    }
    /**
     * return the type of the object
     * @returns {string}
     */
    __type__(){
        return 'font';
    }
}