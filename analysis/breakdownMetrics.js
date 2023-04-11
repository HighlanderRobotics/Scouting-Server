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

            let metrics = {}
          
            var climber = new climberSucsess(a.db, a.team)
            await climber.runAnalysis()
            metrics.climberFailed = climber.finalizeResults().failed
            metrics.climberTipped = climber.finalizeResults().tipped
            metrics.climberSucsess = climber.finalizeResults().level
            metrics.noClimb = climber.finalizeResults().noClimb
            metrics.climbArray = climber.finalizeResults().array


            var climberAuto = new climberSucsessAuto(a.db, a.team)
            await climberAuto.runAnalysis()
            metrics.climberFailedAuto = climberAuto.finalizeResults().failed
            metrics.climberTippedAuto = climberAuto.finalizeResults().tipped
            metrics.climberSucsessAuto = climberAuto.finalizeResults().level
            metrics.noClimbAuto = climberAuto.finalizeResults().noClimb
            metrics.climbAutoArray = climberAuto.finalizeResults().array

            var role = new robotRole(a.db, a.team)
            await role.runAnalysis()
            metrics.defenseRole = role.defense
            metrics.offenseRole = role.offense
            metrics.feeder = role.helper
            metrics.immobile = role.immobile
            metrics.mainRole = role.mainRole
            metrics.roleArray = role.finalizeResults().array
          

          

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
                    "immobile" : this.result.metrics.immobile,
                    "mainRole" : this.result.metrics.mainRole,
                    "array" : this.result.metrics.roleArray

                },
                "climberAuto":
                {
                    "off" : this.result.metrics.noClimbAuto,
                    "failed" : this.result.metrics.climberFailedAuto,
                    "docked" : this.result.metrics.climberTippedAuto,
                    "engaged" : this.result.metrics.climberSucsessAuto,
                    "array" : this.result.metrics.climberAutoArray

                },
                "climber":
                {
                    "off" : this.result.metrics.noClimb,
                    "failed" : this.result.metrics.climberFailed,
                    "docked" : this.result.metrics.climberTipped,
                    "engaged" : this.result.metrics.climberSucsess,
                    "array" : this.result.metrics.climbArray

                }
            },
            "team": this.team
        }
    }

}
module.exports = breakdownMetrics