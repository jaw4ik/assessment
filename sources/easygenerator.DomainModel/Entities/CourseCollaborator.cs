

using easygenerator.Infrastructure;

namespace easygenerator.DomainModel.Entities
{
    public class CourseCollabrator : Entity
    {
        public virtual Course Course { get; protected internal set; }
        public virtual User User { get; protected internal set; }

        protected internal CourseCollabrator() { }

        protected internal CourseCollabrator(Course course, User user, string createdBy)
            : base(createdBy)
        {
            ThrowIfCourseIsInvalid(course);
            ThrowIfUserIsInvaid(user);

            Course = course;
            User = user;
        }

        private void ThrowIfCourseIsInvalid(Course course)
        {
             ArgumentValidation.ThrowIfNull(course, "course");
        }

        private void ThrowIfUserIsInvaid(User user)
        {
            ArgumentValidation.ThrowIfNull(user, "user");
        }
    }
}
