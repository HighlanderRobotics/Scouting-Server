Installation process on Ubuntu (sorry don't know how installation works on mac or windows)

sudo apt update
sudo apt install nodejs

Check node install:
node -v

sudo apt install sqlite3

Check sqlite3 install:
sqlite3 --version

sudo apt install npm
npm init -y
npm install sqlite3

----------------------------------------------------

Nice to have extensions to install
SQLite by alexcvzz
SQLite Viewer by FLorian Klampfer


TODO
----------------------------------------------------
1. Query The blue alliance
 - ~~Build get all teams~~
 - Get and insert matches for round-robin
 - Lots of queries to be built.
2. Make analysis engine
 - ~~Get Team's points average~~
 - Build rest of analysis for analysis engine
3. Add actual data to the Database
 - Get data from the app
 - Add any data required to properly insert into the header in gamedata (on the app)
4. REST API
 - Add post request for inputing data
 - Add get request for recieving analysis
 - Add post request for adding stuff via api (such as tournament matches)