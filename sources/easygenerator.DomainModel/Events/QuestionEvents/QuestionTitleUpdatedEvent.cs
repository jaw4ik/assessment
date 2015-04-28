using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Questions;

namespace easygenerator.DomainModel.Events.QuestionEvents
{
    public class QuestionTitleUpdatedEvent : QuestionEvent
    {
        public QuestionTitleUpdatedEvent(Question question)
            : base(question)
        {

        }
    }
}
