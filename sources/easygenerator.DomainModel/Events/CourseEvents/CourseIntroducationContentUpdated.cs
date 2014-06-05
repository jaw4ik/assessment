using easygenerator.DomainModel.Entities;

namespace easygenerator.DomainModel.Events.CourseEvents
{
    public class CourseIntroducationContentUpdated : CourseEvent
    {
        public CourseIntroducationContentUpdated(Course course)
            : base(course)
        {

        }
    }
}
