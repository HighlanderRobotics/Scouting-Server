const Manager = require('./Manager.js')

class GetMatches extends Manager {
    static name = 'getMatches'

    constructor() {
        super()
    }

    runTask(body) {
        var sql = `SELECT * FROM matches
            WHERE tournamentKey = '${body.tournamentKey}'
            ORDER BY matchNumber`

        let errorCode = 400

        return new Promise((resolve, reject) => {
            Manager.db.all(sql, (err, matches) => {
                let modifiedMatches = []
                if (err) {
                    console.error(`Error with getMatches(): ${err}`)
                    reject({
                        "result": err,
                        "customCode": 500
                    })
                } else if (matches.length == 0) {
                    // No matches found
                    console.log(`No matches found for ${body.tournamentKey}`)
                    reject({
                        "result": `No matches found for ${body.tournamentKey}`,
                        "customCode": 406
                    })
                } else {
                    let largestQm = matches[0].matchNumber
                    matches.forEach((match) => {
                        if (match.matchType === 'qm') {
                            // Remove tournamentKey from the matchKey as requested
                            match.matchKey = match.key.substring(body.tournamentKey.length + 1)

                            modifiedMatches.push(match)
                            if (match.matchNumber > largestQm) {
                                largestQm = match.matchNumber
                            }
                        }
                    })

                    // console.log(largestQm)

                    matches.forEach((match) => {
                        if (match.matchType !== 'qm') {
                            let nonQualNumber = parseInt(match.key.substring(9, 10))
                            if (match.matchType === 'qf') {
                                match.matchNumber = nonQualNumber + largestQm
                            } else if (match.matchType === 'ef') {
                                if (nonQualNumber < 3) {
                                    match.matchNumber = 4 + nonQualNumber + largestQm
                                } else if (nonQualNumber < 6) {
                                    match.matchNumber = 6 + nonQualNumber + largestQm
                                } else {
                                    // When tba fixes their stuff to work with double elimination
                                    // match.matchNumber = 7 + nonQualNumber + largestQm
                                    match.matchNumber = 6 + nonQualNumber + largestQm
                                }
                            } else if (match.matchType === 'sf') {
                                match.matchNumber = 6 + nonQualNumber + largestQm
                            } else if (match.matchType === 'f') {
                                // Should be winners finals but is labeled as f
                                nonQualNumber = parseInt(match.key.substring(8, 9))
                                // match.matchNumber = 11 + nonQualNumber + largestQm
                                match.matchNumber = 12 + nonQualNumber + largestQm
                            } else if (match.matchType === 'gf') {
                                // Taking creative liberty that finals will get the matchKey 'gf'
                                match.matchNumber = 8 + nonQualNumber + largestQm
                            } else {
                                // Not a match type we know of 
                                console.log(match)
                            }

                            // Remove tournamentKey from the matchKey as requested
                            match.matchKey = match.key.substring(body.tournamentKey.length + 1)

                            modifiedMatches.push(match)
                        }

                    })

                    resolve(modifiedMatches)
                }
            })
        })
    }
}

module.exports = GetMatches