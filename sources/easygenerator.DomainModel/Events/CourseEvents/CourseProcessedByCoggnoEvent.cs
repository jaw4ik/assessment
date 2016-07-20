using easygenerator.DomainModel.Entities;

namespace easygenerator.DomainModel.Events.CourseEvents
{
    public class CourseProcessedByCoggnoEvent : CourseEvent
    {
        public bool Success { get; }

        public CourseProcessedByCoggnoEvent(Course course, bool success)
            : base(course)
        {
            Success = success;
        }
    }
}
