let nav = document.querySelector('.nav')
let kompKviz = document.querySelector('#komp-kviz')
let prijateljKviz = document.querySelector('#prijatelj-kviz')

let ipk = document.querySelector('.ipk')
let ipkForm = document.querySelector('.ipk-form')

let inputKategorija = document.querySelector('.kat-input')
let inputs = document.querySelectorAll('input')

let caption = document.querySelector('.caption')
let slovoSat = document.querySelector('.ps-sat')
let slovo = document.querySelector('#slovo')
let sat = document.querySelector('.sat-sek')
let start = document.querySelector('.button')
let button = document.querySelector('button')

let drzavaInput = document.querySelector('#drzava')
let ni = document.querySelector('#ni')





let collection = db.collection('pojmovi');










let countdown = () => {
    let timeleft = 1;
    let timer = setInterval(() => {
        let counter = 90 - timeleft;
        timeleft += 1;
        sat.innerHTML = counter

        if (counter == 0) {
            clearInterval(timer);
            sat.innerHTML = '0'
            ipkForm.submit()
        }
    }, 1000);

    button.addEventListener('click', () => {
        clearInterval(timer)
        sat.innerHTML = ''
    })
}



let formatPojam = pojam => {
    let inputPojam = pojam
    let formatPojam = inputPojam.split(" ").join("").toLowerCase();
    let formatedPojam = formatPojam.charAt(0).toUpperCase() + formatPojam.slice(1)
    return formatedPojam
}

let randomIndex = (x) => {
    return Math.floor(Math.random() * x.length);
}

let randomBotIndex = (x) => {
    let procenat = x.length * (20 / 100)
    return Math.floor(Math.random() * (x.length + procenat));
}



let slova = ['A', 'B', 'S'];
let pS = slova[randomIndex(slova)]
let kategorije = ['Država', 'Grad', 'Reka', 'Planina', 'Životinja', 'Biljka', 'Predmet']

let nizBotOdgovora = []
let glavniNiz = []

let kviz = (kategorija) => {
    collection
        .where('pocetnoslovo', '==', pS)
        .where('kategorija', '==', kategorija)
        .get()
        .then(snapshot => {

            let nizPojmova = []
            snapshot.docs.forEach(doc => {
                nizPojmova.push(`${doc.data().pojam} ${kategorija}`)
                glavniNiz.push(`${doc.data().pojam} ${kategorija}`)
            })

            let botovPojam = nizPojmova[randomBotIndex(nizPojmova)]
            nizBotOdgovora.push(botovPojam)
        })
}

kategorije.forEach(kategorija => {
    kviz(kategorija)
})

console.log(nizBotOdgovora)
console.log(glavniNiz)
let ur = 0
let br = 0

// ceka da se nizovi popune podacima sa servera
let interval = setInterval(() => {
    if (nizBotOdgovora.length != 7) {
        console.log('Wait')
    } else if (nizBotOdgovora.length == 7) {
        console.log('Ready')
        clearInterval(interval)

        let usrOdgovori = []
        ipkForm.addEventListener('submit', e => {
            e.preventDefault()

            inputs.forEach(input => {
                usrOdgovori.push(formatPojam(input.value))
            })

            usrOdgovori = usrOdgovori.map((e, i) => `${e} ${kategorije[i]}`)

            let usrRezultat = 0;
            let botRezultat = 0;
            slovoSat.innerHTML = 'komp rezultat<br>'
            inputKategorija.innerHTML = 'korisnik rezultat<br>'

            nizBotOdgovora.forEach((botOdgovor, i) => {
                let usrOdgovor = usrOdgovori[i]

                if (glavniNiz.includes(usrOdgovor) && usrOdgovor == botOdgovor) {
                    usrRezultat = usrRezultat + 5;
                    botRezultat = botRezultat + 5;
                    slovoSat.innerHTML += `+5 ${botOdgovor}<br>`
                    inputKategorija.innerHTML += `+5 ${usrOdgovor}<br>`

                    console.log(1)
                } else if (glavniNiz.includes(usrOdgovor) && usrOdgovor != botOdgovor && glavniNiz.includes(botOdgovor)) {
                    usrRezultat = usrRezultat + 10;
                    botRezultat = botRezultat + 10;
                    slovoSat.innerHTML += `+10 ${botOdgovor}<br>`
                    inputKategorija.innerHTML += `+10 ${usrOdgovor}<br>`
                    console.log(2)
                } else if (glavniNiz.includes(usrOdgovor) && glavniNiz.includes(botOdgovor) == false) {
                    usrRezultat = usrRezultat + 15;
                    slovoSat.innerHTML += `+nista<br>`
                    inputKategorija.innerHTML += `+15 ${usrOdgovor}<br>`

                    console.log(3)
                } else if (glavniNiz.includes(usrOdgovor) == false && glavniNiz.includes(botOdgovor)) {
                    botRezultat = botRezultat + 15;
                    slovoSat.innerHTML += `+15 ${botOdgovor}<br>`
                    inputKategorija.innerHTML += `+nista<br>`

                    console.log(4)
                } else if (glavniNiz.includes(usrOdgovor) == false && glavniNiz.includes(botOdgovor) == false) {
                    console.log('nista')
                    slovoSat.innerHTML += `+nista<br>`
                    inputKategorija.innerHTML += `+nista<br>`
                }
            })
            // console.log(usrRezultat)
            // console.log(botRezultat)
            caption.innerHTML = `Rezultat je:<br>Korisnik:${usrRezultat}<br>Kompjuter:${botRezultat}`
            button.classList.add('none')
            start.classList.add('none')


        })
    }
}, 420)




start.addEventListener('click', () => {
    sat.innerHTML = '90';
    countdown()
    start.classList.toggle('none')
    button.classList.toggle('none')
    slovo.innerHTML = pS;
    caption.innerHTML = null
})

button.addEventListener('click', () => {
    ni.classList.toggle('none')
    button.classList.toggle('none')
    slovoSat.innerHTML = ''
})

ni.addEventListener('click', () => {
    window.location.reload();
})






