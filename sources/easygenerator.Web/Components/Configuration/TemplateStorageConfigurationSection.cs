using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;

namespace easygenerator.Web.Components.Configuration
{
    public class TemplateStorageConfigurationSection : ConfigurationSection
    {
        [ConfigurationProperty("TemplatesPath", DefaultValue = "Templates", IsRequired = false)]
        public virtual string TemplatesPath
        {
            get
            {
                return (string)this["TemplatesPath"];
            }
            set
            {
                this["TemplatesPath"] = value;
            }
        }

        [ConfigurationProperty("CustomTemplatesPath", DefaultValue = "Templates/CustomTemplates", IsRequired = false)]
        public virtual string CustomTemplatesPath
        {
            get
            {
                return (string)this["CustomTemplatesPath"];
            }
            set
            {
                this["CustomTemplatesPath"] = value;
            }
        }
    }
}