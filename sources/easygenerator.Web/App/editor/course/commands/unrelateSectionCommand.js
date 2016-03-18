import ko from 'knockout';
import courseRepository from 'repositories/courseRepository';

export default class {
    static async execute(courseId, section) {
        await courseRepository.unrelateSections(courseId, [ko.toJS(section)]);
    }
};