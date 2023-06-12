const { resolve } = require('mathjs');
const Manager = require('./Manager.js');
const { rows } = require('jstat');

class addMatches extends Manager {
    static name = 'addMatches'

    constructor() {
        super()
    }

    async runTask(body) {
        if (body.matchType != 'qm') {
            let num = 0
            var sql = `SELECT MAX(matchNumber) AS answer FROM matches WHERE matchType = "em"`;
            num = await this.getLargest(sql)
            num = num + 1
            

            let insertFinal = ``
            for (let i = 0; i < 6; i++) {
                const data = `('${body.tournamentKey}_em${num}_${i}', '${body.tournamentKey}', ${num}, 'frc${body.teams[i]}', 'em'), `
                insertFinal += data
                if (i == 5) {
                    insertFinal = insertFinal.substring(0, insertFinal.length - 2)
                }

            }
            var sql = `INSERT INTO matches (key, tournamentKey, matchNumber, teamkey, matchType) VALUES ${insertFinal}`

            await this.whyGodInsert(sql)
                .catch((err) => {
                    if (err) {
                        console.log(err)
                    }
                })
        }
        else {
            //always qm?

        }
    }
    async getLargest(sql) {
        return new Promise((resolve, reject) => {
            Manager.db.all(sql, [], (err, rows) =>
            {
                if (err) {
                    reject(`error getting max`)
                }
                else {
                    if(rows.length == 0)
                    {
                        return 0
                    }
                    resolve(rows[0].answer)
                }
            })

        })
    }

    async whyGodInsert(sql) {
        return new Promise((resolve, reject) => {
            Manager.db.run(sql, (err) => {
                if (err) {
                    reject(`Error with inserting match: ${err}, ${sql}`)
                } else {
                    resolve()
                }
            })
        })
    }
}

module.exports = addMatches