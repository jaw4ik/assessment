
using easygenerator.DomainModel.Entities.Questions;

namespace easygenerator.DomainModel.Events.QuestionEvents.SingleSelectImageEvents
{
    public class SingleSelectImageCorrectAnswerChangedEvent : SingleSelectImageAnswerEvent
    {
        public SingleSelectImageCorrectAnswerChangedEvent(SingleSelectImageAnswer answer)
            : base(answer)
        {

        }
    }
}
