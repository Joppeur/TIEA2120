"use strict";
//@ts-check 



//--------------------------
//          Taso 1
//--------------------------

let mallij = {
    "nimi": "Mallijoukkue",
    "jasenet": [
        "Lammi Tohtonen",
        "Matti Meikäläinen"
    ],
    "leimaustapa": [0, 2],
    "rastit": [],
    "sarja": undefined,//tämä asetetaan funktiossa oikeaksi
    "id": 99999
};

lisaaJoukkue(data, mallij, '8h');
muutaSarjanNimi(data, "8h", "10h");
tulostaJoukkueet(data);
log();
tulostaRastit(data);


/**
 * Tulostaa kaikki joukkueet aakkosjarjestyksessa ilman whitespaceja alussa tai lopussa. 
 * @param {*} data 
 */
function tulostaJoukkueet(data) {
    let joukkueet = data.joukkueet.map(function (el) {
        return el.nimi.replace(/^\s+|\s+$/g, '') + " " + el.sarja.nimi;
    });

    //Compare Arrow-funktio sortille
    //https://flaviocopes.com/how-to-sort-array-of-objects-by-property-javascript/
    joukkueet.sort((a, b) => a.toLowerCase() > b.toLowerCase() ? 1 : -1);
    for (let joukkue of joukkueet) {
        log(joukkue);
    }
}


/**
 * Jarjestaa rastit, jotka alkaa numerolla, kasv. suurusjarjestykseen ja tulostaa ne ';':lla eroteltuna.
 * @param {*} data 
 */
function tulostaRastit(data) {
    let rastit = data.rastit.filter(function (rasti) {
        if (rasti.koodi.match(/^[0-9].*/g)) {
            return true;
        }
    });

    rastit.sort((a, b) => a.koodi > b.koodi ? 1 : -1);
    // Lisaan loppuun ekstra ';'-merkin, koska mallivastauksessakin on sellainen ¯\_(ツ)_/¯
    log(rastit.map(rasti => rasti.koodi).join(';') + ';');
}


/**
 * Lisää uuden joukkueen dataan.
 * asettaa samalla joukkueen sarjaksi parametrina tuodun sarjan.
 * Jos jokin parametri puuttuu, funktio ei tee mitään.
 * @param {Object} data
 * @param {Object} joukkue
 * @param {Object} sarja
 */
function lisaaJoukkue(data, joukkue, sarja) {
    if (data !== null && joukkue !== null && sarja !== null) {

        //Jos sarja loytyy, lisataan joukkue.
        for (const i of data.sarjat) {
            if (i.nimi == sarja) {
                joukkue.sarja = i;
                data.joukkueet.push(joukkue);
                return true;
            }
        }
        return false;
    }
}


/**
 * Muuttaa sarjan nimen.
 * @param {*} data 
 * @param {*} vanhanimi 
 * @param {*} uusinimi 
 */
function muutaSarjanNimi(data, vanhanimi, uusinimi) {
    if (data !== null && vanhanimi !== null && uusinimi !== null) {
        for (const i of data.sarjat) {
            if (i.nimi == vanhanimi) {
                i.nimi = uusinimi;
                return true;
            }
        }
        return false;
    }
}

//--------------------------
//          Taso 3
//--------------------------

log("\n" + "----------" + "\n" + "Taso 3" + "\n" + "----------" + "\n");

poistaJoukkue(data, "Vara 1");
poistaJoukkue(data, "Vara 2");
poistaJoukkue(data, "Vapaat");


vaihdaRasti(data.joukkueet[6], 73, "32");
tulostaJoukkueetPisteilla(data);


/**
 * Poistaa annetun joukkueen.
 * @param {Object} data
 * @param {string} joukkueNimi Poistettavan joukkueen nimi.
 */
function poistaJoukkue(data, joukkueNimi) {
    data.joukkueet = data.joukkueet.filter(joukkue => joukkue.nimi !== joukkueNimi);
}


/**
 * Vaihtaa pyydetyn rastileimauksen sijalle uuden rastin
 * @param {Object} joukkue
 * @param {number} rastinIdx - rastin paikka joukkue.rastit-taulukossa
 * @param {Object} uusirasti
 * @param {string} Aika - Rastileimauksen aika. Jos tätä ei anneta, käytetään samaa aikaa kuin vanhassa korvattavassa leimauksessa
 */
function vaihdaRasti(joukkue, rastinIdx, uusirasti, aika) {
    uusirasti = etsiRasti(uusirasti);
    if (uusirasti.length === 0) {
        console.log('Uutta rastia ei loytynt.');
        return false;
    }

    let vanharasti;
    try {
        vanharasti = etsiRasti(joukkue.rastit[rastinIdx].rasti.koodi);
    } catch (error) {
        console.log("Vanhan rastin indeksia ei loytynt.");
        return false;
    }

    if (uusirasti.length === 0) {
        console.log('Vanhaa rastia ei loytynt.');
        return false;
    }

    joukkue.rastit[rastinIdx].rasti = uusirasti[0];

    if (aika !== null || aika.length > 0) {
        joukkue.rastit[rastinIdx].rasti.aika = aika;
    }
    return true;
}


/**
 * Etsii annetun rastin koodin mukaan data.rastit-tietokannasta
 * @param {*} rastiKoodi Etsittava rasti
 */
function etsiRasti(rastiKoodi) {
    let rasti = data.rastit.filter(x => x.koodi === rastiKoodi);
    if (rasti === null) {
        return [];
    } else {
        return rasti;
    }
}


/**
 * Tarkistaa, onko rastin koodi 'LAHTO'
 * @param {*} el Rasti
 */
function onkoLahto(el) {
    if (onkoRasti(el)) {
        if (el.rasti.koodi === "LAHTO") {
            return true;
        }
    }
    return false;
}


/**
 * Tarkistaa, onko rastin koodi 'MAALI'
 * @param {*} el Rasti
 */
function onkoMaali(el) {
    if (onkoRasti(el)) {
        if (el.rasti.koodi === "MAALI") {
            return true;
        }
    }
    return false;
}


/**
 * Tarkistaa, onko rasti oikea, eli sisaltaa koodin
 * @param {*} el Rasti
 */
function onkoRasti(el) {
    if (typeof (el) === 'object' && el.hasOwnProperty('rasti') && el.rasti.hasOwnProperty('koodi')) {
        return true;
    }
    return false;
}


/**
 * Poistaa joukkueen rasteista vaaranalaiset rastit.
 * @param {object} rastit Taulukko rasteista, jotka puhdistetaan
 */
function puhdistaRastit(rastit) {
    let rastit2 = rastit.filter((el) => onkoRasti(el));
    return rastit2;
}


/**
 * Palauttaa taulukon rasteista, josta on poistettu rastit ennen viimeista LAHTOa, ja rastit ensimmaisen MAALIn jalkeen.
 * @param {*} rastitTaul Rastit, joista poistetaan lahdot ja maalit
 * @param {boolean} jataOikeat Jos true, jatetaan palautukseen oikea LAHTO ja oikea MAALI
 */
function leikkaaLahtoMaali(rastitTaul, jataOikeat) {
    let rastit = rastitTaul;
    let lahtoidx = -1;
    let idx = 0;
    for (const el of rastit) {
        if (onkoLahto(el)) {
            lahtoidx = idx;
        }
        idx++;
    }

    if (lahtoidx === -1) {return [];}

    if (jataOikeat) {
        rastit = rastit.slice(lahtoidx);
    } else {
        rastit = rastit.slice(lahtoidx + 1);
    }

    let maaliidx = rastit.findIndex((el) => onkoMaali(el));
    if (jataOikeat) {
        rastit = rastit.slice(0, maaliidx + 1);
    } else {
        rastit = rastit.slice(0, maaliidx);
    }

    return rastit;
}


/**
 * Summaa joukkueen saamat pisteet.
 * @param {*} joukkue Joukkue, jonka pisteet summataan
 */
function laskePisteet(joukkue) {

    // Puhdistetaan data (esim. 'rast' ja rastit joiden arvo on "0")
    let rastit = puhdistaRastit(joukkue.rastit);

    // Rajataan rastit lahdon ja maalin valiin
    rastit = leikkaaLahtoMaali(rastit, false);

    // https://stackoverflow.com/a/24968449
    let uniikit = rastit.map((x) => {
        return {
            count: 1,
            koodi: x.rasti.koodi
        };
    })
        .reduce((a, b) => {
            a[b.koodi] = (a[b.koodi] || 0) + b.count;
            return a;
        }, {});

    //let duplicates = Object.keys(uniikit).filter((a) => uniikit[a] > 1);

    // Tsekataan, etta rasti alkaa numerolla.
    let pisteRastit = Object.keys(uniikit).filter(function (el) {
        return el.match(/^[0-9]/g);
    });

    let idx = 0;
    for (let i of pisteRastit) {
        pisteRastit[idx] = parseInt(i.charAt(0));
        idx += 1;
    }

    let summa2 = pisteRastit.reduce((a, b) => a + b, 0);
    return summa2;
}


/**
 * Tulostaa kaikki joukkueet jarjestettyna pisteiden ja aakkosjarjestyksen mukaan.
 * @param {*} data
 */
function tulostaJoukkueetPisteilla(data) {
    // Nimien korjaus, sitten nimi+joukkueen pisteet objektiin
    let pisteet = [];
    for (const jouk of data.joukkueet) {
        let joukkueNimi = jouk.nimi.replace(/^\s+|\s+$/g, '');
        let pisteita = laskePisteet(jouk);
        let o = { nimi: joukkueNimi, pisteet: pisteita };
        pisteet.push(o);
    }

    // Sort ensin aakkosjarjestykseen, ja sitten pisteiden mukaan.
    pisteet.sort((a, b) => a.nimi.toLowerCase() > b.nimi.toLowerCase() ? 1 : -1);
    pisteet.sort((a, b) => b.pisteet - a.pisteet);
    for (let joukkue of pisteet) {
        log(`${joukkue.nimi} \(${joukkue.pisteet} p\)`);
    }

    return pisteet;
}


//--------------------------
//          Taso 5
//--------------------------

log("\n" + "----------" + "\n" + "TASO 5" + "\n" + "----------" + "\n");

tulostaJoukkueetKaikki(data);


/**
 * Laskee kauanko joukkueella meni yht. aikaa kulkea rastit. Palautus sekunneissa.
 * @param {*} joukkue 
 */
function laskeJoukkueenAika(joukkue) {
    let rastit = puhdistaRastit(joukkue.rastit);
    rastit = leikkaaLahtoMaali(rastit, true);

    let aika1, aika2;
    let interval = [];
    for (let i = 1; i < rastit.length; i++) {
        aika1 = Date.parse(rastit[i].aika);
        aika2 = Date.parse(rastit[i - 1].aika);
        // ms -> s
        interval.push((aika1 - aika2) / 1000);
    }

    //Pitaa laittaa initial value 0, tai muuten kaatuu reduce tyhjalla taulukolla.
    let sum = interval.reduce((a, b) => a + b, 0);
    return sum;
}


/**
 * Muuttaa sekuntimaaran muotoon XX:XX:XX
 * @param {*} sekuntia 
 */
function sekunnitAjaksi(sekuntia) {
    let s = Math.floor(sekuntia % 60).toString();
    let m = Math.floor(sekuntia / 60 % 60).toString();
    let h = Math.floor(sekuntia / 60 / 60 % 24).toString();
    return `${h.padStart(2, '0')}:${m.padStart(2, '0')}:${s.padStart(2, '0')}`;
}


/**
 * Laskee kuinka pitkan etaisyyden joukkue kulki rastien valilla. Palautus km tarkkuudella.
 * @param {*} joukkue 
 */
function laskeJoukkueenEtaisyys(joukkue) {
    let rastit = puhdistaRastit(joukkue.rastit);
    rastit = leikkaaLahtoMaali(rastit, true);

    let lat1, lat2, lon1, lon2;
    let etaisyys = [];
    for (let i = 1; i < rastit.length; i++) {
        lat1 = rastit[i].rasti.lat;
        lat2 = rastit[i - 1].rasti.lat;
        lon1 = rastit[i].rasti.lon;
        lon2 = rastit[i - 1].rasti.lon;
        etaisyys.push(getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2));
    }

    return Math.round(etaisyys.reduce((a, b) => a + b, 0));
}


/**
 * Tulostaa kaikki joukkueet jarjestettyna ensin pisteiden, sitten ajan ja sitten aakkosjarjestyksen mukaan.
 * @param {*} data Tietokanta
 */
function tulostaJoukkueetKaikki(data) {
    // Nimi+pisteet+aika+matka objektiin
    let tulos = [];
    for (const jouk of data.joukkueet) {
        let joukkueNimi = jouk.nimi.replace(/^\s+|\s+$/g, '');
        let pisteita = laskePisteet(jouk);
        let etaisyys = laskeJoukkueenEtaisyys(jouk);
        let aikaS = laskeJoukkueenAika(jouk);
        let o = {
            nimi: joukkueNimi,
            pisteet: pisteita,
            matka: etaisyys,
            aika: aikaS
        };
        tulos.push(o);
    }

    tulos.sort((a, b) => b.matka - a.matka);
    tulos.sort((a, b) => b.aika - a.aika);
    tulos.sort((a, b) => a.nimi.toLowerCase() > b.nimi.toLowerCase() ? 1 : -1);
    tulos.sort((a, b) => b.pisteet - a.pisteet);
    for (let joukkue of tulos) {
        log(`${joukkue.nimi}, ${joukkue.pisteet} p, ${joukkue.matka} km, ${sekunnitAjaksi(joukkue.aika)}`);
    }

    return tulos;
}


function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

// sup