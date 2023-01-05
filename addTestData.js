const sqlite = require('sqlite3').verbose()
const db = new sqlite.Database('./test.db', sqlite.OPEN_READWRITE, (err) => {
  if (err)
      console.error(err)
});
require('dotenv').config()
const DatabaseManager = require('./DatabaseManager.js')

let run = async () => {

    console.log(await new DatabaseManager().runTask('addScoutReport', {
        "uuid": "8d35ff89-4ecb-4a14-a6f7-206560fff9b0",
        "competitionKey": "2022cc",
        "matchKey": "qm1",
        "teamNumber": 6036,
        "scouterName": "Jacob Trentini",
        "startTime": 1672524014232,
        "events": [
            [
                1004,
                0,
                1
            ],
            [
                1124,
                0,
                1
            ],
            [
                1236,
                0,
                1
            ],
            [
                1375,
                0,
                1
            ],
            [
                1509,
                0,
                1
            ],
            [
                1890,
                0,
                0
            ],
            [
                2020,
                0,
                0
            ],
            [
                2148,
                0,
                0
            ],
            [
                2279,
                0,
                0
            ],
            [
                2396,
                0,
                0
            ],
            [
                2869,
                0,
                0
            ],
            [
                3013,
                0,
                0
            ],
            [
                3141,
                0,
                0
            ],
            [
                3283,
                0,
                0
            ],
            [
                3435,
                0,
                0
            ],
            [
                3732,
                0,
                2
            ],
            [
                4194,
                0,
                2
            ],
            [
                4344,
                0,
                2
            ],
            [
                4470,
                0,
                2
            ],
            [
                4607,
                0,
                2
            ],
            [
                5053,
                0,
                3
            ],
            [
                5198,
                0,
                3
            ],
            [
                5341,
                0,
                3
            ],
            [
                5515,
                0,
                3
            ],
            [
                8793,
                2,
                5
            ],
            [
                8943,
                2,
                5
            ],
            [
                9406,
                2,
                5
            ],
            [
                9630,
                2,
                5
            ]
        ],
        "robotRole": 0,
        "overallDefenseRating": 0,
        "defenseFrequencyRating": 0,
        "notes": "HOLA THESE ARE NOTES",
        "challengeResult": 0
    }))

    console.log(await new DatabaseManager().runTask('addScoutReport', {
        "uuid": "e7e4e7f9-16d4-4e5b-b571-5bd1ce30a2c4",
        "competitionKey": "2022cc",
        "matchKey": "qm3",
        "teamNumber": 4499,
        "scouterName": "Jacob Trentini",
        "startTime": 1672524439183,
        "events": [
            [
                862,
                0,
                0
            ],
            [
                985,
                0,
                0
            ],
            [
                1129,
                0,
                0
            ],
            [
                1246,
                0,
                0
            ],
            [
                1387,
                0,
                0
            ],
            [
                1634,
                0,
                1
            ],
            [
                1770,
                0,
                1
            ],
            [
                1899,
                0,
                1
            ],
            [
                2412,
                0,
                0
            ],
            [
                2536,
                0,
                0
            ],
            [
                2668,
                0,
                0
            ],
            [
                3004,
                0,
                0
            ],
            [
                3147,
                0,
                0
            ],
            [
                3343,
                0,
                0
            ],
            [
                3411,
                0,
                0
            ],
            [
                3553,
                0,
                0
            ],
            [
                3917,
                0,
                2
            ],
            [
                4052,
                0,
                2
            ],
            [
                4205,
                0,
                2
            ],
            [
                4345,
                0,
                2
            ],
            [
                4870,
                0,
                3
            ],
            [
                5004,
                0,
                3
            ],
            [
                5151,
                0,
                3
            ],
            [
                5727,
                0,
                3
            ],
            [
                6063,
                0,
                3
            ],
            [
                7404,
                1,
                0
            ],
            [
                8366,
                1,
                0
            ],
            [
                9853,
                1,
                0
            ],
            [
                11247,
                1,
                0
            ]
        ],
        "robotRole": 0,
        "overallDefenseRating": 0,
        "defenseFrequencyRating": 0,
        "notes": "NGL, had a great climb but missed a lot of them shots.",
        "challengeResult": 5
    }))

    // console.log(await new DatabaseManager().runTask('addScoutReport', {
        
    // }))

    // console.log(await new DatabaseManager().runTask('addScoutReport', {
        
    // }))

    // console.log(await new DatabaseManager().runTask('addScoutReport', {
        
    // }))

    // console.log(await new DatabaseManager().runTask('addScoutReport', {
        
    // }))

    // console.log(await new DatabaseManager().runTask('addScoutReport', {
        
    // }))

    // console.log(await new DatabaseManager().runTask('addScoutReport', {
        
    // }))

    // console.log(await new DatabaseManager().runTask('addScoutReport', {
        
    // }))

    // console.log(await new DatabaseManager().runTask('addScoutReport', {
        
    // }))

    // console.log(await new DatabaseManager().runTask('addScoutReport', {
        
    // }))

    // console.log(await new DatabaseManager().runTask('addScoutReport', {
        
    // }))

    // console.log(await new DatabaseManager().runTask('addScoutReport', {
        
    // }))

    // console.log(await new DatabaseManager().runTask('addScoutReport', {
        
    // }))

}

run()
