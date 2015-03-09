using easygenerator.Infrastructure;
namespace easygenerator.DomainModel.Entities.ACL
{
    public abstract class AccessControlListEntry : Identifiable
    {
        public const string WildcardIdentity = "*";

        public string UserIdentity { get; private set; }
        protected internal AccessControlListEntry(string userIdentity)
        {
            ArgumentValidation.ThrowIfNullOrEmpty(userIdentity, "userIdentity");
            UserIdentity = userIdentity;
        }
    }
}
