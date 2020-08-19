class Game {
    constructor(p1, p2) {
        this._players = [p1, p2];
        this._turns = [null, null]
        this._usrNames = [null, null]

        this._sendCountdownGame()

        setTimeout(() => {
            this._sendInfo('Igra je počela')
            this._sendCountdown()
        }, 5000)




        this._skupa = []

        this._players.forEach((player, idx) => {
            player.on('turn', (turn) => {
                this._onTurn(idx, turn)
            })

            player.on('username', (name) => {
                this._usrNames[idx] = name
            })
        })

    }

    // informacije o statusu igre
    _sendInfo(msg) {
        this._players.forEach(player => {
            player.emit('info', msg)
        })
    }

    _sendProtiv(index, msg) {
        this._players[index].emit('protiv', msg)
    }

    // glavni countdown
    _sendCountdown() {
        this._players.forEach(player => {
            player.emit('countdown')
        })
        this._sendProtiv(0, this._usrNames[1])
        this._sendProtiv(1, this._usrNames[0])

    }

    // countdown za pocetak partije
    _sendCountdownGame() {
        this._players.forEach(player => {
            player.emit('gms')
        })

    }

    // posalji samo jednom igracu rezultat po elementu
    _sendToPlayer(playerIndex, msg) {
        this._players[playerIndex].emit('form', msg)
    }

    _writeSelf(playerIndex, msg) {
        this._players[playerIndex].emit('self', msg)
    }

    // posalji igracima
    // _sendToPlayers(msg) {
    //     // this._players.forEach(player => {
    //     //     player.emit('message', msg)
    //     // })
    //     this._players[0].emit('message', msg)
    // }

    // posalji svima rezultat
    _sendToAll(msg) {
        this._players.forEach(player => {
            player.emit('rezultat', msg)
        })
    }

    _sendRezToPlayer(playerIndex, msg) {
        this._players[playerIndex].emit('rezultat', msg)
    }

    // ispisi nevidljivi rezultat za bazu
    _writeHelp(playerIndex, msg) {
        this._players[playerIndex].emit('help', msg)
    }

    // registruj potez i skupi ga u zajednicki niz 
    _onTurn(playerIndex, turn) {

        this._turns[playerIndex] = turn;
        this._skupa += turn
        this._checkGameOver()
    }

    // proveri kraj igre
    _checkGameOver() {
        const turns = this._turns;
        // ako postoje oba poteza salji igra je gotova, ispisi rezultate i resetuj poteze
        if (turns[0] && turns[1]) {
            this._sendInfo('Igra je gotova')
            this._getResults()
            this._turns = [null, null]
        }
    }

    // ispisi rezultate po elementu
    _getResults() {
        const turns = this._turns;
        let prvi = []
        let drugi = []

        let prviTurn = turns[0]
        prviTurn.forEach(odg => {
            prvi.push(odg)
        })

        let drugiTurn = turns[1]
        drugiTurn.forEach(odg => {
            drugi.push(odg)
        })

        let poeniPrvi = 0
        let poeniDrugi = 0

        this._sendToPlayer(1, `${this._usrNames[0]}`)
        this._sendToPlayer(0, `${this._usrNames[1]}`)
        this._writeSelf(0, `${this._usrNames[0]}`)
        this._writeSelf(1, `${this._usrNames[1]}`)

        for (let i = 0; i < prvi.length; i++) {

            if (prvi[i] == '') {
                this._sendToPlayer(1, `nema pojma`)
                this._writeSelf(0, `nema pojma`)
            }

            if (drugi[i] == '') {
                this._sendToPlayer(0, `nema pojma`)
                this._writeSelf(1, `nema pojma`)
            }

            if (prvi[i] == drugi[i] && prvi[i] != '') {
                this._sendToPlayer(1, `${prvi[i]} +5`)
                this._sendToPlayer(0, `${drugi[i]} +5`)
                poeniPrvi += 5
                poeniDrugi += 5

                this._writeSelf(0, `${prvi[i]} +5`)
                this._writeSelf(1, `${drugi[i]} +5`)
            }

            if (prvi[i] != '' && drugi[i] == '') {
                this._sendToPlayer(1, `${prvi[i]} +15`)
                this._writeSelf(0, `${prvi[i]} +15`)
                poeniPrvi += 15

            }

            if (drugi[i] != '' && prvi[i] == '') {
                this._sendToPlayer(0, `${drugi[i]} +15`)
                this._writeSelf(1, `${drugi[i]} +15`)

                poeniDrugi += 15
            }

            if (prvi[i] != '' && drugi[i] != '' && prvi[i] != drugi[i]) {
                this._sendToPlayer(1, `${prvi[i]} +10`)
                this._sendToPlayer(0, `${drugi[i]} +10`)

                this._writeSelf(0, `${prvi[i]} +10`)
                this._writeSelf(1, `${drugi[i]} +10`)

                poeniPrvi += 10
                poeniDrugi += 10

            }

        }



        this._sendRezToPlayer(0, `${poeniPrvi} : ${poeniDrugi}`)
        this._sendRezToPlayer(1, `${poeniDrugi} : ${poeniPrvi}`)


        let usrint = setInterval(() => {
            if (this._usrNames[0] != null || this._usrNames[0] != null) {
                if (poeniPrvi > poeniDrugi) {
                    this._sendToAll(`${this._usrNames[0]} je pobednik`)
                    this._writeHelp(0, `${poeniPrvi}`)
                    this._writeHelp(1, `${poeniDrugi}`)
                }

                if (poeniDrugi > poeniPrvi) {
                    this._sendToAll(`${this._usrNames[1]} je pobednik`)
                    this._writeHelp(1, `${poeniDrugi}`)
                    this._writeHelp(0, `${poeniPrvi}`)
                }

                if (poeniPrvi == poeniDrugi) {
                    this._sendToAll('Nerešeno')
                    this._writeHelp(1, `${poeniDrugi}`)
                    this._writeHelp(0, `${poeniPrvi}`)
                }
                clearInterval(usrint)


            }
        }, 420);


    }


}

module.exports = Game