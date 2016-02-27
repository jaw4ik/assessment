using easygenerator.DomainModel.Entities;

namespace easygenerator.DomainModel.Events.ObjectiveEvents
{
    public class ObjectiveLearningObjectiveUpdatedEvent: ObjectiveEvent
    {
        public ObjectiveLearningObjectiveUpdatedEvent(Objective objective) : base(objective)
        {
        }
    }
}
