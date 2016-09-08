using easygenerator.DomainModel.Entities.Questions;

namespace easygenerator.DomainModel.Events.QuestionEvents
{
    public class QuestionIsSurveyUpdatedEvent : QuestionEvent
    {
        public bool IsSurvey { get; private set; }

        public QuestionIsSurveyUpdatedEvent(SurveyQuestion question, bool isSurvey)
            : base(question)
        {
            IsSurvey = isSurvey;
        }
    }
}
