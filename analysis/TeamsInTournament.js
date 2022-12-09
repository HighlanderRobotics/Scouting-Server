const BaseAnalysis = require('./BaseAnalysis.js')

class TeamsInTournament extends BaseAnalysis {
    static name = `TeamsInTournament`

    constructor(db, tournamentKey) {
        super(db)
        this.tournamentKey = tournamentKey
        this.result = []
    }

    async getData() {
        let a = this

        return new Promise((resolve, reject) => {
            var sql = `SELECT teamKey
            FROM matches
            WHERE gameKey = ?`

            a.db.all(sql, [a.tournamentKey], (err, rows) => {
                if (err) {
                    console.log(`Error getting data from ${a.tournamentKey}`)
                } else {
                    resolve(rows)
                }
            })
        })
        .catch((err) => {
            if (err) {
                return err
            }
        })
        .then((data) => {
            return data
        })
    }

    runAnalysis() {
        let a = this

        return new Promise(async (resolve, reject) => {
            var data = await a.getData().catch((err) => {
                if (err) {
                    return err
                }
            })

            // Could be optimized by sorting this list and doing comparisons with a binary search but optimize later ig
            data.forEach((team) => {
                if (!a.result.includes(team.teamKey)) {
                    a.result.push(team.teamKey)
                }
            })

            if (data.length < 1) {
                resolve(`No Data Found For ${a.tournamentKey}`)
            } else {
                // console.log(a.result)
                resolve(`Task Completed`)
            }
        })
    }

    finalizeResults() {
        return {
            "TeamsInTournament": this.result
        }
    }
}

module.exports = TeamsInTournament