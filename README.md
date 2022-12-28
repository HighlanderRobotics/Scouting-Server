# Installation process on Ubuntu (sorry don't know how installation works on mac or windows)
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
npm init -y
```

# Setup ngrok

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

## POST /API/manager/addScoutRport
Will accept if a teamKey, tournamentKey, and data
```json
{
  "uuid": "b9364689-9672-45fd-8a98-a5801338b3bf",
  "competitionKey": "2022cc",
  "matchNumber": 1,
  "teamNumber": 254,
  "scouterId": 5,
  "startTime": 1671755981764,
  "defenseFrequencyRating": 4,
  "overallDefenseRating": 2,
  "notes": "",
  "events": [
    [
      1730,
      0,
      1
    ],
    [
      1877,
      0,
      1
    ],
    [
      2016,
      0,
      1
    ],
    [
      2156,
      0,
      1
    ]
  ],
  "robotRole": 1,
  "challengeResult": "Failed climb"
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
    "key": "2022cc_qm1_4",
    "gameKey": "2022cc",
    "matchNumber": 1,
    "teamKey": "frc254",
    "matchType": "qm"
  },
  {
    "key": "2022cc_qm1_3",
    "gameKey": "2022cc",
    "matchNumber": 1,
    "teamKey": "frc3647",
    "matchType": "qm"
  },
  {
    "key": "2022cc_qm1_0",
    "gameKey": "2022cc",
    "matchNumber": 1,
    "teamKey": "frc6036",
    "matchType": "qm"
  }
]
```

## GET /API/manager/isMatchesScouted?tournamentKey=2022cc&scouterId=34&matchKeys=["2022cc_qm2", "2022cc_qm3", "2022cc_qm4"]

### Will return: Response code 200
```json
[
  {
    "matchKey": "2022cc_qm1",
    "specificMatchKey": "2022cc_qm1_1",
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