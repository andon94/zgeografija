const usernameForm = document.querySelector('.usernamebox')
const usernameInput = document.querySelector('.usernameinput')

const bazaLink = document.querySelector('.navlink')
const kvizLink = document.querySelector('.quizlink')

const button = document.querySelector('.loginbutton')

// set username inside local storage
usernameForm.addEventListener('submit', () => {
    let username = usernameInput.value;
    console.log(username)
    localStorage.setItem('usernameLS', username)
})

// nakon unosa username-a dodaj href za linkove 
let name = localStorage.getItem("usernameLS");
if (name != null && name != '') {
    console.log('continue')
    bazaLink.classList.add('show')
    bazaLink.setAttribute("href", "./datainput.html");

    kvizLink.classList.add('show')
    kvizLink.setAttribute("href", "./nav.html");

    button.innerHTML = 'Promeni Korisnicko Ime'
    usernameInput.setAttribute('placeholder', `Ime: ${name}`)
} else {
    console.log('stop')
}

// localStorage.clear()


