import QuestionModel from 'models/question';

export default {
    map: entity => {
        let question = {
            id: entity.Id,
            title: entity.Title,
            voiceOver: entity.VoiceOver,
            content: entity.Content,
            createdOn: new Date(entity.CreatedOn),
            modifiedOn: new Date(entity.ModifiedOn),
            type: entity.Type
        };

        if (entity.hasOwnProperty('IsSurvey')) {
            question.isSurvey = entity.IsSurvey;
        }

        return new QuestionModel(question);
    }
};