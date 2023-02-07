const BaseAnalysis = require('./BaseAnalysis.js')
const Manager = require('../manager/dbmanager.js')
const role = require('./general/robotRole')
const averageScore = require('./general/averageScore.js')
const autoPaths = require('./auto/cargo/autoPaths')


// const { i } = require('mathjs')


//2022cc_qm3_2	


class alliancePage extends BaseAnalysis {
    static name = `alliancePage`

    constructor(db, teamOne, teamTwo, teamThree) {
        super(db)
        this.teamOne = teamOne
        this.teamTwo = teamTwo
        this.teamThree = teamThree
        this.oneRole = null
        this.twoRole = null
        this.threeRole =null
        this.totalPoints = 0
        this.autoOne = []
        this.autoTwo = []
        this.autoThree = []
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
            a.oneRole = role1.mainRole

            let role2 = new role(Manager.db, a.teamTwo)
            await role2.runAnalysis()
            a.twoRole = role2.mainRole

            let role3 = new role(Manager.db, a.teamThree)
            await role3.runAnalysis()
            a.threeRole = role3.mainRole

            let autoPathOne = new autoPaths(Manager.db, a.teamOne)
            await autoPathOne.runAnalysis()
            a.autoOne = autoPathOne.paths

            let autoPathTwo = new autoPaths(Manager.db, a.teamTwo)
            await autoPathTwo.runAnalysis()
            a.autoTwo = autoPathTwo.paths

            let autoPathThree = new autoPaths(Manager.db, a.teamThree)
            await autoPathThree.runAnalysis()
            a.autoThree = autoPathThree.paths


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
            "threeRole" : this.threeRole,
            "autoOne" : this.autoOne,
            "autoTwo" : this.autoTwo,
            "autoThree" : this.autoThree
        }
    }

}
module.exports = alliancePage