import questionRepository from 'repositories/questionRepository';

export default class{
    static async execute(questionId, title) {
        await questionRepository.updateTitle(questionId, title);
    }
};