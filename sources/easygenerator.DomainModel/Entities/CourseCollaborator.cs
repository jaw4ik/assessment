using easygenerator.DomainModel.Events.CourseEvents.Collaboration;
using easygenerator.Infrastructure;

namespace easygenerator.DomainModel.Entities
{
    public class CourseCollaborator : Entity
    {
        public virtual Course Course { get; protected internal set; }
        public virtual string Email { get; protected internal set; }
        public bool IsAccepted { get; protected internal set; }
        public bool IsAdmin { get; protected internal set; }

        protected internal CourseCollaborator() { }

        protected internal CourseCollaborator(Course course, string email, bool isAdmin, string createdBy, bool isAccepted = false)
            : base(createdBy)
        {
            ThrowIfCourseIsInvalid(course);
            ThrowIfEmailIsNotValid(email);

            Course = course;
            Email = email;
            IsAdmin = isAdmin;
            IsAccepted = isAccepted;
        }

        public virtual void GrantAdminAccess()
        {
            if (IsAdmin)
            {
                return;
            }

            IsAdmin = true;
            RaiseEvent(new CourseCollaboratorAdminAccessGrantedEvent(Course, this));
        }

        private void ThrowIfCourseIsInvalid(Course course)
        {
            ArgumentValidation.ThrowIfNull(course, "course");
        }

        private void ThrowIfEmailIsNotValid(string userEmail)
        {
            ArgumentValidation.ThrowIfNotValidEmail(userEmail, "userEmail");
        }
    }
}
