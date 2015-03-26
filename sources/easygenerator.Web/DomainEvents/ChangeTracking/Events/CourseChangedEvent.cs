using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Events.CourseEvents;

namespace easygenerator.Web.DomainEvents.ChangeTracking.Events
{
    public class CourseChangedEvent : CourseEvent
    {
        public CourseChangedEvent(Course course)
            : base(course)
        {
        }
    }
}
