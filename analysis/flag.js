const BaseAnalysis = require('./BaseAnalysis.js')
const AverageScore = require('./general/averageScore.js')
const math = require('mathjs')

class trends extends BaseAnalysis {
    static name = `fa`

    constructor(db, team) {
        super(db)
        this.team = team
        this.result = this.result
    }
    async getTrend() {
        let a = this



    }



    runAnalysis() {
        let a = this
        return new Promise(async (resolve, reject) => {
            await a.getTrend().catch((err) => {

            })
            resolve("done")
        })


    }

    finalizeResults() {
        return {
            "team": this.team,
            "result": this.result
        }
    }
}

module.exports = trends