import sectionRepository from 'repositories/objectiveRepository';

export default class {
    static async execute(sectionId, questions) {
        await sectionRepository.updateQuestionsOrder(sectionId, questions);
    }
}