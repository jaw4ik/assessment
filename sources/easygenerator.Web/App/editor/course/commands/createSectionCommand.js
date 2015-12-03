import _ from 'underscore';
import sectionRepository from 'repositories/objectiveRepository';
import courseRepository from 'repositories/courseRepository';
import localizationManager from 'localization/localizationManager';
import eventTracker from 'eventTracker';
import constants from 'constants';
import app from 'durandal/app';

export default class {
    static async execute(courseId) {
        let title = localizationManager.localize('objectiveDefaultTitle');
        let createdObjective = await sectionRepository.addObjective({ title: title });
        if (_.isString(courseId)) {
            let response = await courseRepository.relateObjective(courseId, createdObjective.id);
            app.trigger(constants.messages.objective.createdInCourse);
        }
        return createdObjective;
    }
}