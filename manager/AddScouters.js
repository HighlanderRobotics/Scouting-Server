const Manager = require('./Manager.js')

class AddScouters extends Manager {
    static name = "addScouters"

    constructor() {
        super()
    }

    async runTask() {
        let a = this 

        return new Promise(async(resolve, reject) => {
            await a.runInsertScouters()
            .then((results) => {
                resolve(results)
            })
            .catch((err) => {
                if (err) {
                    reject({
                        "results": err,
                        "customCode": 500
                    })
                }
            })
        })        
    }
    
    getScouters() {
        let data = JSON.parse(fs.readFileSync(`${__dirname}/../scouters/./scouters.json`, 'utf8'))
        return data.scouters
    }

    async insertScouter(sql, scout, i) {
        let sql = `INSERT INTO scouters (name, phoneNumber, email) VALUES (?,?,?)`

        return new Promise((resolve, reject) => {
            Manager.db.run(sql, [scout.name, scout.number, scout.email], (err) => {
                if (err) {
                    console.error(`Error inserting scouters: ${err}`)
                    reject(`Error inserting scouters: ${err}`)
                } else {
                    resolve(`Success`)
                }
            })
        })
    }

    async runInsertScouters() {
        var scouters = this.getScouters()

        for (var i = 0; i < scouters.length; i++) {
            // console.log(scouters[i])
            await this.insertScouter(sql, scouters[i], i)
            .catch((err) => {
                if (err) {
                    console.log(`Error with inserting scouter: ${err}`)
                    reject(err)
                }
            })
        }
    }
}

module.exports = AddScouters