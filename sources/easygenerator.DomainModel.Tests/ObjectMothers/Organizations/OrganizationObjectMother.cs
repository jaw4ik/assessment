using easygenerator.DomainModel.Entities.Organizations;

namespace easygenerator.DomainModel.Tests.ObjectMothers.Organizations
{
    public class OrganizationObjectMother
    {
        private const string Title = "Organization title";
        private const string CreatedBy = "username@easygenerator.com";
        private const string EmailDomains = "easygenerator.com";

        public static Organization CreateWithTitle(string title)
        {
            return Create(title: title);
        }

        public static Organization CreateWithCreatedBy(string createdBy)
        {
            return Create(createdBy: createdBy);
        }

        public static Organization CreateWithEmailDomains(string emailDomains)
        {
            return Create(emailDomains: emailDomains);
        }

        public static Organization Create(string title = Title, string createdBy = CreatedBy, string emailDomains = null)
        {
            return new Organization(title, createdBy, emailDomains);
        }
    }
}
