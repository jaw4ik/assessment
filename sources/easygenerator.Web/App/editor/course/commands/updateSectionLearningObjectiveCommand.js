import sectionRepository from 'repositories/objectiveRepository';

export default class{
    static async execute(sectionId, learningObjective) {
        await sectionRepository.updateLearningObjective(sectionId, learningObjective);
    }
};