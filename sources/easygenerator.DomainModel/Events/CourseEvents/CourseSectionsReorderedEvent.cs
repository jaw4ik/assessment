using easygenerator.DomainModel.Entities;

namespace easygenerator.DomainModel.Events.CourseEvents
{
    public class CourseSectionsReorderedEvent : CourseEvent
    {
        public CourseSectionsReorderedEvent(Course course)
            : base(course)
        {

        }
    }
}
