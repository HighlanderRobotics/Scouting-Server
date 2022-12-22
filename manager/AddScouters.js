const Manager = require('./Manager.js')
const fs = require('fs')

class AddScouters extends Manager {
    static name = 'addScouters'

    constructor() {
        super()
    }

    async runTask() {
        // Will eventually read from a file, is temporary until I get a full team list
        var scouters = this.getScouters()

        await this.runInsertScouters(scouters)
        .catch(err => {
            if (err) {
                console.error(`Error with inserting scouters: ${err}`)
                return(`Error with inserting Scouters: ${err}`)    
            }
        })
        .then(() => {
            return `Finished inserting Scouters`
        })
    }
    
    async runInsertScouters(scouters) {
        let sql = `INSERT INTO scouters (name, phoneNumber) VALUES (?,?)`
        let a = this
        
        return new Promise(async (resolve, reject) => {
            for (let i = 0; i < scouters.length; i++) {    
                await a.insertScouter(sql, scouters[i])
                .catch((err) => {
                    if (err) {
                        reject(err)
                    }
                })
            }
        })
    }

    async insertScouter(sql, scout) {
        return new Promise((resolve, reject) => {
            Manager.db.run(sql, [scout.name, scout.number], (err) => {
                if (err) {
                    console.error(`Error inserting scouters: ${err}: ${JSON.stringify(scout)}`)
                    reject(err)
                } else {
                    resolve()
                }
            })
        })
    }

    getScouters() {
        return JSON.parse(fs.readFileSync(`${__dirname}/../scouters/./scouters.json`, 'utf8')).scouters
    }
}

module.exports = AddScouters