# IF YOU WANT IT TO FUNCTION SIMILAR TO A REST API, ADD /API the start of the endpoint and ignore the uuid

## POST /API/analysis
Will accept a list of analyses and parameters
```
body: {
    "tasks": [
        {
            "name": "AverageForMetric",
            "teamKey": "frc8033",
            "metric": "teleopHighSuccess"
        },
        {
            "name": "TeamsInTournament",
            "tournamentKey": "2022cc"
        },
        {
            "name": "BestAverageForMetric",
            "tournamentKey": "2022cc",
            "metric": "teleopHighSuccess"
        }
    ]
}
```
### Will return: Response code 200 
Returns completed analyses as a list

## POST /analysis
Will accept a uuid and a list of analyses (made of analyses that can be run (will come later))
```
body: {
    "uuid": uuid,
    "tasks": [
        {
            "name": "AverageForMetric",
            "teamkey": "frc8033",
            "metric": "teleopHighSuccess"
        },
        {
            "name": "TeamsInTournament",
            "tournamentKey": "2022cc"
        },
        {
            "name": "BestAverageForMetric",
            "tournamentKey": "2022cc",
            "metric": "teleopHighSuccess"
        }
    ]
}
```
### Will return: Response code 200
```
{
    "taskNumber": taskNumber
}
```

## POST /getTaskData
Can accept either a uuid that was sent with the initial request AND/OR the taskNumber that is returned with the uuid. Will return the promise associated with the taskNumber/uuid
```
body: {
    "uuid": uuid,
    "taskNumber": INTEGER
}
```
### Will return: Response code 200
```
{
    "taskData": Promise
}
```

## POST /addScoutRport
Will accept if a teamKey, tournamentKey, and data. Uuid is not neccessary if using /API/addScoutReport, it will instead return success. Let me know if anyone thinks anything else should be added to this format, (can be shrunk, thats not an issue, this is for understanding/agreement purposes)
```
body: {
    "uuid": uuid,
    "teamKey": "frc254",
    "tournamentKey": "2022cc",
    "data": {
        "constantData": {
            "scouterId": "Barry B Benson",
            "matchNumber": 13,
            "dfenseQuantity": 2,
            "defenseQuality": 4,
            "startTime": 129834982,
            "notes": "Ya like jazz"
        },
        "gameDependent": {
            "challengeResult": "Traversal"
            "events": [
                {
                    "event": {
                        "timeSinceStart": 1405,
                        "eventType": 0,
                        "location": 1,
                    }
                },
                {
                    "event": {
                        "timeSinceStart": 1645,
                        "eventType": 0,
                        "location": 1,
                    }
                },
                {
                    "event": {
                        "timeSinceStart": 8418,
                        "eventType": 1,
                        "location": 3,
                    }
                },
                {
                    "event": {
                        "timeSinceStart": 8897,
                        "eventType": 0,
                        "location": 3,
                    }
                }
            ]
        }
    }
}
```
### Will return: Response code 200
```
{
    "taskNumber": taskNumber
}
```

## POST /addTournamentMatches
Add all the matches for a tournament, currently only works for matches where all the teams are in the db, so some offseason matches will have issues (such as Bordie React). Uuid is not required if using /API/addTournamentMatches and it will respond with success.
```
body: {
    "uuid": uuid,
    "tournamentName": "Chezy Champs",
    "tournamentDate": "2022-09-23"
}
```
### Will return: Response code 200
```
{
    "taskNumber": taskNumber
}
```

## GET /API/listTeams
Sends JSON list of all teams in the teams table
Response code 200
```
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
    }
]
```
