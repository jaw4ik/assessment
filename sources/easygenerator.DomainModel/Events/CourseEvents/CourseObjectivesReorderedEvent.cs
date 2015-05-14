using easygenerator.DomainModel.Entities;

namespace easygenerator.DomainModel.Events.CourseEvents
{
    public class CourseObjectivesReorderedEvent : CourseEvent
    {
        public CourseObjectivesReorderedEvent(Course course)
            : base(course)
        {

        }
    }
}
