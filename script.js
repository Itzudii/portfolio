import { loadjson, randomInt ,randomChoice } from "./JS/useful.js";
async function addCerticates() {
    //add certificate by the file certificate json         
    const certificateBoard = document.querySelector('.certificate-board');
    function createCertificate(name, src) {
        const div = document.createElement('div');
        div.className = "certificate";
        div.innerHTML = ` <div class="certificate-img" style="background-image: url(${src});" data-rawsrc="${btoa(src)}">
        </div>
        <div class="certificate-detail">
        <p style="margin-top:10px;">certificates</p>
        <p>${name}</p>
                        
        </div>`;
        return div;
    }
    const data = await loadjson('data/certificates.json');
    data.forEach(element => {
        const div = createCertificate(element.name, element.src);
        certificateBoard.appendChild(div);

    });

}
function imgmodelbehaviour() {
    // img zoom effect of certificate
    const certificates = document.querySelectorAll('.certificate');
    const model = document.querySelector('.model-section');
    const modelimg = document.querySelector('.model-img');
    const modelcanclebtn = document.querySelector('.model-canclebtn');
    const body = document.querySelector('body');
    certificates.forEach(certificate => {
        certificate.addEventListener("click", () => {
            const img = certificate.querySelector('.certificate-img');
            modelimg.src = atob(img.dataset.rawsrc);
            model.style.display = 'grid';
            body.classList.add('noscroll');
        })
    })
    modelcanclebtn.addEventListener("click", () => {
        model.style.display = "none";
        body.classList.remove('noscroll');
    })
}
async function addprojects() {
    const projectBoard = document.querySelector('.projects-collection');
    function createProjectBlock(title, discrip, url, src) {
        const div = document.createElement('a');
        div.href = url;
        div.innerHTML = ` <div class="projects-collection-div"
                                style="background-image: url(${src});">
                                <div></div>
                                <div class="projects-collection-div-base">${title}
                                    <br>
                                    <br>
                                    <i>${discrip}</i>
                                </div>
                            </div>`;
        return div;
    }
    const data = await loadjson('data/projects.json');
    data.forEach(e => {
        const div = createProjectBlock(e.title, e.discription, e.url, e.src);
        projectBoard.appendChild(div);

    });

}

function addstars(limit) {

    
    function createstar(classname, box, x, y) {
        const star = document.createElement('div');
        star.className = [classname];
        star.style.transform = `translate(${x}px,${y}px)`;

        box.appendChild(star);
    }
    const box = document.querySelector('.section-achievement-bg');
    const array = ['section-achievement-star section-achievement-lv1', 'section-achievement-star section-achievement-lv2', 'section-achievement-star section-achievement-lv3'];
    for (let index = 0; index < limit; index++) {
        createstar(randomChoice(array), box, randomInt(0, box.clientWidth - 10), randomInt(0, box.clientHeight - 30));

    }
}
async function addachivement() {
    const achivementwall = document.querySelector('.achievement-wall');
    async function createArchivement(title, name, discription) {
        const div = document.createElement('div');
        div.className = "achievement-frame";
        async function getImg(title) {
            const resource = await loadjson('data/CRPimg.json');
            return resource[title];
        }
        const img = await getImg(title);
        div.innerHTML = `<div class="achievement-frame-img" style="background-image: url(${img});"></div>
                    <div class="achievement-frame-about">
                        <h3>${title.toUpperCase()}</h3>
                        <p>${discription}</p>
                    </div>`;
        return div;
    }
    const data = await loadjson('data/CRP.json');
    data.forEach(async (e) => {
        const div = await createArchivement(e.title, e.name, e.discription);
        achivementwall.appendChild(div);

    });

}

import { Achievement } from "./JS/achievement.js";
async function main() {
    await addCerticates();
    imgmodelbehaviour();
    await addprojects();
    addstars(50);
    await addachivement();
    const a = new Achievement();
    a.init();



}
window.addEventListener("load", main)