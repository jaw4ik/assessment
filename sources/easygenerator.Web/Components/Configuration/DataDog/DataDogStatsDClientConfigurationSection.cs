using System;
using System.Configuration;

namespace easygenerator.Web.Components.Configuration.DataDog
{
    public class DataDogStatsDClientConfigurationSection : ConfigurationSection
    {
        [ConfigurationProperty("enabled", DefaultValue = "false", IsRequired = false)]
        public bool Enabled
        {
            get { return (Boolean)this["enabled"]; }
            set { this["enabled"] = value; }
        }

        [ConfigurationProperty("hostname", IsRequired = true)]
        public string Hostname
        {
            get
            {
                return (string)this["hostname"];
            }
            set
            {
                this["hostname"] = value;
            }
        }

        [ConfigurationProperty("port", IsRequired = true)]
        public int Port
        {
            get
            {
                return (int)this["port"];
            }
            set
            {
                this["port"] = value;
            }
        }

        [ConfigurationProperty("prefix", DefaultValue = "", IsRequired = false)]
        public string Prefix
        {
            get
            {
                return (string)this["prefix"];
            }
            set
            {
                this["prefix"] = value;
            }
        }

        [ConfigurationProperty("interval", DefaultValue = "10", IsRequired = false)]
        public int Interval
        {
            get
            {
                return (int)this["interval"];
            }
            set
            {
                this["interval"] = value;
            }
        }

        [ConfigurationProperty("maxUDPPacketSize", DefaultValue = "512", IsRequired = false)]
        public int MaxUDPPacketSize
        {
            get
            {
                return (int)this["maxUDPPacketSize"];
            }
            set
            {
                this["maxUDPPacketSize"] = value;
            }
        }

        [ConfigurationProperty("tags", IsDefaultCollection = false)]
        [ConfigurationCollection(typeof(TagsCollection), AddItemName = "add", ClearItemsName = "clear", RemoveItemName = "remove")]
        public TagsCollection Tags
        {
            get { return (TagsCollection)base["tags"]; }
        }
    }
}