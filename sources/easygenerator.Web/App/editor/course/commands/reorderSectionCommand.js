import ko from 'knockout';
import courseRepository from 'repositories/courseRepository';

export default class {
    static async execute(courseId, sections) {
        await courseRepository.updateSectionOrder(courseId, ko.toJS(sections));
    }
}