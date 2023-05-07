const BaseAnalysis = require('../../BaseAnalysis.js')
//averge amount of cargo (of given type: cube or cone) for a given level (1 or 2 or 3)

class levelCargoAll extends BaseAnalysis {
    static name = `levelCargoAll`

    constructor(db, type, level) {
        super(db)

        this.level = level
        this.objectType = type
        this.average = 0
        this.array = []

    }
    async getAccuracy() {
        let a = this
        return new Promise(async function (resolve, reject) {

            var sql = `SELECT scoutReport, newMatches.key AS key
                FROM data
            JOIN (SELECT matches.key AS key
                FROM matches 
                JOIN teams ON teams.key = matches.teamKey
               ) AS  newMatches ON  data.matchKey = newMatches.key
          `;
            let len = 0
            let makes = 0
            let object = false
            let arr = []
            a.db.all(sql, [], (err, rows) => {
                if (err) {
                    console.log(err)
                }

                if (rows != undefined) {

                    rows.forEach(functionAdder);
                    function functionAdder(row, index, array) {
                        let curr = JSON.parse(row.scoutReport).events

                        for (var i = 0; i < curr.length; i++) {
                            let subArr = curr[i]

                            if(subArr[1] === a.objectType)
                            {

                                object = true
                            }
                           else if (subArr[1] === 2 && object == true && Math.ceil(subArr[2] / 3) === a.level ) {
                                makes++
                                object = false


                            }
                            else if (subArr[1] === 3 || subArr[1] === 4) {
                                object = false
                            }

                        }
                        len++
                        arr.push(makes)
                    }

                }
                a.average = makes/len
                a.array = arr
              
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
            await a.getAccuracy().catch((err) => {
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
            "result": this.average,
            "array" : this.array           
        }
        
    }

}
module.exports = levelCargoAll
