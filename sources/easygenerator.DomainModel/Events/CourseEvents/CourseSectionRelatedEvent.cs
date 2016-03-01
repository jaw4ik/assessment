using easygenerator.DomainModel.Entities;
using easygenerator.Infrastructure;

namespace easygenerator.DomainModel.Events.CourseEvents
{
    public class CourseSectionRelatedEvent : CourseEvent
    {
        public Section Section { get; private set; }
        public int? Index { get; private set; }

        public CourseSectionRelatedEvent(Course course, Section section, int? index = null)
            : base(course)
        {
            ThrowIfSectionNotValid(section);

            Section = section;
            Index = index;
        }

        private void ThrowIfSectionNotValid(Section section)
        {
            ArgumentValidation.ThrowIfNull(section, "section");
        }
    }
}
