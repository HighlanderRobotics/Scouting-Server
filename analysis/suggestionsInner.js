const BaseAnalysis = require('./BaseAnalysis.js')
const scores = require('./general/scoreForPreiction')
const alliance = require('./alliancePage')
const links = require('./general/links.js')
const Manager = require('../manager/Manager.js')
const cargoCountOverview = require('./teleop/cargo/cargoCountOverview.js')
const climberSucsess = require('./teleop/climber/climberSucsess.js')


// const math = require('mathjs')
// const { max } = require('mathjs')
// const e = require('cors')

class suggestionsInner extends BaseAnalysis {
    static name = `suggestionsInner`

    constructor(db, team1, team2, team3, matchType) {
        super(db)

        this.team1 = team1
        this.team2 = team2
        this.team3 = team3

        this.matchType = matchType

        this.alliance = {}
    }
    async getWinner() {
        let a = this
        return new Promise(async function (resolve, reject) {
            
            let climbPoints = 12

            //teleop
            var teleop = {}

            var linksOne = new links(Manager.db, a.team1)
            await linksOne.runAnalysis()
            var cargoOneCones = new cargoCountOverview(Manager.db,a.team1, 1, 2)
            await cargoOneCones.runAnalysis()
            var cargoOneCubes = new cargoCountOverview(Manager.db,a.team1, 0, 2)
            await cargoOneCubes.runAnalysis()
            
            var linksTwo = new links(Manager.db, a.team2)
            await linksTwo.runAnalysis()
            var cargoTwoCones = new cargoCountOverview(Manager.db,a.team2, 1, 2)
            await cargoTwoCones.runAnalysis()
            var cargoTwoCubes = new cargoCountOverview(Manager.db,a.team2, 0, 2)
            await cargoTwoCubes.runAnalysis()

            var linksThree = new links(Manager.db, a.team3)
            await linksThree.runAnalysis()
            var cargoThreeCones = new cargoCountOverview(Manager.db,a.team3, 1, 2)
            await cargoThreeCones.runAnalysis()
            var cargoThreeCubes = new cargoCountOverview(Manager.db,a.team3, 0, 2)
            await cargoThreeCubes.runAnalysis()

            var climbOne = new climberSucsess(Manager.db, a.team1)
            await climbOne.runAnalysis()

            var climbTwo = new climberSucsess(Manager.db, a.team2)
            await climbTwo.runAnalysis()

            var climbThree = new climberSucsess(Manager.db, a.team3)
            await climbThree.runAnalysis()


            var trippleLinks = linksOne.result + linksTwo.result + linksThree.result
            var arrayTeams = [{"team" : a.team1, "links" : linksOne.result, "max" : cargoOneCones.max, "levelOne" : cargoOneCones.one + cargoOneCubes.one, "levelTwo" : cargoOneCones.two + cargoOneCubes.two, "levelThree" : cargoOneCones.three + cargoOneCubes.three, "climbTele" : climbOne.adjustedPoints}, 
            {"team" : a.team2, "links" : linksTwo.result , "max" : cargoTwoCones.max, "levelOne" : cargoTwoCones.one + cargoTwoCubes.one, "levelTwo" : cargoTwoCones.two + cargoTwoCubes.two, "levelThree" : cargoTwoCones.three + cargoTwoCubes.three, "climbTele" : climbOne.adjustedPoints}, 
            {"team" : a.team3, "links" : linksThree.result, "max" : cargoThreeCones.max, "levelOne" : cargoThreeCones.one + cargoThreeCubes.one, "levelTwo" : cargoThreeCones.two + cargoThreeCubes.two, "levelThree" : cargoThreeCones.three + cargoThreeCubes.three, "climbTele" : climbOne.adjustedPoints}]
            arrayTeams = arrayTeams.sort(function(a, b) {
                return b.links - a.links;
              });
            let first = arrayTeams[0]
            let second = arrayTeams[1]
            let third = arrayTeams[2]
            let one = {"team" : first.team}
            let two = {"team" : second.team}
            let three = {"team" : third.team}
            
            if(trippleLinks >= 4 && trippleLinks < 2)
            {
                //triple offense zone
               
                one.role = 0
                two.role = 0
                three.role = 0

            }
            else
            {
                //2 offense, 1 defense
                one.role = 0
                two.role = 0
                three.role = 1
                
            }




            //end game
            let endGame = {}
            endGame.first = arrayTeams[2].team
            if (a.matchType === "qm")
            {
                let arrayClimb = arrayTeams.sort(function(a, b) {
                    return b.climbTele - a.climbTele;
                  });
                console.log(arrayClimb)
                if(arrayClimb[0].climbTele + arrayClimb[1].climbTele + climbPoints >=23)
                {
                    //climbNumber = how many should climb
                    endGame.climbNumber = 2
                    endGame.teamsClimbing = [arrayClimb[0].team, arrayClimb[1].team]
                }
                else
                {
                    endGame.climbNumber = 3
                    endGame.teamsClimbing = [arrayClimb[0].team, arrayClimb[1].team, arrayClimb[2].team]
                }
            }
            console.log(endGame)

            
        })


    }
   
   
    runAnalysis() {
        let a = this
        return new Promise(async (resolve, reject) => {
            await a.getWinner().catch((err) => {

            })
            // a.result = temp   
            resolve("done")
        })


    }
    
    finalizeResults() {
        return {
            "alliance" : this.alliance
        }
    }
}
    
module.exports = suggestionsInner