using easygenerator.DomainModel.Entities.Questions;
using easygenerator.Infrastructure.Clonning;
using easygenerator.Web.Extensions;
using System;
using System.Dynamic;

namespace easygenerator.Web.Components.Mappers
{
    public class QuestionEntityModelMapper : EntityModelMapper<Question>
    {
        public override dynamic Map(Question entity)
        {
            dynamic question = new ExpandoObject();

            question.Id = entity.Id.ToNString();
            question.Title = entity.Title;
            question.Content = entity.Content;
            question.CreatedOn = entity.CreatedOn;
            question.CreatedBy = entity.CreatedBy;
            question.ModifiedOn = entity.ModifiedOn;
            question.VoiceOver = entity.VoiceOver;
            question.Type = GetQuestionType(entity);

            CheckSurveyQuestion(entity, ref question);

            return question;
        }

        static void CheckSurveyQuestion(Question entity, ref dynamic question)
        {
            var surveyQuestion = entity as SurveyQuestion;
            if (surveyQuestion != null)
            {
                question.IsSurvey = surveyQuestion.IsSurvey;
            }
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