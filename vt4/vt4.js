"use strict";
//@ts-check 

const PALIKOITA = 10;
const PALIKKA_CSS_WIDTH = "10%";
const PALIKKA_ANIMATION_DELAY_MS = 100;

// Naiden kasvattimen ei hajota polloa useampaan osaan 
// (meinasin ensin koodata sen niin, mutta turhaa tyota)
const POLLO_X_TILES = 2;
const POLLO_Y_TILES = 2;

let polloImgTiles = [];

window.addEventListener("load", function () {
    lisaaPalkit(PALIKOITA, PALIKKA_ANIMATION_DELAY_MS);
    splitThePollo();
});



function splitThePollo() {
    let img = document.getElementById('pollo');

    // Double tilde poistaa desimaalit. Bittikikkailua.
    let tileLeveys = ~~(img.width/POLLO_X_TILES);
    let tileKorkeus = ~~(img.height/POLLO_Y_TILES);

    let slicet = [];


    // Slice top left
    let sourceX = 0;
    let sourceY = 0;
    let sourceWidth = tileLeveys;
    let sourceHeight = tileKorkeus;
    let destWidth = sourceWidth;
    let destHeight = sourceHeight;
    let destX = 0;
    let destY = 0;
    let polloSliceCanvas1 = luoPolloSliceCanvas(destWidth, destHeight);

    
    document.body.prepend(polloSliceCanvas1);
    let ctx1 = polloSliceCanvas1.getContext('2d');
    ctx1.drawImage(img, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);
    slicet.push(polloSliceCanvas1);

    // Slice top right
    sourceX = tileLeveys;
    let polloSliceCanvas2 = luoPolloSliceCanvas(destWidth, destHeight);
    polloSliceCanvas2.style.left = "300px";
    polloSliceCanvas2.style.top = "0px";
    document.body.prepend(polloSliceCanvas2);
    let ctx2 = polloSliceCanvas2.getContext('2d');
    ctx2.drawImage(img, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);
    slicet.push(polloSliceCanvas2);

    // Slice bottom left
    sourceX = 0;
    sourceY = tileKorkeus;
    let polloSliceCanvas3 = luoPolloSliceCanvas(destWidth, destHeight);
    polloSliceCanvas3.style.left = "0px";
    polloSliceCanvas3.style.top = "300px";
    document.body.prepend(polloSliceCanvas3);
    let ctx3 = polloSliceCanvas3.getContext('2d');
    ctx3.drawImage(img, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);
    slicet.push(polloSliceCanvas3);


    // Slice bottom right
    sourceX = tileLeveys;
    sourceY = tileLeveys;
    let polloSliceCanvas4 = luoPolloSliceCanvas(destWidth, destHeight);
    polloSliceCanvas4.style.left = "300px";
    polloSliceCanvas4.style.top = "300px";
    document.body.prepend(polloSliceCanvas4);
    let ctx4 = polloSliceCanvas4.getContext('2d');
    ctx4.drawImage(img, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);
    slicet.push(polloSliceCanvas4);


    // Lisataan animaatiot
    for (let i = 0; i < slicet.length; i++) {
        let slice = slicet[i];
        polloSliceAnimate(slice, i);
    }

}


/**
 * Lisaa polloSlicelle .styleen oikean css animationNamen
 * @param {*} polloSlice Polloslicen canvas 
 * @param {*} index index 0 = top left, 1 = top right, 2 = bottom left, 3 = bottom right
 */
function polloSliceAnimate(polloSlice, index) {
    console.log(polloSlice, index);
    polloSlice.style.position = "absolute";
    polloSlice.style.left = "0";
    polloSlice.style.top = "0";
    polloSlice.style.zIndex = "200";

    polloSlice.style.animationName = `polloSliceMove${index+1}`;
}


/**
 * Luo annetun kokoisen polloSlice canvaksen
 * @param {*} width 
 * @param {*} height 
 * @returns 
 */
function luoPolloSliceCanvas(width, height) {
    let newCanvas = document.createElement('canvas');
    newCanvas.setAttribute('class', 'polloSlice');
    newCanvas.setAttribute('width', width);
    newCanvas.setAttribute('height', height);
    newCanvas.style.position = "absolute";
    return newCanvas;
}


/**
 * Lisaa annetun maaran palikoita document.bodyyn ja asettaa niiden valille annetun animaatioviiveen.
 * @param {*} maara Kuinka monta palikkaa lisataan
 * @param {*} delay Aikaviive (animation delay) palikoiden lahtojen valilla
 */
function lisaaPalkit(maara, delay) {
    let currentDelay = 0;
    let zIndex = 100;
    for (let i = 0; i < maara; i++) {
        let palkki = luoPalkki(currentDelay, zIndex);
        document.body.prepend(palkki);
        currentDelay += delay;
        zIndex++;
    }
}

/**
 * Luo tehtavan mukaisen SVG rectanglen
 * @param {*} delay Palikan animation delay
 * @param {*} zIndex Palikan zIndex
 */
function luoPalkki(delay, zIndex) {
    let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svg.setAttribute("version", "1.1");
    svg.setAttribute("width", PALIKKA_CSS_WIDTH.toString());
    svg.setAttribute("height", "100%");
    svg.setAttribute("class", "palkki");

    svg.style.zIndex = zIndex;
    svg.style.animationDelay = delay.toString() + "ms";

    let rect = document.createElementNS("http://www.w3.org/2000/svg","rect");
    rect.setAttribute("width", "100%");
    rect.setAttribute("height", "100%");
    rect.setAttribute("fill", "url(#Gradient1)");
    // Talla pidetaan muistissa mika gradientti on aktiivisena.
    rect.gradient = "1";

    svg.appendChild(rect);

    // Vaihtaa palkin varin animaation lopussa.
    svg.addEventListener('animationiteration', (e) => {
        rect = e.target.firstElementChild;
        vaihdaGradient(rect);
      });

    return svg;
}

/**
 * Vaihtaa SVG palikan rectanglen gradientin
 * @param {*} palikkaRect SVG palikan rectangle element
 */
function vaihdaGradient(palikkaRect) {
    switch (palikkaRect.gradient) {
        case "1":
            palikkaRect.setAttribute("fill", "url(#Gradient2)");
            palikkaRect.gradient = "2";
            break;
    
        case "2":
            palikkaRect.setAttribute("fill", "url(#Gradient1)");
            palikkaRect.gradient = "1";
            break;
    }
}


/**
 * Apufunktio luennot/anim
 * @param {*} rule 
 * @returns 
 */
function findKeyframesRule(rule) {
    let ss = document.styleSheets;
    for (let i = 0; i < ss.length; ++i) {
      for (let j = 0; j < ss[i].cssRules.length; ++j) {
        if (ss[i].cssRules[j].type == window.CSSRule.KEYFRAMES_RULE && 
        ss[i].cssRules[j].name == rule) { 
          return ss[i].cssRules[j]; }
      }
    }
    return null;
  }
