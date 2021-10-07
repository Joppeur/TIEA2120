"use strict";
//@ts-check 


window.addEventListener("load", function() {
    // HTMLInspector.inspect();
    numeroi();
    linkit();
    let button = document.getElementById("nappi");
    //button.onclick = varoitus;
    button.onclick = function () {
        varoitus();
    };

    let tark = document.getElementById("tarkista");
    //   tark.addEventListener("click", tarkista_laskut, false);

      let uusi = document.getElementById("uusi");
      uusi.addEventListener("click", luo_laskut, false);

    button.addEventListener("dblclick", vaihdabackground);
    luo_laskut();
    
    let menu = document.getElementById('menu');
    let imgs = menu.getElementsByTagName('img');

    for (const img of imgs) {
        img.addEventListener("click", muuta_nakyvyys);
    }

});


// function tarkista_laskut() {
//     let laskut = getElementById('laskut');


// }



function luo_laskut() {
	var laskut = document.getElementById("laskut");
	laskut.textContent = ""; // poistaa mahdolliset vanhat laskut
	for(var i=0; i<10; i++) {
		var l = luo_lasku(i);
		laskut.appendChild(l);
		
    }
    
}


function luo_lasku(rivinro){
    //https://domtool.yakshavings.co.uk/
    var p1 = document.createElement('p');
    var input1 = document.createElement('input');
    var span1 = document.createElement('span');
    var span2 = document.createElement('span');
    var txt1 = document.createTextNode('');
    var txt2 = document.createTextNode(' + ');
    var txt3 = document.createTextNode('');
    var txt4 = document.createTextNode(' = ');
    span1.setAttribute('id', 'ekaluku_rivi' + rivinro);
    span2.setAttribute('id', 'tokaluku_rivi' + rivinro);
    span1.textContent = getRandomInt(0,99);
    span2.textContent = getRandomInt(0,99);
    input1.setAttribute('id', 'summa_rivi' + rivinro);
    input1.setAttribute('type', 'text');
    input1.setAttribute('size', '3');
    p1.appendChild(span1);
    p1.appendChild(txt2);
    p1.appendChild(span2);
    p1.appendChild(txt4);
    p1.appendChild(input1);
    span1.appendChild(txt1);
    span2.appendChild(txt3);

    return p1;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }



function muuta_nakyvyys(e) {
    let nappi = e.target;

    if(nappi.getAttribute("src") === "minus.jpg") {
        nappi.setAttribute("src", "plus.jpg");
        nappi.setAttribute("alt", "plus");
        // nappi.nextElementSibling.setAttribute('class', 'hidden');
        nappi.nextElementSibling.hidden = true;
    } else if (nappi.getAttribute("src") === "plus.jpg") {
        nappi.setAttribute("src", "minus.jpg");
        nappi.setAttribute("alt", "minus");
        // nappi.nextElementSibling.style.display = '';
        // nappi.nextElementSibling.setAttribute('class', '');
        nappi.nextElementSibling.hidden = false;
        
    }

}

function vaihdabackground(e) {
    const rndCol = 'rgb(' + random(255) + ',' + random(255) + ',' + random(255) + ')';
    document.body.style.backgroundColor = rndCol;
    console.log(document.body.style.backgroundColor);
}

function random(number) {
    return Math.floor(Math.random() * (number+1));
  }

function varoitus(e) {
    console.log("Hello world!");
}

function linkit() {
    let ul = document.getElementById('tama');
    let as = ul.getElementsByTagName('a');   
    


    for (const el of as) {
        let href = (el.getAttribute('href'));
        let textNode = document.createTextNode(' ' + href);
        el.parentElement.appendChild(textNode);
    }
}


let evt = new MouseEvent("click", {
    bubbles: true,
    cancelable: true,
    view: window
});




function numeroi() {
    let puu = document.getElementsByTagName("body")[0];
    let h2 = puu.getElementsByTagName("h2");

    let idx = 1;
    for (const el of h2) {
        el.textContent = idx + ": " + el.textContent;
        idx++;
    }
    
}