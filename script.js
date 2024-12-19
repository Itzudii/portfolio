class Day {
    constructor() {
        this.days = true;
        this.cloud = document.querySelectorAll('.cloud');
        this.star = document.querySelectorAll('.star');
        this.sunimg = document.querySelector('.sun-img');
        this.dog = document.querySelector('.dog-img');
        this.bee = document.querySelector('.bee');

        this.sky = document.querySelector('.sky');
        this.star_create();


    }


    star_create() {
        for (let i = 0; i < 20; i++) {
            let a = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            a.setAttribute('class', 'star')
            a.setAttribute('x', getRandomInt(0, 100) + '%');
            a.setAttribute('y', getRandomInt(0, 233));
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
        this.dog.setAttribute('href', 'assets/dogs/dog-sleep.gif');
        this.bee.style.display = 'none';
        
        this.days = true;
    }
    day() {
        this.cloud.forEach(div => {
            div.style.display = 'block';
        })
        this.star.forEach(div => {
            div.style.display = 'none';
        })
        this.sunimg.style.filter = `grayscale(0)`;
        this.dog.setAttribute('href', 'assets/dogs/dog-stay.gif');
        this.bee.style.display = 'block';
        this.days = false;

    }
    update() {
        this.star = document.querySelectorAll('.star');
        if (this.days) {
            this.day();
        } else {
            this.night();

        }

    }

}


function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function leftswap() {

    const board = document.querySelector('.certificate-board');
    let certificates = document.querySelectorAll('.certificate');
    // let downloadbtn = document.querySelectorAll('.certificate-dlodbtn');
    // let default_ = 250;
    // let extend = 50;


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


// DOM loader \/------------------------------------------------------------
document.addEventListener("DOMContentLoaded", function () {

    const day = new Day();
    const fps = 120000;//120 seconds
    day.update();
    let ab = setInterval(() => {

        day.update();
    }, fps);

    let bee = document.querySelector(".bee");
    let bee_box = document.querySelector(".bee-box");
    let arrow = document.querySelector(".arrow");
    let perivousx = 0;
    let perivousy = 0;
    bee.addEventListener("click", () => {
        arrow.style.display = 'none';
        let x = getRandomInt(-200, 200);
        let y = getRandomInt(-100, 100);
        bee_box.style.transform = `translate(${x}px, ${y}px)`;
        if (x < perivousx && y < perivousy) {
            bee.style.transform = ` rotateZ(15deg) `;
        }

        else if (x < perivousx && y > perivousy) {
            bee.style.transform = ` rotateZ(-15deg) `;
        }
        else if (x > perivousx && y > perivousy) {
            bee.style.transform = `rotateY(180deg) rotateZ(-15deg)  `;
        }
        else if (x > perivousx && y < perivousy) {
            bee.style.transform = `rotateY(180deg) rotateZ(15deg) `;
        }

        perivousx = x;
        perivousy = y;

    })

})