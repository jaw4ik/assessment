
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Questions;

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
