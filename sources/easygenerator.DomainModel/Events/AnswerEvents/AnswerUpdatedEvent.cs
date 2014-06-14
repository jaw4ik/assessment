
using easygenerator.DomainModel.Entities;

namespace easygenerator.DomainModel.Events.AnswerEvents
{
    public class AnswerUpdatedEvent : AnswerEvent
    {
        public AnswerUpdatedEvent(Answer answer)
            : base(answer)
        {

        }
    }
}
