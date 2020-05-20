const loginButton = document.querySelector('.loginbutton')
const username = document.querySelector('.username')
const usernameInput = document.querySelector('.usernameinput')

const kategorija = document.querySelector('.kat')
const pojam = document.querySelector('.po')

const datainput = document.querySelector('#datainput');
const pojaminput = document.querySelector('.pojaminput')
const radioinput = document.querySelectorAll('.radio')

const drop = document.querySelector('.drop')
const menu = document.querySelector('.menu')




// sinhrono ispisivanje inputa

const writePojam = () => {
    pojam.innerHTML = pojaminput.value
}

for (let i = 0; i < radioinput.length; i++) {

    radioinput[i].onclick = check = () => {
        radioinput[i].setAttribute('checked', true);

        if (radioinput[i].checked) {
            kategorija.innerHTML = radioinput[i].value
            pojam.innerHTML = null;
        }
    }
}


// dropdown funkcionalnost liste kategorija

drop.addEventListener('click', () => {

    pojam.innerHTML = null;
    kategorija.innerHTML = null;


    if (desc.classList.contains('none')) {
        desc.classList.remove('none');
    } else {
        desc.classList.add('none');
    }


    if (menu.classList.contains('none')) {
        menu.classList.remove('none');
    } else {
        menu.classList.add('none');
    }

})









// baza 

let collection = db.collection('pojmovi')

class Pojam {

    constructor(ka, p) {
        this.kategorija = ka;
        this.pojam = p;
        this.pojmovi = db.collection('pojmovi')
    }


    // model za upis pojmova u bazu
    async dodajPojam(kategorija, pojam) {

        let date = new Date();
        let name = localStorage.getItem("usernameLS");

        let element = {
            kategorija: kategorija,
            korisnik: name,
            pocetnoslovo: pojam.charAt(0).toUpperCase(),
            pojam: pojam,
            vreme: firebase.firestore.Timestamp.fromDate(date)
        }

        let response = await this.pojmovi.add(element);
        return response;
    }

}


// upis podataka u bazu klikom na button
let pojam01 = new Pojam();
datainput.addEventListener('submit', e => {
    e.preventDefault();
    inputPojam = pojaminput.value;
    inputKategorija = null;
    inputPojam.value = '';

    for (let i = 0; i < radioinput.length; i++) {

        if (radioinput[i].checked) {
            inputKategorija = radioinput[i].value
        }
    }

    pojam01.dodajPojam(inputKategorija, inputPojam)
        .then(() => {
            console.log("pojam uspesno dodat")
            pojam.innerHTML = 'Dodat';
            kategorija.innerHTML = null;
        })
        .catch(() => {
            console.log("pojam nije dodat")
        })


})



// validacija
// zameni font

