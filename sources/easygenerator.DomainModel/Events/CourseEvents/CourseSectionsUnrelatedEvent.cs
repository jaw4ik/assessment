using easygenerator.DomainModel.Entities;
using easygenerator.Infrastructure;
using System.Collections.Generic;

namespace easygenerator.DomainModel.Events.CourseEvents
{
    public class CourseSectionsUnrelatedEvent : CourseEvent
    {
        public IEnumerable<Section> Sections { get; private set; }

        public CourseSectionsUnrelatedEvent(Course course, IEnumerable<Section> sections)
            : base(course)
        {
            ThrowIfSectionsNotValid(sections);

            Sections = sections;
        }

        private void ThrowIfSectionsNotValid(IEnumerable<Section> sections)
        {
            ArgumentValidation.ThrowIfNull(sections, "sections");
        }
    }
}
