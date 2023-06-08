const BaseAnalysis = require('./BaseAnalysis.js')
const averageScorePicklist = require('./general/averageScore')
const levelCargo = require('./teleop/cargo/levelCargo')
const cargoOverview = require('./teleop/cargo/cargoCount')
const defense1 = require('./defense/defenseTeam')
const autoClimb = require('./auto/climb/climberSucsessAuto')
const avgAutoCargo = require('./general/averageScore')
const teamAvgTotal = require('./general/totalScoreTeamPicklist')
const climberSucsessPicklist = require('./teleop/climber/climberSucsess')
const driverAbility = require('./general/driverAblilityTeam')

class picklist extends BaseAnalysis {
    static name = `picklist`

    constructor(db, team, coneOneScore, coneTwoScore, coneThreeScore, cubeOneScore, cubeTwoScore, cubeThreeScore, autoCargo, teleOp, defense, climbAuto, feedCone, feedCube, avgTotal, teleopClimb, driverAbility, allAndArray) {
        super(db)
        this.team = team
        this.cubeOneScore = cubeOneScore
        this.cubeTwoScore = cubeTwoScore
        this.cubeThreeScore = cubeThreeScore
        this.autoCargo = autoCargo
        this.teleOp = teleOp
        this.result = 0
        this.coneOneScore = coneOneScore
        this.coneTwoScore = coneTwoScore
        this.coneThreeScore = coneThreeScore
        this.defense = defense
        this.climbAuto = climbAuto
        this.array = []
        this.feedingCone = feedCone
        this.feedingCube = feedCube
        this.avgTotal = avgTotal
        this.teleopClimb = teleopClimb
        this.driverAbility = driverAbility
        this.allAndArray = allAndArray

        this.unadjustedZScores = []

    }
   

    async runAnalysis() {
        let a = this
                let arr = []
                let unAdj = []
                // var cone = new cargoCountOverview(a.db, a.team, 1, 2)
                // await cone.runAnalysis()
                // sum += cone.finalizeResults().zScore * a.coneOneScore
                // var cube = new cargoCountOverview(a.db, a.team, 0, 2)
                // await cube.runAnalysis()
                // sum += cube.finalizeResults().zScore * a.cubeScore



                var avgScore = new averageScorePicklist(a.db, a.team, 1)
                await avgScore.runAnalysis()
                let z1 = (avgScore.average - a.allAndArray.avgScore.allAvg)/a.allAndArray.avgScore.arraySTD
                if(isNaN(z1)){z1 = 0}
                arr.push({"result" : z1 * a.teleOp, "type" : "teleopScore"})
                unAdj.push({"result" : z1, "type" : "teleopScore"})


                var coneOne = new levelCargo(a.db, a.team, 1, 1)
                await coneOne.runAnalysis()
                let z2 = (coneOne.average - a.allAndArray.coneOne.allAvg)/a.allAndArray.coneOne.arraySTD
                if(isNaN(z2)){z2 = 0}
                arr.push({"result": z2 * a.coneOneScore, "type": "coneOneScore"})
                unAdj.push({"result" : z2, "type" : "coneOneScore"})


                var coneTwo = new levelCargo(a.db, a.team, 1, 2)
                await coneTwo.runAnalysis()
                let z3 = (coneTwo.average - a.allAndArray.coneTwo.allAvg)/a.allAndArray.coneTwo.arraySTD
                if(isNaN(z3)){z3 = 0}
                arr.push({"result" :z3 * a.coneTwoScore, "type" : "coneTwoScore"})
                unAdj.push({"result" :z3, "type" : "coneTwoScore"})



                var coneThree = new levelCargo(a.db, a.team, 1, 3)
                await coneThree.runAnalysis()
                let z4 = (coneThree.average - a.allAndArray.coneThree.allAvg)/a.allAndArray.coneThree.arraySTD
                if(isNaN(z4)){z4 = 0}
                arr.push({"result": z4 * a.coneThreeScore, "type": "coneThreeScore"})
                unAdj.push({"result": z4, "type": "coneThreeScore"})



                var cubeOne = new levelCargo(a.db, a.team, 0, 1)
                await cubeOne.runAnalysis()
                let z5 = (cubeOne.average- a.allAndArray.cubeOne.allAvg)/a.allAndArray.cubeOne.arraySTD
                if(isNaN(z5)){z5 = 0}
                arr.push({"result": z5 * a.cubeOneScore, "type": "cubeOneScore"})
                unAdj.push({"result": cubeOne.zScore, "type": "cubeOneScore"})


                var cubeTwo = new levelCargo(a.db, a.team, 0, 2)
                await cubeTwo.runAnalysis()
                let z6 = (cubeTwo.average - a.allAndArray.cubeTwo.allAvg)/a.allAndArray.cubeTwo.arraySTD
                if(isNaN(z6)){z6 = 0}
                arr.push({"result": z6 * a.cubeTwoScore, "type": "cubeTwoScore"})
                unAdj.push({"result": z6, "type": "cubeTwoScore"})



                var cubeThree = new levelCargo(a.db, a.team, 0, 3)
                await cubeThree.runAnalysis()
                let z7 = (cubeThree.average - a.allAndArray.cubeThree.allAvg)/a.allAndArray.cubeThree.arraySTD
                if(isNaN(z7)){z7 = 0}
                arr.push({"result": z7 * a.cubeThreeScore, "type": "cubeThreeScore"})
                unAdj.push({"result": z7, "type": "cubeThreeScore"})



                var defense = new defense1(a.db, a.team)
                await defense.runAnalysis()
                let z8 = (defense.average - a.allAndArray.defense.allAvg)/a.allAndArray.defense.arraySTD
                if(isNaN(z8)){z8 = 0}
                arr.push({"result": z8 * a.defense, "type": "defenseScore"})
                unAdj.push({"result": z8, "type": "defenseScore"})


                var climberAuto = new autoClimb(a.db, a.team)
                await climberAuto.runAnalysis()
                let z9 = ( ((climberAuto.level + 1)/(climberAuto.totalAttempted + 3) * 10) + ((climberAuto.tipped + 1)/(climberAuto.totalAttempted + 3) * 6) - a.allAndArray.climberAuto.allAvg)/a.allAndArray.climberAuto.arraySTD
                if(isNaN(z9)){z9 = 0}
                arr.push({"result": z9 * a.climbAuto, "type": "autoClimb"})
                unAdj.push({"result": z9, "type": "autoClimb"})


                var autoCargo1 = new avgAutoCargo(a.db, a.team)
                autoCargo1.cargo = 1
                await autoCargo1.runAnalysis()
                let z10 = (autoCargo1.average - a.allAndArray.autoCargo1.allAvg)/a.allAndArray.autoCargo1.arraySTD
                if(isNaN(z10)){z10 = 0}
                arr.push({"result": z10 * a.autoCargo, "type": "autoCargo"})
                unAdj.push({"result": z10, "type": "autoCargo"})


                var feedCone = new cargoOverview(a.db, a.team, 1, 4)
                await feedCone.runAnalysis()
                let z11 = (feedCone.average - a.allAndArray.feedCone.allAvg)/a.allAndArray.feedCone.arraySTD
                if(isNaN(z11)){z11 = 0}
                arr.push({"result": z11 * a.feedingCone, "type": "feedCone"})
                unAdj.push({"result": z11, "type": "feedCone"})



                var feedCube = new cargoOverview(a.db, a.team, 0, 4)
                await feedCube.runAnalysis()
                let z12 = (feedCube.average - a.allAndArray.feedCube.allAvg)/a.allAndArray.feedCube.arraySTD
                if(isNaN(z12)){z12 = 0}
                arr.push({"result": z12 * a.feedingCube, "type": "feedCube"})
                unAdj.push({"result": z12, "type": "feedCube"})


                var score = new teamAvgTotal(a.db, a.team)
                await score.runAnalysis()
                let z13 = (score.average - a.allAndArray.score.allAvg)/a.allAndArray.score.arraySTD
                if(isNaN(z13)){z13 = 0}
                arr.push({"result": z13 * a.avgTotal, "type": "avgTotal"})
                unAdj.push({"result": z13, "type": "avgTotal"})


                var teleClimb = new climberSucsessPicklist(a.db, a.team)
                await teleClimb.runAnalysis()
                let z14 = ( ((teleClimb.level + 1)/(teleClimb.totalAttempted + 3) * 10) + ((teleClimb.tipped + 1)/(teleClimb.totalAttempted + 3) * 6) - a.allAndArray.teleClimb.allAvg)/a.allAndArray.teleClimb.arraySTD
                if(isNaN(z14)){z14 = 0}
                arr.push({"result": z14 * a.teleopClimb, "type": "teleopClimb"})
                unAdj.push({"result": z14, "type": "teleopClimb"})


                var driveAbility = new driverAbility(a.db, a.team)
                await driveAbility.runAnalysis()
                let z15 = (driveAbility.average - a.allAndArray.driveAbility.allAvg)/a.allAndArray.driveAbility.arraySTD
                if(isNaN(z15)){z15 = 0}
                arr.push({"result" : z15 * a.driverAbility, "type" : "driverAbility"})
                unAdj.push({"result" : z15, "type" : "driverAbility"})
                



            a.unadjustedZScores = unAdj
            a.array = arr
            a.result = arr.reduce((partialSum, a) => partialSum + a.result, 0)



    }
    finalizeResults() {
        return {
            "result": this.result,
            "array" : this.array,
            "unadjusted" : this.unadjustedZScores
        }
    }

}
module.exports = picklist
