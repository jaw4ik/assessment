import questionsRepository from 'repositories/questionRepository';

export default class {
    static execute(objectiveId, questionId) {
        return questionsRepository.removeQuestions(objectiveId, [questionId]);
    }
}