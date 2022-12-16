# IF YOU WANT IT TO FUNCTION SIMILAR TO A REST API, ADD /API the start of the endpoint and ignore the uuid

## GET /API/analysis/taskName?metric=asdf

### Will return: Response code 200 
Returns completed analyses as a list

## GET /getTaskData
Can accept either a uuid that was sent with the initial request AND/OR the taskNumber that is returned with the uuid. Will return the promise associated with the taskNumber/uuid
```json
body: {
    "uuid": "uuid",
    "taskNumber": 32,
}
```
### Will return: Response code 200
```json
{
    "taskData": {
        "metric": "teleopHighSuccess",
        "AverageForMetric": 14.333333333333334,
        "team": "frc8033"
    }
}
```

## GET /API/manager/isScouted/:tournamentKey/:matchNumber

### Will return: 
```json
body: {
    {
        {
            "matchKey": "2022cc_qm2_1",
            "name": "Barry B Benson"
        },
        {
            "matchKey": "2022cc_qm2_2",
            "name": "Barry B Benson"
        },
        {
            "matchKey": "2022cc_qm2_0",
            "name": "Barry B Benson"
        },
        {
            "matchKey": "2022cc_qm2_4",
            "name": "Barry B Benson"
        },
        {
            "matchKey": null,
            "name": null
        },
        {
            "matchKey": null,
            "name": null
        }
    }
}
```

## POST /addScoutRport
Will accept if a teamKey, tournamentKey, and data. Uuid is not neccessary if using /API/addScoutReport, it will instead return success. Let me know if anyone thinks anything else should be added to this format, (can be shrunk, thats not an issue, this is for understanding/agreement purposes)
```json
body: {
    "uuid": "uuid",
    "teamKey": "frc254",
    "tournamentKey": "2022cc",
    "data": {
        "constantData": {
            "scouterId": "Barry B Benson",
            "matchNumber": 13,
            "defenseQuantity": 2,
            "defenseQuality": 4,
            "startTime": 129834982,
            "notes": "Ya like jazz"
        },
        "gameDependent": {
            "challengeResult": "Traversal",
            "events": [
                {
                    "event": {
                        "timeSinceStart": 1405,
                        "eventType": 0,
                        "location": 1
                    }
                },
                {
                    "event": {
                        "timeSinceStart": 1645,
                        "eventType": 0,
                        "location": 1
                    }
                },
                {
                    "event": {
                        "timeSinceStart": 8418,
                        "eventType": 1,
                        "location": 3
                    }
                },
                {
                    "event": {
                        "timeSinceStart": 8897,
                        "eventType": 0,
                        "location": 3
                    }
                }
            ]
        }
    }
}
```
### Will return: Response code 200
```json
{
    "taskNumber": 3
}
```

## POST /addTournamentMatches
Add all the matches for a tournament, currently only works for matches where all the teams are in the db, so some offseason matches will have issues (such as Bordie React). Uuid is not required if using /API/addTournamentMatches and it will respond with success.
```json
body: {
    "uuid": "uuid",
    "tournamentName": "Chezy Champs",
    "tournamentDate": "2022-09-23"
}
```
### Will return: Response code 200
```json
{
    "taskNumber": 3,
}
```

## GET /API/listTeams
Sends JSON list of all teams in the teams table
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
    }
]
```
