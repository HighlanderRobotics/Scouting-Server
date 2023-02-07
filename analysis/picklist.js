const BaseAnalysis = require('./BaseAnalysis.js')
const averageScoreOverview = require('./general/averageScoreOverview')
const levelCargo = require('./teleop/cargo/levelPicklist')
const defense1 = require('./defense/defenseOverview')
const autoClimb = require('./auto/climb/climberSucsessAutoDifference')
const avgAutoCargo = require('./general/avgAutoCargo')

class picklist extends BaseAnalysis {
    static name = `picklist`

    constructor(db, team, coneOneScore, coneTwoScore, coneThreeScore, cubeOneScore, cubeTwoScore, cubeThreeScore, autoCargo, teleOp, defense, climbAuto) {
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

    }
   

    async runAnalysis() {
        let a = this
                let arr = []
                // var cone = new cargoCountOverview(a.db, a.team, 1, 2)
                // await cone.runAnalysis()
                // sum += cone.finalizeResults().zScore * a.coneOneScore
                // console.log(a.coneScore)
                // var cube = new cargoCountOverview(a.db, a.team, 0, 2)
                // await cube.runAnalysis()
                // sum += cube.finalizeResults().zScore * a.cubeScore
                var avgScore = new averageScoreOverview(a.db, a.team)
                await avgScore.runAnalysis()
                arr.push({"result" : avgScore.zScore * a.teleOp, "type" : "averageScore"})

                var coneOne = new levelCargo(a.db, a.team, 1, 1)
                await coneOne.runAnalysis()
                arr.push({"result": coneOne.zScore * a.coneOneScore, "type": "coneOne"})

                var coneTwo = new levelCargo(a.db, a.team, 1, 2)
                await coneTwo.runAnalysis()
                arr.push({"result" :coneTwo.zScore * a.coneTwoScore, "type" : "coneTwo"})


                var coneThree = new levelCargo(a.db, a.team, 1, 3)
                await coneThree.runAnalysis()
                arr.push({"result": coneThree.zScore * a.coneThreeScore, "type": "coneThree"})


                var cubeOne = new levelCargo(a.db, a.team, 0, 1)
                await cubeOne.runAnalysis()
                arr.push({"result": cubeOne.zScore * a.cubeOneScore, "type": "cubeOne"})


                var cubeTwo = new levelCargo(a.db, a.team, 0, 2)
                await cubeTwo.runAnalysis()
                arr.push({"result": cubeTwo.zScore * a.cubeTwoScore, "type": "cubeTwo"})


                var cubeThree = new levelCargo(a.db, a.team, 0, 3)
                await cubeThree.runAnalysis()
                arr.push({"result": cubeThree.zScore * a.cubeThreeScore, "type": "cubeThree"})


                var defense = new defense1(a.db, a.team)
                await defense.runAnalysis()
                arr.push({"result": defense.zScore * a.defense, "type": "defense"})


                var climberAuto = new autoClimb(a.db, a.team)
                await climberAuto.runAnalysis()
                arr.push({"result": climberAuto.zScore * a.climbAuto, "type": "climbAuto"})

                var autoCargo1 = new avgAutoCargo(a.db, a.team)
                await autoCargo1.runAnalysis()
                arr.push({"result": autoCargo1.zScore * a.autoCargo, "type": "autoCargo"})


            a.array = arr
            a.result = arr.reduce((partialSum, a) => partialSum + a.result, 0)

    }
    finalizeResults() {
        return {
            "result": this.result,
            "array" : this.array
        }
    }

}
module.exports = picklist
