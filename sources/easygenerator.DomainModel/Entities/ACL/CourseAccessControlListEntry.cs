using easygenerator.Infrastructure;
namespace easygenerator.DomainModel.Entities.ACL
{
    public class CourseAccessControlListEntry : AccessControlListEntry
    {
        protected internal CourseAccessControlListEntry()
            : base(WildcardIdentity) { }

        protected internal CourseAccessControlListEntry(Course course, string userIdentity, string createdBy)
            : base(userIdentity, createdBy)
        {
            ArgumentValidation.ThrowIfNull(course, nameof(course));
            Course = course;
            UserInvited = false;
        }

        public bool UserInvited { get; private set; }

        public void InviteUser()
        {
            UserInvited = true;
        }

        public virtual Course Course { get; protected internal set; }
    }
}
