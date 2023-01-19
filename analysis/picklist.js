const BaseAnalysis = require('./BaseAnalysis.js')
const cargoCountOverview = require('./teleop/cargo/cargoCountOverview')
const averageScoreOverview = require('./general/averageScoreOverview')



class picklist extends BaseAnalysis {
    static name = `picklist`

    constructor(db, team, coneScore, cubeScore, auto, teleOp) {
        super(db)
        this.team = team
        this.coneScore = coneScore
        this.cubeScore = cubeScore
        this.auto = auto
        this.teleOp = teleOp
        this.result = 0

    }
    async getPicklist() {

        //state machine for different metrics
        //loop through all teams once: find deviation from mean (use the difference file)
        //after loop get average deviation
        //then loop through again: get z-score and put into converter methodd from stack overflow (that teams devation/standard devation [caluclated above])
        //repeat for all metrics, and put coefficents
        //rank and return        
    }


    async runAnalysis() {
        let a = this
        
                let sum = 0
                var cone = new cargoCountOverview(a.db, a.team, 1, 2)
                await cone.runAnalysis()
                sum += cone.finalizeResults().zScore * a.coneScore
                var cube = new cargoCountOverview(a.db, a.team, 0, 2)
                await cube.runAnalysis()
                sum += cube.finalizeResults().zScore * a.cubeScore
                var avgScore = new averageScoreOverview(a.db, a.team)
                await avgScore.runAnalysis()
                sum += avgScore.zScoreAuto * a.auto
                sum += avgScore.zScoreTeleop * a.teleOp
            this.result = sum
        

    }
    finalizeResults() {
        return {
            "result": this.result
        }
    }

}
module.exports = picklist
