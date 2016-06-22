
using easygenerator.DomainModel.Entities;

namespace easygenerator.DomainModel.Events.CourseEvents
{
    public class CourseCreatedEvent : CourseEvent
    {
        public CourseCreatedEvent(Course course)
            : base(course)
        {
        }
    }
}
