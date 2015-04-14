using easygenerator.Infrastructure;

namespace easygenerator.DomainModel.Entities
{
    public class CourseState : Identifiable
    {
        public virtual Course Course { get; private set; }
        public bool HasUnpublishedChanges { get; private set; }

        protected internal CourseState() { }

        protected internal CourseState(Course course, bool hasUnpublishedChanges)
        {
            ArgumentValidation.ThrowIfNull(course, "course");

            Course = course;
            HasUnpublishedChanges = hasUnpublishedChanges;
        }

        public void UpdateHasUnpublishedChanges(bool value)
        {
            HasUnpublishedChanges = value;
        }
    }
}