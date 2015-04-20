using easygenerator.Infrastructure;

namespace easygenerator.DomainModel.Entities
{
    public class CourseState : Identifiable
    {
        public virtual Course Course { get; private set; }
        public bool IsDirty { get; private set; }

        protected internal CourseState() { }

        protected internal CourseState(Course course, bool isDirty)
        {
            ArgumentValidation.ThrowIfNull(course, "course");

            Course = course;
            IsDirty = isDirty;
        }

        public void MarkAsDirty()
        {
            IsDirty = true;
        }

        public void MarkAsClean()
        {
            IsDirty = false;
        }
    }
}