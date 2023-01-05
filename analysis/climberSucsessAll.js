const BaseAnalysis = require('./BaseAnalysis.js')

class climberSucsessAll extends BaseAnalysis {
    static name = `climberSucsessAll`

    constructor(db) {
        super(db)
        // this.team = team
        // this.teamKey = "ftc" + team
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
            let all = 0
            this.db.all(sql, [], (err, rows) =>
            {
                if(err)
                {
                    console.log(err)
                    reject(err)
                }
                else
                {

                    rows.forEach(functionAdder);
                    function functionAdder(row, index, array){
                        let curr = JSON.parse(row.scoutReport).challengeResult
                        console.log(curr)

                        all++
                            if(curr === 0 || curr === 1)
                            {
                                
                                failed++
                            }
                        
                    }
                    a.result = 1-(failed/all)
                    resolve("done")
                    
                }
            })
           
            // console.log(all)
           
                

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
            // a.result = temp  
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
module.exports = climberSucsessAll

