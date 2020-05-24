let nav = document.querySelector('.nav')
let kompKviz = document.querySelector('#komp-kviz')
let prijateljKviz = document.querySelector('#prijatelj-kviz')


let ipk = document.querySelector('.ipk')
let ipkForm = document.querySelector('.ipk-form')

let slovo = document.querySelector('#slovo')
let sat = document.querySelector('.sat-sek')
let start = document.querySelector('.button')
let button = document.querySelector('button')

let drzavaInput = document.querySelector('#drzava')



kompKviz.addEventListener('click', () => {
    nav.classList.toggle('none')
    ipk.classList.toggle('none')
})









let countdown = () => {
    let timeleft = 1;
    let timer = setInterval(() => {
        let counter = 90 - timeleft;
        timeleft += 1;
        sat.innerHTML = counter

        if (counter == 0) {
            clearInterval(timer);
            sat.innerHTML = '0'
            // ipkForm.submit()
        }
    }, 1000);
}



let formatPojam = pojam => {
    let inputPojam = pojam
    let formatPojam = inputPojam.split(" ").join("").toLowerCase();
    let formatedPojam = formatPojam.charAt(0).toUpperCase() + formatPojam.slice(1)
    return formatedPojam
}





let collection = db.collection('pojmovi');

let pS = '';
let tacniOdgovori = () => {
    collection
        .get()
        .then(snapshot => {
            let nizPojmova = []
            let nizKategorija = []

            snapshot.docs.forEach(doc => {
                nizPojmova.push(doc.data().pojam)
                nizKategorija.push(doc.data().kategorija)
            })

            let randomIndex = (x) => {
                return Math.floor(Math.random() * x.length);
            }

            let nizNizova = nizPojmova.map((e, i) => `${e} ${nizKategorija[i]}`);

            let drzave = []
            let gradovi = []
            let reke = []
            let planine = []
            let zivotinje = []
            let biljke = []
            let predmeti = []

            nizNizova.forEach(niz => {
                if (niz.includes('Država')) {
                    drzave.push(niz)
                }
            })

            let drzava = drzave[randomIndex(drzave)]
            pS = drzava[0]
            console.log(pS)

            nizNizova.forEach(niz => {
                if (niz[0] == pS) {
                    if (niz.includes('Grad')) {
                        gradovi.push(niz)
                    } else if (niz.includes('Reka')) {
                        reke.push(niz)
                    } else if (niz.includes('Planina')) {
                        planine.push(niz)
                    } else if (niz.includes('Životinja')) {
                        zivotinje.push(niz)
                    } else if (niz.includes('Biljka')) {
                        biljke.push(niz)
                    } else if (niz.includes('Predmet')) {
                        predmeti.push(niz)
                    }
                }
            })

            let grad = gradovi[randomIndex(gradovi)]
            let reka = reke[randomIndex(reke)]
            let planina = planine[randomIndex(planine)]
            let zivotinja = zivotinje[randomIndex(zivotinje)]
            let biljka = biljke[randomIndex(biljke)]
            let predmet = predmeti[randomIndex(predmeti)]




            ipkForm.addEventListener('submit', e => {
                e.preventDefault()

                let drzavaK = ipkForm.elements[0].value
                let gradK = ipkForm.elements[1].value
                let rekaK = ipkForm.elements[2].value
                let planinaK = ipkForm.elements[3].value
                let zivotinjaK = ipkForm.elements[4].value
                let biljkaK = ipkForm.elements[5].value
                let predmetK = ipkForm.elements[6].value


                let fDrzavaK = `${formatPojam(drzavaK)} Država`
                let fGradK = `${formatPojam(gradK)} Grad`
                let fRekaK = `${formatPojam(rekaK)} Reka`
                let fPlaninaK = `${formatPojam(planinaK)} Planina`
                let fŽivotinjaK = `${formatPojam(zivotinjaK)} Životinja`
                let fBiljkaK = `${formatPojam(biljkaK)} Biljka`
                let fPredmetK = `${formatPojam(predmetK)} Predmet`

                console.log(fDrzavaK)

                if (drzava == fDrzavaK) {
                    console.log('idemoooooo')
                }
                if (grad == fGradK) {
                    console.log('idemoooooo')
                }
                if (reka == fRekaK) {
                    console.log('idemoooooo')
                }
                if (planina == fPlaninaK) {
                    console.log('idemoooooo')
                }
                if (zivotinja == fZivotinjaK) {
                    console.log('idemoooooo')
                }
                if (biljka == fBiljkaK) {
                    console.log('idemoooooo')
                }
                if (predmet == fPredmetK) {
                    console.log('idemoooooo')
                }



            })
        })
}
tacniOdgovori()










start.addEventListener('click', () => {
    countdown()
    start.classList.toggle('none')
    button.classList.toggle('none')
    slovo.innerHTML = pS;
})







