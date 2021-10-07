"use strict";
//@ts-check 

// data-muuttuja on lähes sama kuin viikkotehtävässä 1.
//
//console.log(data);
let muokattava_joukkue = {};
let alkuperainen_joukkue = muokattava_joukkue;

window.addEventListener("load", function() {

    
    let tulokset = document.querySelector("#tupa > table");
    tulokset.id = 'tulokset';
    let lisaaRastiEl = document.querySelector("body > h2:nth-child(3)");

    lisaaKaikkiJoukkueet(tulokset, data.joukkueet);

    // sorttaa ensisijaisesti sarjan kanssa (cell[0]) 
    // ja toissijaisesti nimen kanssa (cell[1])
    //sortByColumn(tulokset, 1, false, 2, true);

    lisaaRastiLomake(lisaaRastiEl);

    let rastiForm = document.forms[0];

    lisaaPisteEl();
    //muokkaaTulostus();

    // sorttaa ensisijaisesti sarjan kanssa (cell[0]) 
    // ja toissijaisesti pisteiden kanssa (cell[1])
    sortByColumn(tulokset, 0, true, 2, false, 1, true);

    //laskePisteet(data.joukkueet[0]);
    korjaaJoukkueForm();





    rastiForm.addEventListener("submit", function(e) {
        e.preventDefault();
        lisaaRasti(rastiForm[1].value, rastiForm[2].value, rastiForm[3].value);
    });


    
    let joukkueform = document.getElementById('joukkuelomake');

    // Disabloidaan lisaa joukkue nappain. (Muutetaan jaseninputtien evenlistenereissa)
    joukkueform.joukkue.disabled = true;
    
    joukkueform.muokkaa.addEventListener("click", function(e) {
        e.preventDefault();
        alkuperainen_joukkue["nimi"] = muokattava_joukkue["nimi"];
        alkuperainen_joukkue["jasenet"] = muokattava_joukkue["jasenet"];
        
        alkuperainen_joukkue["listaus"]["nimi"].textContent = muokattava_joukkue["nimi"];
        
        
        //lisaaKaikkiJoukkueet(tulokset, data.joukkueet);
        
        //alkuperainen_joukkue["listaus"].jasenet = muokattava_joukkue["jasenet"].join(', ');
        
        for (let index = 0; index < muokattava_joukkue["jasenet"].length; index++) {
            
            
            let joukJasenet = document.createElement('span');
            
            // Super laiskuus iski...
            
            while (alkuperainen_joukkue["listaus"].jasenet.hasChildNodes()) {
                alkuperainen_joukkue["listaus"].jasenet.lastChild.remove();
            }
            
            
            for (let i = 0; i < muokattava_joukkue["jasenet"].length; i++) {
                let nimi = muokattava_joukkue["jasenet"][i];
                joukJasenet.appendChild(document.createTextNode(nimi));
                if (i !== muokattava_joukkue["jasenet"].length - 1) {
                    joukJasenet.appendChild(document.createTextNode(', '));
                }
            }
            alkuperainen_joukkue["listaus"].jasenet.appendChild(joukJasenet);
            
            let lomake = document.forms[2];
            lomake.joukkue.hidden = false;
            lomake.muokkaa.hidden = true;
            
            // let rivi = alkuperainen_joukkue["listaus"]["jasenet"];
            // //rivi.textContent = muokattava_joukkue["jasenet"].join(', ');
            // for (const el of alkuperainen_joukkue["listaus"].jasenet.childNodes) {
                //     if(el.textValue !== ", ")
                // }
                
                
            }
            joukkueform.reset();
            //addJasenInput(document.getElementById('jasenet'), null);
            sortByColumn(tulokset, 0, true, 2, false, 1, true);
        });
        
        joukkueform.addEventListener("submit", function(e) {
            e.preventDefault();
            lisaaJoukkue(data, 1234);
        });


});




/**
 * Loppui tyostämisaika. Tein raakileen.
 * @param {*} data 
 * @param {*} sarja 
 */
function lisaaJoukkue(data, sarja) {

    let lomake = document.getElementById('joukkuelomake');
    let inputit = lomake.getElementsByTagName('input');

    let nimi = inputit[0].value;
    let jasenet = [];

    for (let i = 1; i < inputit.length - 1; i++) {
        let input = inputit[i];
        jasenet.push(input.value);
    }

    let joukkue = {
        nimi: nimi,
        sarja: sarja,
        jasenet: jasenet

    };

    data.joukkueet.push(joukkue);
        
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

    let fieldset = document.querySelector("#joukkuelomake > fieldset");
    fieldset.setAttribute('id', 'joukkuefieldset');

    let label = document.querySelector("#joukkuefieldset > p:nth-child(2) > label");
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

    addJasenInput2();
    addJasenInput2();
    
    label.firstElementChild.addEventListener('input', paivita_nimi);


    function paivita_nimi(e) {
        muokattava_joukkue["nimi"] = e.target.value;
        console.log('alkup: ' + alkuperainen_joukkue["nimi"]);
        console.log('muokat: ' + muokattava_joukkue["nimi"]);
    }

    // Piilotetaan 'Tallenna muutokset'-nappi
    let lomake = fieldset.parentElement;
    lomake.muokkaa.hidden = true;
}


function checkJasenInputValidity() {
    let lomake = document.getElementById("joukkuelomake");
    let fieldset = document.getElementById("jasenet");
    let inputit = fieldset.getElementsByTagName('input');

    if (inputit.length >= 2 && lomake.nimi1.value.trim() != "") {
        // Joukkueformin lisaa joukkue nappain -> enabled.
        lomake.joukkue.disabled = false;
    } else {
        lomake.joukkue.disabled = true;
    }
}

function createJasenInput() {
    let label = document.createElement("label");
    label.textContent = "Kenttä";
    let input = document.createElement("input");
    input.setAttribute("type", "text");
    input.addEventListener("input", addJasenInput2);
    label.appendChild(input);
    return label;
}



function addJasenInput2(e) {
    let fieldset = document.getElementById("jasenet");
    let inputit = fieldset.getElementsByTagName('input');
    let viimeinen_tyhja = -1;
    let sisaltoa = 0;
    let button = fieldset.getElementById('joukkue');

    
    // Kaydaan inputit viimeisesta alkaen
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

        if(input.value !== "") {
            sisaltoa++;
        }
    }
    
    if(sisaltoa >= 2) {
        button.disabled = false;
    } else {
        button.disabled = true;
    }


    // Jos ei ollut tyhjia kenttia, tai ei lainkaan kenttia, tai vain yksi kentta, lisataan yksi.
    if (viimeinen_tyhja == -1) {
        let newInput = createJasenInput(); 
        fieldset.appendChild(newInput);

        
        let y;
        // jos halutaan kenttiin numerointi
        for(y=0; y<inputit.length; y++) {
            let label = inputit[y].parentNode;
            label.firstChild.nodeValue = "Jäsen " + (y+1);
            inputit[y].setAttribute('name', `jasen${y + 1}`);
            inputit[y].indeksi = y;
        }

        
        if (muokattava_joukkue["jasenet"] !== undefined){
            {
                let p = y;
                newInput.removeEventListener('input', paivita_luku);
                function paivita_luku(e) {
                    if(e.target.value.trim() !== ""){

                        muokattava_joukkue["jasenet"][p-1] = e.target.value;
                    }
                    console.log('alkup: ' + alkuperainen_joukkue["jasenet"][p]);
                    console.log('muokat: ' + muokattava_joukkue["jasenet"][p]);
                }
                
                newInput.addEventListener('input', paivita_luku);
            }
        }
    }
}


function addJasenInput(parent, jasenet) {
    let n;
    if(jasenet === null) {
        n = 2;
    } else {
        n = jasenet.length;
    }


    while (parent.hasChildNodes()) {
        parent.removeChild(parent.lastChild);
    }

    for (let index = 0; index < n; index++) {


        let uusiLabel = document.createElement("label");
        uusiLabel.textContent = `Jäsen ${index + 1}`;
        let input = document.createElement("input");
        input.setAttribute('name', `jasen${index + 1}`);
        input.setAttribute("type", "text");
        input.indeksi = index;
        if (jasenet !== null) {
            input.value = jasenet[index];
        }
    
        {
            let p = index;
            input.removeEventListener('input', paivita_luku);
            function paivita_luku(e) {
                muokattava_joukkue["jasenet"][p] = e.target.value;
                console.log('alkup: ' + alkuperainen_joukkue["jasenet"][p]);
                console.log('muokat: ' + muokattava_joukkue["jasenet"][p]);
            }
            
            input.addEventListener('input', paivita_luku);
        }
        parent.appendChild(uusiLabel).appendChild(input);
    }
    addJasenInput2();
}


function muokkaaJoukkue(e) {


    let joukkue = e.currentTarget.joukkueObj;

    muokattava_joukkue["nimi"] = joukkue.nimi;
    muokattava_joukkue["jasenet"] = Array.from(joukkue.jasenet);

    alkuperainen_joukkue = joukkue;

    let lomake = document.forms[2];
    lomake.nimi.value = muokattava_joukkue["nimi"];

    let fieldset = document.getElementById('jasenet');

    fieldset.jasenet = joukkue.jasenet;


    
    addJasenInput(fieldset, joukkue.jasenet);

    // Piilotetaan "Lisaa joukkue"-nappi, ja naytetaan muokkaa
    lomake.joukkue.hidden = true;
    lomake.muokkaa.hidden = false;
}




function muokkaaTulostus() {
    // Pisteet
    let eka = document.querySelector("#tulokset > tr:nth-child(2)");
    let th1 = (document.createElement('th'));
    th1.textContent = 'Pisteet';
    eka.appendChild(th1);

    let td1 = document.createElement('td');
    let a1 = document.createElement('a');
    a1.setAttribute('href', '#joukkue');
    a1.textContent = 'Porukka';
    let br1 = document.createElement('br');
    let text1 = document.createTextNode('En1 Sn1, En1 Sn2');

    td1.appendChild(a1);
    td1.appendChild(br1);
    td1.appendChild(text1);

    eka.append(td1);

}


function lisaaPisteEl() {
        // Pisteet
        let eka = document.querySelector("#tulokset > tr:nth-child(2)");
        let th1 = (document.createElement('th'));
        th1.textContent = 'Pisteet';
        eka.appendChild(th1);
}



function compareNames(cellA, cellB, asc){
    if (asc) {
        if(cellA > cellB) {return 1;}
        if(cellA < cellB) {return -1;}
    } else {
        if(cellA > cellB) {return -1;}
        if(cellA < cellB) {return 1;}
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


// todo(?) n argumentin maarittaman cellin mukaan sorttaus
// mahd riski kun sortataan pisteilla: verrataan tekstia eika numeroita,
// mutta koska toimii niin olkoot for now
function sortByColumn(taulukko, first, firstAsc, second, secondAsc, third, thirdAsc) {   
    let rivit = [...taulukko.rows];
    
    //Otetaan eka <td> elementti pois joka on Sarja Joukkue
    rivit.shift();
    
    let sorted = rivit.sort(function(a, b) {
        let cell1A, cell1B, cell2A, cell2B, cell3A, cell3B;

        // Jos tarkkailaan pisteet columnia, niin sen textContent pitää parseIntittaa
        if(first === 2) {
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
        if(firstAsc) {
            if(cell1A > cell1B) {return 1;}
            if(cell1A < cell1B) {return -1;}
        } else {
            if(cell1A > cell1B) {return -1;}
            if(cell1A < cell1B) {return 1;}
        }
        
        if(second) {
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
                if (cell2A > cell2B) {return 1;}
                if (cell2A < cell2B) {return -1;}
            } else {
                if (cell2A > cell2B) {return -1;}
                if (cell2A < cell2B) {return 1;}
            }
        }

        if(third) {
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
                if (cell3A > cell3B) {return 1;}
                if (cell3A < cell3B) {return -1;}
            } else {
                if (cell3A > cell3B) {return -1;}
                if (cell3A < cell3B) {return 1;}
            }
        }
    });
    
    sorted.forEach(function (el) {
        taulukko.appendChild(el);
    });
}

function lisaaKaikkiJoukkueet(taulukko, joukkueet) { 
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
function lisaaRastiLomake(parent) {
    let form = document.createElement('form');

    form.setAttribute('action','foobar.ei.toimi.example');
    form.setAttribute('method','post');
    var fieldset1=document.createElement('fieldset');
    var legend1=document.createElement('legend');
    fieldset1.appendChild(legend1);
    
    var txt1=document.createTextNode('Rastin tiedot');
    legend1.appendChild(txt1);
    var label1=document.createElement('label');

    var span1=document.createElement('span');
    var txt2=document.createTextNode('Lat');
    span1.appendChild(txt2);

    label1.appendChild(span1);
    
    var input1=document.createElement('input');
    input1.setAttribute('type','text');
    input1.setAttribute('value', "");
    label1.appendChild(input1);
    
    fieldset1.appendChild(label1);

    var label2=document.createElement('label');
    var span2=document.createElement('span');
    var txt3=document.createTextNode('Lon');
    span2.appendChild(txt3);
    label2.appendChild(span2);
    var input2=document.createElement('input');
    input2.setAttribute('type','text');
    input2.setAttribute('value', "");

    label2.appendChild(input2);
    fieldset1.appendChild(label2);

    var label3=document.createElement('label');
    var span3=document.createElement('span');
    var txt4=document.createTextNode('Koodi');
    span3.appendChild(txt4);
    label3.appendChild(span3);
    var input3=document.createElement('input');
    input3.setAttribute('type','text');
    input3.setAttribute('value', "");

    label3.appendChild(input3);
    fieldset1.appendChild(label3);
    
    form.appendChild(fieldset1);
    var button1=document.createElement('button','lisaarasti');
    button1.setAttribute('id', 'rasti');
    var txt7=document.createTextNode('Lisää rasti');
    button1.appendChild(txt7);
    fieldset1.appendChild(button1);

    parent.after(form);
}



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
        if(el.id > max) {
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
        if (parseInt(el.rasti) > 0){
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
        if(parseInt(rastit[i].rasti) === alkuRasti.id) {
            lahtoidx = i;
        }
    }


    if (lahtoidx === -1) {return [];}

    if (jataOikeat) {
        rastit = rastit.slice(lahtoidx);
    } else {
        rastit = rastit.slice(lahtoidx + 1);
    }


    let maaliidx = -1;
    for (let i = 0; i < rastit.length; i++) {
        if(parseInt(rastit[i].rasti) === maaliRasti.id) {
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