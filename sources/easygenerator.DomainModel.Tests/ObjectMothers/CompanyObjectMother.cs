using easygenerator.DomainModel.Entities;

namespace easygenerator.DomainModel.Tests.ObjectMothers
{
    public class CompanyObjectMother
    {
        public const string DefaultName = "Company name";
        public const string DefaultLogo = "Logo url";
        public const string DefaultApiUrl = "Api url";
        public const string DefaultSecretKey = "secret key";

        public static Company Create(string name = DefaultName, string logoUrl = DefaultLogo, string publishApiUrl= DefaultApiUrl, string secretKey = DefaultSecretKey,
            bool hideDefaultPublishOptions = false)
        {
            return new Company(name, logoUrl, publishApiUrl, secretKey, hideDefaultPublishOptions);
        }
    }
}
