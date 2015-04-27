using easygenerator.DomainModel.Entities;

namespace easygenerator.DomainModel.Events.CourseEvents
{
    public class CourseTemplateUpdatedEvent : CourseEvent
    {
        public CourseTemplateUpdatedEvent(Course course)
            : base(course)
        {

        }
    }
}
