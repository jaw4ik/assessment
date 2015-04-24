using System.Configuration;
namespace easygenerator.PublicationServer.Configuration
{
    public class ConfigurationReader
    {
        public string ApiKey
        {
            get { return ConfigurationManager.AppSettings["apiKey"]; }
        }
    }
}
