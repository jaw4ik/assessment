using easygenerator.DomainModel.Entities;

namespace easygenerator.DomainModel.Events.CourseEvents
{
    public class CourseScormBuildStartedEvent: CourseEvent
    {
        public CourseScormBuildStartedEvent(Course course)
            : base(course)
        {

        }
    }
}
