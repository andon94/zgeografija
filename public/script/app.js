const kategorija = document.querySelector('.kat')
const pojam = document.querySelector('.po')

const datainput = document.querySelector('#datainput');
const pojaminput = document.querySelector('.pojaminput')
const radioinput = document.querySelectorAll('.radio')

const drop = document.querySelector('.drop')
const menu = document.querySelector('.menu')
const up = document.querySelector('#up')

const imgtext = document.querySelector('.imgtext')
const lista = document.querySelector('.lista')

const usrnm = document.querySelector('.usrnm')
const mobilnaKategorija = document.querySelector('.mobilna-kategorija')
const error = document.querySelector('.error')

// priveremeni selektori dok ne dodjem do boljeg resenja
const one = document.querySelector('#one')
const two = document.querySelector('#two')
const three = document.querySelector('#three')
const four = document.querySelector('#four')
const five = document.querySelector('#five')



let name = localStorage.getItem("usernameLS");
usrnm.innerHTML = `Vase korisnicko ime je: ${name}`



// sinhrono ispisivanje inputa

const writePojam = () => {
    pojam.innerHTML = pojaminput.value
}

let cleanError = () => {
    error.innerHTML = '';
}

for (let i = 0; i < radioinput.length; i++) {

    radioinput[i].onclick = check = () => {
        radioinput[i].setAttribute('checked', true);

        if (radioinput[i].checked) {
            kategorija.innerHTML = radioinput[i].value
            mobilnaKategorija.innerHTML = `Odabrana kategorija: ${radioinput[i].value}`

            pojam.innerHTML = null;
        }
    }
}



// dropdown funkcionalnost liste kategorija

let show = () => {
    desc.classList.toggle('none')
    menu.classList.toggle('none');
    up.classList.toggle('none')
}

drop.addEventListener('click', () => {

    pojam.innerHTML = null;
    // kategorija.innerHTML = null;
    show()
})

desc.addEventListener('click', () => {
    show()
})



// baza 
let collection = db.collection('pojmovi');

// top lista
collection
    .get()
    .then(function (querySnapshot) {
        let niz = []
        querySnapshot.forEach(function (doc) {
            niz.push(doc.data().korisnik)
        });

        let sort = {};
        niz.forEach(function (x) { sort[x] = (sort[x] || 0) + 1; });
        console.log(sort)

        // privremeno resenje

        let first = Object.keys(sort)[0];
        let second = Object.keys(sort)[1];
        let third = Object.keys(sort)[2];
        let forth = Object.keys(sort)[3];
        let fifth = Object.keys(sort)[4];

        let name1 = sort[first]
        let name2 = sort[second]
        let name3 = sort[third]
        let name4 = sort[forth]
        let name5 = sort[fifth]

        one.innerHTML = `${name1} ${first}`
        two.innerHTML = `${name2} ${second}`
        three.innerHTML = `${name3} ${third}`
        four.innerHTML = `${name4} ${forth}`
        five.innerHTML = `${name5} ${fifth}`

    })
    .catch(function (error) {
        console.log(error);
    });



class Pojam {

    constructor(ka, p) {
        this.kategorija = ka;
        this.pojam = p;
        this.pojmovi = db.collection('pojmovi')
    }

    async dodajPojam(kategorija, pojam) {

        // pocetno slovo
        let ps = pojam.charAt(0).toUpperCase();
        if (pojam.slice(0, 2) === 'Nj' || pojam.slice(0, 2) === 'Lj' || pojam.slice(0, 2) === 'Dž') {
            ps = pojam.slice(0, 2);
        }
        else {
            ps = pojam.slice(0, 1);
        }

        let date = new Date();

        let element = {
            kategorija: kategorija,
            korisnik: name,
            pocetnoslovo: ps,
            pojam: pojam,
            vreme: firebase.firestore.Timestamp.fromDate(date)
        }

        let response = await this.pojmovi.add(element);
        return response;
    }

    // formatiranje pojma 
    formatPojam(pojam) {
        let inputPojam = pojam
        let formatPojam = inputPojam.split(" ").join("").toLowerCase();
        let formatedPojam = formatPojam.charAt(0).toUpperCase() + formatPojam.slice(1)
        return formatedPojam
    }
}



// upis podataka u bazu klikom na button
let pojam01 = new Pojam();
// submit forme
datainput.addEventListener('submit', e => {
    e.preventDefault();

    // formatirani pojam
    let fp = pojam01.formatPojam(pojaminput.value)
    console.log(fp)

    // odabrana kategorija
    let inputKategorija = null;
    for (let i = 0; i < radioinput.length; i++) {
        if (radioinput[i].checked) {
            inputKategorija = radioinput[i].value
        }
    }

    // ukoliko username nije prazan nastavi
    if (name != null) {

        let regex = /^[a-zA-Z]*$/
        // ukoliko pojam odgovara regexu, kategorija nije prazna i pojam nije prazan, nastavi
        if (fp.match(regex) && inputKategorija != null && fp != '') {

            // proveri da li postoje duplikati
            pojam01.pojmovi
                .where('kategorija', '==', inputKategorija)
                .where('pojam', '==', fp)
                .get()
                .then(snapshot => {
                    // ako nema takvog dokumenta, dodaj ga u bazu
                    if (snapshot.docs.length == 0) {
                        pojam01.dodajPojam(inputKategorija, fp)
                            .then(() => {
                                console.log("Pojam uspesno dodat")
                                pojam.innerHTML = fp;
                                pojaminput.setAttribute('placeholder', 'Dodato')
                                pojaminput.value = ''
                            })
                            .catch(() => {
                                console.log("pojam nije dodat")
                                error.innerHTML = 'Pojam Nije Dodat'
                                pojam.innerHTML = null;
                                kategorija.innerHTML = null;
                            })
                    } else {
                        console.log('Pojam je duplikat i nije dodat u bazu')
                        error.innerHTML = 'Pojam je vec unet.'
                        pojaminput.setAttribute('placeholder', 'Ovde unesi Pojam')
                        pojaminput.value = ''
                    }
                })

        } else {
            error.innerHTML = 'Izaberite jednu od kategorija i unesite odgovarajuci pojam. <br>Koristite iskljucivo tekstualne karaktere.'
            pojam.innerHTML = null;
            pojaminput.setAttribute('placeholder', 'Ovde unesi Pojam')
            pojaminput.value = ''
        }

    } else {
        error.innerHTML = 'Unesite Korisnicko Ime, pa nastavite sa unosom podataka.'
        pojam.innerHTML = null;
        kategorija.innerHTML = null;
    }
})






