const BaseAnalysis = require('./BaseAnalysis.js')
const Manager = require('../manager/dbmanager.js')
const autoPaths = require('./auto/cargo/autoPaths.js')
const cargoCount = require('./teleop/cargo/cargoCount.js')
const averageScore = require('./general/averageScore')
const cargoCountAuto = require('./auto/cargo/cargoCountAuto.js')
const cycling = require('./teleop/cargo/cycling.js')
const defense = require('./defense/defenseEvent.js')
const averageScoreOverview = require('./general/averageScoreOverview.js')



// const { i } = require('mathjs')


//2022cc_qm3_2	


class categoryMetrics extends BaseAnalysis {
    static name = `categoryMetrics`

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
     



            var autoScore = new averageScore(a.db, a.team, 0)
            await autoScore.runAnalysis()
            metrics.avgAutoScore = autoScore.finalizeResults().result

            var teleScore = new averageScore(a.db, a.team, 1)
            await teleScore.runAnalysis()
            metrics.avgTeleScore = teleScore.finalizeResults().result

            metrics.avgScore = metrics.avgTeleScore + metrics.avgTeleScore

            var cones = new cargoCount(a.db, a.team, 1, 2)
            await cones.runAnalysis()
            metrics.coneCount = cones.finalizeResults().result
            metrics.coneMax = cones.finalizeResults().max

            var cubes = new cargoCount(a.db, a.team, 0, 2)
            await cubes.runAnalysis()
            metrics.cubeCount = cubes.finalizeResults().result
            metrics.cubeMax = cubes.finalizeResults().max
           
            var cubeAuto = new cargoCountAuto(a.db, a.team, 0)
            await cubeAuto.runAnalysis()
            metrics.cubeCountAuto = cubeAuto.finalizeResults().result

            var coneAuto = new cargoCountAuto(a.db, a.team, 1)
            await coneAuto.runAnalysis()
            metrics.coneCountAuto = coneAuto.finalizeResults().result
        
            var cycleCubeTeam = new cycling(a.db, a.team, 0, 4)
            await cycleCubeTeam.runAnalysis()
            metrics.cycleCubeTeam = cycleCubeTeam.result

            var cycleConeTeam = new cycling(a.db, a.team, 1, 4)
            await cycleConeTeam.runAnalysis()
            metrics.cycleConeTeam = cycleConeTeam.result

            var cycleConeScore = new cycling(a.db, a.team, 1, 2)
            await cycleConeScore.runAnalysis()
            metrics.cycleConeScore = cycleConeScore.result

            var cycleCubeScore = new cycling(a.db, a.team, 0, 2)
            await cycleCubeScore.runAnalysis()
            metrics.cycleCubeScore = cycleCubeScore.result

            var defneseMetric = new defense(a.db, a.team)
            await defneseMetric.runAnalysis()
            metrics.defenseTime = defneseMetric.result

            var cyclingCountCube = new cargoCount(a.db, a.team, 0, 4)
            await cyclingCountCube.runAnalysis()
            var cyclingCountCone = new cargoCount(a.db, a.team, 1, 4)
            await cyclingCountCone.runAnalysis()
            metrics.cyclingCount =(cyclingCountCone.result + cyclingCountCube.result)/2

         
            
          
// notes: notesOutput 
            resolve({metrics})
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
module.exports = categoryMetrics