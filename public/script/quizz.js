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

let ni = document.querySelector('#ni')

let collection = db.collection('pojmovi');
let name = localStorage.getItem("usernameLS");











let countdown = () => {
    let timeleft = 1;
    let timer = setInterval(() => {
        let counter = 5 - timeleft;
        timeleft += 1;
        sat.innerHTML = counter

        if (counter == 0) {
            clearInterval(timer);
            sat.innerHTML = '0'
            // ipkForm.submit()
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

let drugaRec = string => {
    let n = string.indexOf(' ');
    let res = string.substring(n + 1);
    return res
}

let prvaRec = string => {
    let n = string.indexOf(' ');
    return n === -1 ? string : string.substr(0, n)
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
            slovoSat.classList.add('rezultat')
            slovoSat.innerHTML = '<h3>Poeni Kompjutera</h3><br>'
            // inputKategorija.innerHTML = '<h3>korisnik rezultat</h3><br>'

            nizBotOdgovora.forEach((botOdgovor, i) => {
                let usrOdgovor = usrOdgovori[i]

                if (glavniNiz.includes(usrOdgovor) && usrOdgovor == botOdgovor) {
                    usrRezultat = usrRezultat + 5;
                    botRezultat = botRezultat + 5;

                    slovoSat.innerHTML += `<p>${prvaRec(botOdgovor)} <span class="zeleno">+5</p></span><br>`
                    inputs.forEach(input => {
                        if (input.id == drugaRec(usrOdgovor)) {
                            input.value += ` +5`
                        }
                    })
                    console.log(1)
                } else if (glavniNiz.includes(usrOdgovor) && usrOdgovor != botOdgovor && glavniNiz.includes(botOdgovor)) {
                    usrRezultat = usrRezultat + 10;
                    botRezultat = botRezultat + 10;

                    slovoSat.innerHTML += `<p>${prvaRec(botOdgovor)} <span class="zeleno">+10</p></span></p><br>`
                    inputs.forEach(input => {
                        if (input.id == drugaRec(usrOdgovor)) {
                            input.value += ` +10`
                        }
                    })
                    console.log(2)
                } else if (glavniNiz.includes(usrOdgovor) && glavniNiz.includes(botOdgovor) == false) {
                    usrRezultat = usrRezultat + 15;

                    slovoSat.innerHTML += `<p class='crveno'>nema pojma</p><br>`
                    inputs.forEach(input => {
                        if (input.id == drugaRec(usrOdgovor)) {
                            input.value += ` +15`
                        }
                    })
                    console.log(3)
                } else if (glavniNiz.includes(usrOdgovor) == false && glavniNiz.includes(botOdgovor)) {
                    botRezultat = botRezultat + 15;

                    slovoSat.innerHTML += `<p>${prvaRec(botOdgovor)} <span class="zeleno">+15</p></span></p><br>`
                    inputs.forEach((input) => {

                        if (input.value == '') {
                            input.value += `+ 0`
                            input.style.color = 'red'
                        }



                    })

                    console.log(4)
                } else if (glavniNiz.includes(usrOdgovor) == false && glavniNiz.includes(botOdgovor) == false) {
                    console.log('nista')

                    slovoSat.innerHTML += `<p class='crveno'>nema pojma</p><br>`
                    inputs.forEach(input => {
                        if (input.value == '') {
                            input.value += `+ 0`
                            input.style.color = 'red'
                        }
                    })
                }
            })
            // console.log(usrRezultat)
            // console.log(botRezultat)


            for (let i = 0; i < inputs.length; i++) {
                console.log(inputs[i].value)
                let inpt = inputs[i].value
                if (inpt.includes('+ 0') == false && inpt.includes('+5') == false && inpt.includes('+10') == false && inpt.includes('+15') == false) {
                    inputs[i].style.color = 'red'
                    inputs[i].value += ' +0'
                    console.log(inputs[i].value)
                }
            }


            if (usrRezultat > botRezultat) {
                caption.innerHTML = `<h3>Rezultat:</h3><br><p>Pobednik je ${name}: <span class="zeleno">${usrRezultat}</span><br>kompjuter: <span class="zeleno">${botRezultat}</span></p>`
            } else if (botRezultat > usrRezultat) {
                caption.innerHTML = `<h3>Rezultat:</h3><br><p>${name}: <span class="zeleno">${usrRezultat}</span><br>Pobednik je kompjuter: <span class="zeleno">${botRezultat}</span></p>`
            } else {
                caption.innerHTML = `<h3>Rezultat:</h3><br><p>Nereseno</p><br><p>${name}: <span class="zeleno">${usrRezultat}</span><br>kompjuter: <span class="zeleno">${botRezultat}</span></p>`
            }
            caption.style.marginTop = '-0.5rem'
            caption.classList.add('rezultat')
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


