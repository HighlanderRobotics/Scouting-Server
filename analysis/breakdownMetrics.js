const BaseAnalysis = require('./BaseAnalysis.js')
const Manager = require('../manager/dbmanager.js')


const climberSucsess = require('./teleop/climber/climberSucsess')
const climberSucsessAuto = require('./auto/climb/climberSucsessAuto')
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
            metrics.climberFailed = climber.finalizeResults().failed
            metrics.climberTipped = climber.finalizeResults().tipped
            metrics.climberSucsess = climber.finalizeResults().level
            metrics.noClimb = climber.finalizeResults().noClimb

            var climberAuto = new climberSucsessAuto(a.db, a.team)
            await climberAuto.runAnalysis()
            metrics.climberFailedAuto = climberAuto.finalizeResults().failed
            metrics.climberTippedAuto = climberAuto.finalizeResults().tipped
            metrics.climberSucsessAuto = climberAuto.finalizeResults().level
            metrics.noClimbAuto = climberAuto.finalizeResults().noClimb

            var role = new robotRole(a.db, a.team)
            await role.runAnalysis()
            metrics.defenseRole = role.defense
            metrics.offenseRole = role.offense
            metrics.mixedRole = role.mixed
            metrics.feeder = role.helper
          

          

            resolve({ metrics})
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
            "result": {
                "role": {
                    "feeder": this.result.metrics.feeder,
                    "defense" : this.result.metrics.defenseRole,
                    "offense" : this.result.metrics.offenseRole,
                    "mixed" : this.result.metrics.mixedRole
                },
                "climberAuto":
                {
                    "off" : this.result.metrics.noClimbAuto,
                    "failed" : this.result.metrics.climberFailedAuto,
                    "docked" : this.result.metrics.climberTippedAuto,
                    "engaged" : this.result.metrics.climberSucsessAuto,

                },
                "climber":
                {
                    "off" : this.result.metrics.noClimb,
                    "failed" : this.result.metrics.climberFailed,
                    "docked" : this.result.metrics.climberTipped,
                    "engaged" : this.result.metrics.climberSucsess,

                }
            },
            "team": this.team
        }
    }

}
module.exports = breakdownMetrics