import sectionRepository from 'repositories/objectiveRepository';

export default class{
    static async execute(sectionId, title) {
        await sectionRepository.updateTitle(sectionId, title);
    }
};