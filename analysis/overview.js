const BaseAnalysis = require('./BaseAnalysis.js')
const Manager = require('../manager/dbmanager.js')
// const AverageForMetric = require('./analysis/AverageForMetric.js')
// const TeamsInTournament = require('./analysis/TeamsInTournament.js')
// const BestAverageForMetric = require('./analysis/BestAverageForMetric.js')
// const Overveiw = require('./overview.js')
// const FullyScouted = require('./analysis/fullyScouted.js')
const defenseAmmount = require('./defenseQuantity.js')
const defenseQuality = require('./defenseQuality.js')
const notes = require('./notes.js')
const coneCount = require('./coneCount.js')
const cubeCount = require('./cubeCount.js')
const climberSucsess = require('./climberSucsess')
const climberSucsessAuto = require('./climberSucsessAuto')
const averageScore = require('./averageScore.js')
const cubeCountAuto = require('./cubeCountAuto.js')
const coneCountAuto = require('./coneCountAuto.js')



// const { i } = require('mathjs')


//2022cc_qm3_2	


class overview extends BaseAnalysis {
    static name = `overview`

    constructor(db, team) {
        super(db)
        this.team = team
        this.teamKey = "ftc" + team
        // this.notes = []
        // this.scoresOverTime = []
        // this.defenseQuantity = 0
        // this.defenseQuality = 0
        // this.ballCount = 0
        // this.autoCount = 0
        this.defenseQuality
    }
    async getData()
    {
        let a = this
        return new Promise(async(resolve, reject) =>
        {
            
            //why does await not work when it works in  bestAverageForMetric
            let metrics = {}
            // console.log(result)

            var defenseFreq = new defenseAmmount(a.db, a.team)
                await defenseFreq.runAnalysis()
                metrics.defenseQuantity = defenseFreq.finalizeResults().result

            var defenseQaul = new defenseQuality(a.db, a.team)
                await defenseQaul.runAnalysis()
                metrics.defenseQuality = defenseQaul.finalizeResults().result

           
            

            var scores = new averageScore(a.db, a.team)
                await scores.runAnalysis()
                metrics.arrayScores = scores.finalizeResults().result
            
            
            var note = new notes(a.db, a.team)
                await note.runAnalysis()
                metrics.notes = note.finalizeResults().result
            var cones = new coneCount(a.db, a.team)
                await cones.runAnalysis()
                metrics.coneCount = cones.finalizeResults().result
            var cubes = new cubeCount(a.db, a.team)
                await cubes.runAnalysis()
                metrics.cubeCount = cubes.finalizeResults().result
            var climber = new climberSucsess(a.db, a.team)
                await climber.runAnalysis()
                metrics.climberOff = climber.finalizeResults().off
                metrics.climberTipped = climber.finalizeResults().tipped
                metrics.climberSucsess = climber.finalizeResults().level

             var climber = new climberSucsessAuto(a.db, a.team)
                await climber.runAnalysis()
                metrics.climberOff = climber.finalizeResults().off
                metrics.climberTipped = climber.finalizeResults().tipped
                metrics.climberSucsess = climber.finalizeResults().level
            var cubeAuto = new cubeCountAuto(a.db, a.team)
                await cubeAuto.runAnalysis()
                metrics.cubeCountAuto = cubeAuto.finalizeResults().result
            var coneAuto = new coneCountAuto(a.db, a.team)
                await coneAuto.runAnalysis()
                metrics.coneCountAuto = coneAuto.finalizeResults().result
            resolve({metrics, notes: notesOutput})
        })
    }
    runAnalysis()
    {
        let a = this
        return new Promise(async (resolve, reject) =>
        {
            a.getData()
                .then((data) => {
                    a.result = data;
                    resolve("done");
                })
                .catch((err) => {
                    if (err) {
                        reject(err);
                        return err;
                    }
                });
        })
        
    }
    finalizeResults()
    {
        return { 
            "result": this.result,
            "team": this.team
        }
    }
}
module.exports = overview