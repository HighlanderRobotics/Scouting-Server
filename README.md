# Installation process on Ubuntu (sorry don't know how installation works on windows)
(on mac, it sqlite3 should already come installed)
```
sudo apt update
sudo apt install nodejs
```
Check node install (Must be at least node v10):
```
node -v
```
```
sudo apt install sqlite3
```

Check sqlite3 install:
```
sqlite3 --version
```
Npm installs
```
sudo apt install npm
npm install
```

# Setup ngrok

On server startup, run the command coorespoinding to your operating system
```
npm run linuxstart
npm run macstart
npm run windowsstart
```

If the command fails, go to the built in terminal in vscode, hit the down arrow next to the plus sign, and press bash or Ubuntu (WSL). Run the linux command

If both steps above fail, please let Barry know both your operating system and which command you ran. Then follow the steps below

### If ngrok isn't working on startup

Follow instructions on https://ngrok.com/download, adding an authToken is optional

Run in terminal:
```
ngrok http 4000
```

Copy the text after the word "forwarding" and before the "->" to get the link to the server (it will work when the server is on and port 4000 opens)

# Extensions

SQLite by alexcvzz<br />
SQLite Viewer by FLorian Klampfer

# ENDPOINTS

## Analysis

## GET /API/analysis/:taskName

| :taskName | requirements | description |
| :---:   | :---: | :---: |
| AverageForMetric | teamKey, metric | Will get average of any metric for a team |
| BestAverageForMetric | tournamentKey, metric | Will get the team with the best average <br/>for a metric in a tournament as well as<br/>their average
| TeamsInTournament | tournamentKey | Returns a list of all teams in the <br/>tournament
|

### Will return: Response code 200
Returns completed analyses as a list

### GET /API/analysis
Can send multiple analysis to be run in the body
```json
{
  "tasks": [
    {
      "name": "AverageForMetric",
      "teamKey": "frc254",
      "metric": "teleopHighSuccess"
    },
    {
      "name": "AverageForMetric",
      "teamKey": "frc8033",
      "metric": "teleopHighSuccess"
    },
    {
      "name": "TeamsInTournament",
      "tournamentKey": "2022cc"
    }
  ]
}
```

### Will return: Response code 200 
Returns completed analyses as a list

-----------------------------------------------------------------
## Database Manager

## POST /API/manager/addScoutReport
Will accept if a teamKey, tournamentKey, and data
```json
{
  "uuid": "71a8e343-39bf-495a-8bba-2da8b7375326",
  "tournamentKey": "2022cc",
  "matchKey": "qm1",
  "scouterName": "Jacob Trentini",
  "teamNumber": 254,
  "startTime": 1673570312,
  "autoChallengeResult": 2,
  "events": [
    [
      2,
      7,
      3
    ],
    [
      5,
      10,
      9
    ],
    [
      8,
      0,
      1
    ],
    [
      11,
      0,
      8
    ]
  ],
  "challengeResult": 4,
  "robotRole": 0,
  "notes": "Robot did not climb but stayed in community."
}
```
### Will return: Response code 200
```
Data successfully entered
```

## GET /API/manager/getTeams

### Will return: Response code 200
```json
[
  {
    "key": "frc1",
    "teamNumber": 1,
    "teamName": "The Juggernauts"
  },
  {
    "key": "frc4",
    "teamNumber": 4,
    "teamName": "Team 4 ELEMENT"
  },
  {
    "key": "frc5",
    "teamNumber": 5,
    "teamName": "Robocards"
  }
]
```

## GET /API/manager/getTeamsInTournament?tournamentKey=2022cc

### Will return: Response code 200
```json
[
  {
    "key": "frc114",
    "teamNumber": 114,
    "teamName": "Eaglestrike"
  },
  {
    "key": "frc254",
    "teamNumber": 254,
    "teamName": "The Cheesy Poofs"
  },
  {
    "key": "frc359",
    "teamNumber": 359,
    "teamName": "Hawaiian Kids"
  },
  {
    "key": "frc498",
    "teamNumber": 498,
    "teamName": "The Cobra Commanders"
  }
]
```

## GET /API/manager/resetAndPopulate
Don't use this one anyway and also it takes a couple minutes for the database to fully reset then populate

### Will return: Response code 200

## POST /API/manager/addTournamentMatches
Needs a tournamentName and tournamentDate
```json
{
  {
    "tournamentName": "Chezy Champs",
    "tournamentDate": "2022-09-23"
  }
} 
```

## Will return: Response code 200
```
Success
```

## GET /API/manager/isScouted?tournamentKey=2022cc&matchKey=2022cc_qm1
Can also omit matchKey to get scouting status/name from all matches in the tournament.

### Will return: Response code 200
If the name is null then it means there's a scoutreport missing for that matchKey
```json
[
  {
    "key": "2022cc_qm1_4",
    "name": "Nate Hart"
  },
  {
    "key": "2022cc_qm1_3",
    "name": null
  },
  {
    "key": "2022cc_qm1_0",
    "name": "William Tenney"
  },
  {
    "key": "2022cc_qm1_5",
    "name": "Nathaniel Welch"
  },
  {
    "key": "2022cc_qm1_1",
    "name": "Keshav Rangan"
  },
  {
    "key": "2022cc_qm1_2",
    "name": "Helena Young"
  }
]
```

## GET /API/manager/getScouters

### Will return: Response code 200
```json
[
  "Abagail Cothran",
  "Alex Ware",
  "Alexander Aires",
  "Alexis Montero Castro",
  "Asha Byers",
  "Athena Li",
  "audrey Dickinson",
  "Ava Grochowski",
  "Ayaan Jajodia",
  "Barry Balasingham",
]
```

## GET /API/manager/getScoutersSchedule

### Will return: Response code 200
```json
{
  "version": 2,
  "shifts": [
    {
      "start": 1,
      "end": 5,
      "scouts": [
        "Jasper Tripp",
        "Mckeane Mcbrearty",
        "Torsten Olsen",
        "Evrim Duransoy",
        "Nate Hart",
        "Jessica Liu"
      ]
    },
    {
      "start": 6,
      "end": 10,
      "scouts": [
        "Nathaniel Scher",
        "Barry Balasingham",
        "Collin Cameron",
        "Valentina Prieto Black",
        "Asha Byers",
        "Lewy Seiden"
      ]
    },
    {
      "start": 11,
      "end": 15,
      "scouts": [
        "Torsten Olsen",
        "Jasper Tripp",
        "Nate Hart",
        "Jessica Liu",
        "Evrim Duransoy",
        "Nathaniel Welch"
      ]
    }
  ]
}
```

## POST /API/manager/updateScoutersSchedule

### Will return: Response code 200
```json
{
  "version": 3,
  "shifts": [
    {
      "start": 1,
      "end": 5,
      "scouts": [
        "Jasper Tripp",
        "Mckeane Mcbrearty",
        "Torsten Olsen",
        "Evrim Duransoy",
        "Nate Hart",
        "Jessica Liu"
      ]
    },
    {
      "start": 6,
      "end": 10,
      "scouts": [
        "Nathaniel Scher",
        "Barry Balasingham",
        "Collin Cameron",
        "Valentina Prieto Black",
        "Asha Byers",
        "Lewy Seiden"
      ]
    },
    {
      "start": 11,
      "end": 15,
      "scouts": [
        "Mckeane Mcbrearty",
        "Jasper Tripp",
        "Nate Hart",
        "Cassandra Colby",
        "Beck Peterson",
        "Nathaniel Welch"
      ]
    }
  ]
}
```

## GET /API/manager/getMatches?tournamentKey=2022cc

### Will return: Response code 200
```json
[
  {
    "key": "2022cc_qm65_3",
    "tournamentKey": "2022cc",
    "matchNumber": 65,
    "teamKey": "frc7157",
    "matchType": "qm"
  },
  {
    "key": "2022cc_qm65_1",
    "tournamentKey": "2022cc",
    "matchNumber": 65,
    "teamKey": "frc972",
    "matchType": "qm"
  },
  {
    "key": "2022cc_ef1_1",
    "tournamentKey": "2022cc",
    "matchNumber": 70,
    "teamKey": "frc1678",
    "matchType": "ef"
  },
  {
    "key": "2022cc_qf1_1",
    "tournamentKey": "2022cc",
    "matchNumber": 66,
    "teamKey": "frc1678",
    "matchType": "qf"
  },
  {
    "key": "2022cc_f1_1",
    "tournamentKey": "2022cc",
    "matchNumber": 78,
    "teamKey": "frc1690",
    "matchType": "f"
  }
]
```

## GET /API/manager/isMatchesScouted?tournamentKey=2022cc&scouterName=Jacob Trentini&matchKeys=["2022cc_qm1", "2022cc_qm2", "2022cc_qm3"]

### Will return: Response code 200
```json
[
  {
    "matchKey": "2022cc_qm1",
    "key": "2022cc_qm1_1",
    "status": true
  },
  {
    "matchKey": "2022cc_1qm2",
    "status": false
  },
  {
    "matchKey": "2022cc_qm3",
    "status": false
  }
]
```

## GET /API/manager/getAllNotes?teamKey=frc8033&sinceTime=1671755981763
sinceTime is optional but will use epoch in milis

### Will return: Response code 200
```json
[
  "Very Purple",
  "Got bodied by defense",
  "Bad climb"
]
```

## GET /API/manager/matchesCompleted?teamKey=frc6036&tournamentKey=2022cc
Can omit tournamentKey if you want to search the entire database and can also use teamNumber if you want. Currently sends the stored matchKey but I can cut off the "_0" if need be.

### Will return: Response code 200
```json
[
    "2022cc_qm1_0"
]
```

## GET /API/manager/newScouter?scouterName=test&scouterNumber=4154154155&scouterEmail=asdf@gmail.com
Due to this command editing the scouters.json file, it will forcibly restart the server. Unless we have paid ngrok the link will change

### Will return: Response code 200

-----------------------------------------------------------------

# TODO
1. ~~Query The blue alliance~~
 - ~~Build get all teams~~
 - ~~Get and insert matches for round-robin~~
2. Make analysis engine
 - ~~Get Team's points average~~
 - ~~Build rest of analysis for analysis engine~~
3. ~~Add actual data to the Database~~
 - ~~Get data from the app~~
 - ~~Add post request for inputing data~~
 - ~~Add any data required to properly insert into the header in gamedata (on the app)~~
   - ~~Its on the test-rest-api branch~~
4. REST API
 - ~~Add get request for recieving analysis~~
 - ~~Create token system~~
 - ~~Add post request for inputing data~~
 - ~~Add get request for recieving analysis~~
 - ~~Add post request for adding stuff via api (such as tournament matches)~~
5. ~~Abstraction~~
 - ~~Break functions and utilities into seperate files for modularity reasons~~
6. Testing
 - ~~Learn jest framework~~
 - Finish writing test cases
7. ~~Fix package.json~~
8. Make a message queue
 - Learn BullMQ and Redis
 - Make message queue
9. Fix endpoints to Collin's suggestions
 - More params and stop using body

# Future
1. Incorporate ORM
2. Make setup simpler
3. Convert to typescript
4. Multithreading if possible

Commands: 
Run server: 
```
nodemon collectionServer.js
```
Run individual js files: 
```
node {filename}
```

Send packets through Postman if you want

# Analysis

1. each analysis function has a header detialing its functionality at the top
2. most anaylsis groups have 4 files (a few exceptions):
      - Team : generally gives an average for the team and an array over time (for the sparkline). Some include other stats like: max row, level breakdown etc
      - Over all team : generally gives average over all teams and sometimes an array
      - Difference : calcuates the difference between team and all team average
      - Overview : one file that gives : average, all team average, difference, array from team file, z-score, and other stats from the team file
3. Names in analysis files:
      - Result/average : average of the described stat
      - Difference : all average - team average
      - array : used for sparkline (code below)
          "array": this.array.map((item, index) => ({
                "match": this.matches[index],
                "value": item,
            }))
      - ObjectType : 0 = cube, 1 = cone
      - Location : 2 = scoring 4 = feeding
      - level : 1 = hybrid, 2 = mid, 3 = high

4. Template for analyis file:
```
const BaseAnalysis = require('../../BaseAnalysis.js')
//comment about the functionality of the file
class example extends BaseAnalysis {
    static name = `example`
    constructor(db, team, objectType) {
        super(db)
        this.team = team
        this.objectType = objectType
        this.matches = []
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
                WHERE teams.teamNumber = ?) AS  newMatches ON  data.matchKey = newMatches.key
          `;
            let arr = []
            let match = []
            let object = false
            a.db.all(sql, [a.team], (err, rows) => {
                if (err) {
                    console.log(err)
                }
                if (rows != undefined) {
                    rows.forEach(functionAdder);
                    function functionAdder(row, index, array) {
                        //code
                    }}
                a.array = arr
                a.average = arr.reduce((partialSum, a) => partialSum + a, 0) / arr.length
                if(a.average === null)
                {
                    a.average = 0
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
            resolve("done")
        })

    }
    finalizeResults() {
        return {
            "result": this.average,
            "team": this.team,
            "array": this.array.map((item, index) => ({
                "match": this.matches[index],
                "value": item,
            }))
        }
    }

}
module.exports = example
```
5. Implementation in TaskManager
```
//import
const example = require('./analysis/example.js')

case ("example"):
      example.push(new example(Manager.db, task.team))
      break
```








