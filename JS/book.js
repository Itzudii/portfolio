import { loadjson, clamp, getRandomString } from "./useful.js";
import { Display,Img ,font} from "./jsnake.js";

export class Book {
    constructor() {
        this.canvas = new Display('book');
        this.screen = this.canvas.set_mode([0, 0]);
        this.imgs = [];
        this.frame = 0;
        this.speed = .4;
        this.state = 'close';
        this.skills = ["python", "java"];
        this.current = 0;
        this.textlist = [];
        this.updateText();
        this.font = null;
        this.fonttext = null;
    }

    async _addimg(key, data) {
        this.imgs[key] = [];
        for (let i = 0; i < data[key].length; i++) {
            let _img = await Img.imageload(data[key][i]);
            let imge = await Img.scale(_img, [1, 1]);
            this.imgs[key].push(imge);
            this.w = imge.width;

        }


    }

    async loaddata() {
        const response = await loadjson('data/skills.json');
        this.data = response["book"];
        this.skills = response["skills"];
    }
    async init() {
        //  activate click effect in init
        this.clickeffect(this.screen);
        this.font = new font(this.screen, 'enchant', clamp(10, window.innerWidth / 153.6, 16));
        this.fonttext = new font(this.screen, 'mc', 16)
        this.fonthead = new font(this.screen, 'mc', clamp(20,window.innerWidth/15,32))
        await this.loaddata();

        this.skills.forEach(async (dict) => {
            const _img = await Img.imageload(dict.image)
            dict.image = _img;
        })

        this.stages = Object.keys(this.data);


        for (let i = 0; i < this.stages.length; i++) {
            await this._addimg(this.stages[i], this.data);
        }

        // set canvas size same as image size for better fiting
        const img = this.imgs[this.stages[0]][0];
        const width = Math.min(img.width, window.innerWidth);
        const imgratio = 1.779;
        this.dx = width / 10;
        this.dy = (width / imgratio) / 10;
        this.allsize = [width, width / imgratio]
        this.screen.set_mode(this.allsize);

    }

    draw(screen, coord, array) {
        screen.ctx.clearRect(0, 0, screen.w, screen.h);
        if (this.frame > array.length) {
            this.frame = 0;
            this.state = "open";
            this.current += 1
            this.updateText();
        } else {

            if (this.current == this.skills.length - 1) {
                this.state = 'close';
                this.current = 0;
            }
        }

        screen.scale_blit(array[Math.floor(this.frame)], [coord[0], coord[1]], this.allsize);

        this.frame += this.speed;
    }

    updateText() {
        this.textlist = [getRandomString(9),
        getRandomString(9),
        getRandomString(9),
        getRandomString(9),
        getRandomString(9),
        getRandomString(9)]

    }

    drawEnchantText(font, color) {
        const constant = .1;
        font.fillrender(this.textlist[0], color, [this.dx * 6, this.dy * 3])
        font.fillrender(this.textlist[1], color, [this.dx * 6, this.dy * 4])
        font.fillrender(this.textlist[2], color, [this.dx * 6, this.dy * 5])
        font.fillrender(this.textlist[3], color, [this.dx * 6, this.dy * 6])
        font.fillrender(this.textlist[4], color, [this.dx * 6, this.dy * 7])
        font.fillrender(this.textlist[5], color, [this.dx * 2.1, this.dy * 7.5])

    }

    drawText(font, color) {
        const constant = .1;
        font.fillrender(this.skills[this.current]["name"], color, [this.dx * 6, this.dy * 1]);
        font.fillrender(this.skills[this.current]["type"], color, [this.dx * 2.3, this.dy * 1]);
        this.screen.scale_blit(this.skills[this.current]["image"], [this.dx * 2.3, this.dy * 2], [this.dx * 2, this.dx * 2]);
    }

    _static_draw(screen, coord, array) {

        screen.scale_blit(array[0], [coord[0], coord[1]], this.allsize);

    }

    clickeffect(screen) {
        screen.canvas.addEventListener("click", () => {
            const state = this.state;
            if (state == 'close') {
                this.state = 'open';
            }
            if (state == 'open') {
                this.state = 'ani';
            }


        })
    }

    run(x, y) {
        if (this.state == 'close' || this.state == 'open') {
            this._static_draw(this.screen, [x, y], this.imgs[this.state]);
            if (this.state == 'open') {
                this.drawEnchantText(this.font, [0, 0, 0]);
                this.drawText(this.fonttext, [0, 0, 0]);
            } else {
                this.fonthead.fillrender("Skills", [255, 214, 52], [this.dx * 6.3, this.dy * 2.5])
            }
        } else {

            this.draw(this.screen, [x, y], this.imgs[this.state]);
        }


    }
}

