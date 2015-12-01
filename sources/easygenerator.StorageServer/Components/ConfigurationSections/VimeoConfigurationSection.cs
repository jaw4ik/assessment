using System.Configuration;

namespace easygenerator.StorageServer.Components.ConfigurationSections
{
    public class VimeoConfigurationSection : ConfigurationSection
    {
        [ConfigurationProperty("token", IsRequired = true)]
        public string Token
        {
            get
            {
                return (string)this["token"];
            }
            set
            {
                this["token"] = value;
            }
        }

        [ConfigurationProperty("url", IsRequired = true)]
        public string Url
        {
            get
            {
                return (string)this["url"];
            }
            set
            {
                this["url"] = value;
            }
        }

        [ConfigurationProperty("ticketUrl", IsRequired = true)]
        public string TicketUrl
        {
            get
            {
                return (string)this["ticketUrl"];
            }
            set
            {
                this["ticketUrl"] = value;
            }
        }

        [ConfigurationProperty("videosEndpoint", IsRequired = true)]
        public string VideosEndpoint
        {
            get
            {
                return (string)this["videosEndpoint"];
            }
            set
            {
                this["videosEndpoint"] = value;
            }
        }
    }
}