const jenkinsapi = require('jenkins-api');
const jenkins = jenkinsapi.init('http://seletiva:11398bb67ac8297cb9f5d53bb6f3c47956@localhost:8080');
const express = require('express');
const app = express();
const { getJobs } = require('./utils');

    
app.get('/', async (req, res) => {
    // const result = await getData();
    const result = await getJobs();
    console.log(result);
    res.json(result);
});

app.listen(3000, () => {
    console.log('Example app listening on port 3000!');
});