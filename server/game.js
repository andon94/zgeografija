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
                this._usrNames[idx] = name;
            })
        })

        // this._players.forEach((player, idx) => {
        //     // player.on('turn', (turn) => {
        //     //     this._turns[playerIndex] = turn;
        //     player.on('username', (name) => {
        //         this._usrNames[idx] = name;
        //     })
        //     // })
        // })

        // this._usrNames.forEach((usrname, idx) => {
        //     usrname.on('username', (name) => {
        //         this._usrNames[idx] = name;
        //     })
        // })
    }

    _sendInfo(msg) {
        this._players.forEach(player => {
            player.emit('info', msg)
        })
    }

    _sendCountdown() {
        this._players.forEach(player => {
            player.emit('countdown')
        })

    }

    _sendCountdownGame() {
        this._players.forEach(player => {
            player.emit('gms')
        })

    }

    _sendToPlayer(playerIndex, msg) {
        this._players[playerIndex].emit('form', msg)
    }

    _sendToPlayers(msg) {
        this._players.forEach(player => {
            player.emit('message', msg)
        })
    }

    _sendToAll(msg) {
        this._players.forEach(player => {
            player.emit('rezultat', msg)
        })
    }

    _writeSelf(playerIndex, msg) {
        this._players[playerIndex].emit('self', msg)
    }

    _onTurn(playerIndex, turn) {

        this._turns[playerIndex] = turn;
        this._skupa += turn
        this._checkGameOver()
    }

    _checkGameOver() {
        const turns = this._turns;

        if (turns[0] && turns[1]) {
            this._sendInfo('Igra je gotova')
            this._getResults()
            this._turns = [null, null]
        }
    }

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
        this._sendToAll(`${poeniPrvi} : ${poeniDrugi}`)
        // this._sendToAll(poeniDrugi)

        // setTimeout(() => {
        //     if (poeniPrvi > poeniDrugi) {
        //         this._sendToAll(`${this._usrNames[0]} je pobedio.`)
        //     }

        //     if (poeniDrugi > poeniPrvi) {
        //         this._sendToAll(`${this._usrNames[1]} je pobedio.`)
        //     }

        //     if (poeniPrvi == poeniDrugi) {
        //         this._sendToAll('Nerešeno')
        //     }
        // }, 2000)

        let usrint = setInterval(() => {
            if (this._usrNames[0] != null || this._usrNames[0] != null) {
                if (poeniPrvi > poeniDrugi) {
                    this._sendToAll(`${this._usrNames[0]} je pobedio.`)
                }

                if (poeniDrugi > poeniPrvi) {
                    this._sendToAll(`${this._usrNames[1]} je pobedio.`)
                }

                if (poeniPrvi == poeniDrugi) {
                    this._sendToAll('Nerešeno')
                }
                clearInterval(usrint)
            }
        }, 420);


    }


}

module.exports = Game