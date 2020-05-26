module.export.getData = jenkins => new Promise( res => {
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
module.export.getJobs = jenkins => new Promise( res => {
    jenkins.all_jobs({}, function(err, data) {
        if (err){ return console.log(err); }
        console.log(data)
        res(data);
    });
});