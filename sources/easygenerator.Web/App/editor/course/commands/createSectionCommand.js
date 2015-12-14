import _ from 'underscore';
import sectionRepository from 'repositories/objectiveRepository';
import courseRepository from 'repositories/courseRepository';
import localizationManager from 'localization/localizationManager';
import eventTracker from 'eventTracker';
import constants from 'constants';

export default class {
    static async execute(courseId) {
        let title = localizationManager.localize('sectionDefaultTitle');
        let createdObjective = await sectionRepository.addObjective({ title: title });
        if (_.isString(courseId)) {
            await courseRepository.relateObjective(courseId, createdObjective.id);
        }
        return createdObjective;
    }
}