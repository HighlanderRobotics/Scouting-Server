const BaseAnalysis = require('./BaseAnalysis.js')
const trend = require('./trend.js')
const penalty = require('./general/penalties.js')
const role = require('./general/robotRole.js')
const rank = require('../manager/getRankOfTeam.js')
const TaskManager = require('../TaskManager.js')
const math = require('mathjs')

class flag extends BaseAnalysis {
    static name = `flag`

    constructor(db, team, type) {
        super(db)
        this.team = team
        this.result = this.result
        this.type = type
    }
    async getFlag() {
        let a = this    
        if (a.type === "trend")
        {
            let temp = new trend(a.db, a.team)
            await temp.runAnalysis()
            this.result = temp.finalizeResults().result
        }
        else if (a.type === "penalty")
        {
            let temp = new penalty(a.db, a.team)
            await temp.runAnalysis()
            if(temp.finalizeResults().result === 0)
            {
                this.result = 0
            }
            else
            {
                this.result = temp.finalizeResults().matches[temp.finalizeResults().matches.length -1].cardType
            }
        }
        else if (a.type === "mainRole")
        {
            let temp = new role(a.db, a.team)
            await temp.runAnalysis()
            this.result = temp.finalizeResults().mainRole
        }
        // else if (type === "ranking")
        // {
            
        //     this.result = await new rank().runTask()
        // }
        else{
           this.result = await new TaskManager().runTasks([{'name': this.type}])[0].result
        //    console.log(await new TaskManager().runTasks([{'name': this.type}]))
           resolve()
        
        }

    }



    runAnalysis() {
        let a = this
        return new Promise(async (resolve, reject) => {
            await a.getFlag().catch((err) => {

            })
            resolve("done")
        })


    }

    finalizeResults() {
        return {
            "team": this.team,
            "result": this.result
        }
    }
}

module.exports = flag