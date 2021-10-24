"use strict";  // pidä tämä ensimmäisenä rivinä
//@ts-check 

//console.log(data);


lisaaSarjaRadiot();
lisaaLeimausCheckboxit();
inputHandler();
inputHandler();
luoJoukkueListaus();

// Event handlerit
// ======================================================================================================

// Valittaa mahdollisesta tyhjasta nimesta kun siirrytaan seuraavaan kenttaan.
let nimi = document.querySelector("#nimi");
nimi.addEventListener('blur', function (e) { 
    nimi.setCustomValidity(nimiCustomValidity(nimi));
    e.target.reportValidity();
});


// Valittaa mahdollisesta tyhjasta leimauksesta kun yritetaan siirtya seuraavaan kenttaan viimeisesta checkboxista.
let lastCheckbox = document.querySelector("#leimaukset > div:last-child input");
lastCheckbox.addEventListener('blur', function(e) {
    e.target.reportValidity();
});


let form = document.forms[0];
form.addEventListener('submit', function (e) {
    e.preventDefault();
    nimi.setCustomValidity(nimiCustomValidity(nimi));

    if (form.checkValidity()) {
        // Jos kaikki ok, lisataan joukkue tietokantaan
        
        // Haetaan jasenten nimet inputeista
        let jasenInputs = document.getElementsByClassName('jaseninput');
        let jasenet = [];
        for (const input of jasenInputs) {
            if (input.value !== '') {
                jasenet.push(input.value);
            }
        }

        let leimausInputs = document.querySelectorAll('input[name="leimauscheckbox"]:checked');
        let leimaukset = [];
        for (const input of leimausInputs) {
            let leimausNimi = input.labels[0].textContent;
            leimaukset.push(getLeimausIdx(leimausNimi));
        }

        lisaaJoukkue(
            e.target.nimi.value,
            leimaukset,
            e.target.querySelector('input[name="sarjaradio"]:checked').labels[0].textContent, // Hakee checkatun radionapin contentin
            jasenet
        );

        e.target.reset();
        inputHandler();
    } 

    // Paivitetaan joukkuelistaus
    luoJoukkueListaus();
});

// ======================================================================================================





function luoJoukkueListaus() {
    let list = document.getElementById('joukkuelistaus');

    // Tyhjennetaan listaus
    while(list.hasChildNodes()) {
        list.lastElementChild.remove();
    }

    // Luodaan kopio joukkuedatasta, ja sortataan.
    let joukkueet = [...data.joukkueet];
    sortJoukkueet(joukkueet);

    // Tehdaan jokaiselle joukkueelle oma li
    for (let i = 0; i < joukkueet.length; i++) {
        const joukkue = joukkueet[i];
        let joukkueli = luoJoukkueLiElement(joukkue);
        list.appendChild(joukkueli);
    }
}


function luoJoukkueLiElement(joukkue) {
    
    // li-elementti johon joukkueen nimi ja boldattu sarjan nimi
    let li = document.createElement('li');
    let textNode1 = document.createTextNode(joukkue.nimi.trim() + ' ');
    let str = getSarjanNimi(joukkue.sarja);
    let sarjanNimi = str.substring(0, 1) + ' ' + str.substring(1);  // Vali sarjan nimeen '8 h'
    let textNode2 = document.createTextNode(sarjanNimi);
    let strong = document.createElement('strong');
    strong.appendChild(textNode2);
    li.appendChild(textNode1);
    li.appendChild(strong);
    
    // li-elementit jasenille ja ne ul:n sisaan
    let ul = document.createElement('ul');
    for (let i = 0; i < joukkue.jasenet.length; i++) {
        const jasen = joukkue.jasenet[i];
        let jasenli = document.createElement('li');
        jasenli.textContent = jasen;
        ul.appendChild(jasenli);
    }
    // jasenten ul joukkueen li:n sisaan
    li.appendChild(ul);
    
    return li;
}


function sortJoukkueet(joukkueet) {
    // Ensisijaisesti nimen mukaan
    joukkueet.sort((a, b) => compareNames(a.nimi, b.nimi, true));

     // Toissijaisesti sarjan mukaan
    joukkueet.sort((a, b) => compareNames(getSarjanNimi(a.sarja), getSarjanNimi(b.sarja)));
}


function lisaaJoukkue(nimi, leimaukset, sarja, jasenet) {
    
    //let leimaustapa = [0];  // Hardcoded
    let rastit = {};        // Hardcoded, voisi olla parempi laittaa HTLM formiin hidden inputtina.

    let joukkue = {
        nimi: nimi,
        jasenet: jasenet,
        id: uusiJoukkueId(),
        rastit: rastit,
        leimaustapa: leimaukset,
        sarja: getSarjanId(sarja)
    };

    data.joukkueet.push(joukkue);
}


function nimiCustomValidity(nimi) {
    if (nimi.value.trim().length < 2) {
        return 'Joukkueen nimen on oltava vähintään kaksi merkkiä pitkä.';
    }

    if (getJoukkueByNimi(nimi.value.trim()) !== null) {
        return `Nimi "${nimi.value.trim()}" on jo käytössä.`;
    }

    return '';
}


function inputHandler() {
    let fieldset = document.querySelector('#jasenet');
    let inputit = fieldset.getElementsByTagName('input');
    let viimeinen_tyhja = -1;
    let sisaltoa = 0;

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
            input.setCustomValidity('');
        } else {

        }
    }

    if (viimeinen_tyhja == -1) {
        let newInputDiv = luoJasenInput();
        fieldset.appendChild(newInputDiv);
    }

    for (let y = 0; y < inputit.length; y++) {

        if (inputit[y].value == '' && sisaltoa < 2) {
            inputit[y].setCustomValidity('Joukkueella on oltava vähintään kaksi jäsentä');
        }


        let label = inputit[y].previousElementSibling;
        label.textContent = "Jäsen " + (y + 1);
        label.setAttribute('for', `jasen${y + 1}`); // For attribuutti, jotta sen klikkaus aktivoi oikean inputin
        inputit[y].setAttribute('name', `jasen${y + 1}`);
        inputit[y].setAttribute('id', `jasen${y + 1}`);
    }

}


function luoJasenInput() {
    let div = document.createElement('div');
    div.className = 'jasen';
    let label = document.createElement("label");
    label.textContent = "Jasen";
    let input = document.createElement("input");
    input.setAttribute("type", "text");
    input.setAttribute('class', 'jaseninput');
    input.addEventListener("input", inputHandler);

    div.appendChild(label);
    div.appendChild(input);
    return div;
}

function lisaaLeimausCheckboxit() {
    let leimauksetDiv = document.querySelector("#leimaukset");
    let leimaustavat = [...data.leimaustapa];

    for (let i = 0; i < leimaustavat.length; i++) {
        const tapa = leimaustavat[i];
        let div = document.createElement('div');
        div.setAttribute('class', 'checkbox');

        // Lisataan ekaan diviin span teksti 'Leimaustapa'
        if (i == 0) {
            let span = document.createElement('span');
            span.textContent = 'Leimaustapa';
            span.setAttribute('id', 'checkboxSpan');
            div.appendChild(span);
        }

        let label = document.createElement('label');
        label.setAttribute('class', 'checkboxlabel');
        label.setAttribute('for', `leimauscheckbox${i}`);
        label.textContent = tapa;
        div.appendChild(label);

        let input = document.createElement('input');
        input.setAttribute('type', 'checkbox');
        input.setAttribute('name', `leimauscheckbox`);
        input.setAttribute('id', `leimauscheckbox${i}`);
        

        // Validity check leimaustavoille
        input.addEventListener('change', function() {
            leimausValidity();
        });

        div.appendChild(input);
        leimauksetDiv.appendChild(div);
    }

    // Kutsutaan tata kerran, jotta viimeinen checkbox saa customValidityn.
    leimausValidity();

}


// Tarkastaa, onko leimaustapaa valittu. Jos on, poistetaan validityherjaus joka on asetettu ainoastaan viimeiselle checkboxille.
// TODO: parempi nimi talle funktiolle.
function leimausValidity() {
    let checked = document.querySelectorAll('input[name="leimauscheckbox"]:checked');
            
    if (checked.length > 0) {
        let lastCheckbox = document.querySelector("#leimaukset > div:last-child input"); // Hakee viimeisen leimauscheckboxin
        lastCheckbox.setCustomValidity('');
    } else {
        let lastCheckbox = document.querySelector("#leimaukset > div:last-child input"); // Hakee viimeisen leimauscheckboxin
        lastCheckbox.setCustomValidity('Valitse vähintään yksi leimaustapa.');
    }
}


// Lisaa formin fielsettiin radionapit sarjoille aakkosjarjestyksessa. Checkkaa ekan vakiona.
function lisaaSarjaRadiot() {
    let sarjatdiv = document.querySelector("#sarjat");

    let sarjat = [...data.sarjat];
    sarjat.sort((a, b) => compareNames(a.nimi, b.nimi, true));

    for (let i = 0; i < sarjat.length; i++) {
        const sarja = sarjat[i];
        let div = document.createElement('div');
        div.setAttribute('class', 'radio');

        // Lisataan ekaan diviin span teksti 'Sarja'
        if (i == 0) {
            let span = document.createElement('span');
            span.textContent = 'Sarja';
            span.setAttribute('id', 'sarjaSpan');
            div.appendChild(span);
        }

        let label = document.createElement('label');
        label.setAttribute('class', 'sarjalabel');
        label.setAttribute('for', `sarja${i}`);
        label.textContent = sarja.nimi;
        div.appendChild(label);

        let input = document.createElement('input');
        input.setAttribute('type', 'radio');
        input.setAttribute('name', `sarjaradio`);
        input.setAttribute('id', `sarja${i}`);


        if (i == 0) {
            input.checked = true;  // Vakiona check ekaan
        }

        div.appendChild(input);
        sarjatdiv.appendChild(div);
    }

}



// Aiempien tasojen juttuja.
// ========================================================================================================

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
 * Hakee sarjan nimella sarjan id:m.
 * @param {*} sarjaid 
 */
function getSarjanId(nimi) {
    // jos ei anneta nimea, palautetaan vakiona 8h
    if (!nimi) {
        return getSarjanId('8h');
    }

    for (const sarja of data.sarjat) {
        if (sarja.nimi === nimi) {
            return sarja.id;
        }
    }

    return null;
}


/**
 * Hakee leimaustavan nimella sen indeksin datasta
 */
 function getLeimausIdx(nimi) {

    for (let i = 0; i < data.leimaustapa.length; i++) {
        const tapa = data.leimaustapa[i];
        if (tapa === nimi){
            return i;
        }
    }

    return null;
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


function getJoukkueByNimi(nimi) {
    for (const joukkue of data.joukkueet) {
        if (joukkue.nimi.toUpperCase() === nimi.toUpperCase()) {
            return joukkue;
        }
    }
    return null;
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