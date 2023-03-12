const BaseAnalysis = require('../../BaseAnalysis.js')


// const Manager = require('./manager/dbmanager.js')

class cycling extends BaseAnalysis {
    static name = `cycling`

    constructor(db, team, type, location) {
        super(db)
        this.team = team
        // this.teamKey = "frc" + team
        // this.start = start
        // this.end = end
        this.type = type
        this.location = location
        this.result = 0
        this.array
        this.matches = []
        // this.array = []

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
            let arr = []
            let match = []

            a.db.all(sql, [a.team], (err, rows) => {
                if (err) {
                    console.log(err)
                }
                if (rows != undefined) {
                    rows.forEach(functionAdder);
                    function functionAdder(row, index, array) {
                        match.push(row.key)
                        let curr = JSON.parse(row.scoutReport).events
                        let prev = 0
                        let total = 0
                        let len = 0
                        for (var i = 0; i < curr.length; i++) {
                            let subArr = curr[i]
                            if (subArr[1] === a.type) {
                                prev = subArr[0]
                            }
                            if (subArr[1] == a.location) {
                                total += subArr[0] - prev
                                len++
                            }
                            if (subArr[1] === 3) {
                                prev = 0
                            }

                        }
                        if (isNaN(total/len))
                        {
                            arr.push(0)
                        }
                        else{
                            arr.push(total/len)
                        }
                    }

                }
              
                a.array = arr
                a.result = arr.reduce((partialSum, a) => partialSum + a, 0) / arr.length
                if(!a.result)
                {
                    a.result = null
                }
                a.matches = match


                resolve("done")

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
             "array": this.array.map((item, index) => ({
                "match": this.matches[index],
                "value": item,
            })),
            "team": this.team
        }
    }

}
module.exports = cycling
