const AverageForMetric = require('./AverageForMetric.js')
const BaseAnalysis = require('./BaseAnalysis.js')
const TeamsInTournament = require('./TeamsInTournament.js')

class BestAverageForMetric extends BaseAnalysis {
    static name = "bestAverageForMetric"

    constructor(db, tournamentKey, metric) {
        super(db)
        this.tournamentKey = tournamentKey
        this.metric = metric
        this.bestResult = 0
        this.bestTeam = 0
    }

    async getData() {
        // When it goes into the promise, this stops pointing to the class, so it's saved here in a
        let a = this

        return new Promise(async (resolve, reject) => {
            let sql = `SELECT *
            FROM matches
            JOIN data ON data.matchKey = matches.key
            WHERE teamKey = ?`
        
            let returnData = []
            var teams = new TeamsInTournament(a.db, a.tournamentKey)
            await teams.runAnalysis()
            var teamData = teams.finalizeResults()
            // console.log(teamData)

            for (var i = 0; i < teamData.TeamsInTournament.length; i++) {
                var teamAverage = new AverageForMetric(a.db, teamData.TeamsInTournament[i], a.metric)
                await teamAverage.runAnalysis()
                returnData.push([teamAverage.finalizeResults().AverageForMetric, teamAverage.finalizeResults().team])
                
                if (i == teamData.TeamsInTournament.length - 1) {
                    // console.log(returnData)
                    resolve(returnData)
                }
            }
        })
        .catch((err) => {
            if (err) {
                return err
            }
        })
        .then((data) => {
            // console.log(data)
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
            // console.log(data)

            if (data.length < 1) {
                resolve(`No Data Found for ${a.metric}`)
            } else {
                // Has Data and finds largest
                data.forEach((team) => {
                    if (team[0] > a.bestResult) {
                        a.bestTeam = team[1]
                        a.bestResult = team[0]
                    }
                })    
                
                resolve(`Task Completed`)
            }
        })
    }

    finalizeResults() {
        return JSON.parse(`{ 
            "metric": "${this.metric}",
            "BestAverageForMetric": ${this.bestResult},
            "team": "${this.bestTeam}",
            "tournament": "${this.tournamentKey}"
        }`)
    }
}

module.exports = BestAverageForMetric