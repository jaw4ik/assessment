using System.Configuration;
namespace easygenerator.PublicationServer.Configuration
{
    public class ConfigurationReader
    {
        public string ApiKey => ConfigurationManager.AppSettings["apiKey"];
        public string ConnectionString => ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString;

        public bool AllowIndexing = bool.Parse(ConfigurationManager.AppSettings["allowIndexing"]);
    }
}
