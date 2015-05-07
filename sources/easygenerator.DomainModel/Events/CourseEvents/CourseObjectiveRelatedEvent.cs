using easygenerator.DomainModel.Entities;
using easygenerator.Infrastructure;

namespace easygenerator.DomainModel.Events.CourseEvents
{
    public class CourseObjectiveRelatedEvent : CourseEvent
    {
        public Objective Objective { get; private set; }
        public int? Index { get; private set; }

        public CourseObjectiveRelatedEvent(Course course, Objective objective, int? index = null)
            : base(course)
        {
            ThrowIfObjectiveNotValid(objective);

            Objective = objective;
            Index = index;
        }

        private void ThrowIfObjectiveNotValid(Objective objective)
        {
            ArgumentValidation.ThrowIfNull(objective, "objective");
        }
    }
}
