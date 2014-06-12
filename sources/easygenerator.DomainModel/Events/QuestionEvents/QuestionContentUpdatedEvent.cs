using easygenerator.DomainModel.Entities;

namespace easygenerator.DomainModel.Events.QuestionEvents
{
    public class QuestionContentUpdatedEvent : QuestionEvent
    {
        public QuestionContentUpdatedEvent(Question question)
            : base(question)
        {

        }
    }
}
