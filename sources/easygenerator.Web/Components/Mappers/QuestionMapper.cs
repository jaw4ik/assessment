using easygenerator.DomainModel.Entities.Questions;
using easygenerator.Infrastructure;
using easygenerator.Infrastructure.Clonning;
using easygenerator.Web.Extensions;
using System;

namespace easygenerator.Web.Components.Mappers
{
    public class QuestionEntityModelMapper : IEntityModelMapper<Question>
    {
        public dynamic Map(Question entity)
        {
            return new
            {
                Id = entity.Id.ToNString(),
                Title = entity.Title,
                Content = entity.Content,
                CreatedOn = entity.CreatedOn,
                CreatedBy = entity.CreatedBy,
                ModifiedOn = entity.ModifiedOn,
                VoiceOver = entity.VoiceOver,
                Type = GetQuestionType(entity)
            };
        }

        static string GetQuestionType(Question question)
        {
            var questionType = question.GetObjectType();

            if (questionType == typeof(FillInTheBlanks))
            {
                return Question.QuestionTypes.FillInTheBlanks;
            }
            if (questionType == typeof(SingleSelectText))
            {
                return Question.QuestionTypes.SingleSelectText;
            }
            if (questionType == typeof(Multipleselect))
            {
                return Question.QuestionTypes.MultipleSelect;
            }
            if (questionType == typeof(DragAndDropText))
            {
                return Question.QuestionTypes.DragAndDropText;
            }
            if (questionType == typeof(HotSpot))
            {
                return Question.QuestionTypes.HotSpot;
            }
            if (questionType == typeof(SingleSelectImage))
            {
                return Question.QuestionTypes.SingleSelectImage;
            }
            if (questionType == typeof(TextMatching))
            {
                return Question.QuestionTypes.TextMatching;
            }
            if (questionType == typeof(InformationContent))
            {
                return Question.QuestionTypes.InformationContent;
            }
            if (questionType == typeof(Statement))
            {
                return Question.QuestionTypes.Statement;
            }
            if (questionType == typeof(OpenQuestion))
            {
                return Question.QuestionTypes.OpenQuestion;
            }
            if (questionType == typeof(Scenario))
            {
                return Question.QuestionTypes.Scenario;
            }
            if (questionType == typeof(RankingText))
            {
                return Question.QuestionTypes.RankingText;
            }
            throw new NotSupportedException();
        }
    }
}