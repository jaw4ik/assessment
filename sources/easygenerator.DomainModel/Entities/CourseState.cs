using easygenerator.Infrastructure;

namespace easygenerator.DomainModel.Entities
{
    public class CourseState : Identifiable
    {
        public virtual Course Course { get; private set; }
        public virtual CourseStateInfo Info { get; private set; }

        public CourseState(Course course, bool hasUnpublishedChanges = false)
        {
            ArgumentValidation.ThrowIfNull(course, "course");

            Course = course;
            Info = new CourseStateInfo(hasUnpublishedChanges);
        }
    }

    public class CourseStateInfo
    {
        public bool HasUnpublishedChanges { get; set; }

        public CourseStateInfo(bool hasUnpublishedChanges = false)
        {
            HasUnpublishedChanges = hasUnpublishedChanges;
        }
    }
}