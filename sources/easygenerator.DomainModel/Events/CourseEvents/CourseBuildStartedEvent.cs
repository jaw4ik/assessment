using easygenerator.DomainModel.Entities;

namespace easygenerator.DomainModel.Events.CourseEvents
{
    public class CourseBuildStartedEvent: CourseEvent
    {
        public CourseBuildStartedEvent(Course course)
            : base(course)
        {

        }
    }
}
