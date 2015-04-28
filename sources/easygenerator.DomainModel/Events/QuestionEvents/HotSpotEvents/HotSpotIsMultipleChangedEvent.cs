using easygenerator.DomainModel.Entities.Questions;

namespace easygenerator.DomainModel.Events.QuestionEvents.HotSpotEvents
{
    public class HotSpotIsMultipleChangedEvent : QuestionEvent
    {
        public bool IsMultiple { get; private set; }

        public HotSpotIsMultipleChangedEvent(Question question, bool isMultiple)
            : base(question)
        {
            IsMultiple = isMultiple;
        }
    }
}
