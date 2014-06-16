
using easygenerator.DomainModel.Entities;

namespace easygenerator.DomainModel.Events.AnswerEvents
{
    public class AnswerTextUpdatedEvent : AnswerEvent
    {
        public AnswerTextUpdatedEvent(Answer answer)
            : base(answer)
        {

        }
    }
}
