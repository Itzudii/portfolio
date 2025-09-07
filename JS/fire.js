import {img} from "./jsnake.js"
export class Fire {
    constructor() {
      this.imgs = [];
      this.frame = 0;
      this.speed = .1;
      // this.drawscreen = drawscreen;
    }
    async _addimg(key, data) {
      // this.imgs[key] = [];
      for (let i = 0; i < data[key].length; i++) {
        let img = await img.imageload(data[key][i]);
        let imge = await img.scale(img, [.3, .3]);
        this.imgs.push(imge);
        this.w = imge.width;

      }


    }
    async init() {
      this.data = await loadjson("firemap.json");
      this.stages = Object.keys(this.data);
      // this.stages.forEach((key)=>{
      // });


      for (let i = 0; i < this.stages.length; i++) {
        await this._addimg(this.stages[i], this.data);
      }

    }
    draw(screen, coord, array) {
      screen.ctx.clearRect(0, 0, screen.w, screen.h);
      if (this.frame > array.length) {
        this.frame = 0;
      }
      screen.blit(this.imgs[Math.floor(this.frame)], [coord[0], coord[1]]);
      // screen.scale_blit(this.imgs[Math.floor(this.frame)],[coord[0],coord[1]])

      this.frame += this.speed;
    }
    run(screen,x,y) {

      this.draw(screen, [x, y], this.imgs);
    }
  }