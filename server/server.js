const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const Game = require('./game')

const app = express()

const clientPath = `${__dirname}/../public`
console.log(`Serving static from ${clientPath}`)
app.use(express.static(clientPath))
const server = http.createServer(app);
const io = socketio(server)



let randomIndex = (x) => {
    return Math.floor(Math.random() * x.length);
}
let slova = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "Lj", "M", "N", "Nj", "O", "P", "R", "S", "T", "U", "V", "Z", "Ž", "Č", "Ć", "Dž", "Đ", "Š"];
let pS = slova[randomIndex(slova)]

let waitingPlayer = null;
io.on('connection', (sock) => {

    if (waitingPlayer) {
        // ako waitingPlayer postoji i pojavi se drugi
        // zapocni igru
        new Game(waitingPlayer, sock)
        io.emit('slovo', pS)

        waitingPlayer = null;


    } else {
        // ako waitingPlayer ne postoji, on postaje socket
        waitingPlayer = sock;
        // sock.emit salje poruku samo jednom igracu
        waitingPlayer.emit('info', 'Sačekaj Protivnika')
    }

    // cim se primi poruka od igraca koji je konektovan
    sock.on('message', (text) => {
        // prosledjuje se svima koji su konektovani
        io.emit('message', text)
    })
})


server.on('error', (err) => {
    console.error('server error', err)
})
server.listen(8080, () => {
    console.log('rps started on 8080')
})