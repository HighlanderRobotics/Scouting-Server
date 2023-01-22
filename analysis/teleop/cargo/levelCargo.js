const math = require('mathjs')
const BaseAnalysis = require('../../BaseAnalysis.js')
// const Manager = require('./manager/dbmanager.js')

class levelCargo extends BaseAnalysis {
    static name = `levelCargo`

    constructor(db, team, type, location) {
        super(db)
        this.team = team
        this.teamKey = "frc" + team
        // this.start = start
        // this.end = end
        this.location = location
        this.type = type
        this.result = 0

    }
    async getAccuracy() {
        let a = this
        return new Promise(async function (resolve, reject) {

            var sql = `SELECT scoutReport, newMatches.key AS key
                FROM data
            JOIN (SELECT matches.key AS key
                FROM matches 
                JOIN teams ON teams.key = matches.teamKey
                WHERE teams.teamNumber = ?) AS  newMatches ON  data.matchKey = newMatches.key
          `;
            let len = 0
            let makes = 0
            let object = false
            a.db.all(sql, [a.team], (err, rows) => {
                if (err) {
                    console.log(err)
                }

                if (rows != undefined) {

                    rows.forEach(functionAdder);
                    function functionAdder(row, index, array) {
                        let curr = JSON.parse(row.scoutReport).events
                        for (var i = 0; i < curr.length; i++) {
                            let subArr = curr[i]

                            if(subArr[1] === a.type)
                            {                   

                                object = true
                            }
                            if (subArr[1] === 2 && object == true) {
                                let temp = Math.ceil(subArr[2]/3)
                                if(temp === a.location )
                                {
                                    makes++
                                    object = false
                                }
                             

                            }
                            else if (subArr[1] === 3 || subArr[1] === 4) {
                                object = false
                            }

                        }
                        len++
                    }

                }
                
                a.result = makes/len
              
                resolve("done")

            })

        })
            .catch((err) => {
                if (err) {
                    return err
                }
            })
            .then((data) => {
                return data
            })
    }

    runAnalysis() {
        return new Promise(async (resolve, reject) => {
            let a = this
            var temp = await a.getAccuracy().catch((err) => {
                if (err) {
                    return err
                }
            })
            // a.result = temp  
            resolve("done")
        })

    }
    finalizeResults() {
        return {
            "result": this.result,
            "team": this.team,
            
        }
        
    }

}
module.exports = levelCargo