const BaseAnalysis = require('./BaseAnalysis.js')

class climberSucsess extends BaseAnalysis {
    static name = `climberSucsess`

    constructor(db, team) {
        super(db)
        this.team = team
        this.teamKey = "ftc" + team
        // this.start = start
        // this.end = end
        this.result = 0
        
    }
    async getData()
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
                `;
            let failed = 0
            this.db.all(sql, [a.team], (err, rows) =>
            {
                if(err)
                {
                    reject(err)
                }
                else
                {
                    rows.forEach(functionAdder);
                    function functionAdder(row, index, array){
                        let curr = JSON.parse(row.scoutReport).challengeResult
                            if(curr === 0 || curr === 1)
                            {
                                failed++
                            }
                        
                    }
                }
            })
            let all = 0
            var sql2 = `SELECT COUNT(*) as count
            FROM data
            JOIN (SELECT matches.key, matches.matchNumber
                FROM matches 
                JOIN teams ON teams.key = matches.teamKey
                WHERE teams.teamNumber = ?) AS  newMatches ON  data.matchKey = newMatches.key
          `;
            this.db.all(sql2, [a.team], (err, row) =>
            {
                if(err)
                {
                    reject(err)
                }
                else
                {
                    console.log(row)
                    all = row[0].count
                }
            })

            console.log(all)
            resolve(1 - (failed/all))
                

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
            var temp = await a.getData().catch((err) => {
                if (err) {
                    console.log(err)
                    return err
                }
            })  
            a.result = temp  
            console.log("cllimber Sucsess ")
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
module.exports = climberSucsess

