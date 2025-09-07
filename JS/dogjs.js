import { loadjson } from "./useful.js";
// import { jsnake } from "../src/main.js";
import { Display ,Img} from "./jsnake.js";
export class Dog {
    constructor(land) {
      this.imgs = {};
      this.frame = 0;
      this.speed = .2;
      this.land = land;
      this.drawscreen = this.land.aniScreen;
      this.cltrscreen = this.land.filtScreen;
      this.TW = this.land.TW;
      // this.standby = true;
      this.dogx = this.TW*12;
      this.dogspeed = 2;
      this.x = 100;
      this.direction = "right";
      this.state = "sit";
      this.w;



    }
    async _addimg(key, data) {
      this.imgs[key] = [];
      for (let i = 0; i < data[key].length; i++) {
        let _img =  await Img.imageload(data[key][i]);
        let imge =  await Img.scale(_img, [1, 1]);
        let invimge =  await Img.scale(_img, [-1, 1]);
        this.imgs[key].push({ "right": imge, "left": invimge });
        this.w = imge.width;

      }


    }
    async init() {
      this.data = await loadjson("data/dog.json");
      this.stages = Object.keys(this.data);


      for (let i = 0; i < this.stages.length; i++) {
        await this._addimg(this.stages[i], this.data);
      }

    }
    draw(screen, coord, array) {
      screen.ctx.clearRect(0, 0, screen.w, screen.h);
      if (this.frame > array.length) {
        this.frame = 0;
      }
      // screen.blit(this.imgs[this.state][Math.floor(this.frame)][this.direction], [coord[0], coord[1]])
      screen.scale_blit(this.imgs[this.state][Math.floor(this.frame)][this.direction], [coord[0], coord[1]],[this.TW*3.1,this.TW*3])

      this.frame += this.speed;
    }
    run(y, isDay = true) {
      this.x = this.land.mouseX;
      this.standby = this.land.standby;
      if (isDay) {
        if (!this.standby) {

          // walk
          if (this.dogx < this.x - this.w) {
            this.dogx += this.dogspeed;
            this.direction = 'right';
            this.state = "run";
          } else if (this.dogx > this.x) {
            this.dogx -= this.dogspeed;
            this.direction = 'left';
            this.state = "run";
          } else {

            this.state = "crouch";
          }
          if (this.dogx < this.TW * 6) {
            this.state = "crouch";
            this.dogx = this.TW * 6;
          } else if (this.dogx > this.TW * 27) {
            this.state = "crouch";
            this.dogx = this.TW * 27;
          }
        } else {
          this.state = "sit";
        }

      } else {
        // sleep
        this.state = "sleep";

      }


      this.draw(this.drawscreen, [this.dogx, y], this.imgs[this.state]);
    }
  }