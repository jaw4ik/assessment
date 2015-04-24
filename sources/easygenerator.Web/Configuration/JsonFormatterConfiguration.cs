using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace easygenerator.Web.Configuration
{
    public class JsonFormatterConfiguration
    {
        public static void Configure()
        {
            JsonConvert.DefaultSettings = () => new JsonSerializerSettings()
            {
                Converters = new List<JsonConverter>()
                {
                    new IsoDateTimeConverter()
                    {
                        DateTimeFormat = "yyyy-MM-dd\\THH:mm:ss.fffK"
                    }
                }
            };
        }
    }
}