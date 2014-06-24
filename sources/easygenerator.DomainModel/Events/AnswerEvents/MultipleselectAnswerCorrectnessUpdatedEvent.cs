using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Questions;

namespace easygenerator.DomainModel.Events.AnswerEvents
{
    public class MultipleselectAnswerCorrectnessUpdatedEvent : AnswerEvent
    {
        public MultipleselectAnswerCorrectnessUpdatedEvent(Answer answer)
            : base(answer)
        {

        }
    }
}
