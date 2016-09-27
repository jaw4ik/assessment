using easygenerator.DomainModel.Events.QuestionEvents;

namespace easygenerator.DomainModel.Entities.Questions
{
    public class SurveyQuestion : Question
    {
        public SurveyQuestion() { }

        public SurveyQuestion(string title, string createdBy)
            : base(title, createdBy)
        {

        }

        public SurveyQuestion(string title, string createdBy, bool isSurvey)
            : base(title, createdBy)
        {
            IsSurvey = isSurvey;
        }

        public bool? IsSurvey { get; internal set; }

        public void UpdateIsSurvey(bool isSurvey, string modifiedBy)
        {
            ThrowIfModifiedByIsInvalid(modifiedBy);

            IsSurvey = isSurvey;
            MarkAsModified(modifiedBy);

            RaiseEvent(new QuestionIsSurveyUpdatedEvent(this, isSurvey));
        }
    }
}
