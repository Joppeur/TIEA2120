"use strict";
//@ts-check 

// data-muuttuja on lähes sama kuin viikkotehtävässä 1.
//
//console.log(data);
let muokattava_joukkue = {};
let alkuperainen_joukkue = muokattava_joukkue;
const JOUKKUE_LOMAKE = document.getElementById("joukkuelomake");

// Globaali sort order.
let sort_order = [0, true, 2, false, 1, true];


window.addEventListener("load", function () {
    // Lisataan tulokset tableen kohta pisteille.
    lisaaPisteEl(); 

    // Tehdaan tuloksien legendoista (sarja, nimi, pisteet) klikattavia
    // TODO: hieno nappi?
    korjaaTuloksetLegenda();

    // Lisataan datasta joukkueiden tiedot taulukkoon
    lisaaKaikkiJoukkueet(data.joukkueet);

    // Tehdaan rastilomakkeelle tarvittavat DOM muutokset
    let rastiLomake = document.forms[0];
    lisaaRastiFieldset(rastiLomake);

    // Sortataan tulostaulukko (jarjestys maaritetaan globaalilla muuttujalla)
    sortTaulukko();
    
    // Tehdaan muokkauksia joukkueformiin
    korjaaJoukkueForm();
    
    // Rastin lisays
    rastiLomake.addEventListener("submit", function (e) {
        e.preventDefault();
        lisaaRasti(rastiLomake[1].value, rastiLomake[2].value, rastiLomake[3].value);
    });

});


function korjaaTuloksetLegenda() {
    let legendat = document.querySelectorAll("#tupa > table > tr > th");

    legendat[0].ascending = sort_order[1];
    legendat[1].ascending = sort_order[3];
    legendat[2].ascending = sort_order[5];

    legendat.forEach(function(th) {
        th.addEventListener('click', changeSortOrder);
    } );
}


function changeSortOrder(e) {
    console.log(e.target);
    e.target.ascending = !e.target.ascending;
    console.log("ascending: " + e.target.ascending);

    switch (e.target.textContent) {
        case 'Sarja':
            sort_order = [0, e.target.ascending, 2, false, 1, true];
            break;

        case 'Joukkue':
            sort_order = [1, e.target.ascending, 2, false, 0, true];
            break;

        case 'Pisteet':
            sort_order = [2, e.target.ascending, 0, false, 1, true];
            break;
    
        default:
            sort_order = [0, true, 2, false, 1, true];
            break;
    }
    sortTaulukko();
}


/**
 * Eventlisteneri joukkueen muokkaa-napille
 * @param {*} e 
 */
function muokkaa(e) {
    let lomake = JOUKKUE_LOMAKE;

    e.preventDefault();
    alkuperainen_joukkue["nimi"] = muokattava_joukkue["nimi"];
    alkuperainen_joukkue["jasenet"] = muokattava_joukkue["jasenet"];
    alkuperainen_joukkue["listaus"]["nimi"].textContent = muokattava_joukkue["nimi"];


    // Luodaan uusi listaus joukkueen jasenille
    for (let index = 0; index < muokattava_joukkue["jasenet"].length; index++) {
        let joukJasenet = document.createElement('span');

        // Poistetaan aiemmat
        while (alkuperainen_joukkue["listaus"].jasenet.hasChildNodes()) {
            alkuperainen_joukkue["listaus"].jasenet.lastChild.remove();
        }

        // Tilalle muokatut
        for (let i = 0; i < muokattava_joukkue["jasenet"].length; i++) {
            let nimi = muokattava_joukkue["jasenet"][i];
            if(nimi !== "") {
                joukJasenet.appendChild(document.createTextNode(nimi));
                if (i !== muokattava_joukkue["jasenet"].length - 1) {
                    joukJasenet.appendChild(document.createTextNode(', '));
                }
            }
        }
        alkuperainen_joukkue["listaus"].jasenet.appendChild(joukJasenet);

        
        
    }

    // lisaa-nappula esille ja muokkaa-nappula piiloon
    lomake.joukkue.hidden = false;
    lomake.muokkaa.hidden = true;

    // Tyhjennetaan muokattava joukkue varmuuden vuoksi.
    muokattava_joukkue = {};

    // Tyhjennetaan form
    lomake.reset();

    // Varmaankin turha, mutta disabloidaan lisaa joukkue nappula, jos ei jo ollut.
    lomake.joukkue.disabled = true;

    // Korjataan inputtien maara.
    addJasenInput();

    sortTaulukko();
}


function getLeimaustapaByName(nimi) {
    // jos ei anneta nimea, palautetaan vakiona GPS
    if(!nimi) {
        return getLeimaustapaByName('GPS');
    }

    for (let i = 0; i < data.leimaustavat.length; i++) {
        const tapa = data.leimaustavat[i];
        if(tapa === nimi) {
            return i;
        }
    }
    return 'xx';
}


function uusiJoukkueId() {
    let max = 0;
    for (const el of data.joukkueet) {
        if (el.id > max) {
            max = el.id;
        }
    }
    return max + 1;
}

/**
 * Lisaa joukkueen tietokantaan.
 * @param {*} data
 * @param {*} sarja Sarjan nimi. Jos tyhja, niin vakio on 8h. 
 */
function lisaaJoukkue(data, sarja, id, leimaustapa, rastit) {

    //muokattava_joukkue = {};
    //let lomake = document.getElementById('joukkuelomake');
    let lomake = JOUKKUE_LOMAKE;
    let inputit = lomake.getElementsByTagName('input');

    let nimi = inputit[0].value;
    let jasenet = [];

    for (let i = 1; i < inputit.length - 1; i++) {
        let input = inputit[i];
        jasenet.push(input.value);
    }

 
    sarja = getSarjanId(sarja);
    
    //TODO
    leimaustapa = [getLeimaustapaByName(leimaustapa)];

    // TODO
    rastit = [];

    id = uusiJoukkueId();


    let joukkue = {
        nimi: nimi,
        jasenet: jasenet,
        id: id,
        rastit: rastit,
        leimaustapa: leimaustapa,
        sarja: sarja
    };

    data.joukkueet.push(joukkue);
    lomake.reset();
    addJasenInput();


    
    lisaaKaikkiJoukkueet(data.joukkueet);
    sortTaulukko(0, true, 2, false, 1, true);
}


function getJoukkueByNimi(nimi) {
    for (const joukkue of data.joukkueet) {
        if (joukkue.nimi === nimi) {
            return joukkue;
        }
    }
    return 'xx';
}


function korjaaJoukkueForm() {
    let fieldset = JOUKKUE_LOMAKE.querySelector('fieldset');
    fieldset.setAttribute('id', 'joukkuefieldset');

    let label = fieldset.querySelector("p > label");
    label.setAttribute('for', 'nimi1');
    label.firstElementChild.setAttribute('id', 'nimi1');
    label.firstElementChild.setAttribute('name', 'nimi');

    let insert = document.querySelector("#joukkuefieldset > p:nth-child(2)");
    let fieldset2 = document.createElement('fieldset');
    fieldset2.setAttribute('id', 'jasenet');
    while (fieldset2.hasChildNodes()) {
        fieldset2.removeChild(parent.lastChild);
    }
    insert.insertAdjacentElement('afterend', fieldset2);


    // Lisataan kaksi jasen inputtia
    addJasenInput();
    addJasenInput();

    
    //Ei tarvii?
    // let joukkueNimiInput = JOUKKUE_LOMAKE.nimi1;
    //joukkueNimiInput.addEventListener('input', addJasenInput);



    label.firstElementChild.addEventListener('input', paivita_nimi);
    function paivita_nimi(e) {
        muokattava_joukkue["nimi"] = e.target.value;
    }

    // Piilotetaan 'Tallenna muutokset'-nappi
    let lomake = fieldset.parentElement;
    lomake.muokkaa.hidden = true;


    // Disabloidaan lisaa joukkue nappain. (Muutetaan jaseninputtien evenlistenereissa)
    lomake.joukkue.disabled = true;

    lomake.muokkaa.addEventListener("click", muokkaa); 
    lomake.addEventListener("submit", function (e) {
        e.preventDefault();
        lisaaJoukkue(data);
    });

}


// function checkJasenInputValidity() {
//     // let lomake = document.getElementById("joukkuelomake");
//     let lomake = JOUKKUE_LOMAKE;
//     let fieldset = lomake.jasenet;
//     let inputit = fieldset.getElementsByTagName('input');

//     if (inputit.length >= 2 && lomake.nimi1.value.trim() != "") {
//         // Joukkueformin lisaa joukkue nappain -> enabled.
//         lomake.joukkue.disabled = false;
//     } else {
//         lomake.joukkue.disabled = true;
//     }
// }


function createJasenInput() {
    let label = document.createElement("label");
    label.textContent = "Kenttä";
    let input = document.createElement("input");
    input.setAttribute("type", "text");
    input.addEventListener("input", addJasenInput);
    label.appendChild(input);
    return label;
}


/**
 * 
 * @param {*} e 
 */
function addJasenInput(e) {

    let lomake = JOUKKUE_LOMAKE;
    let fieldset = lomake.jasenet;
    let viimeinen_tyhja = -1;
    let sisaltoa = 0;
    let joukkueNimiInput = lomake.nimi;
    let button = lomake.joukkue;
    let inputit = fieldset.getElementsByTagName('input');

    // Kaydaan inputit viimeisesta alkaen. Open koodia vahan muokattuna.
    let i;

    for (i = inputit.length - 1; i > -1; i--) {
        let input = inputit[i];

        if (viimeinen_tyhja > -1 && input.value.trim() == "" && inputit.length > 2) {
            let poistettava = inputit[viimeinen_tyhja].parentNode;
            fieldset.removeChild(poistettava);
            viimeinen_tyhja = i;
        }

        if (viimeinen_tyhja == -1 && input.value.trim() == "" && inputit.length > 1) {
            viimeinen_tyhja = i;
        }

        if (input.value !== "") {
            sisaltoa++;
        }
    }


    // Karvalakki validointi, jossa vajaajasenisen joukkueen lisays estetaan disabloimalla nappula.
    // Kunnon hackerman voisi tämän kiertää inspectorilla. Hänet estäisin tsekkaamalla "lisaa joukkue"-napin event listenerissa syotetyt tiedot.
    // Also muokatessa joukkuetta hyvaksytaan alle kahden jasenen joukkueet, joten ei valia.
    if (joukkueNimiInput.value != "" && sisaltoa >= 2) {
        button.disabled = false;
    } else {
        button.disabled = true;
    }



    // Jos ei ollut tyhjia kenttia, lisataan yksi
    if (viimeinen_tyhja == -1) {
        let newInput = createJasenInput();
        fieldset.appendChild(newInput);


        let y;
        // lisataan kenttiin numerointi ja indeksit
        for (y = 0; y < inputit.length; y++) {
            let label = inputit[y].parentNode;
            label.firstChild.nodeValue = "Jäsen " + (y + 1);
            inputit[y].setAttribute('name', `jasen${y + 1}`);
            inputit[y].indeksi = y;

            
            {
                let p = y;
                
                let paivita_luku = function (e) {
                        if (muokattava_joukkue["jasenet"]) {
                        if(e.target.value === "") {
                            muokattava_joukkue["jasenet"].splice(e.target.indeksi, 1);
                        } else {
                            muokattava_joukkue["jasenet"][e.target.indeksi] = e.target.value;
                        }
                    }
                    };
                    
                    inputit[y].removeEventListener('input', paivita_luku);
                    inputit[y].addEventListener('input', paivita_luku);
                }
            }
        
    }
}



/**
 * Event listener, kun painetaan tulokset tablesta joukkueen nimea.
 * Poistaa aiemmat joukkue lomakkeen inputit, ja asettaa muokattavan joukkueen.
 * @param {*} e 
 */
function muokkaaJoukkue(e) {
    let joukkue = e.currentTarget.joukkueObj;

    muokattava_joukkue["nimi"] = joukkue.nimi;
    muokattava_joukkue["jasenet"] = Array.from(joukkue.jasenet);

    alkuperainen_joukkue = joukkue;

    let lomake = JOUKKUE_LOMAKE;
    lomake.nimi.value = muokattava_joukkue["nimi"];

    let fieldset = lomake.jasenet;


    if (Array.isArray(joukkue.jasenet)) {
        while (fieldset.hasChildNodes()) {
            fieldset.removeChild(fieldset.lastChild);
        }
        for (let index = 0; index < joukkue.jasenet.length; index++) {

            let input = createJasenInput();
            input.firstElementChild.value = joukkue.jasenet[index];
    
            fieldset.appendChild(input);

        }
    }

    addJasenInput();

    // Piilotetaan "Lisaa joukkue"-nappi, ja naytetaan muokkaa
    lomake.joukkue.hidden = true;
    lomake.muokkaa.hidden = false;
}



/**
 * Lisaa tulokset tableen kohdan pisteille.
 */
function lisaaPisteEl() {
    let eka = document.querySelector("#tupa > table > tr:nth-child(2)");
    //let eka = document.querySelector("#tulokset > tr:nth-child(2)");
    let th1 = (document.createElement('th'));
    th1.textContent = 'Pisteet';
    eka.appendChild(th1);
}



function compareNames(cellA, cellB, asc) {
    if (asc) {
        if (cellA > cellB) { return 1; }
        if (cellA < cellB) { return -1; }
    } else {
        if (cellA > cellB) { return -1; }
        if (cellA < cellB) { return 1; }
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
    return 'xx';
}



// mutta koska toimii niin olkoot for now
function sortTaulukko() {
    let first = sort_order[0];
    let firstAsc = sort_order[1];
    let second = sort_order[2];
    let secondAsc = sort_order[3];
    let third = sort_order[4];
    let thirdAsc = sort_order[5];
    
    
    let taulukko = document.querySelector("#tupa > table");
    let rivit = [...taulukko.rows];

    //Otetaan eka <td> elementti pois joka on "Sarja Joukkue Pisteet"-legenda
    rivit.shift();

    let sorted = rivit.sort(function (a, b) {
        let cell1A, cell1B, cell2A, cell2B, cell3A, cell3B;

        // Jos tarkkailaan pisteet columnia, niin sen textContent pitää parseIntittaa
        if (first === 2) {
            cell1A = parseInt(a.cells[first].textContent);
            cell1B = parseInt(b.cells[first].textContent);
            // Jos tarkkaillaan nimi columnia, niin sitten nimi pitaa kaivaa syvemmalta
        } else if (first === 1) {
            cell1A = a.cells[first].firstElementChild.textContent.toLowerCase();
            cell1B = b.cells[first].firstElementChild.textContent.toLowerCase();
        } else {
            cell1A = a.cells[first].textContent.toLowerCase();
            cell1B = b.cells[first].textContent.toLowerCase();
        }

        //  compareNames(cell1A, cell1B, firstAsc); // Miksi tama ei toimi?? Tismalleen sama koodi.
        if (firstAsc) {
            if (cell1A > cell1B) { return 1; }
            if (cell1A < cell1B) { return -1; }
        } else {
            if (cell1A > cell1B) { return -1; }
            if (cell1A < cell1B) { return 1; }
        }

        if (second) {
            if (second === 2) {
                cell2A = parseInt(a.cells[second].textContent);
                cell2B = parseInt(b.cells[second].textContent);
            } else if (third === 1) {
                cell2A = a.cells[second].firstElementChild.textContent.toLowerCase();
                cell2B = b.cells[second].firstElementChild.textContent.toLowerCase();
            } else {
                cell2A = a.cells[second].textContent.toLowerCase();
                cell2B = b.cells[second].textContent.toLowerCase();
            }

            if (secondAsc) {
                if (cell2A > cell2B) { return 1; }
                if (cell2A < cell2B) { return -1; }
            } else {
                if (cell2A > cell2B) { return -1; }
                if (cell2A < cell2B) { return 1; }
            }
        }

        if (third) {
            // Jos tarkkailaan pisteet columnia, niin sen textContent pitää parseIntittaa
            if (third === 2) {
                cell3A = parseInt(a.cells[third].textContent);
                cell3B = parseInt(b.cells[third].textContent);
                // Jos tarkkaillaan nimi columnia, niin sitten nimi pitaa kaivaa syvemmalta
            } else if (third === 1) {
                cell3A = a.cells[third].firstElementChild.textContent.toLowerCase();
                cell3B = b.cells[third].firstElementChild.textContent.toLowerCase();
            } else {
                cell2A = a.cells[second].textContent.toLowerCase();
                cell2B = b.cells[second].textContent.toLowerCase();
            }

            if (thirdAsc) {
                if (cell3A > cell3B) { return 1; }
                if (cell3A < cell3B) { return -1; }
            } else {
                if (cell3A > cell3B) { return -1; }
                if (cell3A < cell3B) { return 1; }
            }
        }
    });

    sorted.forEach(function (el) {
        taulukko.appendChild(el);
    });
}


function lisaaKaikkiJoukkueet(joukkueet) {
    let taulukko = document.querySelector("#tupa > table");

    for (let i = taulukko.children.length; i > 2; i--) {
        const element = taulukko.children[i-1];
        taulukko.removeChild(element);
    }

    for (const joukkue of joukkueet) {
        lisaaRiviTaulukkoon(taulukko, joukkue);
    }
}


//<tr><td>2h</td><td><a href="#joukkue">Porukka</a> 
//<br />Etunimi1 Sukunimi1, Etunimi2 Sukunimi2,...</td>    <td>138</td></tr>
function lisaaRiviTaulukkoon(taulukko, joukkue) {

    let nimi = document.createTextNode(joukkue["nimi"]);
    let joukSarja = document.createTextNode(getSarjanNimi(joukkue.sarja));
    let joukPisteet = laskePisteet(joukkue) + ' p';
    let tr = document.createElement('tr');
    let sarja1 = document.createElement('td');
    sarja1.appendChild(joukSarja);
    let td = document.createElement('td');
    let a = document.createElement('a');
    a.appendChild(nimi);

    a.setAttribute('href', '#joukkuelomake');
    a.addEventListener("click", muokkaaJoukkue);
    td.appendChild(a);
    let br = document.createElement('br');
    td.appendChild(br);

    let joukJasenet = document.createElement('span');

    for (let i = 0; i < joukkue.jasenet.length; i++) {
        let jasen = joukkue.jasenet[i];
        joukJasenet.appendChild(document.createTextNode(jasen));
        if (i !== joukkue.jasenet.length - 1) {
            joukJasenet.appendChild(document.createTextNode(', '));
        }
    }
    td.appendChild(joukJasenet);

    let pisteet1 = document.createElement('td');
    pisteet1.textContent = joukPisteet;

    a.joukkueObj = joukkue;

    joukkue["listaus"] = {
        "nimi": nimi,
        "jasenet": joukJasenet
    };

    tr.appendChild(sarja1);
    tr.appendChild(td);
    tr.appendChild(pisteet1);

    taulukko.append(tr);
}


//https://domtool.yakshavings.co.uk/
function lisaaRastiFieldset(parent) {

    let fieldset1 = document.createElement('fieldset');
    let legend1 = document.createElement('legend');
    fieldset1.appendChild(legend1);

    let txt1 = document.createTextNode('Rastin tiedot');
    legend1.appendChild(txt1);
    let label1 = document.createElement('label');

    let span1 = document.createElement('span');
    let txt2 = document.createTextNode('Lat');
    span1.appendChild(txt2);

    label1.appendChild(span1);

    let input1 = document.createElement('input');
    input1.setAttribute('type', 'text');
    input1.setAttribute('value', "");
    label1.appendChild(input1);

    fieldset1.appendChild(label1);

    let label2 = document.createElement('label');
    let span2 = document.createElement('span');
    let txt3 = document.createTextNode('Lon');
    span2.appendChild(txt3);
    label2.appendChild(span2);
    let input2 = document.createElement('input');
    input2.setAttribute('type', 'text');
    input2.setAttribute('value', "");

    label2.appendChild(input2);
    fieldset1.appendChild(label2);

    let label3 = document.createElement('label');
    let span3 = document.createElement('span');
    let txt4 = document.createTextNode('Koodi');
    span3.appendChild(txt4);
    label3.appendChild(span3);
    let input3 = document.createElement('input');
    input3.setAttribute('type', 'text');
    input3.setAttribute('value', "");

    label3.appendChild(input3);
    fieldset1.appendChild(label3);

    let button1 = document.createElement('button', 'lisaarasti');
    button1.setAttribute('id', 'rasti');
    let txt7 = document.createTextNode('Lisää rasti');
    button1.appendChild(txt7);
    fieldset1.appendChild(button1);

    parent.appendChild(fieldset1);
}


/**
 * Lisaa rastin tietokantaan
 * @param {*} lat 
 * @param {*} lon 
 * @param {*} koodi 
 * @returns 
 */
function lisaaRasti(lat, lon, koodi) {
    if (!lat || !lon || !koodi) {
        return;
    }

    if (isNaN(parseFloat(lat)) || isNaN(parseFloat(lon))) {
        return;
    }

    let rasti = {
        lon: lon.toString(),
        koodi: koodi.toString(),
        lat: lat.toString(),
        id: uusiRastiKoodi(),
    };
    data.rastit.push(rasti);
}


function uusiRastiKoodi() {
    let max = 0;
    for (const el of data.rastit) {
        if (el.id > max) {
            max = el.id;
        }
    }
    return max + 1;
}



function muutaSarjanNimi(data, vanhanimi, uusinimi) {
    for (let i in data.sarjat) {
        if (data.sarjat[i].nimi == vanhanimi) {
            data.sarjat[i].nimi = uusinimi;
            return;
        }
    }
}


/**
 * Hakee sarjan nimella sarjan id:m.
 * @param {*} sarjaid 
 */
 function getSarjanId(nimi) {
    // jos ei anneta nimea, palautetaan vakiona 8h
    if(!nimi) {
        return getSarjanId('8h');
    }


    for (const sarja of data.sarjat) {
        if (sarja.nimi === nimi) {
            return sarja.id;
        }
    }

    return 'xx';
}


// ====================================================================



/**
 * Summaa joukkueen saamat pisteet.
 * @param {*} joukkue Joukkue, jonka pisteet summataan
 */
function laskePisteet(joukkue) {

    // Puhdistetaan data (esim. 'rast' ja rastit joiden arvo on "0")
    let rastit = puhdistaRastit(joukkue.rastit);

    // Rajataan rastit lahdon ja maalin valiin
    rastit = leikkaaLahtoMaali(rastit, false);

    // Tsekataan duplikaatit
    // https://stackoverflow.com/a/24968449
    // {    23452643: 1,
    //      54692353: 2,
    //      23546342: 1...}
    let uniikit = rastit.map((x) => {
        return {
            count: 1,
            id: x.rasti
        };
    })
        .reduce((a, b) => {
            a[b.id] = (a[b.id] || 0) + b.count;
            return a;
        }, {});

    //let duplicates = Object.keys(uniikit).filter((a) => uniikit[a] > 1);


    // Haetaan rastin koodi (sama kuin vt1) rastin id:lla
    let koodit = Object.keys(uniikit).map(x => getRastiKoodiById(x));


    // Tehdaan lista numerolla alkavien ensimmaisista kirjaimista.
    let pisteRastit = koodit.map(function (el) {
        return (el.match(/^[0-9]/g));
    });

    pisteRastit = pisteRastit.flat();

    let summa2 = pisteRastit.reduce((a, b) => parseInt(a) + parseInt(b), 0);
    return summa2;
}


//Rasti koodin perusteella
function getRastiByCode(code) {
    for (let i in data.rastit) {
        if (data.rastit[i].koodi === code) {
            return data.rastit[i];
        }
    }
    return null;
}

//Rasti id:n perusteella
function getRastiKoodiById(code) {
    code = parseInt(code);
    for (let i in data.rastit) {
        if (data.rastit[i].id === code) {
            return data.rastit[i].koodi;
        }
    }
    return null;
}



/**
 * Tarkistaa, onko rasti oikea, eli sisaltaa koodin
 * @param {*} el Rasti
 */
function onkoRasti(el) {
    if (typeof (el) === 'object' && el.hasOwnProperty('rasti')) {
        if (parseInt(el.rasti) > 0) {
            return true;
        }
    }
    return false;
}


/**
 * Poistaa joukkueen rasteista vaaranalaiset rastit.
 * @param {object} rastit Taulukko rasteista, jotka puhdistetaan
 */
function puhdistaRastit(rastit) {
    if (!rastit) { return []; }
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

    const alkuRasti = getRastiByCode('LAHTO');
    const maaliRasti = getRastiByCode('MAALI');


    for (let i = 0; i < rastit.length; i++) {
        if (parseInt(rastit[i].rasti) === alkuRasti.id) {
            lahtoidx = i;
        }
    }


    if (lahtoidx === -1) { return []; }

    if (jataOikeat) {
        rastit = rastit.slice(lahtoidx);
    } else {
        rastit = rastit.slice(lahtoidx + 1);
    }


    let maaliidx = -1;
    for (let i = 0; i < rastit.length; i++) {
        if (parseInt(rastit[i].rasti) === maaliRasti.id) {
            maaliidx = i;
            break;
        }
    }


    if (jataOikeat) {
        rastit = rastit.slice(0, maaliidx + 1);
    } else {
        rastit = rastit.slice(0, maaliidx);
    }

    return rastit;
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