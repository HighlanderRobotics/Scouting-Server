const BaseAnalysis = require('../../BaseAnalysis.js')
const teamStat = require('./cargoCount.js')
const all = require('./cargoCountAll.js')

//finding the differece in average cargo (of a given type: cones or cubes) of a team and the overall average to a certain positions (scoring or feeding to team)
class cargoCountDifference extends BaseAnalysis {
    static name = `cargoCountDifference`

    constructor(db, team, type, location) {
        super(db)
        this.team = team
        this.location = location
        this.result = 0
        this.type = type

    }
    async getAccuracy() {
        let a = this

        let x = new teamStat(a.db, a.team, a.type, a.location)
        await x.runAnalysis()
        let teamAvg = x.average
        let y = new all(a.db, a.type, a.location)
        await y.runAnalysis()
        let overallAvg = y.average

        a.result = teamAvg - overallAvg
        

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
            "result": this.result,
            "team": this.team,
        }
    }

}
module.exports = cargoCountDifference
