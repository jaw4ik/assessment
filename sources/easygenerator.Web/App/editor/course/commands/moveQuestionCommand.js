import questionsRepository from 'repositories/questionRepository';

export default class {
    static async execute(questionId, sourceSectionId, targetSectionId) {
        await questionsRepository.moveQuestion(questionId, sourceSectionId, targetSectionId);
    }
}