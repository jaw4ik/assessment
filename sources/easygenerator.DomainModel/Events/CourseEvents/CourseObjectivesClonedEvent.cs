using System;
using easygenerator.DomainModel.Entities;
using easygenerator.Infrastructure;
using System.Collections.Generic;

namespace easygenerator.DomainModel.Events.CourseEvents
{
    public class CourseObjectivesClonedEvent : CourseEvent
    {
        public Dictionary<Guid, Objective> ReplacedObjectives { get; private set; }

        public CourseObjectivesClonedEvent(Course course, Dictionary<Guid, Objective> replacedObjectives)
            : base(course)
        {
            ThrowIfReplacedObjectivesIsInvalid(replacedObjectives);
            ReplacedObjectives = replacedObjectives;
        }

        private void ThrowIfReplacedObjectivesIsInvalid(Dictionary<Guid, Objective> replacedObjectives)
        {
            ArgumentValidation.ThrowIfNull(replacedObjectives, "replacedObjectives");
        }
    }
}
