import sectionRepository from 'repositories/sectionRepository';

export default class{
    static async execute(sectionId, learningObjective) {
        await sectionRepository.updateLearningObjective(sectionId, learningObjective);
    }
};