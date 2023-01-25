const BaseAnalysis = require('./BaseAnalysis.js')
const Manager = require('../manager/dbmanager.js')
const role = require('./general/robotRole')
const averageScore = require('./general/averageScore.js')


// const { i } = require('mathjs')


//2022cc_qm3_2	


class alliancePage extends BaseAnalysis {
    static name = `alliancePage`

    constructor(db, teamOne, teamTwo, teamThree) {
        super(db)
        this.teamOne = teamOne
        this.teamTwo = teamTwo
        this.teamThree = teamThree
        this.oneRole = -1
        this.twoRole = -1
        this.threeRole = -1
        this.totalPoints = 0
        this.defenseQuality
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

            a.totalPoints = avgOneAuto.result + avgOneTele.result + avgTwoAuto.result + avgTwoTele.result + avgThreeAuto.result + avgThreeTele.result

            let role1 = new role(Manager.db, a.teamOne)
            await role1.runAnalysis()
            a.oneRole = role1.mainRole

            let role2 = new role(Manager.db, a.teamTwo)
            await role2.runAnalysis()
            a.twoRole = role2.mainRole

            let role3 = new role(Manager.db, a.teamThree)
            await role3.runAnalysis()
            a.threeRole = role3.mainRole


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
            "oneRole" : this.oneRole,
            "twoRole" : this.twoRole,
            "threeRole" : this.threeRole
        }
    }

}
module.exports = alliancePage