import sectionRepository from 'repositories/objectiveRepository';

export default class {
    static async execute(objectiveId) {
        await sectionRepository.permanentlyDelete(objectiveId);
    }
}