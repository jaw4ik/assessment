using easygenerator.DomainModel.Entities.Questions;

namespace easygenerator.DomainModel.Events.QuestionEvents
{
    public class QuestionGeneralFeedbackUpdatedEvent : QuestionEvent
    {
        public QuestionGeneralFeedbackUpdatedEvent(Question question)
            : base(question)
        {
        }
    }
}
