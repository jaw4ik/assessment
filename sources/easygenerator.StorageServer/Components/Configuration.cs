using System.Configuration;
using easygenerator.StorageServer.Components.ConfigurationSections;

namespace easygenerator.StorageServer.Components
{
    public class Configuration
    {
        public virtual VimeoConfigurationSection Vimeo
        {
            get
            {
                return ConfigurationManager.GetSection("vimeo") as VimeoConfigurationSection;
            }
        }

        public virtual AuthorizationSection Authorization
        {
            get
            {
                return ConfigurationManager.GetSection("authorization") as AuthorizationSection;
            }
        }

        public virtual ConvertionServiceConfigurationSection ConvertionService
        {
            get
            {
                return ConfigurationManager.GetSection("convertion") as ConvertionServiceConfigurationSection;
            }
        }
    }
}