import ko from 'knockout';
import courseRepository from 'repositories/courseRepository';

export default class {
    static async execute(courseId, sections) {
        await courseRepository.updateObjectiveOrder(courseId, ko.toJS(sections));
    }
}