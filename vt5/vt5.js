"use strict";
// seuraavat estävät jshintin narinat jqueryn ja leafletin objekteista
/* jshint jquery: true */
/* globals L */


// kirjoita tänne oma ohjelmakoodisi
// 8203adda-2a75-4b26-b1b0-0811028b3cd2

window.addEventListener("load", function () {
    let kartta = luoKartta();
    naytaJoukkuuet();
    naytaRastit();
});


function naytaRastit() {
    let list = document.querySelector('.rastit ul');

    while (list.hasChildNodes()) {
        list.lastChild.remove();
    }

    let rastit = [...data.rastit];

    // sortRastit(rastit);
    rastit.sort((a, b) => compareNames(a.koodi, b.koodi, false));

    for (let i = 0; i < rastit.length; i++) {
        const rasti = rastit[i];
        let rastiLi = luoRastiLi(rasti);
        rastiLi.style.backgroundColor = rainbow(rastit.length, i);
        list.appendChild(rastiLi);
    }
}


function luoRastiLi(rasti) {
    let li = document.createElement('li');
    li.textContent = rasti.koodi;
    return li;
}


function naytaJoukkuuet() {
    let list = document.querySelector('.joukkueet ul');

    while (list.hasChildNodes()) {
        list.lastChild.remove();
    }

    let joukkueet = [...data.joukkueet];

    laskeMatkat(joukkueet);
    sortJoukkueet(joukkueet);

    // Tehdaan jokaiselle joukkueelle oma li
    for (let i = 0; i < joukkueet.length; i++) {
        const joukkue = joukkueet[i];
        let joukkueli = luoJoukkueLiElement(joukkue);
        joukkueli.style.backgroundColor = rainbow(joukkueet.length, i);
        list.appendChild(joukkueli);
    }
}


/**
 * Lisaa joukkueille kuljettuMatka attribuutin
 * @param {*} joukkueet 
 */
function laskeMatkat(joukkueet) {
    for (let i = 0; i < joukkueet.length; i++) {
        const joukkue = joukkueet[i];
        let oikeatRastit = getValidRastit(joukkue);
        joukkue.kuljettuMatka = laskeMatka(oikeatRastit);
    }
}


function laskeMatka(validRastit) {
    let kuljettuMatka = 0;
    for (let i = 0; i < validRastit.length - 1; i++) {
        let lon1 = validRastit[i].lon;
        let lat1 = validRastit[i].lat;
        let lat2 = validRastit[i + 1].lat;
        let lon2 = validRastit[i + 1].lon;
        let matka = getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2);
        kuljettuMatka += matka;
    }
    return kuljettuMatka;

}


/**
 * Hakee joukkueen rastin id:lla datan rasti objektin.
 * @param {*} rastiId
 */
 function getRastiById(rastiId) {
    for (const rasti of data.rastit) {
        if (rasti.id === rastiId) {
            return rasti;
        }
    }
    return null;
}


function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    let R = 6371; // Radius of the earth in km
    let dLat = deg2rad(lat2 - lat1);  // deg2rad below
    let dLon = deg2rad(lon2 - lon1);
    let a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

/**
 * Palauttaa joukkueen kelpuutetut rastit
 * @param {*} joukkue 
 * @returns 
 */
function getValidRastit(joukkue) {
    let alkuleimaus = false;
    let validRastit = [];
    for (let i in joukkue.rastit) {
        let rasti = getRastiById(joukkue.rastit[i].rasti);
        if (!rasti) {
            continue;
        }
        if (rasti.koodi == "LAHTO") {
            alkuleimaus = true;
            validRastit = [rasti];
            continue;
        }
        if (rasti.koodi == "MAALI") {
            if (alkuleimaus) {
                validRastit.push(rasti);
                return validRastit;
            } else {
                continue;
            }
        }
        validRastit.push(rasti);
    }
    return [];
}


/**
 * Sisaltaako data.rastit kyseisen rastin
 * @param {*} data 
 * @param {*} rasti 
 * @returns 
 */
function isRastiValid(data, rasti) {
    for (let i in data.rastit) {
        if (rasti === data.rastit[i].id) {
            return true;
        }
    }
    return false;
}


function luoJoukkueLiElement(joukkue) {
    
    // li-elementti johon joukkueen nimi ja boldattu etaisyys
    let li = document.createElement('li');
    let textNode1 = document.createTextNode(joukkue.nimi.trim() + ' ');
    
    let str = `(${joukkue.kuljettuMatka.toFixed(1)} km)`;

    let textNode2 = document.createTextNode(str);
    li.appendChild(textNode1);
    li.appendChild(textNode2);
    
    // // li-elementit jasenille ja ne ul:n sisaan
    // let ul = document.createElement('ul');
    // for (let i = 0; i < joukkue.jasenet.length; i++) {
    //     const jasen = joukkue.jasenet[i];
    //     let jasenli = document.createElement('li');
    //     jasenli.textContent = jasen;
    //     ul.appendChild(jasenli);
    // }
    // // jasenten ul joukkueen li:n sisaan
    // li.appendChild(ul);
    
    return li;
}



function sortJoukkueet(joukkueet) {
    // Ensisijaisesti nimen mukaan
    joukkueet.sort((a, b) => compareNames(a.nimi, b.nimi, true));

    // // Toissijaisesti sarjan mukaan
    // joukkueet.sort((a, b) => compareNames(getSarjanNimi(a.sarja), getSarjanNimi(b.sarja)));
    // console.log(joukkueet);
}


function compareNames(a, b, asc) {
    a = a.toUpperCase();
    b = b.toUpperCase();
    if (asc) {
        if (a < b) {
            return -1;
        }
        if (a > b) {
            return 1;
        }
        return 0;
    } else {
        if (a < b) {
            return 1;
        }
        if (a > b) {
            return -1;
        }
        return 0;
    }
}


/**
 * Hakee sarjaid:lla sarjan nimen.
 * @param {*} sarjaid 
 */
 function getSarjanNimi(sarjaid) {
    for (const sarja of data.sarjat) {
        if (sarja.id === sarjaid) {
            return sarja.nimi;
        }
    }
    return null;
}


/**
 * Luo kartan.
 * @returns Leaflet kartta.
 */
function luoKartta(){
    let mymap = new L.map('map', {
        crs: L.TileLayer.MML.get3067Proj()
    }).setView([62.2333, 25.7333], 11);
    L.tileLayer.mml_wmts({ layer: "maastokartta", key : "8203adda-2a75-4b26-b1b0-0811028b3cd2" }).addTo(mymap);
    return mymap;
}


/**
 *  This function generates vibrant, "evenly spaced" colours (i.e. no clustering). This is ideal for creating easily distinguishable vibrant markers in Google Maps and other apps.
    Adam Cole, 2011-Sept-14
    HSV to RBG adapted from: http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript
 * @param {*} numOfSteps 
 * @param {*} step 
 * @returns 
 */
function rainbow(numOfSteps, step) {
    let r, g, b;
    let h = step / numOfSteps;
    let i = ~~(h * 6);
    let f = h * 6 - i;
    let q = 1 - f;
    switch(i % 6){
        case 0: r = 1; g = f; b = 0; break;
        case 1: r = q; g = 1; b = 0; break;
        case 2: r = 0; g = 1; b = f; break;
        case 3: r = 0; g = q; b = 1; break;
        case 4: r = f; g = 0; b = 1; break;
        case 5: r = 1; g = 0; b = q; break;
    }
    let c = "#" + ("00" + (~ ~(r * 255)).toString(16)).slice(-2) + ("00" + (~ ~(g * 255)).toString(16)).slice(-2) + ("00" + (~ ~(b * 255)).toString(16)).slice(-2);
    return (c);
}