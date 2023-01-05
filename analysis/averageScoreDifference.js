const BaseAnalysis = require('./BaseAnalysis.js')
const teamStat = require('./averageScore.js')
const all = require('./averageScoreAll.js')

// const Manager = require('./manager/dbmanager.js')

class averageScoreDifference extends BaseAnalysis {
    static name = `averageScoreDifference`

    constructor(db, team) {
        super(db)
        this.team = team
        // this.teamKey = "frc" + team
        // this.start = start
        // this.end = end
        this.result = 0
        // this.array = []
        
    }
    async getAccuracy()
    {
        let a = this
        let x = new teamStat(a.db, a.team)
        await x.runAnalysis()
        let teamAvg = x.finalizeResults
        let y = new all(a.db)
        await y.runAnalysis()
        let overallAvg = y.finalizeResults

        a.result = teamAvg - overallAvg
        
    }
    
    
        runAnalysis()
        {
            return new Promise(async (resolve, reject) =>
            {
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
        finalizeResults()
        {
            return { 
                "result": this.result,
                "team": this.team,
            }
        }

}
module.exports = averageScoreDifference
