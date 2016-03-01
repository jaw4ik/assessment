import ko from 'knockout';
import sectionRepository from 'repositories/sectionRepository';

export default class {
    static async execute(sectionId, questions) {
        await sectionRepository.updateQuestionsOrder(sectionId, ko.toJS(questions));
    }
}