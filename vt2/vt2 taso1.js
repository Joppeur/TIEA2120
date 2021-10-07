"use strict";
//@ts-check 
// data-muuttuja on lähes sama kuin viikkotehtävässä 1.
//

//console.log(data);


window.addEventListener("load", function() {
    let tulokset = document.querySelector("#tupa > table");
    tulokset.id = 'tulokset';
    let lisaaRastiEl = document.querySelector("body > h2:nth-child(3)");

    lisaaKaikkiJoukkueet(tulokset, data.joukkueet);

    // sorttaa ensisijaisesti sarjan kanssa (cell[0]) 
    // ja toissijaisesti nimen kanssa (cell[1])
    sortByColumn(tulokset, 0, 1);

    lisaaRastiLomake(lisaaRastiEl);

    let rastiForm = document.forms[0];

    //muokkaaTulostus();

    rastiForm.addEventListener("submit", function(e) {
        e.preventDefault();
        lisaaRasti(rastiForm[1].value, rastiForm[2].value, rastiForm[3].value);
    });

});

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


function lisaaKaikkiJoukkueet(taulukko, joukkueet) {
    for (const joukkue of joukkueet) {
        let nimi = joukkue.nimi;
        let sarja = getSarjanNimi(joukkue.sarja);
        lisaaRiviTaulukkoon(taulukko, [sarja, nimi]);
    }
}


function compareNames(nameA, nameB){
    //nameA = nameA.toUpperCase().trim();
    //nameB = nameB.nimi.toUpperCase().trim();

    if (nameA > nameB) {
        return 1;
    }
    if (nameA < nameB) {
        return -1;
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
function sortByColumn(taulukko, first, second) {   
    let rivit = [...taulukko.rows];

    //Otetaan eka <td> elementti pois joka on Sarja Joukkue
    rivit.shift();

    let sorted = rivit.sort(function(a, b) {
        let cell1A = a.cells[first].textContent;
        let cell1B = b.cells[first].textContent;
        if(cell1A > cell1B) {return 1;}
        if(cell1A < cell1B) {return -1;}

        if(second) {
            let cell2A = a.cells[second].textContent.toLowerCase();
            let cell2B = b.cells[second].textContent.toLowerCase();

            // compareNames(nameA, nameB); // Miksi tama ei toimi???????
            if (cell2A > cell2B) {return 1;}
            if (cell2A < cell2B) {return -1;}
        }


    });

    sorted.forEach(function (val) {
        taulukko.appendChild(val);
    });
}


function lisaaRiviTaulukkoon(taulukko, kolumnit) {
    let tr = document.createElement('tr');

    for (let i = 0; i < kolumnit.length; i++) {
        const input = kolumnit[i];
        let td = document.createElement('td');
        td.textContent = input;
        tr.appendChild(td);
    }
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