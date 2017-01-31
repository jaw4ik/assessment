using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;

namespace easygenerator.PdfConverter.Components.Configuration
{
    public class JobShedulerTimeConfigurationSection : ConfigurationSection
    {
        [ConfigurationProperty("shedulerIntervalRepeatTimeInHours", IsRequired = true)]
        public int ShedulerIntervalRepeatTimeInHours
        {
            get
            {
                return Convert.ToInt32(this["shedulerIntervalRepeatTimeInHours"]);
            }
            set
            {
                this["shedulerIntervalRepeatTimeInHours"] = value;
            }
        }

        [ConfigurationProperty("maxCacheLifeTimeInDays", IsRequired = true)]
        public int MaxCacheLifeTimeInDays
        {
            get
            {
                return Convert.ToInt32(this["maxCacheLifeTimeInDays"]);
            }
            set
            {
                this["maxCacheLifeTimeInDays"] = value;
            }
        }
    }
}