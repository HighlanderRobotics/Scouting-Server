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
npm install sqlite3
npm install sqlite
npm install morgan
npm install papaparse
```

# Setup ngrok

Follow instructions on https://ngrok.com/download, adding an authToken is optional

Run in terminal:
```
ngrok http 4000
```

Copy the text after the word "forwarding" and before the "->" to get the link to the server (it will work when the server is on and port 4000 opens)

# Extensions

SQLite by alexcvzz<br />
SQLite Viewer by FLorian Klampfer


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