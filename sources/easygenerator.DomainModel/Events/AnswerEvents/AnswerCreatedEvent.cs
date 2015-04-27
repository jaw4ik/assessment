using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Questions;

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
