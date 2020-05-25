let nav = document.querySelector('.nav')
let kompKviz = document.querySelector('#komp-kviz')
let prijateljKviz = document.querySelector('#prijatelj-kviz')

let ipk = document.querySelector('.ipk')
let ipkForm = document.querySelector('.ipk-form')

let inputs = document.querySelectorAll('input')

let caption = document.querySelector('.caption')
let slovo = document.querySelector('#slovo')
let sat = document.querySelector('.sat-sek')
let start = document.querySelector('.button')
let button = document.querySelector('button')

let drzavaInput = document.querySelector('#drzava')





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







let slova = ['A', 'B', 'S'];
let pS = slova[randomIndex(slova)]
let kategorije = ['Država', 'Grad', 'Reka', 'Planina', 'Životinja', 'Biljka', 'Predmet']

let nizOdgovora = []
let nizBotOdgovora = []

let kviz = (kategorija) => {
    collection
        .where('pocetnoslovo', '==', pS)
        .where('kategorija', '==', kategorija)
        .get()
        .then(snapshot => {

            let nizPojmova = []
            snapshot.docs.forEach(doc => {
                nizPojmova.push(`${doc.data().pojam} ${kategorija}`)
            })

            let randomPojam = nizPojmova[randomIndex(nizPojmova)]
            nizOdgovora.push(randomPojam)

            let botovPojam = nizPojmova[randomIndex(nizPojmova)]
            nizBotOdgovora.push(botovPojam)
        })
}

kategorije.forEach(kategorija => {
    kviz(kategorija)
})

console.log(nizOdgovora)
console.log(nizBotOdgovora)
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
            console.log(usrOdgovori)

            nizOdgovora.forEach((odgovor, i) => {
                let usrOdgovor = usrOdgovori[i]
                if (odgovor == usrOdgovor) {
                    console.log('bravo brate 15')
                } else {
                    console.log("ne valja 0")
                }
            })

            nizOdgovora.forEach((odgovor, i) => {
                let botOdgovor = nizBotOdgovora[i]
                if (odgovor == nizBotOdgovora[i]) {
                    console.log('bravo kompe 15')
                } else {
                    console.log("ne valja kompe 0")
                }
            })
        })
    }
}, 420)







start.addEventListener('click', () => {
    countdown()
    start.classList.toggle('none')
    button.classList.toggle('none')
    slovo.innerHTML = pS;
    caption.innerHTML = null
})






