import sectionRepository from 'repositories/sectionRepository';

export default class {
    static async execute(sectionId) {
        await sectionRepository.permanentlyDelete(sectionId);
    }
}