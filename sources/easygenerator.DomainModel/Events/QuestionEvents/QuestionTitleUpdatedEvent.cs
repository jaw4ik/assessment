using easygenerator.DomainModel.Entities;

namespace easygenerator.DomainModel.Events.QuestionEvents
{
    public class QuestionTitleUpdatedEvent : QuestionEvent
    {
        public QuestionTitleUpdatedEvent(Question question)
            : base(question)
        {

        }
    }
}
