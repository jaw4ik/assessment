
using easygenerator.DomainModel.Entities;
using easygenerator.Infrastructure;

namespace easygenerator.Web.DomainEvents.ChangeTracking
{
    public class CourseState
    {
        public Course Course { get; set; }
        public bool HasUnpublishedChanges { get; set; }

        public CourseState(Course course, bool hasUnpublishedChanges = false)
        {
            ArgumentValidation.ThrowIfNull(course, "course");

            Course = course;
            HasUnpublishedChanges = hasUnpublishedChanges;
        }
    }
}