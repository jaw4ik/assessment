import sectionRepository from 'repositories/objectiveRepository';

export default class {
    static execute(objectiveId) {
        return sectionRepository.removeObjective(objectiveId);
    }
}