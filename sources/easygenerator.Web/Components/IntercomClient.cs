using easygenerator.Web.Components.Configuration;

namespace easygenerator.Web.Components
{
    public interface IIntercomClient
    {
        IntercomDotNet.IntercomClient Client { get; }
    }

    public class IntercomClient: IIntercomClient
    {
        public IntercomClient()
        {
        }

        public IntercomClient(ConfigurationReader configurationReader)
        {
            if (string.IsNullOrEmpty(configurationReader.IntercomConfiguration.AppId) ||
                string.IsNullOrEmpty(configurationReader.IntercomConfiguration.ApiKey))
            {
                Client = null;
                return;
            }
            Client = IntercomDotNet.IntercomClient.GetClient(configurationReader.IntercomConfiguration.AppId,
                configurationReader.IntercomConfiguration.ApiKey);
        }

        public IntercomDotNet.IntercomClient Client { get; }
    }
}