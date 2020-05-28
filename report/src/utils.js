module.exports.getLastBuild = (jenkins, job_name) => new Promise( (res, rej) => {
    // API Token
    jenkins.last_build_info(job_name, {}, (err, data) => {
        if (err){ return console.log(err); }
        if(data.building){
            return res({
                regional: job_name, result: null, building: true
            })
        }
        jenkins.console_output(job_name, data.number, {}, (err, data) => {
            if (err){ return console.log(err); }
            const findInformationRegExp = /(assertions │[ ]{1,}[0-9]{1,} │[ ]{1,}[0-9]{1,})/gi;
            const matchers = data.body.match(findInformationRegExp);
            if(!matchers){
                return rej(`not found string test result - Job: ${job_name} - Build: ${data.number}`)
            }
            const result = matchers.map(match => {
                return match.split(" │").map(a => a.trim());
            });
            res({regional: job_name, result: result, building: false});
        });
    });
})
module.exports.getJobs = (jenkins) => new Promise( (res, rej) => {
    jenkins.all_jobs({}, (err, data) => {
        if (err){ 
            return rej(err);
        }
        res(data);
    });
});

module.exports.getLastBuilds = async (jenkins, jobs) => {
    const build = await jobs.map(async (job) => {
        return await module.exports.getLastBuild(jenkins, job.name);
    });
    return await Promise.all(build);
}