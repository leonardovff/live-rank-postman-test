const jenkinsapi = require('jenkins-api');

const express = require('express');
const app = express();

const http = require('http').createServer(app);
const io = require('socket.io')(http);

const { getJobs, getLastBuilds } = require('./src/utils');

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/src/index.html');
});

http.listen(3000, '0.0.0.0', () => {
    console.log('Example app listening on port 3000!');
});

// Remove this endpoint - just test
app.get('/api-status', async (req, res) => {
    res.send('1');
});

setInterval(async () => {
    const jenkins = jenkinsapi.init('http://seletiva:11398bb67ac8297cb9f5d53bb6f3c47956@localhost:8080');
    const jobs = await getJobs(jenkins);
    const regionals = await getLastBuilds(jenkins, jobs);
    io.emit('update', {regionals});
    console.log(regionals, 'entrou');
}, 1000 * 5);
