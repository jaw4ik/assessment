using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Questions;

namespace easygenerator.DomainModel.Events.QuestionEvents
{
    public class QuestionContentUpdatedEvent : QuestionEvent
    {
        public QuestionContentUpdatedEvent(Question question)
            : base(question)
        {

        }
    }
}
