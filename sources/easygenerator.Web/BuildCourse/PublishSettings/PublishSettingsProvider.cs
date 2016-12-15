using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Configuration;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.ACL;
using easygenerator.Web.BuildCourse.Modules.Models;
using easygenerator.Web.BuildCourse.PublishSettings.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace easygenerator.Web.BuildCourse.PublishSettings
{
    public class PublishSettingsProvider
    {
        public class Mode
        {
            public const string Default = "Publish";
            public const string Lms = "Lms";
            public const string Review = "Review";
            public const string Sales = "Sales";
            public const string Preview = "Preview";
        }

        public virtual string GetPublishSettings(IEnumerable<PackageModule> packageModules, string publishMode = Mode.Default, Dictionary<string, int> shortIds = null, IEnumerable<CourseAccessControlListEntry> accessControlList = null)
        {
            var publishSettings = new Models.PublishSettings();
            foreach (var module in packageModules)
            {
                publishSettings.Modules.Add(new Module(module.Name));
            }

            if (accessControlList != null)
            {
                publishSettings.AccessLimitation = new AccessLimitation
                {
                    Enabled = accessControlList.Any(entry => entry.UserIdentity == AccessControlListEntry.WildcardIdentity),
                    AllowedUsers = accessControlList.Where(entry => entry.UserIdentity != AccessControlListEntry.WildcardIdentity)
                                                    .Select(entry => new { Email = entry.UserIdentity })
                };
            }
            if (shortIds != null)
            {
                publishSettings.QuestionShortIds = shortIds;
            }

            publishSettings.CustomFontPlace = ConfigurationManager.AppSettings["customFontUrl"];
            publishSettings.PublishMode = publishMode;

            return JsonConvert.SerializeObject(publishSettings, new JsonSerializerSettings() { ContractResolver = new CamelCasePropertyNamesContractResolver() });
        }
    }
}