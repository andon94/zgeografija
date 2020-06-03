
let ipk = document.querySelector('.ipk')
let ipkForm = document.querySelector('.ipk-form')

let chatBox = document.querySelector('.chat-events')
let chatForm = document.querySelector('.chat-form')
let chatInput = document.querySelector('#chat')

let inputKategorija = document.querySelector('.kat-input')
let inputs = document.querySelectorAll('.input')

let start = document.querySelector('.button')
let button = document.querySelector('button')

let rezultat = document.querySelector('.rezultat')

let collection = db.collection('pojmovi');
let name = localStorage.getItem("usernameLS");

const parent = document.querySelector('#events')


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

    wait = document.createElement('div')
    wait.classList.add('wait')
    wait.innerHTML = 'Sačekajte protivnika';
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

        collection
            .where('pojam', '==', usrPojam)
            .where('kategorija', '==', usrKategorija)
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
            clearInterval(interval)
        }
    }, 500)

}

// pise chat poruke i inpute iz forme u centralno polje
// prima samo vrednost poruke
const writeEvent = (text) => {
    const el = document.createElement('li')
    el.innerHTML = text;
    parent.appendChild(el)
};

const writeRezultat = (text) => {
    const el = document.createElement('div')
    el.classList.add('rez-kraj')
    el.innerHTML = text;
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

// salje na server poruku iz chatInput-a pa resetuje input
const onFormSubmited = (e) => {
    e.preventDefault()
    const text = chatInput.value
    chatInput.value = ''
    sock.emit('message', text)
}


// konektuje se na server
// salje poruku serveru

const sock = io();

sock.on('message', writeEvent)
sock.on('form', writeInput)
sock.on('self', writeSelf)
sock.on('rezultat', writeRezultat)


// event listneri za forme
// dva ideneticna slucaja
chatForm.addEventListener('submit', onFormSubmited)
ipkForm.addEventListener('submit', usrInputsSubmited)










