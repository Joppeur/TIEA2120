"use strict";
// seuraavat estävät jshintin narinat jqueryn ja leafletin objekteista
/* jshint jquery: true */
/* globals L */


// kirjoita tänne oma ohjelmakoodisi

// tein dragattavasta joukkuen li elementista globaalin muuttujan
let dragged;

let kartta = luoKartta();
// Tässä pidetään muistissa Leaflet karttaan piirrettyjä layereita.
let karttaAddedLayers = new Map();

window.addEventListener("load", function () {
    naytaJoukkuuet(data.joukkueet);
    naytaRastiLista(data.rastit);
    handleJoukkueDragDrop(kartta);
    teeDropKohde(document.querySelector('.dragMap > div'), ['joukkue', 'rasti']);
    teeDropKohde(document.querySelector('.joukkueet div > ul'), ['joukkue']);
    teeDropKohde(document.querySelector('.rastit div > ul'), ['rasti']);
    let rastiYmpyrat = piirraRastit(kartta, data.rastit);
    kartta.fitBounds(rastiYmpyrat.getBounds());
});


/**
 * Piirtaa joukkueen kulkeman matkan leaflet karttaan
 * @param {*} kartta 
 * @param {*} joukkue 
 * @param {*} vari 
 * @returns 
 */
function piirraMatka(kartta, joukkue, vari) {
    let rastit = getValidRastit(joukkue);

    let latlngs = [];
    for (let i = 0; i < rastit.length; i++) {
        const rasti = rastit[i];
        latlngs.push([rasti.lat, rasti.lon]);
    }
    let polyline = L.polyline(latlngs, { color: vari }).addTo(kartta);
    return polyline;
}


function handleJoukkueDragDrop() {
    let dragMap = document.querySelector('.dragMap');

    dragMap.addEventListener('dragstart', function (e) {
        if (dragged.getAttribute('class') == 'joukkue') {
            let poistettavaPolyline = karttaAddedLayers.get(dragged.joukkueId);
            if (poistettavaPolyline) {
                poistettavaPolyline.remove();
                karttaAddedLayers.delete(dragged.joukkueId);
                console.log(poistettavaPolyline);
            }
            else {
                console.error("Couldn't remove polyline");
            }
        }
    });

    dragMap.addEventListener('drop', function (e) {
        // Haetaan li:n stylesta rgb vari ja muutetaan se hexiksi Leaflettia varten
        let vari = dragged.style.backgroundColor;
        vari = (vari.match(/([0-9])+/g));
        let hexVari = rgbToHex(...vari);

        dragged.style.left = e.clientX.toString() + 'px';
        dragged.style.top = e.clientY.toString() + 'px';

        if (dragged.getAttribute('class') == 'joukkue') {
            let pl = piirraMatka(kartta, getJoukkueById(dragged.joukkueId), hexVari);
            karttaAddedLayers.set(dragged.joukkueId, pl);
        }

    });
}


function getJoukkueById(joukkueId) {
    for (let i = 0; i < data.joukkueet.length; i++) {
        const joukkue = data.joukkueet[i];
        if (joukkue.id == joukkueId) {
            return joukkue;
        }
    }
    return null;
}


/**
 * Lisaa elementille drop eventlistenerit
 * @param {*} element 
 * @param {*} sallitutLuokat Minka tyyppisia elementteja voi pudottaa
 * @returns 
 */
function teeDropKohde(element, sallitutLuokat) {
    if (sallitutLuokat.length > 0) {
        element.sallitutLuokat = sallitutLuokat;
    } else {
        console.error('Aseta sallitut luokat.');
        return;
    }

    element.addEventListener('dragover', function (e) {
        e.preventDefault();
        if (e.dataTransfer.types.some(x => sallitutLuokat.includes(x))) {
            e.dataTransfer.dropEffect = "move";
        }
        else {
            e.dataTransfer.dropEffect = "none";
        }
    });

    element.addEventListener('drop', function (e) {
        e.preventDefault();

        // Toimii, koska olen nimennyt datatypen luokkien mukaan.
        // Koko homman voisi varmaan tehda ilman tuota globaalia dragged-muuttujaa,
        // mutta imo helpottaa hommaa huomattavasti.
        let draggedClass = dragged.getAttribute('class');
        let data = e.dataTransfer.getData(draggedClass);
        if (data) {
            try {
                let target = e.target;

                // Jos elementti dropataan li:n paalle, laitetaan kohteeksi sen parent, eli ul.
                if (target.nodeName === "LI") {
                    target = e.target.parentElement;
                }

                if (target.sallitutLuokat.includes(draggedClass)) {
                    target.appendChild(dragged);

                } else {
                    throw 'Drop kohde ei hyväksy tätä luokkaa';
                }
            } catch (error) {
                console.error(error);
            }
        }
    });
}


function piirraRastit(kartta, rastit) {
    let rastiYmpyrat = [];
    rastit.forEach(rasti => {
        let circle = piirraRastiYmpyra(kartta, rasti, 150);
        rastiYmpyrat.push(circle);
    });
    return new L.featureGroup([...rastiYmpyrat]);
}


function piirraRastiYmpyra(kartta, rasti, radius) {
    let circle = L.circle([rasti.lat, rasti.lon], {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: '0',
        radius: radius
    });

    circle.addTo(kartta);
    return circle;
}


function naytaRastiLista(inputRastit) {
    let list = document.querySelector('.rastit ul');

    while (list.hasChildNodes()) {
        list.lastChild.remove();
    }

    let rastit = [...inputRastit];
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
    li.setAttribute('class', 'rasti');
    li.textContent = rasti.koodi;

    li.setAttribute('draggable', 'true');
    li.rastiId = rasti.id;
    li.addEventListener('dragstart', function (e) {
        e.dataTransfer.setData('rasti', li.rastiId);
        // Globaali muuttuja
        dragged = e.target;
    });

    return li;
}


/**
 * Listaa joukkueet nimet ul:n sisaan matkoineen
 * @param {*} inputJoukkueet 
 */
function naytaJoukkuuet(inputJoukkueet) {
    let list = document.querySelector('.joukkueet ul');

    while (list.hasChildNodes()) {
        list.lastChild.remove();
    }

    let joukkueet = [...inputJoukkueet];

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


/**
 * 
 * @param {*} validRastit Rastit joista puhdistettu vääränlaiset rastit 
 * ja jätetty vain oikea maali ja lähtö
 * @returns Joukkueen kuljettu matka kilometreissä
 */
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

    li.setAttribute('class', 'joukkue');
    li.setAttribute('draggable', 'true');
    li.joukkueId = joukkue.id;
    li.addEventListener('dragstart', function (e) {
        e.dataTransfer.setData('joukkue', li.joukkueId);
        dragged = e.target;
    });

    // li.addEventListener('dragend', function(e) {
    //     console.log('DragEnd');
    // });

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
function luoKartta() {
    let mymap = new L.map('map', {
        crs: L.TileLayer.MML.get3067Proj()
    }).setView([62.2333, 25.7333], 11);
    L.tileLayer.mml_wmts({ layer: "maastokartta", key: "8203adda-2a75-4b26-b1b0-0811028b3cd2" }).addTo(mymap);
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
    switch (i % 6) {
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


// https://stackoverflow.com/a/39077686
function rgbToHex(r, g, b) {
    return '#' + [r, g, b].map(x => {
        const hex = parseInt(x).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }).join('');

    //console.log(rgbToHex(0, 51, 255)); // '#0033ff'
}