module.exports.getLastBuild = (jenkins, job_name) => new Promise( res => {
    // API Token
    jenkins.last_build_info(job_name, {}, (err, data) => {
        if (err){ return console.log(err); }
        console.log(data)
        jenkins.console_output(job_name, data.number, {}, function(err, data) {
            if (err){ return console.log(err); }
            const findInformationRegExp = /(assertions │[ ]{1,}[0-9]{1,} │[ ]{1,}[0-9]{1,})/gi;
            const matchers = data.body.match(findInformationRegExp);
            const result = matchers.map(match => {
                return match.split(" │").map(a => a.trim());
            });
            res({regional: job_name, result: result});
        });
    });
})
module.exports.getJobs = (jenkins) => new Promise( (res, rej) => {
    jenkins.all_jobs({}, (err, data) => {
        if (err){ 
            console.log(err); 
            return rej(err);
        }
        console.log(data)
        res(data);
    });
});

module.exports.getLastBuilds = async (jenkins, jobs) => {
    const build = await jobs.map(async (job) => {
        return await module.exports.getLastBuild(jenkins, job.name);
    });
    const data = await Promise.all(build);
    return data;
}