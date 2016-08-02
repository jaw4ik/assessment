import http from 'http/apiHttpWrapper';
import themeModelMapper from 'mappers/themeModelMapper';

export function getCourseTemplateSettings(courseId, templateId) {
    return http.get(`/api/course/${courseId}/template/${templateId}?v=${Math.random()}`)
        .then(response => {
            //fix for nulls in json array (see Simple course templateSettings.js)
            var settings = JSON.parse(response.settings);
            settings && settings.fonts && removeNullsInArray(settings.fonts);
            settings && settings.branding && settings.branding.colors && removeNullsInArray(settings.branding.colors);
            //end fix
            return {
                settings,
                extraData: JSON.parse(response.extraData),
                theme: response.theme && themeModelMapper.map(response.theme)
            }
        });
};

function removeNullsInArray(array){
    if (array && array.length) {
        for (var i = 0; i < array.length; i++) {
            if (array[i] === null) {
                delete array[i];
            }
        }
    }
}