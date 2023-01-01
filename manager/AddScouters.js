const Manager = require('./Manager.js')

class AddScouters extends Manager {
    static name = "addScouters"

    constructor() {
        super()
    }

    async runTask() {
        let sql = `INSERT INTO scouters (name, phoneNumber, email) VALUES (?,?,?)`

        var scouters = this.getScouters()


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
    
    getScouters() {
        let data = JSON.parse(fs.readFileSync(`${__dirname}/../scouters/./scouters.json`, 'utf8'))
        return data.scouters
    }

    async insertScouter(sql, scout, i) {
        return new Promise((resolve, reject) => {
            Manager.db.run(sql, [scout.name, scout.number, scout.email], (err) => {
                if (err) {
                    console.error(`Error inserting scouters: ${err}`)
                    reject(`Error inserting scouters: ${err}`)
                } else {
                    resolve()
                }
            })
        })
    }

    async runInsertScouters() {
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