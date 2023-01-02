const BaseAnalysis = require('./BaseAnalysis.js')

class climberMax extends BaseAnalysis {
    static name = `climberMax`

    constructor(db, team, start, end) {
        super(db)
        this.team = team
        this.teamKey = "ftc" + team
        this.start = start
        this.end = end
        this.result = 0
        
    }
    async getClimberMax()
    {
        let a = this
        return new Promise(async(resolve, reject) =>
        {
            //why does await not work when it works in  bestAverageForMetric
           
            var sql = `SELECT scoutReport
                FROM data
                JOIN (SELECT matches.key, matches.matchNumber
                    FROM matches 
                    JOIN teams ON teams.key = matches.teamKey
                    WHERE teams.teamNumber = ?) AS  newMatches ON  data.matchKey = newMatches.key
              `
            a.db.all(sql, [a.team], (err, rows) =>
            {
                if(err)
                {
                    console.log(err)
                    reject(err)
                }
                else
                {
                    // console.log(row)

                    let max = 0
                    rows.forEach(functionAdder);
                    function functionAdder(row, index, array){
                        let curr = JSON.parse(row.scoutReport)
                        if(curr.challengeResult > max)
                        {
                            max = curr.challengeResult
                        }
                       
                    }
                    resolve(max)

            }
                

        })
        
    })
    }
    runAnalysis()
        {
            return new Promise(async (resolve, reject) =>
            {
                // console.log("here")
                let a = this
                var temp = await a.getClimberMax().catch((err) => {
                    if (err) {

                        console.log(err)
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
                "team": this.team
            }
        }

}
module.exports = climberMax
