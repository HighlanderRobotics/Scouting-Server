const BaseAnalysis = require('./BaseAnalysis.js')
// const Manager = require('./manager/dbmanager.js')

class cargoAccuracy extends BaseAnalysis {
    static name = `cargoAccuracy`

    constructor(db, team) {
        super(db)
        this.team = team
        this.teamKey = "frc" + team
        // this.start = start
        // this.end = end
        this.result = 0
        
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
                JOIN teams ON teams.key = matches.teamKey
                WHERE teams.teamNumber = ?) AS  newMatches ON  data.matchKey = newMatches.key
          `;
                a.db.all(sql, [a.team], (err, rows) =>
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
        let a = this
        return new Promise(async (resolve, reject) =>
        {

            var temp = await a.getAccuracy()
            a.result = temp 
            // console.log(temp)     
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
