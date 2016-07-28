import _ from 'underscore';
import app from 'durandal/app';
import sectionRepository from 'repositories/sectionRepository';
import courseRepository from 'repositories/courseRepository';
import localizationManager from 'localization/localizationManager';
import eventTracker from 'eventTracker';
import constants from 'constants';

export default class {
    static async execute(courseId) {
        let title = localizationManager.localize('sectionDefaultTitle');
        let createdSection = await sectionRepository.addSection({ title: title });
        if (_.isString(courseId)) {
            await courseRepository.relateSection(courseId, createdSection.id);
            app.trigger(constants.messages.section.createdInCourse);
        }
        return createdSection;
    }
}