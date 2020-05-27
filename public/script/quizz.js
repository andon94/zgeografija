let nav = document.querySelector('.nav')
let kompKviz = document.querySelector('#komp-kviz')
let prijateljKviz = document.querySelector('#prijatelj-kviz')

let ipk = document.querySelector('.ipk')
let ipkForm = document.querySelector('.ipk-form')

let inputKategorija = document.querySelector('.kat-input')
let inputs = document.querySelectorAll('input')

let olaf = document.querySelector('.olaf')
let caption = document.querySelector('.caption')
let slovoSat = document.querySelector('.ps-sat')
let slovo = document.querySelector('#slovo')
let sat = document.querySelector('.sat-sek')
let start = document.querySelector('.button')
let button = document.querySelector('button')

let ni = document.querySelector('#ni')

let collection = db.collection('pojmovi');
let name = localStorage.getItem("usernameLS");


// pri ucitavanju onemoguci unos preko input polja
inputs.forEach(input => {
    input.setAttribute('disabled', 'true')
})

let olafF = () => {
    olaf.style.display = 'block'
}

let none = () => {
    olaf.style.display = 'none'
}

let countdown = () => {
    let timeleft = 1;
    let timer = setInterval(() => {
        let counter = 90 - timeleft;
        timeleft += 1;
        sat.innerHTML = counter
        // ukoliko dodje do nule klikni na dugme vezanozaformu
        if (counter == 0) {
            clearInterval(timer);
            sat.innerHTML = '0'
            button.click()
        }
    }, 1000);

    button.addEventListener('click', () => {
        slovoSat.classList.add('animation2')
        setTimeout(() => {
            clearInterval(timer)
            sat.innerHTML = ''
        }, 300)
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
// 20posto veci raspon za odabir indexa od duzine niza
let randomBotIndex = (x) => {
    let procenat = x.length * (20 / 100)
    return Math.floor(Math.random() * (x.length + procenat));
}



// let slova = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "Lj", "M", "N", "Nj", "O", "P", "R", "S", "T", "U", "V", "Z", "Ž", "Č", "Ć", "Dž", "Đ", "Š"];
let slova = ['A', 'S', 'B']
let pS = slova[randomIndex(slova)]
let kategorije = ['Država', 'Grad', 'Reka', 'Planina', 'Životinja', 'Biljka', 'Predmet']

let nizBotOdgovora = []
let glavniNiz = []

let kviz = (kategorija) => {
    collection
        .where('pocetnoSlovo', '==', pS)
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
// prolazim kroz sve kategorije da bi se popunio niz pojmova 
kategorije.forEach(kategorija => {
    kviz(kategorija)
})

// console.log(nizBotOdgovora)
// console.log(glavniNiz)

// ceka da se nizovi popune podacima sa servera
// interval se ponavlja sve dok niz botovim odgovora ne bude imao7 elementa
let interval = setInterval(() => {
    if (nizBotOdgovora.length != 7) {
        console.log('Wait')
    } else if (nizBotOdgovora.length == 7) {
        console.log('Ready')
        clearInterval(interval)

        let usrOdgovori = []
        ipkForm.addEventListener('submit', e => {
            e.preventDefault()
            // setTimeout je tu samo zbog animacija 
            setTimeout(() => {
                inputs.forEach(input => {
                    usrOdgovori.push(formatPojam(input.value))
                })
                // odgovorima usera se u stringu dodaje i kategorija tog pojma
                usrOdgovori = usrOdgovori.map((e, i) => `${e} ${kategorije[i]}`)

                let usrRezultat = 0;
                let botRezultat = 0;
                slovoSat.classList.add('rezultat')
                slovoSat.innerHTML = '<h3>Olafovi poeni</h3><br>'

                nizBotOdgovora.forEach((botOdgovor, i) => {
                    let usrOdgovor = usrOdgovori[i]
                    // ako glavni niz sadrzi odgovor moj ili robotov...
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
                                input.value += `nema pojma`
                                input.style.color = 'red'
                            }
                        })
                        console.log(4)
                    } else if (glavniNiz.includes(usrOdgovor) == false && glavniNiz.includes(botOdgovor) == false) {
                        console.log('nista')

                        slovoSat.innerHTML += `<p class='crveno'>nema pojma</p><br>`
                        inputs.forEach(input => {
                            if (input.value == '') {
                                input.value += `nema pojma`
                                input.style.color = 'red'
                            }
                        })
                    }
                })
                // console.log(usrRezultat)
                // console.log(botRezultat)


                for (let i = 0; i < inputs.length; i++) {
                    // console.log(inputs[i].value)
                    let inpt = inputs[i].value
                    // inpute koji nisu u bazu boji crvenom bojom
                    if (inpt.includes('+ 0') == false && inpt.includes('+5') == false && inpt.includes('+10') == false && inpt.includes('+15') == false) {
                        inputs[i].style.color = 'red'
                        // console.log(inputs[i].value)
                    }
                }

                // racunanje rezultata
                if (usrRezultat > botRezultat) {
                    caption.innerHTML = `<h3>Rezultat:</h3><p>Pobednik je ${name}: <span class="zeleno">${usrRezultat}</span><br>Olaf: <span class="zeleno">${botRezultat}</span></p>`
                    olaf.innerHTML = 'tøgr!'
                    olaf.style.display = 'block'
                    myMove()
                } else if (botRezultat > usrRezultat) {
                    caption.innerHTML = `<h3>Rezultat:</h3><p>${name}: <span class="zeleno">${usrRezultat}</span><br>Pobednik je Olaf: <span class="zeleno">${botRezultat}</span></p>`
                    olaf.innerHTML = 'HAAAAHAAAAHAHAHA!!!'
                    olaf.style.display = 'block'
                } else {
                    caption.innerHTML = `<h3>Rezultat:</h3><p>Nerešeno</p><p>${name}: <span class="zeleno">${usrRezultat}</span><br>Olaf: <span class="zeleno">${botRezultat}</span></p>`
                }
                caption.classList.add('rezultat')
                button.classList.add('none')
                start.classList.add('none')
            }, 300)
        })
    }
}, 420) //random vrednost intervala koji se ponavlja dok ne dodju podaci iz baze


// funkcija za animaciju
let izgubiSe = x => {
    x.classList.add('animation3')
    setTimeout(() => {
        x.innerHTML = null
    }, 250)
}
// prvo dugme koje se pritiska da bi se dozvolio unos podataka i da bi se pojavilo form button nakon njega
start.addEventListener('click', () => {
    slovo.classList.add('animation')
    izgubiSe(caption)
    start.classList.toggle('none')
    button.classList.toggle('none')
    // myMove()

    // timeout zbog animacija
    setTimeout(() => {
        caption.classList.remove('animation3')
        sat.innerHTML = '90';
        countdown()
        slovo.innerHTML = pS;
        // ukoliko nema username=a nemoj da dozvolis input cak ni nakon klika na duge start
        inputs.forEach(input => {
            if (name != null || name != '') {
                input.removeAttribute('disabled')
                input.style.textTransform = 'lowercase'
            }
        })
    }, 300)
})

// glavno dugme
button.addEventListener('click', () => {
    slovoSat.classList.add('animation2')
    caption.classList.add('animation2')
    button.classList.toggle('none')
    // onemoguci enter
    ipkForm.setAttribute('onkeydown', "return event.key != 'Enter'")
    setTimeout(() => {
        ni.classList.toggle('none')
    }, 300)

})

// refresuj stranicu i pocni novu partiju
ni.addEventListener('click', () => {
    window.location.reload();
})



