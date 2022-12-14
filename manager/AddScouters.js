const Manager = require('./Manager.js')

class AddScouters extends Manager {
    static name = "AddScouters"

    constructor() {
        super()
    }

    async runTask() {
        var sql = `INSERT INTO scouters (name) VALUES (?)`

        // Will eventually read from a file, is temporary until I get a full team list
        var scouters = ["Barry B Benson", "Jacob Trentini", "Collin Cameron", "Alex Ware", "Jasper Tripp"]

        await this.runInsertScouters()
        .catch(err => {
            if (err) {
                console.error(`Error with inserting Scouters: ${err}`)
                return(`Error with inserting Scouters: ${err}`)    
            }
        })
        .then(() => {
            console.log(`Finished inserting Scouters`)
            return
        })
    }
    
    async runInsertScouters() {
        for (var i = 0; i < scouters.length; i++) {
            await this.insertScouter(sql, scouters, i)
            .catch((err) => {
                if (err) {
                    console.log(`Error with inserting scouter: ${err}`)
                    reject(err)
                }
            })
        }
    }

    async insertScouter(sql, scouters, i) {
        return new Promise((resolve, reject) => {
            Manager.db.run(sql, [scouters[i]], (err) => {
                if (err) {
                    console.error(`Error inserting scouters: ${err}`)
                    reject(`Error inserting scouters: ${err}`)
                } else {
                    resolve()
                }
            })
        })
    }
}

module.exports = AddScouters