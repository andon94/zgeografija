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

const error = document.querySelector('.error')

const up = document.querySelector('#up')




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

    if (up.classList.contains('none')) {
        up.classList.remove('none')
    } else {
        up.classList.add('none')
    }

})

desc.addEventListener('click', () => {
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
    up.classList.add('none')

})









// baza 

let collection = db.collection('pojmovi')
let name = localStorage.getItem("usernameLS");

class Pojam {

    constructor(ka, p) {
        this.kategorija = ka;
        this.pojam = p;
        this.pojmovi = db.collection('pojmovi')
    }


    // model za upis pojmova u bazu
    async dodajPojam(kategorija, pojam) {

        let date = new Date();
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



// let stringFormat = (string) => {
//     // string = "sddDsdfas D dd d d dd ";
//     newString = string.split(" ").join("").toLowerCase();
//     lastString = newString.charAt(0).toUpperCase() + newString.slice(1)
//     console.log(lastString)

// }


// upis podataka u bazu klikom na button
let pojam01 = new Pojam();
datainput.addEventListener('submit', e => {
    e.preventDefault();
    // formatiranje stringa
    inputPojam = pojaminput.value;
    formatPojam = inputPojam.split(" ").join("").toLowerCase();
    formatedPojam = formatPojam.charAt(0).toUpperCase() + formatPojam.slice(1)
    console.log(formatedPojam)

    inputKategorija = null;

    for (let i = 0; i < radioinput.length; i++) {
        if (radioinput[i].checked) {
            inputKategorija = radioinput[i].value
        }
    }

    // ukoliko username nije prazan nastavi
    if (name != null) {

        let regex = /^[a-zA-Z]*$/
        // ukoliko pojam odgovara regexu nastavi
        if (formatedPojam.match(regex) && inputKategorija != null && formatedPojam != '') {

            pojam01.dodajPojam(inputKategorija, formatedPojam)
                .then(() => {
                    console.log("pojam uspesno dodat")
                    pojam.innerHTML = 'Dodat';
                    // kategorija.innerHTML = null;
                })
                .catch(() => {
                    console.log("pojam nije dodat")
                    error.innerHTML = 'Pojam Nije Dodat'
                    pojam.innerHTML = null;
                    kategorija.innerHTML = null;
                })

        } else {
            error.innerHTML = 'Izaberite jednu od kategorija i unesite odgovarajuci pojam. <br>Koristite iskljucivo tekstualne karaktere.'
            pojam.innerHTML = null;
            kategorija.innerHTML = null;
        }

    } else {
        error.innerHTML = 'Unesite Korisnicko Ime, pa nastavite sa unosom podataka.'
        pojam.innerHTML = null;
        kategorija.innerHTML = null;
    }
})


let cleanError = () => {
    error.innerHTML = '';
}
