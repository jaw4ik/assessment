import _ from 'underscore';
import apiHttpWrapper from 'http/apiHttpWrapper';
import guard from 'guard';
import themeModelMapper from 'mappers/themeModelMapper';
import app from 'durandal/app';
import constants from 'constants';

export default class {
    static getCollection(templateId) {
        guard.throwIfNotString(templateId, 'Template id is not a string');

        return apiHttpWrapper.post('api/template/themes', { templateId: templateId }).then(response => {
            guard.throwIfNotArray(response, 'Response is not an array');

            return _.map(response, theme => themeModelMapper.map(theme));
        });
    }
    static add(templateId, name, settings) {
        guard.throwIfNotString(templateId, 'Template id is not a string');
        guard.throwIfNotString(name, 'Name is not a string');
        guard.throwIfNotAnObject(settings, 'Settings is not an object');

        return apiHttpWrapper.post('api/template/theme/add', { templateId: templateId, name: name, settings: JSON.stringify(settings) })
            .then(response => {
                guard.throwIfNotAnObject(response, 'Response is not an object');

                let newTheme = themeModelMapper.map(response);
                app.trigger(constants.messages.themes.added, newTheme);
                return newTheme;
            });
    }
    static update(themeId, settings) {
        guard.throwIfNotString(themeId, 'Theme id is not a string');
        guard.throwIfNotAnObject(settings, 'Settings is not an object');

        return apiHttpWrapper.post('api/template/theme/update', { themeId: themeId, settings: JSON.stringify(settings) })
            .then(() => {
                app.trigger(constants.messages.themes.updated, {themeId: themeId, settings: settings});
            });
    }
    static remove(themeId) {
        guard.throwIfNotString(themeId, 'Theme id is not a string');

        return apiHttpWrapper.post('api/template/theme/delete', { themeId: themeId })
            .then(() => {
                 app.trigger(constants.messages.themes.deleted, themeId);
            });
    }
    static addThemeToCourse(courseId, templateId, themeId) {
        guard.throwIfNotString(courseId, 'Course id is not a string');
        guard.throwIfNotString(templateId, 'Template id is not a string');
        guard.throwIfNotString(themeId, 'Theme id is not a string');

        return apiHttpWrapper.post(`api/course/${courseId}/template/${templateId}/addtheme`, { themeId: themeId });
    }
    static removeCourseTheme(courseId, templateId) {
        guard.throwIfNotString(courseId, 'Course id is not a string');
        guard.throwIfNotString(templateId, 'Template id is not a string');

        return apiHttpWrapper.post(`api/course/${courseId}/template/${templateId}/removetheme`, null);
    }
};