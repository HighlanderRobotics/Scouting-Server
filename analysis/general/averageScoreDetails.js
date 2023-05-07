const BaseAnalysis = require('../BaseAnalysis')
const teamStat = require('./averageScore')
const all = require('./averageScoreAll.js')
const difference = require('./averageScoreDifference.js')
//details for average score of a team, specifies auto or teleop (0 or 1):
//all team avg
//team avg
//difference between all team and team avg
//array with matches
class averageScoreDetails extends BaseAnalysis {
    static name = `averageScoreDetails`

    constructor(db, team, autoOrTele) {
        super(db)
        this.team = team
        this.array = []
        this.all = 0
        this.average = 0
        this.autoOrTele = autoOrTele
        this.difference = 0
        this.scoringBreakdown = {}
    }
    async getAccuracy() {
        let a = this
        let team = new teamStat(a.db, a.team, a.autoOrTele)
        await team.runAnalysis()
        let allAvg = new all(a.db, a.autoOrTele)
        await allAvg.runAnalysis()
        let diff = new difference(a.db, a.team, a.autoOrTele)
        await diff.runAnalysis()

        a.average = team.average
        a.all = allAvg.average
        a.difference = diff.average
        a.array = team.finalizeResults().array


    }


    runAnalysis() {
        return new Promise(async (resolve, reject) => {
            let a = this
            await a.getAccuracy().catch((err) => {
                if (err) {
                    return err
                }
            })
            resolve("done")
        })

    }
    finalizeResults() {
        return {
            "result": this.average,
            "all": this.all,
            "difference": this.difference,
            "array": this.array,
            "team": this.team
        }
    }

}
module.exports = averageScoreDetails
