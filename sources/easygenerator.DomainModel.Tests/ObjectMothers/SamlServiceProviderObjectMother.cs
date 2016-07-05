using easygenerator.DomainModel.Entities;

namespace easygenerator.DomainModel.Tests.ObjectMothers
{
    public class SamlServiceProviderObjectMother
    {
        public const string DefaultAssertionConsumerServiceUrl = "http://www.saml.com/acs";
        public const string DefaultIssuer = "http://www.saml.com";

        public static SamlServiceProvider Create(string assertionConsumerSericeUrl = DefaultAssertionConsumerServiceUrl, string issuer = DefaultIssuer)
        {
            return new SamlServiceProvider(assertionConsumerSericeUrl, issuer);
        }
    }
}
