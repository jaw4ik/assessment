using easygenerator.Infrastructure;

namespace easygenerator.DomainModel.Entities
{
    public class CourseState : Identifiable
    {
        public virtual Course Course { get; private set; }
        public virtual CourseStateInfo Info { get; private set; }

        protected internal CourseState() { }

        protected internal CourseState(Course course, CourseStateInfo info)
        {
            ArgumentValidation.ThrowIfNull(course, "course");

            Course = course;
            Info = info ?? new CourseStateInfo();
        }

        public void UpdateInfo(CourseStateInfo info)
        {
            ArgumentValidation.ThrowIfNull(info, "info");
            Info = info;
        }
    }

    public class CourseStateInfo
    {
        public bool HasUnpublishedChanges { get; set; }

        protected internal CourseStateInfo() { }

        protected internal CourseStateInfo(bool hasUnpublishedChanges = false)
        {
            HasUnpublishedChanges = hasUnpublishedChanges;
        }
    }
}