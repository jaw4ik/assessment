using easygenerator.Infrastructure;
namespace easygenerator.DomainModel.Entities.ACL
{
    public class TemplateAccessControlListEntry : AccessControlListEntry
    {
        // parameterless constructor for EF with dummy identity which will be replaced by EF with proper identity during fields initization.
        protected internal TemplateAccessControlListEntry() : base(WildcardIdentity) { }

        protected internal TemplateAccessControlListEntry(Template template, string userIdentity)
            : base(userIdentity)
        {
            ArgumentValidation.ThrowIfNull(template, "template");
            Template = template;
        }

        protected internal virtual Template Template { get; private set; }
    }
}
