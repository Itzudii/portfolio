import { randomInt } from "./useful.js";
export class DayCycle {
    constructor() {
        this.isDay = false;
        this.cloud = document.querySelectorAll('.cloud');
        this.star = document.querySelectorAll('.star');
        this.sunimg = document.querySelector('.sun-img');
        this.sky = document.querySelector('.sky');
        this.star_create();
        this.star = document.querySelectorAll('.star');

    }


    star_create() {
        for (let i = 0; i < 20; i++) {
            let a = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            a.setAttribute('class', 'star');
            a.setAttribute('x', randomInt(0, 100) + '%');
            a.setAttribute('y', randomInt(0, 233));
            a.setAttribute('fill', "white");
            a.setAttribute('width', "5");
            a.setAttribute('height', "5");
            this.sky.appendChild(a);

        }
    }
    night() {
        this.cloud.forEach(div => {
            div.style.display = 'none';
        })
        this.star.forEach(div => {
            div.style.display = 'block';
        })
        this.sunimg.style.filter = `grayscale(1)`;
    }

    day() {
        this.cloud.forEach(div => {
            div.style.display = 'block';
        })
        this.star.forEach(div => {
            div.style.display = 'none';
        })
        this.sunimg.style.filter = `grayscale(0)`;

    }
    update() {

        if (!this.isDay) {
            this.day();
            this.isDay = true;
        } else {
            this.night();
            this.isDay = false;

        }

    }
    start() {
        const fps = 120000; //120 sec day and 120 sec night
        document.documentElement.style.setProperty("--time",`${(fps/1000)*2}s`); // chnage --time in root according to fps
        this.update();
        setInterval(() => {
            this.update();
        }, fps);
    }

}

function leftswap() {

    const board = document.querySelector('.certificate-board');
    let certificates = document.querySelectorAll('.certificate');


    certificates.forEach(certificate => {
        certificate.style.transition = '1s';
        certificate.style.transform = `translate(-260px)`;

    })
    let interval = setInterval(() => {
        certificates.forEach(certificate => {

            certificate.style.transition = '0s';
            certificate.style.transform = `translate(0px)`;
        });
        board.appendChild(certificates[0]);
        clearInterval(interval);


    }, 1000);


}
