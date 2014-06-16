using easygenerator.DomainModel.Entities;

namespace easygenerator.DomainModel.Events.AnswerEvents
{
    public class AnswerCorrectnessUpdatedEvent : AnswerEvent
    {
        public AnswerCorrectnessUpdatedEvent(Answer answer)
            : base(answer)
        {

        }
    }
}
