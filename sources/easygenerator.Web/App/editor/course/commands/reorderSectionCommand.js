import courseRepository from 'repositories/courseRepository';

export default class {
    static async execute(courseId, sections) {
        await courseRepository.updateObjectiveOrder(courseId, sections);
    }
}