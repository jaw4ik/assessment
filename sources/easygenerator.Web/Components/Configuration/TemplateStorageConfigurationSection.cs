using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;

namespace easygenerator.Web.Components.Configuration
{
    public class TemplateStorageConfigurationSection : ConfigurationSection
    {
        [ConfigurationProperty("Path", DefaultValue = "Templates", IsRequired = false)]
        public virtual string Path
        {
            get
            {
                return (string)this["Path"];
            }
            set
            {
                this["Path"] = value;
            }
        }

        [ConfigurationProperty("CustomTemplatesDirectory", DefaultValue = "CustomTemplates", IsRequired = false)]
        public virtual string CustomTemplatesDirectory
        {
            get
            {
                return (string)this["CustomTemplatesDirectory"];
            }
            set
            {
                this["CustomTemplatesDirectory"] = value;
            }
        }
    }
}