const BaseAnalysis = require('../../BaseAnalysis.js')
const teamStat = require('./climberSucsess.js')
const all = require('./climberSucsessAll.js')
const math = require('mathjs')


// const Manager = require('./manager/dbmanager.js')

class climberSucsessDifference extends BaseAnalysis {
    static name = `climberSucsessDifference`

    constructor(db, team) {
        super(db)
        this.team = team
        // this.teamKey = "frc" + team
        // this.start = start
        // this.end = end
        this.zScore
        // this.array = []

    }
    async getAccuracy() {
        let a = this
        let x = new teamStat(a.db, a.team)
        await x.runAnalysis()

        let y = new all(a.db)
        await y.runAnalysis()        


        let allRate = ((y.level + 1)/(y.totalAttempted + 3) * 10) + ((y.tipped + 1)/(y.totalAttempted + 3) * 8)
        let teamRate = ((x.level + 1)/(x.totalAttempted + 3) * 10) + ((x.tipped + 1)/(x.totalAttempted + 3) * 8)
        let temp = math.std(y.array)
        a.zScore = (teamRate - allRate)/temp
        if(isNaN(a.zScore))
        {
            a.zScore = 0
        }
    }


    runAnalysis() {
        return new Promise(async (resolve, reject) => {
            let a = this
            var temp = await a.getAccuracy().catch((err) => {
                if (err) {
                    return err
                }
            })
            // a.result = temp  
            resolve("done")
        })

    }
    finalizeResults() {
        return {
            "zScore" : this.zScore

        }
    }

}
module.exports = climberSucsessDifference
