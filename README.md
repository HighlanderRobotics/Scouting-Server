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
```
# Setup SSL Certificate

**Not neccessary because scrapped https code**

Go to /ssl and run: 
```
openssl genrsa -out key.pem

openssl req -new -key key.pem -out csr.pem

openssl x509 -req -days 365 -in csr.pem -signkey key.pem -out cert.pem
```
You can enter w/e information you want for the certificate request it doesn't matter

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
1. Query The blue alliance
 - ~~Build get all teams~~
 - ~~Get and insert matches for round-robin~~
2. Make analysis engine
 - ~~Get Team's points average~~
 - Build rest of analysis for analysis engine
3. ~~Add actual data to the Database~~
 - ~~Get data from the app~~
 - ~~Add post request for inputing data~~
 - ~~Add any data required to properly insert into the header in gamedata (on the app)~~
   - Its on the test-rest-api branch
4. REST API
 - ~~Add get request for recieving analysis~~
 - Create token system
 - Add post request for inputing data
 - ~~Add get request for recieving analysis~~
 - ~~Add post request for adding stuff via api (such as tournament matches)~~

Commands: 
Run server: nodemon collectionServer.js
Run individual js files: node {filename}
Send packets through Postman if you want