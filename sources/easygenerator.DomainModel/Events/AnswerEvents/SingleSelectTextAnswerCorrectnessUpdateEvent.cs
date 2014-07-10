using easygenerator.DomainModel.Entities.Questions;

namespace easygenerator.DomainModel.Events.AnswerEvents
{
    public class SingleSelectTextAnswerCorrectnessUpdateEvent : AnswerEvent
    {
        public SingleSelectTextAnswerCorrectnessUpdateEvent(Answer answer)
            : base(answer)
        {
        }
    }
}
