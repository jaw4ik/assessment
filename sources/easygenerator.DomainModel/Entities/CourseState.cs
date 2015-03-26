using easygenerator.Infrastructure;

namespace easygenerator.DomainModel.Entities
{
    public class CourseState : Identifiable
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