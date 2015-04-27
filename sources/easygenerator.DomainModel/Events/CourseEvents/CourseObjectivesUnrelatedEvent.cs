using easygenerator.DomainModel.Entities;
using easygenerator.Infrastructure;
using System.Collections.Generic;

namespace easygenerator.DomainModel.Events.CourseEvents
{
    public class CourseObjectivesUnrelatedEvent : CourseEvent
    {
        public IEnumerable<Objective> Objectives { get; private set; }

        public CourseObjectivesUnrelatedEvent(Course course, IEnumerable<Objective> objectives)
            : base(course)
        {
            ThrowIfObjectivesNotValid(objectives);

            Objectives = objectives;
        }

        private void ThrowIfObjectivesNotValid(IEnumerable<Objective> objectives)
        {
            ArgumentValidation.ThrowIfNull(objectives, "objectives");
        }
    }
}
