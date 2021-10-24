"use strict";  // pidä tämä ensimmäisenä rivinä
//@ts-check 

//console.log(data);


lisaaSarjaRadiot();
inputHandler();
inputHandler();

let nimi = document.querySelector("#nimi");
nimi.addEventListener('blur', function (e) { // Valittaa nimesta kun siirrytaan seuraavaan kenttaan.
    nimi.setCustomValidity(nimiCustomValidity(nimi));
    e.target.reportValidity();
});


let form = document.forms[0];
form.addEventListener('submit', function (e) {
    e.preventDefault();
    nimi.setCustomValidity(nimiCustomValidity(nimi));

    if (form.checkValidity()) {
        // Jos kaikki ok, lisataan joukkue tietokantaan
        let jasenInputs = document.getElementsByClassName('jaseninput');
        let jasenet = [];
        for (const input of jasenInputs) {
            if (input.value !== '') {
                jasenet.push(input.value);
            }
        }

        lisaaJoukkue(
            e.target.nimi.value,
            e.target.querySelector('input[name="sarjaradio"]:checked').labels[0].textContent,
            jasenet
        );

        e.target.reset();
        inputHandler();
    }
});


function lisaaJoukkue(nimi, sarja, jasenet) {

    let leimaustapa = [0];  // Hardcoded
    let rastit = {};        // Hardcoded

    let joukkue = {
        nimi: nimi,
        jasenet: jasenet,
        id: uusiJoukkueId(),
        rastit: rastit,
        leimaustapa: leimaustapa,
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
            span.setAttribute('id', 'sarja');
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
    if (asc) {
        if (a.toUpperCase() < b.toUpperCase()) {
            return -1;
        }
        if (a.toUpperCase() > b.toUpperCase()) {
            return 1;
        }
        return 0;
    } else {
        if (a.toUpperCase() < b.toUpperCase()) {
            return 1;
        }
        if (a.toUpperCase() > b.toUpperCase()) {
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