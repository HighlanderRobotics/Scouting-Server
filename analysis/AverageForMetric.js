const BaseAnalysis = require('./BaseAnalysis.js')

class AverageForMetric extends BaseAnalysis {
    static name = `averageForMetric`

    constructor(db, teamKey, metric, countOrAvg) {
        super(db)
        this.teamKey = teamKey
        this.metric = metric
        //boolean, true = count, false = avg
        if(countOrAvg.eqauls("count"))
        {
            this.count = true
        }
        else
        {
            this.count = false
        }
        this.result = 0
    }

    async getData() {
        // When it goes into the promise, this stops pointing to the class, so it's saved here in a
        let a = this

        return new Promise((resolve, reject) => {
        // CAST(replace(json_extract(data.scoutReport,'$.autoHighSucsess'), ''', '') AS INTEGER)
            var sql = `SELECT *
            FROM matches
            JOIN data ON data.matchKey = matches.key
            WHERE teamKey = ?`
            
            // console.log(`Metric: ${a.metric}`)

            var returnData = []

            a.db.all(sql, [a.teamKey], (err, rows) =>
            {
                if(err)
                {
                    console.log(`Error getting data from ${a.teamKey}`)
                    reject(err);
                } else {
                    rows.forEach((data) => {
                        // Extracts only the metric (could be done more elegantly but w/e)
                        returnData.push(JSON.parse(JSON.parse(data.scoutReport).gameDependent.slice(1, -1))[a.metric])
                    })
                    resolve(returnData)
                }
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
    async getAvg()
    {
        
    }

    runAnalysis() {
        let a = this

        return new Promise(async (resolve, reject) => {
            var data = await a.getData().catch((err) => {
                if (err) {
                    return err
                }
            })

            // Some level of data translation needs to happen here as some metrics have higher points or are strings (ie climbing)

            if (data.length < 1) {
                resolve(`No Data Found for ${a.metric}`)
            } else {
                // Has Data and finds average  
                a.result = data.reduce((a,b) => a + b, 0)/data.length
                // console.log(a.result)
                resolve(`Task Completed`)
    
            }
        })
    }

    finalizeResults() {
        return { 
            'metric': this.metric,
            'AverageForMetric': this.result,
            'team': this.teamKey
        }
    }
}

module.exports = AverageForMetric