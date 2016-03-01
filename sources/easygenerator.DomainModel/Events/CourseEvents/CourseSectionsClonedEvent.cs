using System;
using easygenerator.DomainModel.Entities;
using easygenerator.Infrastructure;
using System.Collections.Generic;

namespace easygenerator.DomainModel.Events.CourseEvents
{
    public class CourseSectionsClonedEvent : CourseEvent
    {
        public Dictionary<Guid, Section> ReplacedSections { get; private set; }

        public CourseSectionsClonedEvent(Course course, Dictionary<Guid, Section> replacedSections)
            : base(course)
        {
            ThrowIfReplacedSectionsIsInvalid(replacedSections);
            ReplacedSections = replacedSections;
        }

        private void ThrowIfReplacedSectionsIsInvalid(Dictionary<Guid, Section> replacedSections)
        {
            ArgumentValidation.ThrowIfNull(replacedSections, "replacedSections");
        }
    }
}
