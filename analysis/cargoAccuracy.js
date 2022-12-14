const BaseAnalysis = require('./BaseAnalysis.js')
// const Manager = require('./manager/dbmanager.js')

class cargoAccuracy extends BaseAnalysis {
    static name = `cargoAccuracy`

    constructor(db, team, start, end) {
        super(db)
        this.team = team
        this.teamKey = "frc" + team
        this.start = start
        this.end = end
        this.result = 0
        
    }
    async getAccuracy()
    {
        let a = this
        return new Promise(async function(resolve, reject)
        {

                var sql = `SELECT scoutReport.events
                FROM data
            JOIN (SELECT matches.key
                FROM matches 
                JOIN teams ON teams.key = matches.teamKey
                WHERE teams.teamNumber = ?) AS  newMatches ON  data.matchKey = newMatches.key
            WHERE data.startTime BETWEEN COALESCE(?, (SELECT MIN(startTime) FROM data)) AND COALESCE(?, (SELECT MAX(startTime) FROM data))
            ORDER BY data.startTime ASC`;
                db.all(sql, [a.team, a.start, a.end], (err, rows) =>
                {
                    let len = 0
                    let makes = 0
                    rows.forEach(functionAdder);
                    function functionAdder(row, index, array){
                       
                        for (let [subArr] of row.entries()) {
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
        let a = this
        return new Promise(async (resolve, reject) =>
        {

            var temp = await a.getAccuracy().catch((err) => {
                if (err) {
                    reject(err)
                }
            })  
            a.result = temp      
            resolve("done")    
        })
        
    }
    finalizeResults()
    {
        return { 
            "team": this.team,
            "result": this.result

        }
    }

}
module.exports = cargoAccuracy
