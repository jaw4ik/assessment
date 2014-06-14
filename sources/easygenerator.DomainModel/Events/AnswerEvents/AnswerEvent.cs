using easygenerator.DomainModel.Entities;

namespace easygenerator.DomainModel.Events.AnswerEvents
{
    public abstract class AnswerEvent
    {
        public Answer Answer { get; private set; }

        protected AnswerEvent(Answer answer)
        {
            Answer = answer;
        }
    }
}
