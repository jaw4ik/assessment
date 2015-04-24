using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Questions;

namespace easygenerator.DomainModel.Events.QuestionEvents
{
    public class QuestionCreatedEvent : QuestionEvent
    {
        public QuestionCreatedEvent(Question question)
            : base(question)
        {

        }
    }
}
