const BaseAnalysis = require('../BaseAnalysis')
const teamStat = require('./averageScore')
const all = require('./averageScoreAll.js')
const difference = require('./averageScoreDifference.js')
const math = require('jstat')


// const Manager = require('./manager/dbmanager.js')

class averageScoreOverview extends BaseAnalysis {
    static name = `averageScoreOverview`

    constructor(db, team) {
        super(db)
        this.team = team
       
        // this.teamKey = "frc" + team
        // this.start = start
        // this.end = end
        this.autoTeam = 0
        this.autoAll = 0
        this.autoDifference = 0
        this.teleOpDifference = 0
        this.teleOpAll = 0
        this.teleOp = 0
        this.score = 0
        this.scoreAll = 0
        this.scoreDiffrence = 0
        this.autoArray = []
        this.teleOpArray = []
        this.zScoreAuto = 0
        this.zScoreTeleop = 0

        // this.array = []

    }
    async getAccuracy() {
        let a = this
        let auto = new teamStat(a.db, a.team, 0)
        await auto.runAnalysis()
        let autoAll = new all(a.db, a.team, 0)
        await autoAll.runAnalysis()
        let autoDifference = new difference(a.db, a.team, 0)
        await autoDifference.runAnalysis()
        
        a.autoTeam = auto.result
        a.autoAll = autoAll.result
        a.autoDifference = autoDifference.result
        a.autoArray = auto.finalizeResults().array
        let autoTemp = math.stedv(autoAll.array)
        //FIX ISSUES WITH STDEV JSTAT
        a.zScoreAuto = a.autoDifference/autoTemp

        let teleOp = new teamStat(a.db, a.team, 1)
        await teleOp.runAnalysis()
        let teleOpAll = new all(a.db, a.team, 1)
        await teleOpAll.runAnalysis()
        let teleOpDifference = new difference(a.db, a.team, 1)
        await teleOpDifference.runAnalysis()
        
        a.teleOp = teleOp.result
        a.teleOpAll = teleOpAll.result
        a.teleOpDifference = teleOpDifference.result
        a.teleOpArray = teleOp.finalizeResults().array
        let teleOpTemp = math.stedv(teleOpAll.array)
        a.zScoreAuto = a.teleOpDifference/teleOpTemp


        a.score = a.teleOp + a.autoTeam
        a.scoreAll = a.teleOpAll + a.autoAll
        a.difference = a.autoDifference + a.teleOpDifference

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
            "autoTeam" : this.autoTeam,
            "autoAll" :this.autoAll ,
            "autoDifference" :this.autoDifference ,
            "teleOpDifference" :this.teleOpDifference ,
            "teleOpAll" :this.teleOpAll ,
            "teleOp" :this.teleOp ,
            "score" :this.score ,
            "scoreAll" :this.scoreAll ,
            "scoreDiffrence" :this.scoreDiffrence ,
            "autoArray" :this.autoArray,
            "teleOpArray" :this.teleOpArray,
            "zScoreAuto" : this.zScoreAuto ,
            "zScoreTeleop" : this.zScoreTeleop ,
        }
    }

}
module.exports = averageScoreOverview
