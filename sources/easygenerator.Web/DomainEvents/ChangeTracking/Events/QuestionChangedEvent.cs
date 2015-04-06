using easygenerator.DomainModel.Entities.Questions;
using easygenerator.DomainModel.Events.QuestionEvents;

namespace easygenerator.Web.DomainEvents.ChangeTracking.Events
{
    public class QuestionChangedEvent : QuestionEvent
    {
        public QuestionChangedEvent(Question question)
            : base(question)
        {

        }
    }
}