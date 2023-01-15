const BaseAnalysis = require('./BaseAnalysis.js')
const Manager = require('../manager/dbmanager.js')
// const AverageForMetric = require('./analysis/AverageForMetric.js')
// const TeamsInTournament = require('./analysis/TeamsInTournament.js')
// const BestAverageForMetric = require('./analysis/BestAverageForMetric.js')
// const Overveiw = require('./overview.js')
// const FullyScouted = require('./analysis/fullyScouted.js')
// const defenseAmmount = require('./defenseQuantity.js')
// const defenseQuality = require('./defenseQuality.js')

const climberSucsess = require('./teleop/climber/climberSucsess')
const robotRole = require('./general/robotRole')




// const { i } = require('mathjs')


//2022cc_qm3_2	


class breakdownMetrics extends BaseAnalysis {
    static name = `breakdownMetrics`

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
    async getData() {
        let a = this

        return new Promise(async (resolve, reject) => {

            //why does await not work when it works in  bestAverageForMetric
            let metrics = {}
            // console.log(result)

            // var defenseFreq = new defenseAmmount(a.db, a.team)
            //     await defenseFreq.runAnalysis()
            //     metrics.defenseQuantity = defenseFreq.finalizeResults().result

            // var defenseQaul = new defenseQuality(a.db, a.team)
            //     await defenseQaul.runAnalysis()
            //     metrics.defenseQuality = defenseQaul.finalizeResults().result




           

          
            var climber = new climberSucsess(a.db, a.team)
            await climber.runAnalysis()
            metrics.climberOff = climber.finalizeResults().failed
            metrics.climberTipped = climber.finalizeResults().tipped
            metrics.climberSucsess = climber.finalizeResults().level
            metrics.noClimb = climber.finalizeResults().noClimb

            var climberAuto = new climberSucsessAuto(a.db, a.team)
            await climberAuto.runAnalysis()
            metrics.climberOff = climbclimberAutor.finalizeResults().failed
            metrics.climberTipped = climberAuto.finalizeResults().tipped
            metrics.climberSucsess = climberAuto.finalizeResults().level
            metrics.noClimb = climberAuto.finalizeResults().noClimb

            var role = new robotRole(a.db, a.team)
            await role.runAnalysis()
            metrics.defenseRole = role.defense
            metrics.offenseRole = role.offense
            metrics.mixedRole = role.mixed
            metrics.feeder = role.feeder
          

          

            resolve({ metrics, notes: notesOutput })
        })
    }

    runAnalysis() {
        let a = this
        return new Promise(async (resolve, reject) => {
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
    finalizeResults() {
        return {
            "result": this.result,
            "team": this.team
        }
    }

}
module.exports = breakdownMetrics