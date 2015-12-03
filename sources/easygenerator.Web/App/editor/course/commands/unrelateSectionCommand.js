import courseRepository from 'repositories/courseRepository';

export default class {
    static async execute(courseId, section) {
        await courseRepository.unrelateObjectives(courseId, [section]);
    }
};