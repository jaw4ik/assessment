import questionsRepository from 'repositories/questionRepository';

export default class {
    static execute(sectionId, questionId) {
        return questionsRepository.removeQuestions(sectionId, [questionId]);
    }
}