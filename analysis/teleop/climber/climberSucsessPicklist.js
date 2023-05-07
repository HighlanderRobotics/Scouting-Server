const BaseAnalysis = require('../../BaseAnalysis.js')
const teamStat = require('./climberSucsess.js')
const all = require('./climberSucsessAll.js')
const math = require('mathjs')


//gives z-core for picklist
class climberSucsessPicklist extends BaseAnalysis {
    static name = `climberSucsessPicklist`

    constructor(db, team) {
        super(db)
        this.team = team
        this.zScore

    }
    async getAccuracy() {
        let a = this
        let x = new teamStat(a.db, a.team)
        await x.runAnalysis()

        let y = new all(a.db)
        await y.runAnalysis()        


        let allRate = ((y.level + 1)/(y.totalAttempted + 3) * 10) + ((y.tipped + 1)/(y.totalAttempted + 3) * 6)
        let teamRate = ((x.level + 1)/(x.totalAttempted + 3) * 10) + ((x.tipped + 1)/(x.totalAttempted + 3) * 6)
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
module.exports = climberSucsessPicklist
