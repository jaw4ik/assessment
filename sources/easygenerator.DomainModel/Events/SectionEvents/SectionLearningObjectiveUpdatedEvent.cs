using easygenerator.DomainModel.Entities;

namespace easygenerator.DomainModel.Events.SectionEvents
{
    public class SectionLearningObjectiveUpdatedEvent : SectionEvent
    {
        public SectionLearningObjectiveUpdatedEvent(Section section) : base(section)
        {
        }
    }
}
