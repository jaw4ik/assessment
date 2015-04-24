using easygenerator.DomainModel.Entities;
using easygenerator.Infrastructure;

namespace easygenerator.DomainModel.Events.CourseEvents
{
    public abstract class CourseEvent : Event
    {
        public Course Course { get; private set; }

        protected CourseEvent(Course course)
        {
            ThrowIfCourseIsInvalid(course);

            Course = course;
        }

        private void ThrowIfCourseIsInvalid(Course course)
        {
            ArgumentValidation.ThrowIfNull(course, "course");
        }
    }
}
