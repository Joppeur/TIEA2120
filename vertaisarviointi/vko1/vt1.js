"use strict";
//@ts-check 

//OMA KORJAUS
//Mallijoukkue annetuilla tiedoilla
var malliJoukkue = {
    "nimi": "Mallijoukkue",
    "jasenet": [
        "Lammi Tohtonen",
        "Matti Meikäläinen"
    ],
    "leimaustapa": [0, 2],
    "rastit": [],
    "sarja":undefined,
    "id": 99999
};


console.log(data);
//Haetaan sarja nimellä
var lisättäväSarja = getSarjaByName(data, "8h");
//Lisätään joukkue sarjaan
lisääJoukkue(data, malliJoukkue, lisättäväSarja);
//Sarjan nimi 8h:sta 10h:ksi
muutaSarjanNimi(data, "8h", "10h");
//Ykkös tason tulostus
tulostaJoukkueet(data);
tulostaRastit(data);


//Poistetaan Vara 1, Vara 2 ja Vapaat
poistaJoukkue(data, 'Vara 1');
poistaJoukkue(data, 'Vara 2');
poistaJoukkue(data, 'Vapaat');

//Valitaan joukkue nimen perusteella
let valittuJoukkue = getTeamByName(data, "Dynamic Duo ");
//Valitaan rasti koodin perusteella
let uusiRasti = getRastiByCode(data, 32);
//Vaihdetaan valitun joukkueen 74. rasti koodin perusteella valituksi rastiksi
vaihdaRasti(valittuJoukkue, 74, uusiRasti);
//Kolmos tason tulostus
taso3Tulostus(data);
//Vitos tason  tulostus
taso5Tulostus(data);

console.log(data);
console.dir(data);




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


//Sortti funktio nimille
function compareNames(a,b){
    var nameA = a.nimi.toUpperCase().trim();
    var nameB = b.nimi.toUpperCase().trim();
    if (nameA < nameB) {
        return -1;
    }
    if (nameA > nameB) {
        return 1;
    }
    return 0;
}

function compareStrings(a,b){
    var nameA = a.toUpperCase().trim();
    var nameB = b.toUpperCase().trim();
    if (nameA < nameB) {
        return -1;
    }
    if (nameA > nameB) {
        return 1;
    }
    return 0;

}


function tulostaJoukkueet(data) {
    let joukkueet = [...data.joukkueet];
    joukkueet.sort(compareNames);
    for (let i = 0; i < joukkueet.length; i++) {
        log(joukkueet[i].nimi.trim() + ' ' + joukkueet[i].sarja.nimi);
    }
}

function lisääJoukkue(data, joukkue, sarja) {
    if (data === undefined || joukkue === undefined || sarja === undefined) {
        return;
    }
    if (!isSarjaValid(data, sarja)) {
        return;
    }
    joukkue.sarja = sarja;
    data.joukkueet.push(joukkue);
}

function muutaSarjanNimi(data, vanhanimi, uusinimi) {
    for (let i in data.sarjat) {
        if (data.sarjat[i].nimi == vanhanimi) {
            data.sarjat[i].nimi = uusinimi;
            return;
        }
    }
}

//Tulostaa rastit joiden ensimmäinen merkki on numero.. parseInt(thisRasti) palauttaa Nan jos eka merkki on joku muu kuin kokonaisluku
function tulostaRastit(data) {
    var output = "";
    var rastiArray = [];
    for (let i in data.rastit) {
        var thisRasti = data.rastit[i].koodi;
        if (!Number.isNaN(parseInt(thisRasti))) {
            rastiArray.push(thisRasti);
        }
    }
    rastiArray.sort(compareStrings);
    for (let i in rastiArray) {
        output = output.concat(rastiArray[i], ';');
    }
    log("\n");
    log(output);
}

function poistaJoukkue(data, nimi) {
    var indexToDelete = getTeamIndexByName(data, nimi);
    if (indexToDelete == -1) {
        return;
    }
    data.joukkueet.splice(indexToDelete, 1);
}

function getSarjaByName(data, nimi){
    for (let i in data.sarjat){
        if (data.sarjat[i].nimi == nimi){
            return data.sarjat[i];
        }    
    }
    return -1;
}

function getTeamIndexByName(data, nimi) {
    for (let i in data.joukkueet) {
        if (data.joukkueet[i].nimi == nimi) {
            return i;
        }
    }
    return -1;
}

//Tsekkaa sisältääkö data.joukkueet kyseisen joukkueen
function isJoukkueValid(data, joukkue) {
    for (let i in data.joukkueet) {
        if (joukkue === data.joukkueet[i]) {
            return true;
        }
    }
    return false;
}

//Tsekkaa sisältääkö data.sarjat kyseisen sarjan
function isSarjaValid(data, sarja) {
    for (let i in data.sarjat) {
        if (sarja === data.sarjat[i]) {
            return true;
        }
    }
    return false;
}

//Tsekkaa sisältääkö data.rastit kyseisen rastin
function isRastiValid(data, rasti) {
    for (let i in data.rastit) {
        if (rasti === data.rastit[i]) {
            return true;
        }
    }
    return false;
}


//Rasti koodin perusteella
function getRastiByCode(data, code) {
    for (let i in data.rastit) {
        if (data.rastit[i].koodi == code) {
            return data.rastit[i];
        }
    }
    return -1;
}

//Joukkue nimen perusteella
function getTeamByName(data, nimi) {
    for (let i in data.joukkueet) {
        if (data.joukkueet[i].nimi == nimi) {
            return data.joukkueet[i];
        }
    }
    return -1;

}

//vaihdetaan joukkueen rastinIndx arvoon uusirasti. Jos aika-muuttujaa on undefined niin käytetään vanhaa aikaa
//joukkue.rastit[rastinIdx - 1] koska indeksointi alkaa nollasta. 
//Käytetty ternary operatoria if else tai vastaavan tilalla https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator
function vaihdaRasti(joukkue, rastinIdx, uusirasti, aika) {
    if (!isJoukkueValid(data, joukkue) || !isRastiValid(data, uusirasti) || joukkue.rastit.length < rastinIdx) {
        return;
    }
    joukkue.rastit[rastinIdx - 1].aika = aika === undefined ? joukkue.rastit[rastinIdx - 1].aika : aika;
    joukkue.rastit[rastinIdx - 1].rasti = uusiRasti;
}

function taso3Tulostus(data) {
    let tempJoukkueet = [...data.joukkueet];
    for (let i in tempJoukkueet) {
        var thisJoukkue = tempJoukkueet[i];
        thisJoukkue.pisteet = laskePisteet(thisJoukkue);
    }
    tempJoukkueet.sort(function (a, b) {
        var pisteetA = a.pisteet;
        var pisteetB = b.pisteet;
        var nimiA = a.nimi.toUpperCase();
        var nimiB = b.nimi.toUpperCase();

        if (pisteetA > pisteetB) { return -1; }
        if (pisteetA < pisteetB) { return 1; }
        if (nimiA < nimiB) { return -1; }
        if (nimiA < nimiB) { return 1; }
        return 0;

    });
    log('\n----------\nTASO 3\n----------\n');
    for (let i in tempJoukkueet) {
        log(tempJoukkueet[i].nimi.trim() + " (" + tempJoukkueet[i].pisteet + " p)");
    }


}

//Laskee pisteet lähdöstä maaliin
function laskePisteet(joukkue) {
    let alkuleimaus = false;
    var pisteet = 0;
    var käydytRastit = [];
    for (let i in joukkue.rastit) {
        let thisRasti = joukkue.rastit[i].rasti;
        if (!isRastiValid(data, thisRasti)) {
            continue;
        }
        if (thisRasti.koodi == "LAHTO") {
            alkuleimaus = true;
            pisteet = 0;
            continue;
        }
        if (thisRasti.koodi == "MAALI") {
            if (alkuleimaus) {
                return pisteet;
            } else {
                continue;
            }
        }
        var rastiPisteet = parseInt(thisRasti.koodi.charAt(0));
        //Tsekkaa että ensimmäinen merkki on kokonaisluku ja että rastia ei ole vielä laskettu mukaan pisteisiin
        if (!Number.isNaN(rastiPisteet) && käydytRastit.indexOf(thisRasti.koodi) == -1) {
            käydytRastit.push(thisRasti.koodi);
            pisteet += rastiPisteet;
        }
    }
    return 0;
}

function taso5Tulostus(data) {
    let tempJoukkueet = [...data.joukkueet];
    for (let i in tempJoukkueet) {
        let thisJoukkue = tempJoukkueet[i];
        let validRastit = getValidRastit(thisJoukkue);
        thisJoukkue.kuljettuMatka = laskeMatka(thisJoukkue, validRastit);
        thisJoukkue.kaytettyAikaInMillis = laskeKaytettyAikaInMillis(thisJoukkue, validRastit);
        thisJoukkue.kaytettyAika = msToTime(thisJoukkue.kaytettyAikaInMillis);
        thisJoukkue.pisteet = laskePisteet(thisJoukkue);

    }

    tempJoukkueet.sort(function (a, b) {
        var pisteetA = a.pisteet;
        var pisteetB = b.pisteet;
        var aikaA = a.kaytettyAika;
        var aikaB = b.kaytettyAika;
        var matkaA = a.kuljettuMatka;
        var matkaB = b.kuljettuMatka;
        if (pisteetA > pisteetB) { return -1; }
        if (pisteetA < pisteetB) { return 1; }
        if (matkaB > matkaA) {return 1;}
        if (matkaA < matkaB) {return -1;}
        if (aikaA < aikaB) { return -1; }
        if (aikaA < aikaB) { return 1; }
        compareNames(a,b);

        return 0;
    });
    
    log('\n----------\nTASO 5\n----------\n');
    for (let i in tempJoukkueet) {
        log(`${tempJoukkueet[i].nimi.trim() }, ${tempJoukkueet[i].pisteet} p, ${tempJoukkueet[i].kuljettuMatka} km, ${tempJoukkueet[i].kaytettyAika}`);
    }
    return;


}


//Palauttaa arrayn joka sisältää kelpuutetut rastit (eli lähdöstä maaliin)
function getValidRastit(joukkue) {
    let alkuleimaus = false;
    let validRastit = [];
    for (let i in joukkue.rastit) {
        let thisRasti = joukkue.rastit[i].rasti;
        if (!isRastiValid(data, thisRasti)) {
            continue;
        }
        if (thisRasti.koodi == "LAHTO") {
            alkuleimaus = true;
            validRastit = [i];
            continue;
        }
        if (thisRasti.koodi == "MAALI") {
            if (alkuleimaus) {
                validRastit.push(i);
                return validRastit;
            } else {
                continue;
            }
        }
        validRastit.push(i);
    }
    return [];

}


function laskeMatka(joukkue, validRastit) {
    let kuljettuMatka = 0;
    for (let i = 0; i < validRastit.length - 1; i++) {
        let lat1 = joukkue.rastit[validRastit[i]].rasti.lat;
        let lon1 = joukkue.rastit[validRastit[i]].rasti.lon;
        let lat2 = joukkue.rastit[validRastit[i + 1]].rasti.lat;
        let lon2 = joukkue.rastit[validRastit[i + 1]].rasti.lon;
        let matka = getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2);
        kuljettuMatka += matka;
    }
    return Math.round(kuljettuMatka);

}

//Laskee ajan millisekuinteina, joka kului ensimmäisestä rastista viimeiseen rastiin
function laskeKaytettyAikaInMillis(joukkue, validRastit) {
    if (validRastit.length < 2) {
        return 0;
    }
    let firstRasti = validRastit[0];
    let lastRasti = validRastit[validRastit.length - 1];
    var paivaAlku = Date.parse(joukkue.rastit[firstRasti].aika);
    var paivaLoppu = Date.parse(joukkue.rastit[lastRasti].aika);
    var duration = paivaLoppu - paivaAlku;
    return duration;

}

//Muuttaa kuluneet millisekunnit halutuksi stringiksi
function msToTime(s) {
    var ms = s % 1000;
    s = (s - ms) / 1000;
    var secs = s % 60;
    s = (s - secs) / 60;
    var mins = s % 60;
    var hrs = (s - mins) / 60;
    return hrs.toString().padStart(2, '0') + ':' + mins.toString().padStart(2, '0') + ':' + secs.toString().padStart(2, '0');
}




