using easygenerator.DomainModel.Entities.Questions;
using easygenerator.DomainModel.Events.QuestionEvents.TextMatchingEvents;

namespace easygenerator.Web.Domain.DomainEvents.ChangeTracking.Events
{
    public class TextMatchingAnswerChangedEvent : TextMatchingAnswerEvent
    {
        public TextMatchingAnswerChangedEvent(TextMatchingAnswer answer)
            : base(answer)
        {

        }
    }
}