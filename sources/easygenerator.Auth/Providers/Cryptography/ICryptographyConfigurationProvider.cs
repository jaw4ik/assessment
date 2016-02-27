namespace easygenerator.Auth.Providers.Cryptography
{
    public interface ICryptographyConfigurationProvider
    {
        string Secret { get; }
    }
}
