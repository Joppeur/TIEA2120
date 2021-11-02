"use strict";
//@ts-check 

const PALIKOITA = 10;
const PALIKKA_CSS_WIDTH = "12%";
const PALIKKA_ANIMATION_DELAY_MS = 100;


window.addEventListener("load", function () {
    lisaaPalkit(PALIKOITA, PALIKKA_ANIMATION_DELAY_MS);
});


/**
 * Lisaa annetun maaran palikoita ja asettaa niiden valille annetun animaatioviiveen.
 * @param {*} maara Kuinka monta palikkaa lisataan
 * @param {*} delay Aikaviive (animation delay) palikoiden lahtojen valilla
 */
function lisaaPalkit(maara, delay) {
    let currentDelay = 0;
    let zIndex = 100;
    for (let i = 0; i < PALIKOITA; i++) {
        lisaaPalkki(currentDelay, zIndex);
        currentDelay += PALIKKA_ANIMATION_DELAY_MS;
        zIndex++;
    }
}

/**
 * Luo tehtavan mukaisen SVG rectanglen
 * @param {*} delay Viive palikoiden lahtojen valilla millisekunneissa
 * @param {*} zIndex Palikan zIndex
 */
function lisaaPalkki(delay, zIndex) {
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
        switch (rect.gradient) {
            case "1":
                rect.setAttribute("fill", "url(#Gradient2)");
                rect.gradient = "2";
                break;
        
            case "2":
                rect.setAttribute("fill", "url(#Gradient1)");
                rect.gradient = "1";
                break;
        }
      });

    document.body.prepend(svg);
}


