const BaseAnalysis = require('./BaseAnalysis.js')
// const Manager = require('./manager/dbmanager.js')

class cargoAccuracyAll extends BaseAnalysis {
    static name = `cargoAccuracyAll`

    constructor(db) {
        super(db)
        // this.team = team
        // this.teamKey = "frc" + team
        // this.start = start
        // this.end = end
        this.result
        
    }
    async getAccuracy()
    {
        let a = this
        return new Promise(async function(resolve, reject)
        {

                var sql = `SELECT scoutReport
                FROM data
            JOIN (SELECT matches.key
                FROM matches 
                JOIN teams ON teams.key = matches.teamKey) AS  newMatches ON  data.matchKey = newMatches.key
          `;
                a.db.all(sql, [], (err, rows) =>
                {
                    if(err)
                    {
                        console.log(err)
                    }
                    let len = 0
                    let makes = 0
                    rows.forEach(functionAdder);
                    function functionAdder(row, index, array){
                        let curr = JSON.parse(row.scoutReport).events
                        for(var i = 0; i < curr.length; i++) {
                            let subArr = curr[i]
                            if(subArr[1] === 1)
                            {
                                len++
                            }
                            if (subArr[1] === 0) {
                              makes++
                              len++
                            }
                        }
                    }
                    // console.log(makes/len)

                    resolve(makes/len)                
                })
                   
                })
                .catch((err) => {
                    if (err) {
                        return err
                    }
                })
                .then((data) => {
                    // console.log(data)
                    return data
                })
        }
    
        runAnalysis()
        {
            return new Promise(async (resolve, reject) =>
            {
                let a = this
                var temp = await a.getAccuracy().catch((err) => {
                    if (err) {
                        return err
                    }
                })  
                a.result = temp  
                resolve("done")        
            })
            
        }
        finalizeResults()
        {
            return { 
                "result": this.result,
                // "team": this.team
            }
        }

}
module.exports = cargoAccuracyAll
