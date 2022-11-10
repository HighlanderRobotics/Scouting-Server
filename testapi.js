const axios = require('axios');
require("dotenv").config()

var url = "https://www.thebluealliance.com/api/v3"

axios.get(`${url}/teams/0`, {
    headers: {'X-TBA-Auth-Key': process.env.KEY}
})
  .then(response => {
    // var data = JSON.parse(response)
    console.log(response);
    
})
  .catch(error => {
    console.log(error);
  });