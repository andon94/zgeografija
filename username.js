const usernameForm = document.querySelector('.usernamebox')
const usernameInput = document.querySelector('.usernameinput')

const bazaLink = document.querySelector('.navlink')
const kvizLink = document.querySelector('.quizlink')

const button = document.querySelector('.loginbutton')

usernameForm.addEventListener('submit', e => {
    // e.preventDefault();
    let username = usernameInput.value;
    console.log(username)
    localStorage.setItem('usernameLS', username)
})
// localStorage.clear()

let name = localStorage.getItem("usernameLS");

if (name != null && name != '') {
    console.log('continue')
    bazaLink.classList.add('show')
    bazaLink.setAttribute("href", "./datainput.html");

    kvizLink.classList.add('show')
    kvizLink.setAttribute("href", "./kviz.html");

    button.innerHTML = 'HVALA'

} else {
    console.log('stop')
}

