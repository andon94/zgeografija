let nav = document.querySelector('.nav')
let kompKviz = document.querySelector('#komp-kviz')
let prijateljKviz = document.querySelector('#prijatelj-kviz')


let ipk = document.querySelector('.ipk')
let ipkForm = document.querySelector('.ipk-form')

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
        }
    }, 1000);
}

sat.addEventListener('click', () => {
    countdown()
})


