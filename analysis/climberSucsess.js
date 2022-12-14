const BaseAnalysis = require('./BaseAnalysis.js')

class climberSucsess extends BaseAnalysis {
    static name = `climberSucsess`

    constructor(db, team, start, end) {
        super(db)
        this.team = team
        this.teamKey = "ftc" + team
        this.start = start
        this.end = end
        this.result = 0
        
    }
    async getData()
    {
        let a = this
        return new Promise(async(resolve, reject) =>
        {
            //why does await not work when it works in  bestAverageForMetric
           
            var sql = `SELECT COUNT(*)
                FROM data
                WHERE (data.scoutReport = 1 OR data.scoutReport = 0)
                JOIN (SELECT matches.key, matches.matchNumber
                    FROM matches 
                    JOIN teams ON teams.key = matches.teamKey
                    WHERE teams.teamNumber = ?) AS  newMatches ON  data.matchKey = newMatches.key
                WHERE data.startTime BETWEEN COALESCE(?, (SELECT MIN(startTime) FROM data)) AND COALESCE(?, (SELECT MAX(startTime) FROM data))
                ORDER BY data.startTime ASC`;
            let failed = 0
            this.db.all(sql, [a.team, a.start, a.end], (err, row) =>
            {
                if(err)
                {
                    reject(err)
                }
                else
                {
                    failed = row[0]
                }
            })
            let all = 0
            var sql2 = `SELECT COUNT(*)
            FROM data
            JOIN (SELECT matches.key, matches.matchNumber
                FROM matches 
                JOIN teams ON teams.key = matches.teamKey
                WHERE teams.teamNumber = ?) AS  newMatches ON  data.matchKey = newMatches.key
            WHERE data.startTime BETWEEN COALESCE(?, (SELECT MIN(startTime) FROM data)) AND COALESCE(?, (SELECT MAX(startTime) FROM data))
            ORDER BY data.startTime ASC`;
            this.db.all(sql2, [a.team, a.start, a.end], (err, row) =>
            {
                if(err)
                {
                    reject(err)
                }
                else
                {
                    all = row[0]
                }
            })
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
        let a = this

        return new Promise(function (resolve, reject)
        {
            var temp = a.getData().catch((err) => {
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
            "team": this.team,
            "result": this.result

        }
    }
}
module.exports = climberSucsess

