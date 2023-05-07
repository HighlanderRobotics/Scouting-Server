const BaseAnalysis = require('../BaseAnalysis')
const teamStat = require('./averageScore')
const all = require('./averageScoreAll.js')
const math = require('mathjs')

//z-score for averageScores, used for picklists
class averageScorePicklist extends BaseAnalysis {
    static name = `averageScorePicklist`

    constructor(db, team) {
        super(db)
        this.team = team
        this.zScore
    }
    async getAccuracy() {
        let a = this
        
        var team = new teamStat(a.db, a.team, 1)
        await team.runAnalysis()

        var allTeams = new all(a.db, 1)
        await allTeams.runAnalysis()
        let difference = team.totalPicklist - allTeams.totalPicklist

        let teleOpTemp = math.std(allTeams.pickArray)
        a.zScore = difference/teleOpTemp
        if(isNaN(a.zScore))
        {
            a.zScore = 0
        }


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
          "zScore" : this.zScore
        }
    }

}
module.exports = averageScorePicklist
