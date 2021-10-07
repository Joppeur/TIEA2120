// kirjoita tähän tiedostoon javascript-ohjelmakoodisi
"use strict";

// lisää seuraava rivi, jos haluat visual studio coden ajavan TypeScriptin tyyppitarkistuksen
// ohjelmakoodillesi. Koodisi ei tarvitse olla TypeScriptiä.
// Mahdolliset ongelmat näet Visual Studio Coden problems-ikkunassa View|Problems (Ctrl+Shift+M)
// Saatat saada myös jotain turhia virheilmoituksia
//@ts-check

// katso selaimen konsolista, että tulostuuko seuraava testi-teksti
// console.log("Hello world!");

// let kissa = "Mirri";
// let koira = "Musti";

// // console.log(kissa);
// // console.log(koira);

// let elukat = ['Kissa','Koira','Hiiri', 'Koira'];
// const elaimet = new Set(elukat);



// elukat.push('Kettu');
// console.log(elukat);
// elukat.unshift('Rotta');
// console.log(elukat);
// elukat.splice(2, 1);
// console.log(elukat);
// elukat.pop();
// console.log(elukat);
// elukat.shift();
// console.log(elukat);
// elukat.splice(2, 0, 'Koira');
// console.log(elukat);
// console.log(elaimet); 

// let maarat = new Map();
// maarat.set("Kissa", 2);
// maarat.set("Koira", "1");
// maarat.set("Hiiri", 0);
// let maarat2 = new Map([["Kissa", 2],["Koira", "1"],["Hiiri", 0]])
// // console.log(maarat);

// for (let [key, value] of maarat.entries()) {
//     console.log(key + ' = ' + value);
// }

// for (const key of maarat.keys()) {
//     console.log(key);
// }

// console.log(maarat.get("Kissa"));

// for(let i=0; i<elukat.length; i++) {
//     let elukka = elukat[i];
//     console.log( elukka + " : " + maarat.get( elukka ) );
// }

// elukat.push("Hevonen");
// maarat.set("Hevonen", "2k");

// for(let i=0; i<elukat.length; i++) {
//     let elukka = elukat[i];
//     console.log( elukka + " : " + maarat.get( elukka ) );
// }

function isNumeric(value) {
    return /^-{0,1}\d+$/.test(value);
}

// let summa = 0;
// for (let [key,value] of maarat.entries()) {
//     if (isNumeric(value)) {
//         summa += parseInt(value);
//     }
//     console.log(key + ' : ' + value);
//     console.log(summa);
// }

function summaa(elaimet, maarat) {
    let summa = 0;
    for (const elukka of elaimet) {
        let maara = maarat.get(elukka);
        if (parseInt(maara)) {
            summa += parseInt(maara);
        }
    }
    return summa;
}
// console.log('Haloo');
// console.log(summaa(elaimet, maarat));

// let elukka = new Object();
// elukka.tyyppi = 'Kissa';
// elukka.nimi = 'Mirri';
// elukka.paino = 4;

// console.log(elukka['tyyppi']);
// console.log(elukka['nimi']);
// elukka['paino'] = 5;

// let elukka2 = {
//     tyyppi: 'Koira',
//     nimi: 'Musti',
//     paino: 10
// };

// for (let [key,value] in elukka) {
//     console.log(key + " : " + value);
// }

// for (let property in elukka) {
//     console.log(`${property}: ${elukka[property]}`);
// }


let elaintarha = {
    "tyypit": [
        "Kissa",
        "Koira",
        "Hiiri"
    ],
    "elaimet": [
        {
            "tyyppi": "Kissa",
            "nimi": "Mirri",
            "paino": 5
        },
        {
            "tyyppi": "Koira",
            "nimi": "Musti",
            "paino": 10
        },
        {
            "tyyppi": "Koira",
            "nimi": "Murre",
            "paino": 10
        }
    ]
};


function tyypit(e) {
    // riittää kun otetaan tyypit-taulukko käsittelyyn
    let tyypit = e.tyypit;
    for(let tyyppi of tyypit) {
            console.log(tyyppi);
    }
}

function elaimet(e) {
    let elaimet = e.elaimet;
    for (const elain of elaimet) {
        console.log(elain["nimi"]);
    }
}

function maarat(t, e) {
    
    for (const elain of elaimet) {
        console.log(elain["nimi"]);
    }
}

// tyypit(elaintarha);
// elaimet(elaintarha);

// let testi = {
//     "elaimet": [
//         {
//             "tyyppi": "Kissa",
//             "nimi": "Mirri",
//             "paino": 5
//         },
//         {
//             "tyyppi": "Koira",
//             "nimi": "Musti",
//             "paino": 10
//         },
//         {
//             "tyyppi": "Koira",
//             "nimi": "Murre",
//             "paino": 10
//         }
//     ]
// };

// let summa = 0;
// for (const tyyppi of elaintarha.tyypit) {
//     for (const elain of testi.elaimet) {
//         if(elain["tyyppi"] == tyyppi) {
//             summa += 1;
//         }
//     }
//     console.log(tyyppi + " : " + summa);
//     summa = 0;
// }

// let summa = 0;
// for (const tyyppi of elaintarha.tyypit) {
//     for (const elain of elaintarha.elaimet) {
//         if(elain["tyyppi"] == tyyppi) {
//             summa += 1;
//         }
//     }
//     console.log(tyyppi + " : " + summa);
//     summa = 0;
// }

let opis = [
    "Testi",
   {
     "nimi": "Maija Meikäläinen",
     "Syntymäaika": 1999,
     "Pääaine": "TIE",
     "Kurssit": ["TIEA2120","ITKP101", "ITKP1011" ]
   },
   {
     "nimi": "Matti Meikäläinen",
     "Syntymäaika": 1999,
     "Pääaine": "TIE"
   },
   {
     "nimi": "Kalle Kehveli",
     "Syntymäaika": 1998,
     "Pääaine": "TIE"
   },
   {
     "nimi": "Kaija Kehveli",
     "Syntymäaika": 1998,
     "Pääaine": "TJT"
   },
   {
     "nimi": "Ville Virtanen",
     "Syntymäaika": 1995,
     "Pääaine": "MAT"
   }
 ];

 let nimet = opis.map(function (currentValue, index, array) {
     return currentValue["nimi"]; 
 });
//  console.log(nimet);

 let nimet2 = opis.every(function (currentValue){
     if (currentValue.nimi) return true;
     return false;
 });
// console.log(nimet2);

let tulos = opis.every(function (currentValue) {
    if(currentValue.nimi) return true;
    return false;
});
// console.log(tulos);


// console.log(summa);

// console.log(opis);

function compare_opis(a, b) {
    // undefined pitää myös huomioida. Testillä ei ole nimeä
    // halutaanko undefined viimeiseksi vai ensimmäiseksi? seuraavalla lisäyksellä tulee viimeiseksi
    if (!a.nimi) {
            return 1;
    }
    
    // yleensä riittää vain seuraava
    if (a.nimi < b.nimi) {
    // myös tämä käy:        if (a["nimi"] < b["nimi"]) {
                return -1;
        }
        if (a.nimi > b.nimi) {
            return 1;
        }
        // a must be equal to b
        return 0;
      }

opis.sort(compare_opis);
// console.log(opis);

// vanhin ensimmäiseksi eli pienin syntymävuosi
function compare_opis_ika(a, b) {

    // yleensä riittää vain seuraava
    if (a["Syntymäaika"] < b["Syntymäaika"]) {
        return -1;
    }
    if (a["Syntymäaika"] > b["Syntymäaika"]) {
        return 1;
    }

    // samanikäiset järjestetään toissijaisesti nimen mukaan
    if (a.nimi < b.nimi) {
        return -1;
    }
    if (a.nimi > b.nimi) {
        return 1;
    }
    // a must be equal to b
    return 0;
}

opis.sort(compare_opis_ika);
// console.log(opis);

var henkilot = {
	1 : "Tommi Lahtonen", 
	2 : "Kalle Kehveli", 
	3 : "Maija Virtanen",
	4 : "Matti Virtanen",
	5 : "Ville Kehveli",
	6 : "Kalle Kehveli",
	7 : null
};

// console.dir(henkilot);

// sama kuin edellä mutta avaimina muuta kuin kokonaislukuja
var henkilot2 = {
	"tunniste1" : "Lammi Tohtonen", 
	"tunniste2" : "Nalle Kehveli", 
	"tunniste3" : "Miia Virtanen",
	"tunniste4" : "Ville Virtanen",
	"tunniste5" : "Kalle Kehveli",
	"tunniste6" : "Lammi Tohtonen"
};

// console.dir(henkilot2);

// Object, jonka avainten arvoina taulukoita

var jutut1 = {
	1 : ["Nalle", "Lego", "Pipo"], 
	2 : ["Lusikka","Veitsi","Haarukka", "Spork"], 
	3 : [33, 44, 55, 66, 77, 88],
	4 : [1,2,3,"Lusikka","Nalle","Pipo", 100],
	5 : [],
	6 : ["Just one"]
}

// console.dir(jutut1);

// taulukko jonka alkioina on objecteja
var jutut2 = [
	{1:"foo", 2:"bar", 3:"foobar"},
	{10:"foo", 11:"bar", 13:"foobar"},
	{"1":"foo", "2":"bar", "3":"foobar"},
	{10:1, 11:2, 13:3},
]
// console.dir(jutut2);

// var kaikki = [
// 	henkilot, henkilot2, jutut1, jutut2
// ]

// console.dir(kaikki);

// for (let henkilo in henkilot){
//     console.log(henkilo + " : " + henkilot[henkilo]);
// }

// for (let id in henkilot) {
//     console.log( "Henkilot2: " + id + " : " + henkilot2["tunniste" + id] );
// }

var tiedot = {};

for (var i in henkilot) {
    let henkilo = {};
	henkilo["Nimi"] = henkilot[i]
	henkilo["Osoite"] = "Unknown"
	henkilo["Postinumero"] = "00000" 
	henkilo["Puhelin"] = "+358000000"
	henkilo["Data"] = [1,2,3,4,5,6,7,8,9,10] // whatever dataa listana
    tiedot[i] = henkilo;

}

console.dir(tiedot);

let tiedot2 = {};
for (let i in henkilot) {
    tiedot2[i] = {
        "Nimi" : henkilot[i],
        "Osoite": "Unknown",
		"Postinumero": "00000",
		"Puhelin": "+358000000",
		"Data" : [1,2,3,4,5,6,7,8,9,10]
    }
}

console.dir(tiedot2);

console.log( JSON.stringify(tiedot2));