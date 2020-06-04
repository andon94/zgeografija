
let ipk = document.querySelector('.ipk')
let ipkForm = document.querySelector('.ipk-form')

let chatBox = document.querySelector('.chat-events')
let chatForm = document.querySelector('.chat-form')
let chatInput = document.querySelector('#chat')

let inputKategorija = document.querySelector('.kat-input')
let inputs = document.querySelectorAll('.input')

let start = document.querySelector('.button')
let button = document.querySelector('.button')

let rezultat = document.querySelector('.rezultat')

let collection = db.collection('pojmovi');
let colRez = db.collection('rezultati')
let name = localStorage.getItem("usernameLS");

const parent = document.querySelector('#events')

const psSat = document.querySelector('.ps-sat')
const satSek = document.querySelector('.sat-sek')

let slovo = document.querySelector('#slovo')

let info = document.querySelector('.info')

let usr = document.querySelector('.usr')
let ni = document.querySelector('#ni')

let lista = document.querySelector('.lista')





colRez
    .orderBy('broj_poena', 'desc')
    .limit(3)
    .get()
    .then(snapshot => {
        console.log(snapshot.docs.length)
        // ako nema takvog dokumenta, dodaj ga u bazu
        snapshot.forEach(doc => {
            console.log(doc.data().username)
            lista.innerHTML += `<div class="list-el">${doc.data().username} ${doc.data().broj_poena}</div>`
        })
    })






class Usr {

    constructor(usr) {
        this._username = usr;
        // this._broj_poena = brP
        this.rezultati = db.collection('rezultati')
    }

    async dodajPojam(usr, brP) {


        let date = new Date();
        let brIgara = 0
        brIgara++
        let brPoena = 0
        brPoena = brPoena + brP

        let element = {
            username: usr,
            broj_igara: brIgara,
            broj_poena: brPoena,
            datum: firebase.firestore.Timestamp.fromDate(date)
        }

        let response = await this.rezultati.add(element);
        return response;
    }

}


button.disabled = true
slovo.style.display = 'none'
usr.innerHTML = `Korisničko ime: <span id="usrn">${name}</span>`

let usrName = document.querySelector('#usrn')
usrName.style.color = 'teal'

usr.style.marginTop = '1rem'
usr.style.fontWeight = 'bold'
usr.style.letterSpacing = '1px'

ni.addEventListener('click', () => {
    window.location.reload();
})



let formatPojam = pojam => {
    let inputPojam = pojam
    let formatPojam = inputPojam.split(" ").join("").toLowerCase();
    let formatedPojam = formatPojam.charAt(0).toUpperCase() + formatPojam.slice(1)
    return formatedPojam
}

let drugaRec = string => {
    let n = string.indexOf(' ');
    let res = string.substring(n + 1);
    return res
}

let prvaRec = string => {
    let n = string.indexOf(' ');
    return n === -1 ? string : string.substr(0, n)
}


let wait = null

const usrInputsSubmited = (e) => {
    e.preventDefault()
    let ukupno = []
    ipkForm.innerHTML = ''
    // info.innerHTML = ''

    wait = document.createElement('div')
    wait.classList.add('wait')
    info.innerHTML = 'Sačekaj protivnika';
    ipkForm.appendChild(wait)



    inputs.forEach(input => {
        ukupno.push(input.value)

        if (input.value == '') {
            input.value = 'nema pojma'
            input.style.textTransform = 'lowercase'
            input.style.color = 'red'
        }
    })

    let kategorije = ['Država', 'Grad', 'Reka', 'Planina', 'Životinja', 'Biljka', 'Predmet']

    let formatiraniInputi = []
    ukupno.forEach(input => {
        formatiraniInputi.push(formatPojam(input))
    })

    let puniInputi = formatiraniInputi.map((e, i) => `${e} ${kategorije[i]}`)

    let tacno = []
    let upit = input => {
        let usrPojam = prvaRec(input)
        let usrKategorija = drugaRec(input)
        let pocetnoSlovo = slovo.innerHTML

        collection
            .where('pojam', '==', usrPojam)
            .where('kategorija', '==', usrKategorija)
            .where('pocetnoSlovo', '==', pocetnoSlovo)
            .get()
            .then(snapshot => {
                if (snapshot.size == 1) {
                    tacno.push(usrPojam)
                } else {
                    tacno.push('')
                }
            })
    }

    puniInputi.forEach(input => {
        upit(input)
    })

    // console.log(tacno)
    let interval = setInterval(() => {
        if (tacno != 0) {
            sock.emit('turn', tacno)
            sock.emit('username', name)

            clearInterval(interval)
            ni.classList.remove('none')





        }
    }, 500)

}



const writeCountdown = () => {

    button.disabled = false
    slovo.style.display = 'block'


    let timeleft = 1;
    let timer = setInterval(() => {
        let counter = 45 - timeleft;
        timeleft += 1;
        satSek.innerHTML = counter
        // ukoliko dodje do nule klikni na dugme vezano za formu
        if (counter == 0) {
            clearInterval(timer);
            psSat.style.display = 'none'
            button.click()
        }
    }, 1000);

    button.addEventListener('click', () => {
        // setTimeout(() => {
        clearInterval(timer)
        psSat.style.display = 'none'

        // }, 600)
    })


}

let gameStartsIn = () => {
    let timeleft = 1;
    let timer = setInterval(() => {
        let counter = 4 - timeleft;
        timeleft += 1;
        info.innerHTML = `Igra počinje za ${counter} sekunde`
        // ukoliko dodje do nule klikni na dugme vezano za formu
        if (counter == 0) {
            clearInterval(timer);
            info.innerHTML = ''
        }
    }, 1000);
}

// countdown(false)
// pise chat poruke i inpute iz forme u centralno polje
// prima samo vrednost poruke

const writeEvent = (text) => {
    const el = document.createElement('li')
    el.innerHTML = text

    parent.appendChild(el)

    parent.scrollTop = parent.scrollHeight

};

const writeInfo = text => {
    info.innerHTML = text;
}

const writeSlovo = text => {
    slovo.innerHTML = text;
}

const writeRezultat = (text) => {
    const el = document.createElement('div')
    el.classList.add('rez-kraj')
    el.innerHTML = `${text}`;
    chatBox.appendChild(el)
};

const writeInput = (text) => {
    const el = document.createElement('div')
    el.classList.add('protivnik')
    el.innerHTML = text;
    rezultat.appendChild(el)

    if (el.innerHTML == 'nema pojma') {
        el.style.textTransform = 'lowercase'
        el.style.color = 'red'
    }
};

const writeSelf = text => {
    wait.style.display = 'none'
    const el = document.createElement('div')
    el.classList.add('self')
    el.innerHTML += text;
    ipkForm.appendChild(el)

    if (el.innerHTML == 'nema pojma') {
        el.style.textTransform = 'lowercase'
        el.style.color = 'red'
    }
}

const writeHelp = text => {
    const el = document.createElement('div')
    el.classList.add('helper')
    el.style.visibility = 'hidden'
    el.innerHTML += text;
    ipkForm.appendChild(el)


    let player0 = new Usr(name)

    player0.rezultati
        .where('username', '==', name)
        .get()
        .then(snapshot => {
            console.log(snapshot.docs.length)
            // ako nema takvog dokumenta, dodaj ga u bazu
            if (snapshot.docs.length == 0) {
                let brPn = text
                let brPr = 1

                player0.dodajPojam(name, brPn, brPr)
                    .then(() => {
                        console.log("Pojam uspešno dodat")
                    })
                    .catch(() => {
                        console.log("pojam nije dodat")
                    })
            } else {
                let date = new Date()

                snapshot.forEach(doc => {
                    // if (text == 0) {
                    //     db.collection("rezultati").doc(doc.id).update({ broj_igara: firebase.firestore.FieldValue.increment(1), datum: firebase.firestore.Timestamp.fromDate(date) });
                    //     console.log("Pojam apdejtovan")
                    // } else {
                    let br = parseInt(text)
                    db.collection("rezultati").doc(doc.id).update({ broj_poena: firebase.firestore.FieldValue.increment(br), broj_igara: firebase.firestore.FieldValue.increment(1), datum: firebase.firestore.Timestamp.fromDate(date) });
                    console.log("Pojam apdejtovan")
                    // }

                });
            }
        })
}

// salje na server poruku iz chatInput-a pa resetuje input
const onFormSubmited = (e) => {
    e.preventDefault()
    const text = `${name}: ${chatInput.value}`
    chatInput.value = ''
    sock.emit('message', text)
}


// konektuje se na server
// salje poruku serveru

const sock = io();



sock.on('gms', gameStartsIn)
sock.on('slovo', writeSlovo)
sock.on('info', writeInfo)
sock.on('countdown', writeCountdown)
sock.on('message', writeEvent)
sock.on('form', writeInput)
sock.on('self', writeSelf)
sock.on('help', writeHelp)
sock.on('rezultat', writeRezultat)
// sock.on('help', writeHelp)

// event listneri za forme
// dva ideneticna slucaja
chatForm.addEventListener('submit', onFormSubmited)

ipkForm.addEventListener('submit', usrInputsSubmited)









// player0.dodajPojam(name, 20)





