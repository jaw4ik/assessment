using easygenerator.DomainModel.Entities;

namespace easygenerator.DomainModel.Events.CourseEvents
{
    public class CoursePublishedEvent : CourseEvent
    {
        public CoursePublishedEvent(Course course)
            : base(course)
        {

        }
    }
}
