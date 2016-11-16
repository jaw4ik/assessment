'use strict';

let co = require('co');
let sql = require('mssql');
let db = require('./dist/db');

let obj = {}

// 1.specify db connection config

// localhost config
obj.config = {
    database: "easygenerator-web",
    server: "127.0.0.1",
    driver: "msnodesqlv8",
    options: {
        trustedConnection: true
    }
};

// staging config
// obj.config = {
//     user: 'easygenerator',
//     password: 'Easy123!',
//     server: '52.203.242.134',
//     port: 1433,
//     database: 'performance.easygenerator.com'
// };

// live config
// obj.config = {
//     user: 'easygenerator',
//     password: 'OT1Km21iO2',
//     server: '127.0.0.1',
//     port: 1533,
//     database: 'live.easygenerator.com'
// };


// 2.specify migration function

obj.migration = (connection) => {
    return co(function* () {
        let scenarioQuestions = yield db.selectQuery(connection, 'SELECT * FROM ScenarioQuestions');
        console.log('Scenario questions found: ' + scenarioQuestions.length);
        
        yield db.updateQuery(connection,
            'UPDATE ScenarioQuestions SET EmbedCode = @embedCode, EmbedUrl = @embedUrl WHERE Id = @id', 
            [
                { key: 'embedCode', type: sql.NVARCHAR },
                { key: 'embedUrl', type: sql.NVARCHAR },
                { key: 'id', type: sql.UNIQUEIDENTIFIER }
            ],
            scenarioQuestions,
            currentScenario => {
                const scenarioDisableFocusParam = '?disable-focus';

                if (currentScenario.EmbedUrl && currentScenario.EmbedUrl.indexOf(scenarioDisableFocusParam) === -1) {
                     currentScenario.EmbedUrl = currentScenario.EmbedUrl + scenarioDisableFocusParam;
                }
                
                if (currentScenario.EmbedCode && currentScenario.EmbedCode.indexOf(scenarioDisableFocusParam) === -1) {
                    let srcMatch = currentScenario.EmbedCode.match(/.*?src=["|'](.*?)["|']/i);
                    if (srcMatch) {
                        currentScenario.EmbedCode = currentScenario.EmbedCode.replace(srcMatch[1], srcMatch[1] + scenarioDisableFocusParam); 
                    }
                }

                console.log('Scenario processed: ' + currentScenario.Id);
                return { embedCode: currentScenario.EmbedCode, embedUrl: currentScenario.EmbedUrl, id: currentScenario.Id };
            });
    });
};

module.exports = obj;