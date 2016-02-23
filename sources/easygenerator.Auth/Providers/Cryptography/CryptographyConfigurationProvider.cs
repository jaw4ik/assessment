using System.Configuration;
using easygenerator.Auth.ConfigurationSections;

namespace easygenerator.Auth.Providers.Cryptography
{
    public class CryptographyConfigurationProvider: ICryptographyConfigurationProvider
    {
        public CryptographyConfigurationProvider()
        {
            Secret = ((CryptographySection) ConfigurationManager.GetSection("cryptography")).Secret;
        }

        public string Secret { get; }
    }
}
