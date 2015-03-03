using System.Collections.Generic;
using easygenerator.Web.BuildCourse.Modules.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace easygenerator.Web.BuildCourse.PublishSettings
{
    public class PublishSettingsProvider
    {
        public virtual string GetPublishSettings(IEnumerable<PackageModule> packageModules)
        {
            var publishSettings = new Models.PublishSettings();
            foreach (var module in packageModules)
            {
                publishSettings.Modules.Add(new Models.PublishSettings.Module(module.Name));
            }

            return JsonConvert.SerializeObject(publishSettings, new JsonSerializerSettings() { ContractResolver = new CamelCasePropertyNamesContractResolver() });
        }
    }
}