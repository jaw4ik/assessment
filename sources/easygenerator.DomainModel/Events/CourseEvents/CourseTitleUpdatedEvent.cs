using easygenerator.DomainModel.Entities;

namespace easygenerator.DomainModel.Events.CourseEvents
{
    public class CourseTitleUpdatedEvent : CourseEvent
    {
        public CourseTitleUpdatedEvent(Course course)
            : base(course)
        {

        }
    }
}
