let nav = document.querySelector('.nav')
let kompKviz = document.querySelector('#komp-kviz')
let prijateljKviz = document.querySelector('#prijatelj-kviz')


let ipk = document.querySelector('.ipk')
let ipkForm = document.querySelector('.ipk-form')

let slovo = document.querySelector('#slovo')
let sat = document.querySelector('.sat-sek')




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
            sat.innerHTML = 'Vreme je isteklo'
        }
    }, 1000);
}




function getRandom(arr, n) {
    var result = new Array(n),
        len = arr.length,
        taken = new Array(len);
    if (n > len)
        throw new RangeError("getRandom: more elements taken than available");
    while (n--) {
        var x = Math.floor(Math.random() * len);
        result[n] = arr[x in taken ? taken[x] : x];
        taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
}



let collection = db.collection('pojmovi');

let randomSlovo = () => {
    collection
        .get()
        .then(snapshot => {
            let nizSlova = []
            let nizPojmova = []
            snapshot.docs.forEach(doc => {
                nizSlova.push(doc.data().pocetnoslovo)
                nizPojmova.push(doc.data().pojam)
            })
            // console.log(nizSlova)
            // console.log(nizPojmova)

            let brSlova = nizSlova.length;
            let randomIndex = Math.floor(Math.random() * brSlova);
            let randomSlovo = nizSlova[randomIndex]
            slovo.innerHTML = randomSlovo
            console.log(randomSlovo)

            let pojmoviSlova = nizPojmova.filter(pojam => pojam[0] == randomSlovo)
            console.log(pojmoviSlova)
        })
}
randomSlovo()

sat.addEventListener('click', () => {
    countdown()
    randomSlovo()
})

ipkForm.addEventListener('submit', e => {
    e.preventDefault()
})
