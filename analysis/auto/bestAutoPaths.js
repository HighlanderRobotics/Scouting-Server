const { map, all } = require('mathjs')
const BaseAnalysis = require('../BaseAnalysis.js')
const Manager = require('../../manager/dbmanager.js')
const autoPaths = require('./cargo/autoPaths.js')
// const Manager = require('./manager/dbmanager.js')

class cargoCountAuto extends BaseAnalysis {
    static name = `cargoCountAuto`

    constructor(db, team) {
        super(db)
        this.team = team
        // this.start = start
        // this.end = end
        this.bestPaths = [[{"points" : 0, "path" : {}, "climbPoints" : 0, "climb" : false, "all" : {"scoringRow" : []}}], [{"points" : 0, "path" : {}, "climbPoints" : 0, "climb" : false, "all" : {"scoringRow" : []}}], [{"points" : 0, "path" : {}, "climbPoints" : 0, "climb" : false, "all" : {"socringRow" : 0}}]]
    }
    async getAccuracy() {
        let a = this
        let paths = new autoPaths(Manager.db, a.team)
        await paths.runAnalysis()
        let allPaths = paths.finalizeResults().paths
        for(let i = 0; i < allPaths.length; i ++)
        {
            let averageOnPath = 0
            for(let j = 0; j < allPaths[i].score.length; j ++)
            {
                averageOnPath += allPaths[i].score[j]
            }
            averageOnPath = averageOnPath/ allPaths[i].score.length
            let loc = allPaths[i].positions[0].location -17
            let climbPoints = (allPaths[i].chargeRate.docked * 8 + allPaths[i].chargeRate.engaged * 12)/allPaths[i].frequency
            let charingRate = allPaths[i].chargeRate
            let chargeBool = false
            if(charingRate.docked + charingRate.failed + charingRate.engaged > 0)
            {
                chargeBool = true
            }
            a.bestPaths[loc].push( {"points" : averageOnPath, "path" : allPaths[i], "climbPoints" : climbPoints, "climb" : chargeBool, "full" : allPaths})

        }
        for(let j = 0; j < 3; j ++)
        {
            a.bestPaths[j] = a.bestPaths[j].sort((a, b) => b.points - a.points);
        }

        resolve("done")

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
            "bestPaths": this.bestPaths,
            "team": this.team,
        }
    }
}
module.exports = cargoCountAuto
