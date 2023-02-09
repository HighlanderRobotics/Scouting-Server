const BaseAnalysis = require('./BaseAnalysis.js')
const Manager = require('../manager/dbmanager.js')
const role = require('./general/robotRole')
const averageScore = require('./general/averageScore.js')
const autoPaths = require('./auto/cargo/autoPaths')
const levelCargo = require('./teleop/cargo/levelCargo')


// const { i } = require('mathjs')


//2022cc_qm3_2	


class alliancePage extends BaseAnalysis {
    static name = `alliancePage`

    constructor(db, teamOne, teamTwo, teamThree) {
        super(db)
        this.teamOne = teamOne
        this.teamTwo = teamTwo
        this.teamThree = teamThree
        this.totalPoints = 0
        this.one = {}
        this.two = {}
        this.three = {}
    }
    async getData() {
        let a = this

            let metrics = {}
            let avgOneAuto = new averageScore(Manager.db, a.teamOne, 0)
            await avgOneAuto.runAnalysis()
            let avgOneTele = new averageScore(Manager.db, a.teamOne, 1)
            await avgOneTele.runAnalysis()

            let avgTwoAuto = new averageScore(Manager.db, a.teamTwo, 0)
            await avgTwoAuto.runAnalysis()
            let avgTwoTele = new averageScore(Manager.db, a.teamTwo, 1)
            await avgTwoTele.runAnalysis()

            let avgThreeAuto = new averageScore(Manager.db, a.teamThree, 0)
            await avgThreeAuto.runAnalysis()
            let avgThreeTele = new averageScore(Manager.db, a.teamThree, 1)
            await avgThreeTele.runAnalysis()

            a.totalPoints = avgOneAuto.average + avgOneTele.average + avgTwoAuto.average + avgTwoTele.average + avgThreeAuto.average + avgThreeTele.average

            let role1 = new role(Manager.db, a.teamOne)
            await role1.runAnalysis()

            let role2 = new role(Manager.db, a.teamTwo)
            await role2.runAnalysis()

            let role3 = new role(Manager.db, a.teamThree)
            await role3.runAnalysis()

            let autoPathOne = new autoPaths(Manager.db, a.teamOne)
            await autoPathOne.runAnalysis()

            let autoPathTwo = new autoPaths(Manager.db, a.teamTwo)
            await autoPathTwo.runAnalysis()

            let autoPathThree = new autoPaths(Manager.db, a.teamThree)
            await autoPathThree.runAnalysis()

            let levelArr = [0, 0, 0]
            let teamArr = [a.teamOne, a.teamTwo, a.teamThree]
            for(let i = 0; i < teamArr.length; i ++)
            {
                for(let j = 1; j < 4; j ++)
                {
                    let temp = new levelCargo(Manager.db, teamArr[i], 1, j)
                    await temp.runAnalysis()
                    let temp2 = new levelCargo(Manager.db, teamArr[i], 0, j)
                    await temp2.runAnalysis()
                    levelArr[j-1] += temp2.result + temp.result

                }
            }

           a.autoPaths = [{"role" : role1.mainRole, "paths" : autoPathOne.finalizeResults().paths},
            {"role" : role2.mainRole, "paths" : autoPathTwo.finalizeResults().paths},
            {"role" : role3.mainRole, "paths" : autoPathThree.finalizeResults().paths}]
            a.levels = levelArr





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
            "totalPoints": this.totalPoints,
            "autoPaths" : this.autoPaths,
            "levelCargo" : this.levels,
            "autoThree" : this.autoThree
        }
    }

}
module.exports = alliancePage