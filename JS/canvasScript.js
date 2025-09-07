// import { jsnake } from "../src/main.js";
import { LightSpot } from "./lightspot.js";
import { loadjson, fix, randomInt, domtopng } from "./useful.js";
import { Dog } from "./dogjs.js";
import { Particle } from "./particle.js";
import { DayCycle } from "./daycycle.js";
import {Book} from "./book.js";
import { Display,Img } from "./jsnake.js";


const torchimg_src = 'assets/cursor/Torch.png';
const boneimg_src = 'assets/cursor/Bone.png';
const lavabucketimg_src = 'assets/cursor/Lava_Bucket.png';

const landtile = 'tiles/land.png';
const cavetile = 'tiles/cave.png';
const lavatile = 'tiles/lava.png';

async function load_draw(screen, map, tileWidth, tileHeight, start, last) {

  const tilesets = await Promise.all(
    map.tilesets.map(ts => Img.imageload(ts.image).then(img => ({ ...ts, img })))
  );

  let sdiff = 1 / start;
  let ldiff = 1 / last;

  const layer = map.layers[0];
  for (let row = 0; row < layer.height; row++) {
    const brightness = Math.min(fix(row * sdiff), fix((layer.height - row) * ldiff));
    if (start != 1 || last != 1) {
      screen.ctx.filter = `brightness(${brightness})`;
    }
    for (let col = 0; col < layer.width; col++) {
      const tileIndex = row * layer.width + col;
      const gid = layer.data[tileIndex];
      if (gid === 0) continue; // for empty tile

      const tileset = tilesets.slice().reverse().find(ts => gid >= ts.firstgid);
      if (!tileset) continue;

      const localId = gid - tileset.firstgid;
      const cols = tileset.columns;
      const sx = (localId % cols) * tileset.tilewidth;
      const sy = Math.floor(localId / cols) * tileset.tileheight;
      const img = tileset.img;


      screen.slice_blit(img,
        [sx, sy], [tileset.tilewidth, tileset.tileheight],
        [col * tileWidth, row * tileHeight], [tileWidth, tileHeight]
      )

    }

    screen.ctx.filter = `none`;
  }

}

class imgRender{
      
      constructor(id,src,mw,mh){
        
        this.ID = id;
        this.SRC = src;
        this.MW = mw;
        this.MH = mh;
        this.WW = window.innerWidth;

        this.imgdiv = document.getElementById(id);
        this.imgdiv.style.backgroundImage = `url(${src})`;
        this.update();
        
        window.addEventListener('resize',()=>{
          const w = window.innerWidth;
          this.WW = w;
          this.update();
          
        })
      }
      update(){
        
        this.imgdiv.style.width =  `${this.WW}px`;
        this.imgdiv.style.height =  `${(this.WW/this.MW)*this.MH}px`;
        this.imgdiv.style.backgroundSize =  `${this.WW}px `;
      }
      
    }

class Land {
  constructor() {
    this.MW = 36;
    this.MH = 21;
    this.WW = window.innerWidth;
    this.WH = window.innerHeight;
    this.TW = this.WW / this.MW;
    this.BR = this.WW / 8;

    this.torchlight = new LightSpot("#ffd786", 0, .1);

    this.IDS = 'houseJSnakeCanvas'; //id static
    this.IDA = 'house2JSnakeCanvas';// id animaiton
    this.IDF = 'house3JSnakeCanvas';//id filter

    new imgRender(this.IDS,landtile,this.MW,this.MH);

    
    this.canvasWH = [this.WW, this.MH * this.TW];

    this.ani = new Display(this.IDA);
    this.aniScreen = this.ani.set_mode(this.canvasWH);

    this.filt = new Display(this.IDF);
    this.filtScreen = this.filt.set_mode(this.canvasWH);

    this.mouseX = this.filtScreen.w / 2;
    this.mouseY = this.filtScreen.h / 2;
    this.filtScreen.canvas.addEventListener("mousemove", (e) => {
      const rect = this.filtScreen.canvas.getBoundingClientRect();
      this.mouseX = (e.clientX - rect.left) * (this.filtScreen.w / rect.width);
      this.mouseY = (e.clientY - rect.top) * (this.filtScreen.h / rect.height);
    });

    this.standby = true;
    this.filtScreen.canvas.addEventListener("mouseenter", () => {
      this.standby = false;
    })
    this.filtScreen.canvas.addEventListener("mouseleave", () => {
      this.standby = true;
    })

    // animation 
    this.dog = new Dog(this);

  }

  async init_obj() {
    // create Dog 
    await this.dog.init();
    this.bone = await Img.imageload(boneimg_src);

  }

  async draw_static_tiles(start, end) { // start and end layes effects
    await load_draw(this.staticScreen, this.MP, this.TW, this.TW, start, end);
  }

  filter_and_light() {
    const screen = this.filtScreen;
    const ctx = screen.ctx;

    let rad = this.torchlight.radius(this.BR, 5, 150);

    ctx.globalCompositeOperation = "source-over";
    ctx.clearRect(0, 0, screen.w, screen.h);

    ctx.globalCompositeOperation = "destination-out";
    this.torchlight.carve(screen.ctx, this.TW * 13.5, this.TW * 15.5, rad);
    this.torchlight.carve(screen.ctx, this.TW * 23, this.TW * 15.5, rad);

    ctx.globalCompositeOperation = "lighter";
    this.torchlight.tintGlow(screen.ctx, this.TW * 13.5, this.TW * 15.5, rad);
    this.torchlight.tintGlow(screen.ctx, this.TW * 22.5, this.TW * 14.5, rad);

    ctx.globalCompositeOperation = "source-over";

  }
  animation(isDay) {
    this.dog.run(this.TW * 13.5, isDay);
    if (!this.standby) {
      this.aniScreen.scale_blit(this.bone, [this.mouseX, this.mouseY], [this.TW, this.TW]) // Bone
    }
  }
}

class Cave {
  constructor() {
    this.MW = 36;
    this.MH = 28;
    this.WW = window.innerWidth;
    this.WH = window.innerHeight;
    this.TW = this.WW / this.MW;
    this.BR = this.WW / 8;

    this.yellowlight = new LightSpot("#ffd786", 0.2, .2);
    this.violetlight = new LightSpot("#be83b5", 0.2, 0.2);
    this.bluelight = new LightSpot("#005da3", 0.2, 0.2);
    this.torchlight = new LightSpot("#ffd786", 0, .1);
    // this.orangelight = new LightSpot("#c85000", 0, .3);

    this.IDS = 'cavel1JSnakeCanvas';
    this.IDA = 'cavel3JSnakeCanvas';
    this.IDF = 'cavel2JSnakeCanvas';

    new imgRender(this.IDS,cavetile,this.MW,this.MH);
    
    this.canvasWH = [this.WW, this.MH * this.TW];
    //4
    this.ani = new Display(this.IDA);
    this.aniScreen = this.ani.set_mode(this.canvasWH);

    //5
    this.filt = new Display(this.IDF);
    this.filtScreen = this.filt.set_mode(this.canvasWH);

    this.mouseX = this.filtScreen.w / 2;
    this.mouseY = this.filtScreen.h / 2;
    this.filtScreen.canvas.addEventListener("mousemove", (e) => {
      const rect = this.filtScreen.canvas.getBoundingClientRect();
      this.mouseX = (e.clientX - rect.left) * (this.filtScreen.w / rect.width);
      this.mouseY = (e.clientY - rect.top) * (this.filtScreen.h / rect.height);
    });

    this.standby = true;
    this.filtScreen.canvas.addEventListener("mouseenter", () => {
      this.standby = false;
    })
    this.filtScreen.canvas.addEventListener("mouseleave", () => {
      this.standby = true;
    })

  }

  async draw_static_tiles(start, end) { // start and end layes effects
    await load_draw(this.staticScreen, this.MP, this.TW, this.TW, start, end);
  }

  async init_obj() {
    this.torch = await Img.imageload(torchimg_src);

  }

  filter_and_light() {
    const screen = this.filtScreen;
    const ctx = screen.ctx;

    ctx.globalCompositeOperation = "source-over";
    ctx.clearRect(0, 0, screen.w, screen.h);          // optional, keeps buffer clean
    ctx.fillStyle = "rgba(0,0,0,0.7)";
    ctx.fillRect(0, 0, screen.w, screen.h);

    // Precompute radii once per frame so both passes match
    const r1 = this.yellowlight.radius(this.BR, 4, 150);
    const r2 = this.violetlight.radius(this.BR, 4, 150);
    const r3 = this.bluelight.radius(this.BR, 0, 150);
    const rm = this.yellowlight.radius(this.BR, 4, 150);   // mouse

    // 2) PASS A: carve alpha (make overlay thinner under lights)
    ctx.globalCompositeOperation = "destination-out";
    // cave
    this.yellowlight.carve(ctx, this.TW * 10, this.TW * 7, r1);
    this.yellowlight.carve(ctx, this.TW * 21, this.TW * 6, r1);
    this.yellowlight.carve(ctx, this.TW * 25, this.TW * 8, r1);
    this.yellowlight.carve(ctx, this.TW * 29, this.TW * 10, r1);
    this.yellowlight.carve(ctx, this.TW * 34, this.TW * 7.5, r1);
    this.violetlight.carve(ctx, this.TW * 15, this.TW * 16, r2);
    this.violetlight.carve(ctx, this.TW * 28.5, this.TW * 24, r2);
    this.violetlight.carve(ctx, this.TW * 33, this.TW * 23, r2);
    this.bluelight.carve(ctx, this.TW * 10, this.TW * 18, r3);
    this.bluelight.carve(ctx, this.TW * 2, this.TW * 12, r3);
    if (!this.standby) {
      this.yellowlight.carve(ctx, this.mouseX, this.mouseY, rm);
    }


    // 3) PASS B: colored glow (additive)
    ctx.globalCompositeOperation = "lighter";
    //cave
    this.yellowlight.tintGlow(ctx, this.TW * 10, this.TW * 7, r1);
    this.yellowlight.tintGlow(ctx, this.TW * 21, this.TW * 6, r1);
    this.yellowlight.tintGlow(ctx, this.TW * 25, this.TW * 8, r1);
    this.yellowlight.tintGlow(ctx, this.TW * 29, this.TW * 10, r1);
    this.yellowlight.tintGlow(ctx, this.TW * 34, this.TW * 7.5, r1);
    this.violetlight.tintGlow(ctx, this.TW * 15, this.TW * 16, r2);
    this.violetlight.tintGlow(ctx, this.TW * 28.5, this.TW * 24, r2);
    this.violetlight.tintGlow(ctx, this.TW * 33, this.TW * 23, r2);
    this.bluelight.tintGlow(ctx, this.TW * 10, this.TW * 18, r3);
    this.bluelight.tintGlow(ctx, this.TW * 2, this.TW * 12, r3);
    if (!this.standby) {
      this.yellowlight.tintGlow(ctx, this.mouseX, this.mouseY, rm);
    }


    // 4) Reset and loop
    ctx.globalCompositeOperation = "source-over";

  }
  animation() {
    this.aniScreen.ctx.clearRect(0, 0, this.filtScreen.w, this.filtScreen.h);
    if (!this.standby) {

      this.aniScreen.scale_blit(this.torch, [this.mouseX - 14, this.mouseY - 10], [this.TW * 2, this.TW * 2]) // Bone
    }
  }
}

class Lava {
  constructor() {
    this.MW = 36;
    this.MH = 21;
    this.WW = window.innerWidth;
    this.WH = window.innerHeight;
    this.TW = this.WW / this.MW;
    this.BR = this.WW / 8;

    this.bluelight = new LightSpot("#005da3", 0.2, 0.2);
    this.orangelight = new LightSpot("#c85000", 0, .3);

    this.IDS = 'lava1JSnakeCanvas';
    this.IDA = 'lava3JSnakeCanvas';
    this.IDF = 'lava2JSnakeCanvas';

    new imgRender(this.IDS,lavatile,this.MW,this.MH);
    
    this.canvasWH = [this.WW, this.MH * this.TW];
    
    this.ani = new Display(this.IDA);
    this.aniScreen = this.ani.set_mode(this.canvasWH);

    this.filt = new Display(this.IDF);
    this.filtScreen = this.filt.set_mode(this.canvasWH);

    // not implement now it can be implement later... mouse x and y
    this.mouseX = this.filtScreen.w / 2;
    this.mouseY = this.filtScreen.h / 2;
    this.filtScreen.canvas.addEventListener("mousemove", (e) => {
      const rect = this.filtScreen.canvas.getBoundingClientRect();
      this.mouseX = (e.clientX - rect.left) * (this.filtScreen.w / rect.width);
      this.mouseY = (e.clientY - rect.top) * (this.filtScreen.h / rect.height);
    });

    // animation
    this.particles = [];
    setInterval(() => {
      this._emitParticles(this.particles, 3, randomInt(this.TW * 7, this.TW * 20), this.TW * 18);


    }, 2000);

    this.userparticles = [];
    setInterval(() => {
      this._emitParticles(this.userparticles, 10, this.mouseX, this.mouseY);

    }, 1000);


    this.standby = true;
    this.filtScreen.canvas.addEventListener("mouseenter", () => {
      this.standby = false;
    })
    this.filtScreen.canvas.addEventListener("mouseleave", () => {
      this.standby = true;
    })
  }

  async init_obj() {
    this.lavabucket = await Img.imageload(lavabucketimg_src);

  }

  filter_and_light() {
    const screen = this.filtScreen;
    const ctx = screen.ctx;

    ctx.globalCompositeOperation = "source-over";
    ctx.clearRect(0, 0, screen.w, screen.h);          // optional, keeps buffer clean
    ctx.fillStyle = "rgba(0,0,0,.4)";
    ctx.fillRect(0, 0, screen.w, screen.h);

    // Precompute radii once per frame so both passes match
    const r1 = this.orangelight.radius(this.BR, 4, 150);
    const r3 = this.bluelight.radius(this.BR, 4, 150);

    // 2) PASS A: carve alpha (make overlay thinner under lights)
    ctx.globalCompositeOperation = "destination-out";
    this.orangelight.carve(ctx, this.TW * 7, this.TW * 16, r1);
    this.orangelight.carve(ctx, this.TW * 11, this.TW * 5, r1);
    this.orangelight.carve(ctx, this.TW * 11, this.TW * 9.5, r1);
    this.orangelight.carve(ctx, this.TW * 11, this.TW * 15, r1);
    this.orangelight.carve(ctx, this.TW * 15, this.TW * 18, r1);
    this.orangelight.carve(ctx, this.TW * 22, this.TW * 18, r1);
    this.bluelight.carve(ctx, this.TW * 31, this.TW * 9.5, r3);

    // 3) PASS B: colored glow (additive)
    ctx.globalCompositeOperation = "lighter";
    this.orangelight.tintGlow(ctx, this.TW * 7, this.TW * 16, r1);
    this.orangelight.tintGlow(ctx, this.TW * 11, this.TW * 5, r1);
    this.orangelight.tintGlow(ctx, this.TW * 11, this.TW * 9.5, r1);
    this.orangelight.tintGlow(ctx, this.TW * 11, this.TW * 15, r1);
    this.orangelight.tintGlow(ctx, this.TW * 15, this.TW * 18, r1);
    this.orangelight.tintGlow(ctx, this.TW * 22, this.TW * 18, r1);
    this.bluelight.tintGlow(ctx, this.TW * 31, this.TW * 9.5, r3);

    // 4) Reset and loop
    ctx.globalCompositeOperation = "source-over";

  }
  _emitParticles(array, limit, x, y) {
    for (let i = 0; i < limit; i++) {
      array.push(new Particle(x, y));
    }
  }

  animation() {
    const screen = this.aniScreen;
    const ctx = screen.ctx;
    ctx.clearRect(0, 0, screen.w, screen.h); // clear buffer
    ctx.fillStyle = "rgba(0, 0, 0, 0.01)";
    ctx.fillRect(0, 0, screen.w, screen.h);

    this.particles = this.particles.filter(p => p.life > 0);
    for (let p of this.particles) {
      p.update();
      p.draw(ctx);
    }

    
    if(!this.standby) {
      
      this.userparticles = this.userparticles.filter(p => p.life > 0);
      for (let p of this.userparticles) {
        p.update();
        p.draw(ctx);
      }
      this.aniScreen.scale_blit(this.lavabucket, [this.mouseX , this.mouseY ], [this.TW, this.TW ]) // Bone
    }
    
  }

}
async function main() {

  // land ======================================
  const land = new Land();
  await land.init_obj();
  
  //  cave ======================================
  const cave = new Cave();
  await cave.init_obj();
  
  //  lava ======================================
  const lava = new Lava();
  await lava.init_obj();

  const daycycle = new DayCycle();
  daycycle.start();

  const book = new Book();
  await book.init();
  // loader disable
  const loader = document.querySelector('#loader');
  loader.style.display = 'none';
  document.body.classList.remove('noyscroll');


  function run() {

    land.filter_and_light();
    land.animation(daycycle.isDay);

    cave.filter_and_light();
    cave.animation();

    lava.filter_and_light();
    lava.animation();

    book.run(0,0);

    requestAnimationFrame(run);
  }

  run();

}

window.addEventListener("load", main)