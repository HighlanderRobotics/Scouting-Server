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
const climberSucsess = require('./climberSucsess.js')
const climberMax = require('./climberMax.js')
const cargoCount = require('./cargoCount.js')
const cargoAccuracy = require('./cargoAccuracy.js')
const averageScore = require('./averageScore.js')

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
            let result = {}
            // console.log(result)

            var defenseFreq = new defenseAmmount(a.db, a.team)
                await defenseFreq.runAnalysis()
                result.defenseQuantity = defenseFreq.finalizeResults()

            var defenseQaul = new defenseQuality(a.db, a.team)
                await defenseQaul.runAnalysis()
                result.defenseQuality = defenseQaul.finalizeResults()
            var note = new notes(a.db, a.team)
                await note.runAnalysis()
                result.notes = note.finalizeResults()
            var accuracy = new cargoAccuracy(a.db, a.team)
                await accuracy.runAnalysis()
                result.cargoAccuracy = accuracy.finalizeResults()
            var ballCount = new cargoCount(a.db, a.team)
                await ballCount.runAnalysis()
                result.averageCount = ballCount.finalizeResults()
            var climber = new climberMax(a.db, a.team)

                await climber.runAnalysis()

                result.climberHighest = climber.finalizeResults()
            var climberS = new climberSucsess(a.db, a.team)
                await climberS.runAnalysis()
                result.climberSucsesses = climberS.finalizeResults()

            var scores = new averageScore(a.db, a.team)
                await scores.runAnalysis()
                result.arrayScores = scores.finalizeResults()


            resolve(result)
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