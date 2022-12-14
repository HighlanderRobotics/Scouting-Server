const Manager = require('./Manager.js')

class InitServer extends Manager {
    static name = "InitServer"

    constructor() {
        super()
    }

    runTask() {
        var sql = `PRAGMA foreign_keys = ON`

        // Shouldn't give a response if it runs correctly, just enables foreign keys
        
        return new Promise ((resolve, reject) => {
            Manager.db.get(sql, (err) => {
                if (err) {
                    reject(`(Ask Barry) Error: ${err}`)
                } else {
                    resolve()
                }
            })
        })
        .catch((err) => {
            if (err) {
                return err
            }
        })
        .then((results) => {
            return results
        })
        
    }
}

module.exports = InitServer