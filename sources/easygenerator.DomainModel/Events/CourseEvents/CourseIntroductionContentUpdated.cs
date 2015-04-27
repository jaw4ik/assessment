using easygenerator.DomainModel.Entities;

namespace easygenerator.DomainModel.Events.CourseEvents
{
    public class CourseIntroductionContentUpdated : CourseEvent
    {
        public CourseIntroductionContentUpdated(Course course)
            : base(course)
        {

        }
    }
}
