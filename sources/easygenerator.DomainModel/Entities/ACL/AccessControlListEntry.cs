using easygenerator.Infrastructure;
namespace easygenerator.DomainModel.Entities.ACL
{
    public abstract class AccessControlListEntry : Entity
    {
        public const string WildcardIdentity = "*";

        protected internal AccessControlListEntry(string userIdentity) : base()
        {
            ArgumentValidation.ThrowIfNullOrEmpty(userIdentity, "userIdentity");
            UserIdentity = userIdentity;
        }

        protected internal AccessControlListEntry(string userIdentity, string createdBy)
            : base(createdBy)
        {
            ArgumentValidation.ThrowIfNullOrEmpty(userIdentity, "userIdentity");
            UserIdentity = userIdentity;
        }

        public string UserIdentity { get; private set; }
    }
}
