using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Questions;

namespace easygenerator.DomainModel.Events.AnswerEvents
{
    public abstract class AnswerEvent : Event
    {
        public Answer Answer { get; private set; }

        protected AnswerEvent(Answer answer)
        {
            Answer = answer;
        }
    }
}
