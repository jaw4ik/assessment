using easygenerator.DomainModel.Entities.Questions;
using easygenerator.DomainModel.Events.QuestionEvents.TextMatchingEvents;

namespace easygenerator.Web.DomainEvents.ChangeTracking.Events
{
    public class TextMatchingAnswerChangedEvent : TextMatchingAnswerEvent
    {
        public TextMatchingAnswerChangedEvent(TextMatchingAnswer answer)
            : base(answer)
        {

        }
    }
}