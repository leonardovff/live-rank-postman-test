const jenkinsapi = require('jenkins-api');
const jenkins = jenkinsapi.init('http://seletiva:11398bb67ac8297cb9f5d53bb6f3c47956@localhost:8080');
const express = require('express');
const app = express();

getData = () => new Promise( res => {
    // API Token
    jenkins.last_build_info("api_014_al", {}, function(err, data) {
        if (err){ return console.log(err); }
        console.log(data)
        jenkins.console_output('api_014_al', data.number, {}, function(err, data) {
            if (err){ return console.log(err); }
            const findInformationRegExp = /(assertions │[ ]{1,}[0-9]{1,} │[ ]{1,}[0-9]{1,})/gi;
            const matchers = data.body.match(findInformationRegExp);
            const result = matchers.map(match => {
                return match.split(" │").map(a => a.trim());
            });
            res(result);
        });
    });
})
    
app.get('/', async (req, res) => {
    const result = await getData();
    console.log(result);
    res.json(result);
});

app.listen(3000, () => {
    console.log('Example app listening on port 3000!');
});