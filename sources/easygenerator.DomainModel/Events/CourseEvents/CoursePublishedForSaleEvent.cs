using easygenerator.DomainModel.Entities;

namespace easygenerator.DomainModel.Events.CourseEvents
{
    public class CoursePublishedForSaleEvent : CourseEvent
    {
        public CoursePublishedForSaleEvent(Course course)
            : base(course)
        {

        }
    }
}
