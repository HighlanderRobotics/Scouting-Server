const { re } = require('mathjs')
const Manager = require('./Manager.js')
//adds or updates

class AddCustomMatch extends Manager {
    static name = "AddCustomMatch"

    constructor() {
        super()
    }

    async runTask(tournamentKey, matchNumber, matchType, teams) {
        teams = JSON.parse(teams)
        console.log(teams.length)
        for (let i = 0; i < teams.length; i++) {
            console.log(teams[i])
            let currKey = tournamentKey + '_'+matchType+matchNumber+'_'+i
            let currTeamKey = "frc" + teams[i]
            this.runInsert(currKey, tournamentKey, matchNumber, currTeamKey, matchType)
        }

    }


    async runInsert(key, tournamentKey, matchNumber, teamKey, matchType) {
        var sql = `INSERT INTO matches (key, tournamentKey, matchNumber, teamKey, matchType) VALUES (?, ?, ?, ?, ?)`
        return new Promise(async (resolve, reject) => {
            Manager.db.all(sql, [key, tournamentKey, matchNumber, teamKey, matchType], (err, rows) => {
        
                if (err) {
                    reject(err)
                }
                else
                {
                    resolve("done")
                }
            })
            

        })
        .catch(err)
        {
            
        }


    }
}

module.exports = AddCustomMatch