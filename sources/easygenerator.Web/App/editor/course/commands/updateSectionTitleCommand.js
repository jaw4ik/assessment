import sectionRepository from 'repositories/sectionRepository';

export default class{
    static async execute(sectionId, title) {
        await sectionRepository.updateTitle(sectionId, title);
    }
};