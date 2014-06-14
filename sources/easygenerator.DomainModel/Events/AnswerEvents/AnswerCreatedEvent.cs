using easygenerator.DomainModel.Entities;

namespace easygenerator.DomainModel.Events.AnswerEvents
{
    public class AnswerCreatedEvent : AnswerEvent
    {
        public AnswerCreatedEvent(Answer answer)
            : base(answer)
        {

        }
    }
}
