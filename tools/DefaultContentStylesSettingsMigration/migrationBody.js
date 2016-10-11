'use strict';
let _ = require('underscore-node');
let obj = {}

//specify database credentials
obj.config = {
    user: 'easygenerator',
    password: 'Easy123!',
    server: '52.1.184.232',
    port: 1433,
    database: 'perfomance.easygenerator.com'
}
// live config
// obj.config = {
//     user: 'easygenerator',
//     password: 'OT1Km21iO2',
//     server: '127.0.0.1',
//     port: 1533,
//     database: 'live.easygenerator.com'
// }
// obj.config = {
//     user: 'abaranov',
//     password: 'Fylhtq14121987',
//     server: '127.0.0.1',
//     port: 1433,
//     database: 'easygenerator-web'
// }

//specifying column and value will cause executing "SELECT * FROM CourseTemplateSettings WHERE obj.column = obj.value" query
//when parameters column and value misses all course template settings will be migrated

obj.column = 'Template_Id';
//specify a value to build  a query
obj.value = '4A17FB71-DF78-4F38-BB6F-B582F6D6ECC5';

obj.migrationFunction = function (settingsObject, extraDataObject) {
    //specify a callback function
    //to delete some settings use 
    //delete settingsObject.experimentalSetting;
    //to add some new settings use
    //settingsObject.experimentalSetting = "ololo"
    if (!_.isNull(settingsObject) && !_.isUndefined(settingsObject)) {
        if (settingsObject.fonts) {

            let textColor = _.find(settingsObject.branding.colors, color => {
                return color.key === '@text-color'
            });
            let mainColor = _.find(settingsObject.branding.colors, color => {
                return color.key === '@main-color'
            });
            let secondaryColor = _.find(settingsObject.branding.colors, color => {
                return color.key === "@secondary-color"
            });
            let buttonTextColor = _.find(settingsObject.branding.colors, color => {
                return color.key === "@button-text-color"
            });

            let h1 = _.find(settingsObject.fonts, font => {
                return font.key === 'Heading1'
            });

            if (h1 && h1.size === 26) {
                h1.size = 24;
            };

            let h2 = _.find(settingsObject.fonts, font => {
                return font.key === 'Heading2'
            });
            if (h2 && h2.size === 24) {
                h2.size = 22;
            };

            let highLighted = _.find(settingsObject.fonts, font => {
                return font.key === 'Highlighted'
            });

            if (highLighted && _.isObject(highLighted) && highLighted.isGeneralColorSelected && _.isObject(buttonTextColor) && buttonTextColor.color) {
                highLighted.color = buttonTextColor.color;
            };

            if (highLighted && _.isObject(highLighted)) {
                highLighted.textBackgroundColor = mainColor.color;
            };

            let links = _.find(settingsObject.fonts, font => {
                return font.key === 'links'
            });

            if (links && _.isObject(links) && links.isGeneralColorSelected) {
                links.color = mainColor.color;
            };
        };
    }

    //try not to delete this ;)
    return [JSON.stringify(settingsObject), JSON.stringify(extraDataObject)];
};

module.exports = obj;